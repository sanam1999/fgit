// export interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   department: string;
//   status: "active" | "on-leave" | "inactive";
//   joinDate: string;
//   avatar: string;
//   phone: string;
//   salary: number;
// }

// export interface LeaveRequest {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   type: "vacation" | "sick" | "personal" | "maternity";
//   startDate: string;
//   endDate: string;
//   status: "pending" | "approved" | "rejected";
//   reason: string;
// }

// export interface Department {
//   id: string;
//   name: string;
//   head: string;
//   employeeCount: number;
//   budget: number;
// }

// async function fetchOrEmpty<T>(url: string): Promise<{ data: T[]; error: string | null }> {
//   try {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
//     const data = await res.json() as T[];
//     return { data, error: null };
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     console.error(`❌ Failed to fetch ${url}:`, message);
//     return { data: [], error: message };
//   }
// }

// export let employees: Employee[] = [];
// export let leaveRequests: LeaveRequest[] = [];
// export let departments: Department[] = [];


// export async function initData() {
//   const [l, d] = await Promise.all([

//     fetchOrEmpty<LeaveRequest>(`${import.meta.env.VITE_API_BASE_URL}/api/leaveRequests`),
//     fetchOrEmpty<Department>(`${import.meta.env.VITE_API_BASE_URL}/departments`),

//   ]);


//   if (l.error) console.error("❌ Leave requests fetch failed:", l.error);
//   if (d.error) console.error("❌ Departments fetch failed:", d.error);


//   employees = [];
//   leaveRequests = l.data;
//   departments = d.data;

// }
// export const DEPARTMENTS = [
//   "Software Engineering Department",
//   "AI & Research Department",
//   "Cybersecurity Department",
//   "Project Management Office (PMO)",
//   "Marketing & Branding",
//   "Administration & Finance"
// ];