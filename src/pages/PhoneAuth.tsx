import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Phone, Shield } from "lucide-react";
import { toast } from "sonner";
import { requestOTP, verifyOTP } from "@/lib/otp";
import { formatPhoneNumber } from "@/lib/infobip";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLanguage } from "@/contexts/LanguageContext";
import yolafreshLogo from "@/assets/yolafresh-logo.jpg";
import { logActivity } from "@/lib/logger";

export default function PhoneAuth() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [step, setStep] = useState<"phone" | "otp" | "register">("phone");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);

    const handleSendOTP = async () => {
        if (!phoneNumber) {
            toast.error("Please enter your phone number");
            return;
        }

        setLoading(true);

        // 1. Format number using centralized logic
        const formattedPhone = formatPhoneNumber(phoneNumber);
        console.log("CTO Debug: Checking whitelist for:", formattedPhone);

        // 2. Check Whitelist
        const { data: isWhitelisted, error: whitelistError } = await supabase
            .from("whitelisted_phone_numbers" as any)
            .select("phone_number")
            .eq("phone_number", formattedPhone)
            .maybeSingle();

        if (whitelistError) {
            console.error("CTO Debug: Whitelist DB Error:", whitelistError);
            setLoading(false);
            toast.error(`Database Error: ${whitelistError.message}`);
            return;
        }

        if (!isWhitelisted) {
            console.warn("CTO Debug: Number not in whitelist:", formattedPhone);
            setLoading(false);
            toast.error("You cannot access. Please speak with the admin.");
            return;
        }

        const result = await requestOTP(phoneNumber);
        setLoading(false);

        if (result.success) {
            toast.success("OTP sent to your phone!");
            setStep("otp");
        } else {
            toast.error(result.error || "Failed to send OTP");
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter the 6-digit code");
            return;
        }

        setLoading(true);
        const verifyResult = await verifyOTP(phoneNumber, otp);

        if (!verifyResult.success) {
            setLoading(false);
            toast.error(verifyResult.error || "Invalid OTP");
            return;
        }

        // Check if user exists
        const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+212${phoneNumber.replace(/\D/g, "")}`;
        const { data: profile } = await supabase
            .from("profiles" as any)
            .select("*")
            .eq("phone_number", formattedPhone)
            .maybeSingle();

        if (profile) {
            // Existing user - sign them in
            // Create a session (we'll use a simple approach here)
            const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
                email: `${formattedPhone.replace(/\+/g, "")}@phone.auth`,
                password: formattedPhone, // Using phone as password for phone-only auth
            });

            setLoading(false);

            if (signInError) {
                toast.error("Authentication failed. Please try again.");
                return;
            }

            toast.success("Welcome back!");
            await logActivity({
                event_type: "login",
                description: "User logged in with phone",
                metadata: { phone: formattedPhone }
            });
            navigate("/");
        } else {
            // New user - show registration form
            setIsNewUser(true);
            setStep("register");
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!fullName) {
            toast.error("Please enter your full name");
            return;
        }

        setLoading(true);
        const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+212${phoneNumber.replace(/\D/g, "")}`;

        // Create auth user with phone as email
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: `${formattedPhone.replace(/\+/g, "")}@phone.auth`,
            password: formattedPhone,
            options: {
                data: {
                    full_name: fullName,
                    phone_number: formattedPhone,
                },
            },
        });

        if (signUpError) {
            setLoading(false);
            toast.error(signUpError.message);
            return;
        }

        // Update profile with phone number
        if (authData.user) {
            await supabase
                .from("profiles" as any)
                .update({ phone_number: formattedPhone })
                .eq("user_id", authData.user.id);

            // Add employee role by default
            await supabase
                .from("user_roles")
                .insert({
                    user_id: authData.user.id,
                    role: "employee",
                });
        }

        setLoading(false);
        toast.success("Account created successfully!");
        await logActivity({
            event_type: "login",
            description: "New user registered and logged in",
            metadata: { phone: formattedPhone, name: fullName }
        });
        navigate("/");
    };

    const handleResendOTP = async () => {
        await handleSendOTP();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                        <img src={yolafreshLogo} alt="Yola Fresh" className="h-12 object-contain" />
                    </div>
                    <div className="text-center">
                        <CardTitle className="text-2xl">
                            {step === "phone" && "Welcome to Training Yola"}
                            {step === "otp" && "Verify Your Phone"}
                            {step === "register" && "Complete Your Profile"}
                        </CardTitle>
                        <CardDescription>
                            {step === "phone" && "Enter your phone number to continue"}
                            {step === "otp" && "Enter the 6-digit code sent to your phone"}
                            {step === "register" && "Tell us a bit about yourself"}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === "phone" && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+212 6XX XXX XXX"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="pl-10"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSendOTP} disabled={loading} className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send OTP"
                                )}
                            </Button>
                        </>
                    )}

                    {step === "otp" && (
                        <>
                            <div className="space-y-2">
                                <Label>Verification Code</Label>
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>
                            <Button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6} className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify OTP"
                                )}
                            </Button>
                            <Button onClick={handleResendOTP} variant="outline" disabled={loading} className="w-full">
                                Resend OTP
                            </Button>
                        </>
                    )}

                    {step === "register" && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <Button onClick={handleRegister} disabled={loading} className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Complete Registration"
                                )}
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
