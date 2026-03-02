import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Notification {
    id: string;
    senderName: string;
    position: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: "info" | "warning" | "success" | "error";
}

const mockNotifications: Notification[] = [
    {
        id: "n-1",
        senderName: "Sarah Johnson",
        position: "HR Manager",
        title: "Leave Request Approved",
        message: "Your leave request for Dec 24–26 has been approved. Enjoy your time off!",
        time: "2 min ago",
        read: false,
        type: "success",
    },
    {
        id: "n-2",
        senderName: "Mark Williams",
        position: "Engineering Lead",
        title: "Project Deadline Reminder",
        message: "The Q4 dashboard project deadline is tomorrow. Please ensure all tasks are completed.",
        time: "1 hr ago",
        read: false,
        type: "warning",
    },
    {
        id: "n-3",
        senderName: "Emily Davis",
        position: "Product Manager",
        title: "New Task Assigned",
        message: "You have been assigned to the new onboarding flow redesign. Check your task board.",
        time: "3 hr ago",
        read: false,
        type: "info",
    },
    {
        id: "n-4",
        senderName: "James Carter",
        position: "Finance Director",
        title: "Payroll Processed",
        message: "This month's payroll has been successfully processed and will reflect within 2 business days.",
        time: "Yesterday",
        read: true,
        type: "success",
    },
    {
        id: "n-5",
        senderName: "Lisa Brown",
        position: "CEO",
        title: "Company All-Hands Meeting",
        message: "Reminder: All-hands meeting is scheduled for Friday at 10:00 AM in the main conference room.",
        time: "2 days ago",
        read: true,
        type: "info",
    },
    {
        id: "n-6",
        senderName: "Tom Harris",
        position: "IT Support",
        title: "System Maintenance Alert",
        message: "Scheduled maintenance will occur Sunday 2–4 AM. Expect brief downtime during this window.",
        time: "3 days ago",
        read: true,
        type: "error",
    },
];

const TYPE_STYLES = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
    error: "bg-red-100 text-red-700",
};

const AVATAR_COLORS = [
    "bg-violet-100 text-violet-700",
    "bg-pink-100 text-pink-700",
    "bg-sky-100 text-sky-700",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-rose-100 text-rose-700",
];

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast.success("All notifications marked as read");
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.success("Notification removed");
    };

    const clearAll = () => {
        setNotifications([]);
        toast.success("All notifications cleared");
    };

    return (
        <AppLayout>
            <div className="p-6 max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-100 rounded-xl">
                            <Bell className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
                            <p className="text-sm text-gray-500">
                                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <Badge className="bg-violet-600 text-white">{unreadCount}</Badge>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1 text-xs">
                                <CheckCheck className="w-4 h-4" /> Mark all read
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button variant="outline" size="sm" onClick={clearAll} className="gap-1 text-xs text-red-500 border-red-200 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" /> Clear all
                            </Button>
                        )}
                    </div>
                </div>

                {/* List */}
                {notifications.length === 0 ? (
                    <Card className="p-12 text-center text-gray-400">
                        <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No notifications</p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((n, i) => (
                            <Card
                                key={n.id}
                                className={`p-4 transition-all border ${!n.read ? "border-violet-200 bg-violet-50/40" : "bg-white"
                                    }`}
                            >
                                <div className="flex items-start gap-4">

                                    {/* Avatar */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                        {getInitials(n.senderName)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <div>
                                                <span className="text-sm font-semibold text-gray-900">{n.senderName}</span>
                                                <span className="text-xs text-gray-400 ml-2">{n.position}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLES[n.type]}`}>
                                                    {n.type}
                                                </span>
                                                <span className="text-xs text-gray-400">{n.time}</span>
                                                {!n.read && (
                                                    <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-sm font-medium text-gray-800 mt-1">{n.title}</p>
                                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-3">
                                            {!n.read && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs h-7 px-3 gap-1"
                                                    onClick={() => markAsRead(n.id)}
                                                >
                                                    <Check className="w-3 h-3" /> Mark as read
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-xs h-7 px-3 gap-1 text-red-500 hover:bg-red-50"
                                                onClick={() => deleteNotification(n.id)}
                                            >
                                                <Trash2 className="w-3 h-3" /> Remove
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}