import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { leaveRequests } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { LeaveRequest } from "@/data/mockData";

export default function Leaves() {
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filtered = requests.filter(r => filter === "all" || r.status === filter);

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <AppLayout title="Leave Management">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
              {f !== "all" && (
                <span className="ml-1.5 text-xs">
                  ({requests.filter(r => r.status === f).length})
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="grid gap-3">
          {filtered.map((leave) => (
            <Card key={leave.id} className="shadow-sm animate-fade-in">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                      {leave.employeeName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{leave.employeeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {leave.startDate} → {leave.endDate}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{leave.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-xs">{leave.type}</Badge>
                      <Badge
                        variant="outline"
                        className={
                          leave.status === "approved"
                            ? "bg-success/10 text-success border-success/20"
                            : leave.status === "pending"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {leave.status === "approved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {leave.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {leave.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                        {leave.status}
                      </Badge>
                    </div>
                    {leave.status === "pending" && (
                      <div className="flex gap-1.5 mt-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs text-success hover:bg-success/10" onClick={() => handleAction(leave.id, "approved")}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-destructive hover:bg-destructive/10" onClick={() => handleAction(leave.id, "rejected")}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">No leave requests found.</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
