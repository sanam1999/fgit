import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { employees, leaveRequests, departments } from "@/data/mockData";
import { Users, CalendarDays, Building2, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "../hooks/use-toast";

const departmentData = departments.map(d => ({
  name: d.name.length > 10 ? d.name.slice(0, 10) + "…" : d.name,
  employees: d.employeeCount,
}));

const statusData = [
  { name: "Active", value: employees.filter(e => e.status === "active").length },
  { name: "On Leave", value: employees.filter(e => e.status === "on-leave").length },
  { name: "Inactive", value: employees.filter(e => e.status === "inactive").length },
];
// toast({ title: "Error", description: "Failed to fetch balances", variant: "destructive" });
const PIE_COLORS = ["hsl(174, 62%, 32%)", "hsl(36, 90%, 55%)", "hsl(210, 12%, 70%)"];

export default function Dashboard() {
  const pendingLeaves = leaveRequests.filter(l => l.status === "pending").length;
  const approvedLeaves = leaveRequests.filter(l => l.status === "approved").length;

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Employees"
            value={employees.length}
            change="+2 this month"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Pending Leaves"
            value={pendingLeaves}
            change={`${approvedLeaves} approved`}
            changeType="neutral"
            icon={Clock}
            iconClassName="bg-warning/10 text-warning"
          />
          <StatCard
            title="Departments"
            value={departments.length}
            icon={Building2}
            iconClassName="bg-info/10 text-info"
          />
          <StatCard
            title="Attendance Rate"
            value="94.2%"
            change="+1.5% vs last month"
            changeType="positive"
            icon={TrendingUp}
            iconClassName="bg-success/10 text-success"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Employees by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 16%, 89%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(210, 12%, 50%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(210, 12%, 50%)" />
                    <Tooltip />
                    <Bar dataKey="employees" fill="hsl(174, 62%, 32%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Employee Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {statusData.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {statusData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leave Requests */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Recent Leave Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaveRequests.slice(0, 5).map((leave) => (
                <div key={leave.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {leave.employeeName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{leave.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{leave.startDate} — {leave.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize">{leave.type}</Badge>
                    <Badge
                      className={
                        leave.status === "approved"
                          ? "bg-success/10 text-success border-success/20"
                          : leave.status === "pending"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                      }
                      variant="outline"
                    >
                      {leave.status === "approved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {leave.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
