import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Building2, Mail, Phone, Briefcase, Calendar, Shield } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { useAuth } from "../context/AuthContext";
const token = localStorage.getItem("token");

// Static data that doesn't come from the server
const STATIC_INFO = {
  company: "Prolab R",
  industry: "Technology",
  annualLeave: 21,
  sickLeave: 10,
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0">
      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" style={{ color: "#288b81" }} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  department: string;
  role: string;
  status?: string;
  joinDate: Date;
}

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth();
  const [user, setUser] = useState<Employee | null>(null);

  async function getuserdata() {
    try {
      const _id = authUser?.id;
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/${_id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      if (res.status === 402) {
        navigate("/unauthorized", { replace: true });
        return; // ← stop execution after redirect
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data: Employee = await res.json();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getuserdata();
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully.",
    });
    navigate("/login", { replace: true });
  };

  if (!user) return (
    <AppLayout title="Profile">
      <p className="text-center py-10 text-gray-400">Loading...</p>
    </AppLayout>
  );

  return (
    <AppLayout title="Profile">
      <div className="flex flex-col items-center max-w-md mx-auto space-y-6 py-4">

        {/* Avatar + Name + Role */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-24 h-24 rounded-full bg-violet-100 text-violet-700 text-2xl font-bold flex items-center justify-center ring-4 ring-violet-200">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-violet-600 font-medium">{user.role}</p>
            <p className="text-xs text-gray-400 mt-0.5">{STATIC_INFO.company}</p>
          </div>
        </div>

        {/* Personal Info */}
        <Card className="w-full shadow-sm">
          <CardContent className="pt-4 pb-2 px-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Personal</p>
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={Phone} label="Phone" value={user.phone} />
            <InfoRow icon={Calendar} label="Joined" value={new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card className="w-full shadow-sm">
          <CardContent className="pt-4 pb-2 px-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Company</p>
            <InfoRow icon={Building2} label="Company" value="Prolab R" />
            <InfoRow icon={Briefcase} label="Department" value={user.department} />
            <InfoRow icon={Shield} label="Industry" value={STATIC_INFO.industry} />
          </CardContent>
        </Card>

        {/* Leave Policy */}
        <Card className="w-full shadow-sm">
          <CardContent className="pt-4 pb-4 px-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Leave Policy</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-violet-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-violet-600">{STATIC_INFO.annualLeave}</p>
                <p className="text-xs text-gray-500 mt-0.5">Annual Leave Days</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{STATIC_INFO.sickLeave}</p>
                <p className="text-xs text-gray-500 mt-0.5">Sick Leave Days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-red-200 text-red-500 hover:bg-red-50 gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>

      </div>
    </AppLayout>
  );
}