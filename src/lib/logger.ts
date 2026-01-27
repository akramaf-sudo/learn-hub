import { supabase } from "@/integrations/supabase/client";

export type LogEventType = 'login' | 'logout' | 'video_view' | 'page_view' | 'click' | 'upload';

export interface LogEntry {
    event_type: LogEventType;
    description: string;
    metadata?: any;
}

/**
 * Fetches the user's public IP address using a free service.
 */
const getIPAddress = async (): Promise<string> => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Failed to fetch IP address:", error);
        return "unknown";
    }
};

/**
 * Logs an activity to the database.
 */
export const logActivity = async ({ event_type, description, metadata = {} }: LogEntry) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const ipAddress = await getIPAddress();
        const phone = user.user_metadata?.phone_number || user.email || "unknown";

        const { error } = await supabase
            .from('user_activity_logs' as any)
            .insert({
                user_id: user.id,
                user_phone: phone,
                event_type,
                description,
                ip_address: ipAddress,
                metadata
            });

        if (error) {
            console.error("Error saving log:", error);
        }
    } catch (err) {
        console.error("Log utility error:", err);
    }
};
