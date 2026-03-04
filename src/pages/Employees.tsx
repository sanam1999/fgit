import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { employees } from "@/data/mockData";
import { Search, Plus, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { get, post, ApiError } from '../hooks/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/data/mockData";
import { toast } from "sonner";

const DEPARTMENT_NAMES = [
  "Engineering",
  "Design",
  "Human Resources",
  "Product",
  "Marketing",
  "Finance",
  "Sales",
];

const EMPTY_FORM = {
  name: "",
  role: "",
  department: "",
  joinDate: "",
  salary: "",
  email: "",
  phone: "",
};

export default function Employees() {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees);

  const filtered = employeeList.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleAddEmployee = async () => {
    if (!form.name || !form.role || !form.department || !form.email) return;

    const initials = form.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      name: form.name,
      role: form.role,
      department: form.department,
      status: "active",
      joinDate: form.joinDate,
      salary: Number(form.salary.replace(/[^0-9]/g, "")),
      email: form.email,
      phone: form.phone,
      avatar: initials,
    };

    try {
      // 1. Call API first
      const created = await post('/addemployee', form);

      // 2. Use server response id instead of Date.now()
      setEmployeeList((prev) => [...prev, { ...newEmployee, id: created.id ?? newEmployee.id }]);
      setForm(EMPTY_FORM);
      setShowAddDialog(false);
      toast.success("Employee added successfully");

    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);        // show server error message
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <AppLayout title="Employees">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="gap-2 self-start" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>

        <Card className="shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3 pl-4">Employee</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3 hidden md:table-cell">Role</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3 hidden lg:table-cell">Department</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3 hidden lg:table-cell">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                          {emp.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{emp.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{emp.role}</td>
                    <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">{emp.department}</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={
                          emp.status === "active"
                            ? "bg-success/10 text-success border-success/20"
                            : emp.status === "on-leave"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">{emp.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">No employees found.</div>
          )}
        </Card>
      </div>

      {/* View Employee Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-bold">
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

      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              ID {1}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name & Role */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  placeholder="Sarah Johnson"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
                <Input
                  id="role"
                  placeholder="Engineering Manager"
                  value={form.role}
                  onChange={(e) => handleFormChange("role", e.target.value)}
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <Label>Department <span className="text-destructive">*</span></Label>
              <Select
                value={form.department}
                onValueChange={(val) => handleFormChange("department", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_NAMES.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Join Date & Salary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={form.joinDate}
                  onChange={(e) => handleFormChange("joinDate", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="LKR 50,000"
                  value={form.salary}
                  onChange={(e) => handleFormChange("salary", e.target.value)}
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="space-y-3 pt-1 border-t">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah.j@company.com"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  placeholder="+94 (71) 012 3123"
                  value={form.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => { setShowAddDialog(false); setForm(EMPTY_FORM); }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEmployee}
              disabled={!form.name || !form.role || !form.department || !form.email}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}