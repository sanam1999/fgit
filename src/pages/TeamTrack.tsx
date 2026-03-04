import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";

// ── Google Fonts loader ──────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
document.head.appendChild(fontLink);

// ── Types & data ─────────────────────────────────────────────────────────────
type Status = "active" | "on-leave" | "inactive";

interface Employee {
    id: string;
    name: string;
    initials: string;
    role: string;
    dept: string;
    status: Status;
    join: string;
    task: string;
}

const EMPLOYEES: Employee[] = [
    { id: "1", name: "Sarah Johnson", initials: "SJ", role: "Engineering Manager", dept: "Engineering", status: "active", join: "2022-03-15", task: "Sprint planning & code review" },
    { id: "2", name: "Michael Chen", initials: "MC", role: "Senior Designer", dept: "Design", status: "active", join: "2021-07-22", task: "Redesigning login page" },
    { id: "3", name: "Emily Rodriguez", initials: "ER", role: "HR Specialist", dept: "Human Resources", status: "active", join: "2023-01-10", task: "Onboarding 3 new hires" },
    { id: "4", name: "James Wilson", initials: "JW", role: "Product Manager", dept: "Product", status: "on-leave", join: "2020-11-05", task: "Currently on leave" },
    { id: "5", name: "Lisa Park", initials: "LP", role: "Software Engineer", dept: "Engineering", status: "active", join: "2023-06-18", task: "API integration work" },
    { id: "6", name: "David Kim", initials: "DK", role: "Marketing Lead", dept: "Marketing", status: "active", join: "2021-09-30", task: "Q2 campaign launch" },
    { id: "7", name: "Anna Thompson", initials: "AT", role: "Finance Analyst", dept: "Finance", status: "active", join: "2022-08-14", task: "Monthly report compilation" },
    { id: "8", name: "Robert Davis", initials: "RD", role: "DevOps Engineer", dept: "Engineering", status: "inactive", join: "2021-04-01", task: "Account inactive" },
    { id: "9", name: "Maria Garcia", initials: "MG", role: "UX Researcher", dept: "Design", status: "active", join: "2023-02-28", task: "User interview sessions" },
    { id: "10", name: "Chris Lee", initials: "CL", role: "Sales Director", dept: "Sales", status: "active", join: "2020-06-12", task: "Enterprise client meetings" },
];

const DEPARTMENTS = ["Engineering", "Design", "Human Resources", "Product", "Marketing", "Finance", "Sales"];

// ── Status badge ─────────────────────────────────────────────────────────────
const tagStyles: Record<Status, React.CSSProperties> = {
    active: { background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
    "on-leave": { background: "#fef9c3", color: "#854d0e", border: "1px solid #fde68a" },
    inactive: { background: "#f3f4f6", color: "#6b7280", border: "1px solid #e5e7eb" },
};

function StatusTag({ status }: { status: Status }) {
    const label = status === "on-leave" ? "On Leave" : status.charAt(0).toUpperCase() + status.slice(1);
    return (
        <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 500,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.3px",
            width: "fit-content",
            ...tagStyles[status],
        }}>
            {label}
        </span>
    );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
    return (
        <div style={{
            width: size, height: size,
            borderRadius: "50%",
            background: "#ccfbf1",
            color: "#0f766e",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.31,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.5px",
            flexShrink: 0,
        }}>
            {initials}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TeamTrack() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [dateFrom, setFrom] = useState("");
    const [dateTo, setTo] = useState("");
    const [dept, setDept] = useState("");

    const handleEmployeeClick = (id: string) => navigate(`/workflow/${id}`);

    const todayStr = new Date().toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    const filtered = useMemo(() => EMPLOYEES.filter(e => {
        if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (dept && e.dept !== dept) return false;
        if (dateFrom && e.join < dateFrom) return false;
        if (dateTo && e.join > dateTo) return false;
        return true;
    }), [search, dateFrom, dateTo, dept]);

    const activeToday = filtered.filter(e => e.status === "active");

    // ── Shared styles ─────────────────────────────────────────────────────────
    const BASE: React.CSSProperties = {
        fontFamily: "'DM Sans', sans-serif",
    };

    const inputStyle: React.CSSProperties = {
        ...BASE,
        fontSize: 13,
        fontWeight: 400,
        padding: "8px 12px",
        border: "1px solid #d1d5db",
        borderRadius: 8,
        background: "#fff",
        color: "#111827",
        outline: "none",
        height: 38,
        lineHeight: "1.4",
    };

    const labelStyle: React.CSSProperties = {
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        fontWeight: 500,
        color: "#9ca3af",
        textTransform: "uppercase" as const,
        letterSpacing: "0.8px",
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <AppLayout title="Team Track">
            <div style={{ ...BASE, background: "#f4f6f8", minHeight: "100vh", padding: "28px 32px", color: "#111827" }}>

                {/* Top bar */}
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#111827",
                        letterSpacing: "-0.4px",
                        margin: 0,
                    }}>
                        TeamTrack
                    </h1>
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "flex-end" }}>

                    {/* Search */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        <label style={labelStyle}>Search by name</label>
                        <input
                            type="text"
                            placeholder="Search employees…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ ...inputStyle, width: 220 }}
                        />
                    </div>

                    {/* From date */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        <label style={labelStyle}>From date</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => setFrom(e.target.value)}
                            style={{ ...inputStyle, width: 150 }}
                        />
                    </div>

                    {/* To date */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        <label style={labelStyle}>To date</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => setTo(e.target.value)}
                            style={{ ...inputStyle, width: 150 }}
                        />
                    </div>

                    {/* Department */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        <label style={labelStyle}>Department</label>
                        <select
                            value={dept}
                            onChange={e => setDept(e.target.value)}
                            style={{ ...inputStyle, width: 175, cursor: "pointer" }}
                        >
                            <option value="">All Departments</option>
                            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                {/* Layout */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

                    {/* ── Employee list ── */}
                    <div style={{
                        background: "#fff",
                        borderRadius: 14,
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    }}>
                        {/* Table header */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "2.5fr 1.4fr 1fr",
                            padding: "11px 20px",
                            background: "#f9fafb",
                            borderBottom: "1px solid #e5e7eb",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10,
                            fontWeight: 500,
                            color: "#9ca3af",
                            textTransform: "uppercase",
                            letterSpacing: "0.7px",
                        }}>
                            <span>Employee</span>
                            <span>Department</span>
                            <span>Status</span>
                        </div>

                        {/* Rows */}
                        {filtered.length === 0 ? (
                            <div style={{ ...BASE, padding: 48, textAlign: "center", fontSize: 13, fontWeight: 400, color: "#9ca3af" }}>
                                No employees match your filters.
                            </div>
                        ) : (
                            filtered.map((e, i) => (
                                <div
                                    key={e.id}
                                    onClick={() => handleEmployeeClick(e.id)}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "2.5fr 1.4fr 1fr",
                                        padding: "13px 20px",
                                        borderBottom: i === filtered.length - 1 ? "none" : "1px solid #f3f4f6",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "background 0.12s",
                                    }}
                                    onMouseEnter={el => (el.currentTarget.style.background = "#f0fdfa")}
                                    onMouseLeave={el => (el.currentTarget.style.background = "transparent")}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <Avatar initials={e.initials} />
                                        <div>
                                            <div style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "#111827",
                                                letterSpacing: "-0.1px",
                                                lineHeight: 1.3,
                                            }}>
                                                {e.name}
                                            </div>
                                            <div style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                color: "#9ca3af",
                                                lineHeight: 1.4,
                                                marginTop: 1,
                                            }}>
                                                {e.role}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: 13,
                                        fontWeight: 400,
                                        color: "#374151",
                                    }}>
                                        {e.dept}
                                    </span>
                                    <StatusTag status={e.status} />
                                </div>
                            ))
                        )}
                    </div>

                    {/* ── Today panel ── */}
                    <div style={{
                        background: "#fff",
                        borderRadius: 14,
                        padding: 20,
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                        position: "sticky",
                        top: 28,
                        maxHeight: "calc(100vh - 60px)",
                        overflowY: "auto",
                    }}>
                        {/* Panel header */}
                        <div style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 9,
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "1.4px",
                            color: "#9ca3af",
                            marginBottom: 4,
                        }}>
                            Today
                        </div>
                        <div style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#111827",
                            letterSpacing: "-0.1px",
                            marginBottom: 16,
                            paddingBottom: 14,
                            borderBottom: "1px solid #f3f4f6",
                            lineHeight: 1.4,
                        }}>
                            {todayStr}
                        </div>

                        <div style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 9,
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "1.2px",
                            color: "#9ca3af",
                            marginBottom: 12,
                        }}>
                            All Active Employees
                        </div>

                        {activeToday.length === 0 ? (
                            <div style={{ ...BASE, fontSize: 12, fontWeight: 400, color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>
                                No active employees
                            </div>
                        ) : (
                            activeToday.map(e => (
                                <div
                                    key={e.id}
                                    onClick={() => handleEmployeeClick(e.id)}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 10,
                                        padding: "11px 13px",
                                        marginBottom: 9,
                                        cursor: "pointer",
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={el => (el.currentTarget.style.background = "#f9fafb")}
                                    onMouseLeave={el => (el.currentTarget.style.background = "transparent")}
                                >
                                    {/* Card header */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                        <Avatar initials={e.initials} size={34} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: "#111827",
                                                letterSpacing: "-0.1px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                lineHeight: 1.3,
                                            }}>
                                                {e.name}
                                            </div>
                                            <div style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 11,
                                                fontWeight: 400,
                                                color: "#9ca3af",
                                                marginTop: 1,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                lineHeight: 1.4,
                                            }}>
                                                {e.role}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleEmployeeClick(e.id)}
                                            style={{
                                                background: "#134e4a",
                                                color: "#fff",
                                                border: "none",
                                                padding: "5px 12px",
                                                borderRadius: 6,
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: 11,
                                                fontWeight: 600,
                                                letterSpacing: "0.2px",
                                                cursor: "pointer",
                                                flexShrink: 0,
                                            }}
                                        >
                                            See
                                        </button>
                                    </div>

                                    {/* Current task */}
                                    < div style={{
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 9,
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.9px",
                                        color: "#9ca3af",
                                        marginBottom: 3,
                                    }}>
                                        Current Task
                                    </div>
                                    <div style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: 12,
                                        fontWeight: 400,
                                        color: "#374151",
                                        lineHeight: 1.5,
                                        marginBottom: 8,
                                    }}>
                                        {e.task}
                                    </div>

                                    {/* Dept chip */}
                                    <span style={{
                                        display: "inline-block",
                                        background: "#f3f4f6",
                                        borderRadius: 4,
                                        padding: "2px 8px",
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 10,
                                        fontWeight: 400,
                                        color: "#6b7280",
                                        letterSpacing: "0.2px",
                                    }}>
                                        {e.dept}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div >
        </AppLayout >
    );
}