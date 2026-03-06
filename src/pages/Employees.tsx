import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Search, Plus, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { toast } from "sonner";

const DEPARTMENT_NAMES = [
  "Software Engineering Department",
  "AI & Research Department",
  "Cybersecurity Department",
  "Project Management Office (PMO)",
  "Sales & Business Development",
  "Administration & Finance",
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

interface Attendance {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  phone: string;
  department: string;
  role: string;
  status?: string;
  joinDate: string;
  salary?: number;
  checkIn: string | null;
  checkOut: string | null;
}

export default function Employees() {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Attendance | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [employeeList, setEmployeeList] = useState<Attendance[]>([]);

  async function getuserdata() {
    try {
      const res = await fetch(`http://localhost:3050/employees`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data: Attendance[] = await res.json();
      // FIX 1: Removed stale closure console.log(employeeList) — state hasn't
      // updated yet at this point so it always logged the old value.
      setEmployeeList(data);
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getuserdata();
  }, []);

  const filteredList = employeeList.filter((emp) => {
    const q = search.toLowerCase();
    return (
      emp.fullName?.toLowerCase().includes(q) ||
      emp.role?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.phone?.toLowerCase().includes(q) ||
      emp.status?.toLowerCase().includes(q)
    );
  });

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddEmployee = async () => {

    if (!form.name || !form.role || !form.department || !form.email || !form.joinDate) {
      toast.error("Please fill in all required fields!");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3050/addemployee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update");
      setForm(EMPTY_FORM);
      setShowAddDialog(false);
      toast.success("Employee added successfully");
      getuserdata();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
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
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3 hidden lg:table-cell">Phone NO</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3 hidden lg:table-cell">check In</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-3 hidden lg:table-cell">check Out</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((emp) => (

                  <tr
                    key={emp._id}
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    {void console.log(emp)}
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                          <img style={{ borderRadius: 20 }} src={emp.avatar} alt="image not available" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{emp.fullName}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{emp.role}</td>
                    <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">{emp.phone}</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={
                          emp.status === "active"
                            ? "bg-success/10 text-success border-success/20"
                            : emp.status === "on-leave"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"

                        }
                      >
                        {emp.status}
                      </Badge>
                    </td>

                    <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">{emp.checkIn ? new Date(emp.checkIn).toLocaleDateString('en-US', {
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    }) : "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">{emp.checkOut ? new Date(emp.checkOut).toLocaleDateString('en-US', {
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    }) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredList.length === 0 && (
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
                {/* FIX 2: Render avatar as <img> instead of raw string */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                  <img
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedEmployee.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.role}</p>
                </div>
              </div>
              <p> Join Date:  {selectedEmployee.joinDate
                ? new Date(selectedEmployee.checkIn).toLocaleDateString('en-US', {
                  day: "numeric",
                  year: "numeric",
                  month: "numeric"
                })
                : "—"}</p>
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
                          : "bg-red-500/10 text-red-500 border border-red-500/20"

                    }
                  >
                    {selectedEmployee.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Check In</p>
                  <p className="font-medium">{
                    selectedEmployee.checkIn
                      ? new Date(selectedEmployee.checkIn).toLocaleDateString('en-US', {
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })
                      : "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Check Out</p>
                  {/* FIX 3: Was showing checkIn for both, and had a stray $ sign */}
                  <p className="font-medium">{
                    selectedEmployee.checkOut
                      ? new Date(selectedEmployee.checkOut).toLocaleDateString('en-US', {
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })
                      : "—"}</p>
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
          </DialogHeader>

          <div className="space-y-4">
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="joinDate">Join Date <span className="text-destructive">*</span></Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={form.joinDate}
                  onChange={(e) => handleFormChange("joinDate", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="salary">Salary </Label>
                <Input
                  id="salary"

                  type="number"
                  placeholder="LKR 50,000"
                  value={form.salary}
                  onChange={(e) => handleFormChange("salary", e.target.value)}
                />
              </div>
            </div>

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
              disabled={!form.name || !form.role || !form.department || !form.email || !form.joinDate}
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