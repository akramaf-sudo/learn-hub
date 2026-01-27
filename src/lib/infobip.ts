const INFOBIP_API_KEY = "7692079a541ab37a7e9002fa89dae536-47cb822e-b4af-4579-b2f9-908f27e6b848";
const INFOBIP_BASE_URL = "https://api.infobip.com";

export interface SendOTPResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

export async function sendOTP(phoneNumber: string, code: string): Promise<SendOTPResponse> {
    try {
        const response = await fetch(`${INFOBIP_BASE_URL}/sms/2/text/advanced`, {
            method: "POST",
            headers: {
                "Authorization": `App ${INFOBIP_API_KEY}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                messages: [
                    {
                        destinations: [{ to: phoneNumber }],
                        from: "YolaFresh",
                        text: `Your Training Yola verification code is: ${code}. Valid for 5 minutes.`,
                    },
                ],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Infobip API error:", data);
            return {
                success: false,
                error: data.requestError?.serviceException?.text || "Failed to send OTP",
            };
        }

        return {
            success: true,
            messageId: data.messages?.[0]?.messageId,
        };
    } catch (error) {
        console.error("Error sending OTP:", error);
        return {
            success: false,
            error: "Network error while sending OTP",
        };
    }
}

export function generateOTP(length: number = 6): string {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}

export function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, "");

    // If it starts with +, return it cleaned
    if (phone.startsWith("+")) {
        return `+${cleaned}`;
    }

    // Handle Moroccan leading 0 (e.g., 06XXXX becomes 6XXXX)
    if (cleaned.startsWith("0")) {
        cleaned = cleaned.substring(1);
    }

    // Default to Morocco (+212)
    return `+212${cleaned}`;
}
