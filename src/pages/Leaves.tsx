import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";

// MongoDB API shape — employeeId is populated (not just an ID string)
interface EmployeeId {
  _id: string;
  fullName: string;
  email: string;
  department: string;
  status: string;
  avatar: string;
}

interface LeaveRequestAPI {
  _id: string;
  employeeId: EmployeeId;
  type: "vacation" | "sick" | "personal" | "maternity";
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  createdAt: string;
  updatedAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


export default function Leaves() {
  const [requests, setRequests] = useState<LeaveRequestAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    async function fetchLeaves() {
      try {
        const res = await fetch("http://localhost:3050/api/leaveRequests");
        if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
        const data: LeaveRequestAPI[] = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch leave requests");
      } finally {
        setLoading(false);
      }
    }

    fetchLeaves();
  }, []);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    console.log(id, action)
    setRequests(prev =>
      prev.map(r => (r._id === id ? { ...r, status: action } : r))
    );

    try {
      const res = await fetch(`http://localhost:3050/api/leaveRequests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action, _id: id }),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch {
      // Revert on failure
      setRequests(prev =>
        prev.map(r => (r._id === id ? { ...r, status: "pending" } : r))
      );
    }
  };

  const filtered = requests.filter(r => filter === "all" || r.status === filter);

  return (
    <AppLayout title="Leave Management">
      <div className="space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading leave requests…</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="py-8 text-center text-destructive text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Leave Cards */}
        {!loading && !error && (
          <div className="grid gap-3">
            {filtered.map(leave => (
              <Card key={leave._id} className="shadow-sm animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                        <img style={{ borderRadius: 20 }} src={leave.employeeId.avatar} alt="image not avalable" />
                      </div>
                      <div style={{ minWidth: 100 }}>
                        <p className="text-sm font-medium">
                          {leave.employeeId.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(leave.startDate)} <br /> {formatDate(leave.endDate)}
                        </p>

                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{leave.reason}</p>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-col sm:items-end" style={{ minWidth: 180 }}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="capitalize text-xs">
                          {leave.type}
                        </Badge>
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-success hover:bg-success/10"
                            onClick={() => handleAction(leave._id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => handleAction(leave._id, "rejected")}
                          >
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
              <div className="py-12 text-center text-muted-foreground text-sm">
                No leave requests found.
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}