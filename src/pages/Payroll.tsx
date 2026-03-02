import { AppLayout } from "@/components/AppLayout";
import { employees } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { DollarSign, TrendingUp, Users } from "lucide-react";

export default function Payroll() {
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalary = Math.round(totalPayroll / employees.length);

  return (
    <AppLayout title="Payroll">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Payroll" value={`$${totalPayroll.toLocaleString()}`} icon={DollarSign} />
          <StatCard title="Average Salary" value={`$${avgSalary.toLocaleString()}`} icon={TrendingUp} iconClassName="bg-info/10 text-info" />
          <StatCard title="Active Employees" value={employees.filter(e => e.status === "active").length} icon={Users} iconClassName="bg-success/10 text-success" />
        </div>
        <Card className="shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3 pl-4">Employee</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3">Department</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground p-3 pr-4">Salary</th>
                </tr>
              </thead>
              <tbody>
                {employees.filter(e => e.status === "active").map(emp => (
                  <tr key={emp.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {emp.avatar}
                        </div>
                        <span className="text-sm font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{emp.department}</td>
                    <td className="p-3 pr-4 text-sm font-semibold text-right">${emp.salary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
