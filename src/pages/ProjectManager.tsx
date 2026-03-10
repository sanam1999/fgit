import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");
// ── Design tokens ────────────────────────────────────────────────────────────
const f = "'DM Sans', sans-serif";
const mono = "'DM Mono', monospace";
const BG = "#f0f4f2";
const WHITE = "#ffffff";
const DIVIDER = "#e8eeed";
const TEXT = "#1c2b25";
const TEXT2 = "#403d3d";
const TEXT3 = "#8a8a8a";
const ACCENT = "#3d8c6e";
const ACCENT_LT = "#eaf5ef";
const RING_COLOR = "#3d8c6e";
const RING_TRACK = "#dff0e8";
const RING_R = 50;
const RING_STROKE = 8;
const RING_SIZE = (RING_R + RING_STROKE) * 2 + 3;

// ── Types ────────────────────────────────────────────────────────────────────
export interface Project {
    id: string;
    name: string;
    pct: number;
    employeeid: string[];
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    departmentName: string;
    status: string;
    joinDate: string;
}

export interface Department {
    id: string;
    name: string;
}

interface RawProject {
    _id: string;
    name: string;
    progress: number;
    employeeid?: string[];
}

interface RawEmployee {
    _id: string;
    fullName: string;
    email: string;
    role?: string;
    position?: string;
    jobTitle?: string;
    department: string;
    status?: string;
    joinDate?: string;
}

interface RawDepartment {
    id: string;
    name: string;
}

// ── Normalisers ──────────────────────────────────────────────────────────────
function normaliseProject(r: RawProject): Project {
    return {
        id: String(r._id),
        name: r.name,
        pct: r.progress ?? 0,
        employeeid: r.employeeid ?? [],
    };
}

function normaliseEmployee(
    r: RawEmployee,
    deptMap: Record<string, string>
): Employee {
    const deptKey = String(r.department);
    return {
        id: String(r._id),
        name: r.fullName,
        email: r.email,
        role: r.role ?? r.position ?? r.jobTitle ?? "—",
        department: deptKey,
        departmentName: deptMap[deptKey] ?? "—",
        status: r.status ?? "active",
        joinDate: r.joinDate ?? "",
    };
}

// ── Sub-components ───────────────────────────────────────────────────────────

/** Three-dot kebab menu with Edit / Delete */
function ProjectMenu({
    project,
    onEdit,
    onDelete,
}: {
    project: Project;
    onEdit: (p: Project) => void;
    onDelete: (id: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        function handle(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    return (
        <div ref={ref} style={{ position: "relative" }}>
            {/* Dot button */}
            <button
                onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
                title="Options"
                style={{
                    background: open ? ACCENT_LT : "transparent",
                    border: `1px solid ${open ? "#a8d5c0" : "transparent"}`,
                    borderRadius: "50%",
                    width: 26,
                    height: 26,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    transition: "background 0.15s, border-color 0.15s",
                    color: open ? ACCENT : TEXT3,
                    flexShrink: 0,
                }}
            >
                {/* Three vertical dots */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <circle cx="7" cy="2.5" r="1.3" />
                    <circle cx="7" cy="7" r="1.3" />
                    <circle cx="7" cy="11.5" r="1.3" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: WHITE,
                        border: `1px solid ${DIVIDER}`,
                        borderRadius: 10,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                        minWidth: 130,
                        zIndex: 100,
                        overflow: "hidden",
                    }}
                >
                    {/* Edit */}
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setOpen(false);
                            onEdit(project);
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            width: "100%",
                            padding: "10px 14px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: f,
                            fontSize: 13,
                            fontWeight: 500,
                            color: TEXT2,
                            textAlign: "left",
                            transition: "background 0.1s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = ACCENT_LT)}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                    >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" />
                        </svg>
                        Edit Name
                    </button>

                    <div style={{ height: 1, background: DIVIDER, margin: "0 10px" }} />

                    {/* Delete */}
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setOpen(false);
                            onDelete(project.id);
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            width: "100%",
                            padding: "10px 14px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: f,
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#c0392b",
                            textAlign: "left",
                            transition: "background 0.1s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#fff0f0")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                    >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 3 12 3" />
                            <path d="M4 3V2h5v1" />
                            <path d="M2 3l1 9h7l1-9" />
                        </svg>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

function RingChart({
    label,
    pct,
    project,
    onEdit,
    onDelete,
}: {
    label: string;
    pct: number;
    project: Project;
    onEdit: (p: Project) => void;
    onDelete: (id: string) => void;
}) {
    const cx = RING_SIZE / 2;
    const cy = RING_SIZE / 2;
    const circ = 2 * Math.PI * RING_R;
    const filled = (Math.min(pct, 100) / 100) * circ;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            {/* Ring SVG */}
            <svg
                width={RING_SIZE}
                height={RING_SIZE}
                viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                style={{ overflow: "visible" }}
            >
                <circle cx={cx} cy={cy} r={RING_R} fill="none" stroke={RING_TRACK} strokeWidth={RING_STROKE} />
                <circle
                    cx={cx} cy={cy} r={RING_R}
                    fill="none" stroke={RING_COLOR}
                    strokeWidth={RING_STROKE} strokeLinecap="round"
                    strokeDasharray={`${filled} ${circ}`}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
                <text
                    x={cx} y={cy}
                    textAnchor="middle" dominantBaseline="central"
                    fontSize={14} fontWeight={700} fontFamily={mono} fill={RING_COLOR}
                >
                    {pct}%
                </text>
            </svg>

            {/* Label row: name + 3-dot menu */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                maxWidth: RING_SIZE + 30,
                justifyContent: "center",
            }}>
                <span style={{
                    fontFamily: mono, fontSize: 10, fontWeight: 500, color: TEXT3,
                    textTransform: "uppercase" as const, textAlign: "center" as const,
                    letterSpacing: "0.07em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                    maxWidth: RING_SIZE,
                }}>
                    {label}
                </span>

                <ProjectMenu project={project} onEdit={onEdit} onDelete={onDelete} />
            </div>
        </div>
    );
}

const inputSt: React.CSSProperties = {
    fontFamily: f, fontSize: 13, fontWeight: 400,
    padding: "8px 12px", border: `1px solid ${DIVIDER}`,
    borderRadius: 8, background: WHITE, color: TEXT2,
    outline: "none", width: "100%", boxSizing: "border-box" as const,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            fontFamily: mono, fontSize: 15, fontWeight: 600, color: TEXT3,
            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
        }}>
            {children}
        </div>
    );
}

function Av({ name, size = 28 }: { name: string; size?: number }) {
    const ini = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: ACCENT_LT, color: ACCENT,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: f, fontWeight: 700, fontSize: size * 0.34, flexShrink: 0,
        }}>
            {ini}
        </div>
    );
}

// ── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({
    project,
    onClose,
    onSave,
}: {
    project: Project;
    onClose: () => void;
    onSave: (id: string, newName: string) => Promise<void>;
}) {
    const [name, setName] = useState(project.name);
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (!name.trim() || name.trim() === project.name) { onClose(); return; }
        setSaving(true);
        await onSave(project.id, name.trim());
        setSaving(false);
        onClose();
    }

    return (
        /* Backdrop */
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 200,
            }}
        >
            {/* Modal card */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: WHITE,
                    border: `1px solid ${DIVIDER}`,
                    borderRadius: 16,
                    padding: "24px 28px",
                    width: 340,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
                }}
            >
                <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: TEXT3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                    Edit Project Name
                </div>

                <input
                    autoFocus
                    style={{ ...inputSt, marginBottom: 16 }}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSave()}
                    placeholder="Project name"
                />

                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1, padding: "10px 0",
                            background: BG, border: `1px solid ${DIVIDER}`,
                            borderRadius: 8, fontFamily: f, fontSize: 13,
                            fontWeight: 600, color: TEXT3, cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !name.trim()}
                        style={{
                            flex: 1, padding: "10px 0",
                            background: (!name.trim() || saving) ? DIVIDER : ACCENT,
                            color: (!name.trim() || saving) ? TEXT3 : WHITE,
                            border: "none", borderRadius: 8,
                            fontFamily: f, fontSize: 13, fontWeight: 600,
                            cursor: (!name.trim() || saving) ? "not-allowed" : "pointer",
                            transition: "background 0.15s",
                        }}
                    >
                        {saving ? "Saving…" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ProjectManage() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // form state
    const [newName, setNewName] = useState("");
    const [newPct, setNewPct] = useState<number | "">("");
    const [assignId, setAssignId] = useState<string | null>(null);
    const [selDept, setSelDept] = useState("");
    const [selEmpId, setSelEmpId] = useState("");

    // edit modal
    const [editProject, setEditProject] = useState<Project | null>(null);

    // ── Fetch all data on mount ────────────────────────────────────────────────
    useEffect(() => {
        async function loadAll() {
            setLoading(true);
            setError(null);
            try {
                const deptRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/departments`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }

                });
                if (deptRes.status === 402) {
                    navigate("/unauthorized", { replace: true });
                    return; // ← stop execution after redirect
                }
                if (!deptRes.ok) throw new Error(`Departments fetch failed: ${deptRes.status}`);
                const rawDepts: RawDepartment[] = await deptRes.json();

                const deptMap: Record<string, string> = {};
                rawDepts.forEach(d => { deptMap[String(d.id)] = d.name; });
                setDepartments(rawDepts.map(d => ({ id: String(d.id), name: d.name })));

                const empRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employee`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                if (empRes.status === 402) {
                    navigate("/unauthorized", { replace: true });
                    return; // ← stop execution after redirect
                }
                if (!empRes.ok) throw new Error(`Employee fetch failed: ${empRes.status}`);
                const rawEmps: RawEmployee[] = await empRes.json();
                setEmployees(rawEmps.map(e => normaliseEmployee(e, deptMap)));

                const projRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/project`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (projRes.status === 402) {
                    navigate("/unauthorized", { replace: true });
                    return; // ← stop execution after redirect
                }
                if (!projRes.ok) throw new Error(`Project fetch failed: ${projRes.status}`);
                const rawProjs: RawProject[] = await projRes.json();
                setProjects(rawProjs.map(normaliseProject));

            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                setError(msg);
            } finally {
                setLoading(false);
            }
        }
        loadAll();
    }, []);

    // ── Derived helpers ────────────────────────────────────────────────────────
    const deptEmployeesMap: Record<string, { id: string; name: string; role: string }[]> = {};
    departments.forEach(dept => {
        deptEmployeesMap[dept.name] = employees
            .filter(e => e.department === dept.id)
            .map(e => ({ id: e.id, name: e.name, role: e.role }));
    });

    function empById(id: string) {
        return employees.find(e => e.id === id);
    }

    const assignProject = projects.find(p => p.id === assignId) ?? null;
    const deptEmployees = selDept ? (deptEmployeesMap[selDept] ?? []) : [];

    const engagementMap: Record<string, number> = {};
    employees.forEach(e => {
        engagementMap[e.id] = projects.filter(p => p.employeeid.includes(e.id)).length;
    });

    // ── Handlers ──────────────────────────────────────────────────────────────
    async function handleCreate() {
        if (!newName.trim()) return;
        const pct = typeof newPct === "number" ? Math.min(100, Math.max(0, newPct)) : 0;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/project`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: newName.trim(), progress: pct }),
            });

            if (res.status === 402) {
                navigate("/unauthorized", { replace: true });
                return; // ← stop execution after redirect
            }
            if (!res.ok) throw new Error(`Create project failed: ${res.status}`);
            const raw: RawProject = await res.json();
            setProjects(prev => [...prev, normaliseProject(raw)]);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        }
        setNewName("");
        setNewPct("");
    }

    async function handleAddMember() {
        if (!assignId || !selEmpId) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/project/asingEmployee`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ projectId: assignId, employeeId: selEmpId }),
            });


            if (res.status === 402) {
                navigate("/unauthorized", { replace: true });
                return; // ← stop execution after redirect
            }
            if (!res.ok) throw new Error(`Assign employee failed: ${res.status}`);
            setProjects(prev =>
                prev.map(p =>
                    p.id === assignId && !p.employeeid.includes(selEmpId)
                        ? { ...p, employeeid: [...p.employeeid, selEmpId] }
                        : p
                )
            );
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        }
        setSelEmpId("");
    }

    function handleRemoveMember(projId: string, empId: string) {
        setProjects(prev =>
            prev.map(p =>
                p.id === projId
                    ? { ...p, employeeid: p.employeeid.filter(id => id !== empId) }
                    : p
            )
        );
    }

    // ── PATCH: rename project ─────────────────────────────────────────────────
    async function handleEditSave(projectId: string, newName: string) {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/project`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ projectId, newName }),
            });
            if (res.status === 402) {
                navigate("/unauthorized", { replace: true });
                return; // ← stop execution after redirect
            }
            if (!res.ok) throw new Error(`Rename project failed: ${res.status}`);
            // Update local state
            setProjects(prev =>
                prev.map(p => p.id === projectId ? { ...p, name: newName } : p)
            );
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }

    // ── DELETE: remove project ────────────────────────────────────────────────
    async function handleDelete(projectId: string) {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/project`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ projectId }),
            });
            if (res.status === 402) {
                navigate("/unauthorized", { replace: true });
                return; // ← stop execution after redirect
            }
            if (!res.ok) throw new Error(`Delete project failed: ${res.status}`);
            // Clear assign panel first if this project was selected
            if (assignId === projectId) {
                setAssignId(null);
                setSelDept("");
                setSelEmpId("");
            }
            // Remove from local state
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <AppLayout title="Project Management">
            <div style={{ fontFamily: f, background: BG, minHeight: "100vh", padding: "28px 32px", boxSizing: "border-box" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <span style={{ fontFamily: mono, fontSize: 15, fontWeight: 600, color: TEXT3, letterSpacing: "0.12em" }}>
                        Project Management
                    </span>
                    <div style={{ flex: 1, height: 1, background: DIVIDER }} />
                </div>

                {/* Error banner */}
                {error && (
                    <div style={{
                        background: "#fff0f0", border: "1px solid #f5c6c6", borderRadius: 10,
                        padding: "12px 16px", marginBottom: 20,
                        fontFamily: mono, fontSize: 12, color: "#c0392b",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                        <span>⚠ {error}</span>
                        <button
                            onClick={() => setError(null)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontSize: 16, fontFamily: mono }}
                        >×</button>
                    </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>

                    {/* ── LEFT COLUMN ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Create project */}
                        <div style={{ background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 14, padding: "20px 22px" }}>
                            <SectionLabel>Create Project</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 11, color: TEXT3, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                                        Project Name
                                    </div>
                                    <input
                                        style={inputSt}
                                        placeholder="e.g. Pearl City POS"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleCreate()}
                                    />
                                </div>
                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 11, color: TEXT3, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                                        Progress (%)
                                    </div>
                                    <input
                                        style={inputSt}
                                        type="number" min={0} max={100}
                                        placeholder="0 – 100"
                                        value={newPct}
                                        onChange={e => setNewPct(e.target.value === "" ? "" : Number(e.target.value))}
                                    />
                                </div>
                                <button
                                    onClick={handleCreate}
                                    disabled={!newName.trim()}
                                    style={{
                                        marginTop: 4,
                                        background: newName.trim() ? ACCENT : DIVIDER,
                                        color: newName.trim() ? WHITE : TEXT3,
                                        border: "none", borderRadius: 8, padding: "10px 0",
                                        fontFamily: f, fontSize: 13, fontWeight: 600,
                                        cursor: newName.trim() ? "pointer" : "not-allowed",
                                        width: "100%", transition: "background 0.15s",
                                    }}
                                >
                                    + Create Project
                                </button>
                            </div>
                        </div>

                        {/* Assign members */}
                        <div style={{ background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 14, padding: "20px 22px" }}>
                            <SectionLabel>Assign Members</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 11, color: TEXT3, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                                        Project
                                    </div>
                                    <select
                                        style={{ ...inputSt, cursor: "pointer" }}
                                        value={assignId ?? ""}
                                        onChange={e => {
                                            setAssignId(e.target.value || null);
                                            setSelDept("");
                                            setSelEmpId("");
                                        }}
                                    >
                                        <option value="">Select project…</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 11, color: TEXT3, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                                        Department
                                    </div>
                                    <select
                                        style={{ ...inputSt, cursor: assignId ? "pointer" : "not-allowed", opacity: assignId ? 1 : 0.6 }}
                                        value={selDept}
                                        onChange={async e => {
                                            const deptName = e.target.value;
                                            setSelDept(deptName);
                                            setSelEmpId("");
                                            if (deptName) {
                                                const dept = departments.find(d => d.name === deptName);
                                                if (dept) {
                                                    try {
                                                        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employee/${dept.id}`, {
                                                            headers: {
                                                                "Authorization": `Bearer ${token}`,
                                                                "Content-Type": "application/json"
                                                            },
                                                        });
                                                        if (res.status === 402) {
                                                            navigate("/unauthorized", { replace: true });
                                                            return; // ← stop execution after redirect
                                                        }
                                                        if (!res.ok) throw new Error(`Employee fetch failed: ${res.status}`);
                                                        const rawEmps: RawEmployee[] = await res.json();
                                                        const deptMap: Record<string, string> = {};
                                                        departments.forEach(d => { deptMap[d.id] = d.name; });
                                                        const fetched = rawEmps.map(e => normaliseEmployee(e, deptMap));
                                                        setEmployees(prev => {
                                                            const otherDeptEmps = prev.filter(e => e.department !== dept.id);
                                                            return [...otherDeptEmps, ...fetched];
                                                        });
                                                    } catch (err: unknown) {
                                                        setError(err instanceof Error ? err.message : String(err));
                                                    }
                                                }
                                            }
                                        }}
                                        disabled={!assignId}
                                    >
                                        <option value="">Select department…</option>
                                        {Object.keys(deptEmployeesMap).map(d => (
                                            <option key={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                {selDept && (
                                    <div>
                                        <div style={{ fontFamily: mono, fontSize: 11, color: TEXT3, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                                            Employee
                                            <span style={{ marginLeft: 8, fontWeight: 400, color: TEXT3 }}>
                                                ({deptEmployees.length} in dept)
                                            </span>
                                        </div>
                                        {deptEmployees.length === 0 ? (
                                            <div style={{ fontFamily: mono, fontSize: 11, color: TEXT3, padding: "8px 0" }}>
                                                No employees in this department
                                            </div>
                                        ) : (
                                            <select
                                                style={{ ...inputSt, cursor: "pointer" }}
                                                value={selEmpId}
                                                onChange={e => setSelEmpId(e.target.value)}
                                            >
                                                <option value="">Select employee…</option>
                                                {deptEmployees.map(e => {
                                                    const already = assignProject?.employeeid.includes(e.id) ?? false;
                                                    return (
                                                        <option key={e.id} value={e.id} disabled={already}>
                                                            {e.name} — {e.role}{already ? " ✓" : ""}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={handleAddMember}
                                    disabled={!assignId || !selEmpId}
                                    style={{
                                        marginTop: 2,
                                        background: (!assignId || !selEmpId) ? DIVIDER : ACCENT,
                                        color: (!assignId || !selEmpId) ? TEXT3 : WHITE,
                                        border: "none", borderRadius: 8, padding: "10px 0",
                                        fontFamily: f, fontSize: 13, fontWeight: 600,
                                        cursor: (!assignId || !selEmpId) ? "not-allowed" : "pointer",
                                        width: "100%", transition: "background 0.15s",
                                    }}
                                >
                                    Add to Project
                                </button>

                                {assignProject && assignProject.employeeid.length > 0 && (
                                    <div style={{ marginTop: 4 }}>
                                        <div style={{ fontFamily: mono, fontSize: 9, color: TEXT3, marginBottom: 8, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                                            Current Members ({assignProject.employeeid.length})
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                            {assignProject.employeeid.map(id => {
                                                const emp = empById(id);
                                                if (!emp) return null;
                                                return (
                                                    <div
                                                        key={id}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: 10,
                                                            background: ACCENT_LT, borderRadius: 8, padding: "8px 10px",
                                                        }}
                                                    >
                                                        <Av name={emp.name} />
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontFamily: f, fontSize: 12, fontWeight: 600, color: TEXT }}>{emp.name}</div>
                                                            <div style={{ fontFamily: f, fontSize: 11, color: TEXT3 }}>{emp.role}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveMember(assignProject.id, id)}
                                                            style={{
                                                                background: "none", border: "none", cursor: "pointer",
                                                                color: TEXT3, fontSize: 16, padding: 2, fontFamily: mono,
                                                                lineHeight: 1,
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Project rings */}
                        <div style={{ background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 14, padding: "20px 22px" }}>
                            <SectionLabel>Project Breakdown</SectionLabel>
                            {loading ? (
                                <div style={{ textAlign: "center", color: TEXT3, fontFamily: mono, fontSize: 12, padding: "32px 0" }}>
                                    Loading…
                                </div>
                            ) : projects.length === 0 ? (
                                <div style={{ textAlign: "center", color: TEXT3, fontFamily: mono, fontSize: 12, padding: "32px 0" }}>
                                    No projects yet
                                </div>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "24px 16px" }}>
                                    {projects.map(p => (
                                        <RingChart
                                            key={p.id}
                                            label={p.name}
                                            pct={p.pct}
                                            project={p}
                                            onEdit={setEditProject}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Engagement table */}
                        <div style={{ background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 14, padding: "20px 22px" }}>
                            <SectionLabel>Employee Project Engagement</SectionLabel>

                            <div style={{
                                display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 80px",
                                padding: "8px 14px", background: BG, borderRadius: 8,
                                fontFamily: mono, fontSize: 9, fontWeight: 500, color: TEXT3,
                                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4,
                            }}>
                                <span>Employee</span>
                                <span>Department</span>
                                <span>Role</span>
                                <span style={{ textAlign: "center" as const }}>Projects</span>
                            </div>

                            {loading ? (
                                <div style={{ textAlign: "center", color: TEXT3, fontFamily: mono, fontSize: 12, padding: "32px 0" }}>
                                    Loading employees…
                                </div>
                            ) : employees.length === 0 ? (
                                <div style={{ textAlign: "center", color: TEXT3, fontFamily: mono, fontSize: 12, padding: "32px 0" }}>
                                    No employees found
                                </div>
                            ) : (
                                employees
                                    .slice()
                                    .sort((a, b) => (engagementMap[b.id] ?? 0) - (engagementMap[a.id] ?? 0))
                                    .map((emp, i) => {
                                        const count = engagementMap[emp.id] ?? 0;
                                        return (
                                            <div
                                                key={emp.id}
                                                style={{
                                                    display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 80px",
                                                    padding: "11px 14px",
                                                    borderBottom: i < employees.length - 1 ? `1px solid ${DIVIDER}` : "none",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <Av name={emp.name} />
                                                    <span style={{ fontFamily: f, fontSize: 13, fontWeight: 600, color: TEXT }}>{emp.name}</span>
                                                </div>
                                                <span style={{ fontFamily: f, fontSize: 12, color: TEXT2 }}>{emp.departmentName}</span>
                                                <span style={{ fontFamily: f, fontSize: 12, color: TEXT3 }}>{emp.role}</span>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <span style={{
                                                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                        width: 28, height: 28, borderRadius: "50%",
                                                        background: count > 0 ? ACCENT_LT : BG,
                                                        color: count > 0 ? ACCENT : TEXT3,
                                                        fontFamily: mono, fontSize: 11, fontWeight: 700,
                                                        border: count > 0 ? `1.5px solid #a8d5c0` : `1px solid ${DIVIDER}`,
                                                    }}>
                                                        {count}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit modal (rendered outside the grid so it overlays everything) */}
            {editProject && (
                <EditModal
                    project={editProject}
                    onClose={() => setEditProject(null)}
                    onSave={handleEditSave}
                />
            )}
        </AppLayout>
    );
}