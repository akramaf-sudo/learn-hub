import { supabase } from "@/integrations/supabase/client";
import { generateOTP, sendOTP, formatPhoneNumber } from "./infobip";

export interface OTPResult {
    success: boolean;
    error?: string;
}

export async function requestOTP(phoneNumber: string): Promise<OTPResult> {
    try {
        const formattedPhone = formatPhoneNumber(phoneNumber);

        // Generate OTP
        const code = generateOTP(6);

        // Calculate expiration (5 minutes from now)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        // Delete any existing OTPs for this phone number
        await supabase
            .from("otp_codes" as any)
            .delete()
            .eq("phone_number", formattedPhone);

        // Store OTP in database
        const { error: dbError } = await supabase
            .from("otp_codes" as any)
            .insert({
                phone_number: formattedPhone,
                code: code,
                expires_at: expiresAt.toISOString(),
                verified: false,
            });

        if (dbError) {
            console.error("Database error:", dbError);
            return { success: false, error: `Database Error: ${dbError.message}` };
        }

        // Send OTP via Infobip
        const smsResult = await sendOTP(formattedPhone, code);

        if (!smsResult.success) {
            return { success: false, error: smsResult.error || "Failed to send OTP" };
        }

        return { success: true };
    } catch (error) {
        console.error("Error requesting OTP:", error);
        return { success: false, error: "An error occurred" };
    }
}

export async function verifyOTP(phoneNumber: string, code: string): Promise<OTPResult> {
    try {
        const formattedPhone = formatPhoneNumber(phoneNumber);

        // Find valid OTP
        const { data: otpData, error: otpError } = await supabase
            .from("otp_codes" as any)
            .select("*")
            .eq("phone_number", formattedPhone)
            .eq("code", code)
            .eq("verified", false)
            .gt("expires_at", new Date().toISOString())
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (otpError || !otpData) {
            return { success: false, error: "Invalid or expired OTP" };
        }

        // Mark OTP as verified
        await supabase
            .from("otp_codes" as any)
            .update({ verified: true })
            .eq("id", (otpData as any).id);

        return { success: true };
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, error: "Verification failed" };
    }
}
