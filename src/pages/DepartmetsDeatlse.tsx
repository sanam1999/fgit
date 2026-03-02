import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { departments, employees } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, User, ChevronLeft, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Department, Employee } from "@/data/mockData";

const PRIMARY = "#1F8278";

export default function Departments() {
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const deptEmployees = selectedDept
        ? employees.filter((e) => e.department === selectedDept.name)
        : [];

    // ─── DEPARTMENT DETAIL PAGE ───────────────────────────────────────────────
    if (selectedDept) {
        return (
            <AppLayout title="Departments">
                <div className="space-y-5">
                    {/* Back + Header */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
                            onClick={() => setSelectedDept(null)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </div>

                    {/* Dept Info Banner */}
                    <div
                        className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                        style={{ backgroundColor: `${PRIMARY}12` }}
                    >
                        <div
                            className="flex h-14 w-14 items-center justify-center rounded-xl shrink-0"
                            style={{ backgroundColor: `${PRIMARY}20`, color: PRIMARY }}
                        >
                            <Users className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-0.5">{selectedDept.name}</h2>
                            <p className="text-sm text-muted-foreground">Head: <span className="font-medium text-foreground">{selectedDept.head}</span></p>
                        </div>
                        <div className="flex gap-4 sm:gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold" style={{ color: PRIMARY }}>{selectedDept.employeeCount}</p>
                                <p className="text-xs text-muted-foreground">Employees</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold" style={{ color: PRIMARY }}>${(selectedDept.budget / 1000).toFixed(0)}k</p>
                                <p className="text-xs text-muted-foreground">Budget</p>
                            </div>
                        </div>
                    </div>

                    {/* Employee List */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Team Members ({deptEmployees.length})
                        </p>

                        {deptEmployees.length === 0 ? (
                            <div className="py-16 text-center text-muted-foreground text-sm rounded-2xl border border-dashed">
                                No employees found in this department.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {deptEmployees.map((emp) => (
                                    <div
                                        key={emp.id}
                                        className="flex items-center gap-3 p-4 rounded-xl border border-border/60 hover:border-border hover:shadow-sm bg-background cursor-pointer transition-all"
                                        onClick={() => setSelectedEmployee(emp)}
                                    >
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold shrink-0"
                                            style={{ backgroundColor: `${PRIMARY}18`, color: PRIMARY }}
                                        >
                                            {emp.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{emp.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{emp.role}</p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={
                                                emp.status === "active"
                                                    ? "bg-success/10 text-success border-success/20 text-xs"
                                                    : emp.status === "on-leave"
                                                        ? "bg-warning/10 text-warning border-warning/20 text-xs"
                                                        : "bg-muted text-muted-foreground text-xs"
                                            }
                                        >
                                            {emp.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Employee Detail Dialog */}
                <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Employee Details</DialogTitle>
                        </DialogHeader>
                        {selectedEmployee && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold shrink-0"
                                        style={{ backgroundColor: `${PRIMARY}18`, color: PRIMARY }}
                                    >
                                        {selectedEmployee.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{selectedEmployee.name}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedEmployee.role}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-0.5">Department</p>
                                        <p className="font-medium">{selectedEmployee.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-0.5">Status</p>
                                        <Badge
                                            variant="outline"
                                            className={
                                                selectedEmployee.status === "active"
                                                    ? "bg-success/10 text-success border-success/20"
                                                    : selectedEmployee.status === "on-leave"
                                                        ? "bg-warning/10 text-warning border-warning/20"
                                                        : "bg-muted text-muted-foreground"
                                            }
                                        >
                                            {selectedEmployee.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-0.5">Join Date</p>
                                        <p className="font-medium">{selectedEmployee.joinDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-0.5">Salary</p>
                                        <p className="font-medium">${selectedEmployee.salary.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{selectedEmployee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{selectedEmployee.phone}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </AppLayout>
        );
    }

    // ─── DEPARTMENTS GRID ─────────────────────────────────────────────────────
    return (
        <AppLayout title="Departments">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept, i) => (
                    <Card
                        key={dept.id}
                        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
                        style={{ animationDelay: `${i * 80}ms` }}
                        onClick={() => setSelectedDept(dept)}
                    >
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: `${PRIMARY}18`, color: PRIMARY }}
                                >
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-base mb-3">{dept.name}</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-3.5 w-3.5" />
                                    <span>Head: <span className="text-foreground font-medium">{dept.head}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{dept.employeeCount} employees</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <DollarSign className="h-3.5 w-3.5" />
                                    <span>Budget: ${dept.budget.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}