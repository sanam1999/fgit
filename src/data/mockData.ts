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

export interface Project {
  id: string;
  name: string;
  pct: number;
  memberIds: string[];
}

async function fetchOrEmpty<T>(url: string): Promise<{ data: T[]; error: string | null }> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
    const data = await res.json() as T[];
    return { data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Failed to fetch ${url}:`, message);
    return { data: [], error: message };
  }
}

export let employees: Employee[] = [];
export let leaveRequests: LeaveRequest[] = [];
export let departments: Department[] = [];
export let projects: Project[] = [];

export async function initData() {
  const [e, l, d, p] = await Promise.all([
    fetchOrEmpty<Employee>("http://localhost:3050/api/employees"),
    fetchOrEmpty<LeaveRequest>("http://localhost:3050/api/leaveRequests"),
    fetchOrEmpty<Department>("http://localhost:3050/departments"),
    fetchOrEmpty<Project>("http://localhost:3050/api/projects"),
  ]);

  if (e.error) console.error("❌ Employees fetch failed:", e.error);
  if (l.error) console.error("❌ Leave requests fetch failed:", l.error);
  if (d.error) console.error("❌ Departments fetch failed:", d.error);
  if (p.error) console.error("❌ Projects fetch failed:", p.error);

  employees = e.data;
  leaveRequests = l.data;
  departments = d.data;
  projects = p.data;
}