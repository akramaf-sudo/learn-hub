import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Activity, User, Globe, Clock, Filter, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ActivityLog {
    id: string;
    user_id: string;
    user_phone: string;
    event_type: string;
    description: string;
    ip_address: string;
    metadata: any;
    created_at: string;
}

export default function AdminActivity() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

    const { data: logs, isLoading } = useQuery({
        queryKey: ["admin-activity-logs"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("user_activity_logs" as any)
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return (data as unknown) as ActivityLog[];
        },
    });

    const filteredLogs = (logs || []).filter((log) =>
        log.user_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getEventColor = (type: string) => {
        switch (type) {
            case "login": return "bg-green-500/10 text-green-600 border-green-200";
            case "upload": return "bg-blue-500/10 text-blue-600 border-blue-200";
            case "video_view": return "bg-purple-500/10 text-purple-600 border-purple-200";
            case "page_view": return "bg-gray-500/10 text-gray-600 border-gray-200";
            default: return "bg-primary/10 text-primary border-primary/20";
        }
    };

    return (
        <MainLayout>
            <div className="p-4 md:p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Activity Dashboard</h1>
                    <p className="text-muted-foreground">Monitor real-time user interactions and security logs.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{logs?.length || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users Today</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Set(logs?.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).map(l => l.user_id)).size}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Logs History</CardTitle>
                                <CardDescription>Detailed record of every action on the platform.</CardDescription>
                            </div>
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search phone, event or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Time</TableHead>
                                        <TableHead>User / Phone</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead className="hidden md:table-cell">Description</TableHead>
                                        <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10">Loading logs...</TableCell>
                                        </TableRow>
                                    ) : filteredLogs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10">No logs found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredLogs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="font-medium whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{format(new Date(log.created_at), "MMM d, HH:mm:ss")}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
                                                            {log.user_phone?.slice(-2)}
                                                        </div>
                                                        <span className="text-sm font-medium">{log.user_phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getEventColor(log.event_type)}>
                                                        {log.event_type.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                                                        {log.description}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Globe className="h-3 w-3" />
                                                        {log.ip_address}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Log Details</DialogTitle>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Original Timestamp</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(selectedLog.created_at), "PPPP p")}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">IP Address</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Globe className="w-3 h-3" />
                                        {selectedLog.ip_address}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">User ID</p>
                                    <p className="font-mono text-[10px] truncate">{selectedLog.user_id}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Phone</p>
                                    <p className="font-medium">{selectedLog.user_phone}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Event Metadata</p>
                                <pre className="p-4 rounded-lg bg-accent font-mono text-xs overflow-auto max-h-40">
                                    {JSON.stringify(selectedLog.metadata, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
