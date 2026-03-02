export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "on-leave" | "inactive";
  joinDate: string;
  avatar: string;
  phone: string;
  salary: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "vacation" | "sick" | "personal" | "maternity";
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
  budget: number;
}

export const employees: Employee[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah.j@company.com", role: "Engineering Manager", department: "Engineering", status: "active", joinDate: "2022-03-15", avatar: "SJ", phone: "+1 555-0101", salary: 145000 },
  { id: "2", name: "Michael Chen", email: "m.chen@company.com", role: "Senior Designer", department: "Design", status: "active", joinDate: "2021-07-22", avatar: "MC", phone: "+1 555-0102", salary: 120000 },
  { id: "3", name: "Emily Rodriguez", email: "e.rodriguez@company.com", role: "HR Specialist", department: "Human Resources", status: "active", joinDate: "2023-01-10", avatar: "ER", phone: "+1 555-0103", salary: 85000 },
  { id: "4", name: "James Wilson", email: "j.wilson@company.com", role: "Product Manager", department: "Product", status: "on-leave", joinDate: "2020-11-05", avatar: "JW", phone: "+1 555-0104", salary: 135000 },
  { id: "5", name: "Lisa Park", email: "l.park@company.com", role: "Software Engineer", department: "Engineering", status: "active", joinDate: "2023-06-18", avatar: "LP", phone: "+1 555-0105", salary: 110000 },
  { id: "6", name: "David Kim", email: "d.kim@company.com", role: "Marketing Lead", department: "Marketing", status: "active", joinDate: "2021-09-30", avatar: "DK", phone: "+1 555-0106", salary: 105000 },
  { id: "7", name: "Anna Thompson", email: "a.thompson@company.com", role: "Finance Analyst", department: "Finance", status: "active", joinDate: "2022-08-14", avatar: "AT", phone: "+1 555-0107", salary: 95000 },
  { id: "8", name: "Robert Davis", email: "r.davis@company.com", role: "DevOps Engineer", department: "Engineering", status: "inactive", joinDate: "2021-04-01", avatar: "RD", phone: "+1 555-0108", salary: 125000 },
  { id: "9", name: "Maria Garcia", email: "m.garcia@company.com", role: "UX Researcher", department: "Design", status: "active", joinDate: "2023-02-28", avatar: "MG", phone: "+1 555-0109", salary: 98000 },
  { id: "10", name: "Chris Lee", email: "c.lee@company.com", role: "Sales Director", department: "Sales", status: "active", joinDate: "2020-06-12", avatar: "CL", phone: "+1 555-0110", salary: 140000 },
];

export const leaveRequests: LeaveRequest[] = [
  { id: "1", employeeId: "4", employeeName: "James Wilson", type: "vacation", startDate: "2026-03-01", endDate: "2026-03-10", status: "approved", reason: "Family vacation" },
  { id: "2", employeeId: "1", employeeName: "Sarah Johnson", type: "sick", startDate: "2026-02-20", endDate: "2026-02-21", status: "approved", reason: "Not feeling well" },
  { id: "3", employeeId: "5", employeeName: "Lisa Park", type: "personal", startDate: "2026-03-05", endDate: "2026-03-06", status: "pending", reason: "Personal appointment" },
  { id: "4", employeeId: "6", employeeName: "David Kim", type: "vacation", startDate: "2026-03-15", endDate: "2026-03-22", status: "pending", reason: "Spring break trip" },
  { id: "5", employeeId: "9", employeeName: "Maria Garcia", type: "sick", startDate: "2026-02-24", endDate: "2026-02-25", status: "pending", reason: "Doctor appointment" },
  { id: "6", employeeId: "2", employeeName: "Michael Chen", type: "vacation", startDate: "2026-04-01", endDate: "2026-04-05", status: "pending", reason: "Conference attendance" },
];

export const departments: Department[] = [
  { id: "1", name: "Engineering", head: "Sarah Johnson", employeeCount: 3, budget: 850000 },
  { id: "2", name: "Design", head: "Michael Chen", employeeCount: 2, budget: 320000 },
  { id: "3", name: "Human Resources", head: "Emily Rodriguez", employeeCount: 1, budget: 180000 },
  { id: "4", name: "Product", head: "James Wilson", employeeCount: 1, budget: 250000 },
  { id: "5", name: "Marketing", head: "David Kim", employeeCount: 1, budget: 280000 },
  { id: "6", name: "Finance", head: "Anna Thompson", employeeCount: 1, budget: 200000 },
  { id: "7", name: "Sales", head: "Chris Lee", employeeCount: 1, budget: 350000 },
];
