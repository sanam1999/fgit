import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { employees, departments, projects as serverProjects } from "@/data/mockData";
import type { Project } from "@/data/mockData";

(() => {
    if (document.getElementById("__pm_fonts")) return;
    const l = document.createElement("link");
    l.id = "__pm_fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
})();

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

function RingChart({ label, pct }: { label: string; pct: number }) {
    const cx = RING_SIZE / 2, cy = RING_SIZE / 2;
    const circ = 2 * Math.PI * RING_R;
    const filled = (Math.min(pct, 100) / 100) * circ;
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} style={{ overflow: "visible" }}>
                <circle cx={cx} cy={cy} r={RING_R} fill="none" stroke={RING_TRACK} strokeWidth={RING_STROKE} />
                <circle cx={cx} cy={cy} r={RING_R} fill="none" stroke={RING_COLOR}
                    strokeWidth={RING_STROKE} strokeLinecap="round"
                    strokeDasharray={`${filled} ${circ}`}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                    fontSize={14} fontWeight={700} fontFamily={mono} fill={RING_COLOR}>
                    {pct}%
                </text>
            </svg>
            <span style={{
                fontFamily: mono, fontSize: 10, fontWeight: 500, color: TEXT3,
                textTransform: "uppercase" as const, textAlign: "center" as const,
                letterSpacing: "0.07em", maxWidth: RING_SIZE,
            }}>
                {label}
            </span>
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
            fontFamily: mono, fontSize: 9, fontWeight: 500, color: TEXT3,
            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14
        }}>
            {children}
        </div>
    );
}

function Av({ name, size = 28 }: { name: string; size?: number }) {
    const ini = name.split(" ").map(n => n[0]).join("").slice(0, 2);
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: ACCENT_LT, color: ACCENT,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: f, fontWeight: 700, fontSize: size * 0.34, flexShrink: 0,
        }}>{ini}</div>
    );
}

export default function ProjectManage() {
    // ── Load everything from server ─────────────────────────────────────────
    const [projects, setProjects] = useState<Project[]>(serverProjects);
    const [newName, setNewName] = useState("");
    const [newPct, setNewPct] = useState(0);
    const [assignId, setAssignId] = useState<string | null>(null);
    const [selDept, setSelDept] = useState("");
    const [selEmpId, setSelEmpId] = useState("");

    // Sync if serverProjects loads after mount
    useEffect(() => {
        if (serverProjects.length > 0) setProjects(serverProjects);
    }, [serverProjects.length]);

    // ── DEPARTMENTS map built from server data ──────────────────────────────
    const DEPARTMENTS: Record<string, { id: string; name: string; role: string }[]> = {};
    departments.forEach(dept => {
        DEPARTMENTS[dept.name] = employees
            .filter(e => e.department === dept.name)
            .map(e => ({ id: e.id, name: e.name, role: e.role }));
    });

    const ALL_EMPLOYEES = employees.map(e => ({ id: e.id, name: e.name, role: e.role }));
    function empById(id: string) { return ALL_EMPLOYEES.find(e => e.id === id); }

    // ── Create project ──────────────────────────────────────────────────────
    function handleCreate() {
        if (!newName.trim()) return;
        setProjects(p => [...p, {
            id: `pr${Date.now()}`,
            name: newName.trim(),
            pct: Math.min(100, Math.max(0, newPct)),
            memberIds: [],
        }]);
        setNewName(""); setNewPct(0);
    }

    // ── Add member ──────────────────────────────────────────────────────────
    function handleAddMember() {
        if (!assignId || !selEmpId) return;
        setProjects(ps => ps.map(p =>
            p.id === assignId && !p.memberIds.includes(selEmpId)
                ? { ...p, memberIds: [...p.memberIds, selEmpId] }
                : p
        ));
        setSelEmpId("");
    }

    // ── Remove member ───────────────────────────────────────────────────────
    function handleRemoveMember(projId: string, empId: string) {
        setProjects(ps => ps.map(p =>
            p.id === projId ? { ...p, memberIds: p.memberIds.filter(id => id !== empId) } : p
        ));
    }

    const engagementMap: Record<string, number> = {};
    ALL_EMPLOYEES.forEach(e => {
        engagementMap[e.id] = projects.filter(p => p.memberIds.includes(e.id)).length;
    });

    const assignProject = projects.find(p => p.id === assignId);
    const deptEmployees = selDept ? DEPARTMENTS[selDept] ?? [] : [];

    return (
        <AppLayout title="Project Management">
            <div style={{ fontFamily: f, background: BG, minHeight: "100vh", padding: "28px 32px", boxSizing: "border-box" }}>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 400, color: TEXT3, letterSpacing: "0.12em" }}>
                        project manager
                    </span>
                    <div style={{ flex: 1, height: 1, background: DIVIDER }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>

                    {/* ── LEFT COLUMN ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Create project */}
                        <div style={{ background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 14, padding: "20px 22px" }}>
                            <SectionLabel>Create Project</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 9, color: TEXT3, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>Project Name</div>
                                    <input style={inputSt} placeholder="e.g. Pearl City Pos" value={newName} onChange={e => setNewName(e.target.value)} />
                                </div>
                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 9, color: TEXT3, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>Progress (%)</div>
                                    <input style={inputSt} type="number" min={0} max={100} placeholder="0 – 100"
                                        value={newPct === 0 ? "" : newPct} onChange={e => setNewPct(Number(e.target.value))} />
                                </div>
                                <button onClick={handleCreate} style={{
                                    marginTop: 4, background: ACCENT, color: WHITE, border: "none",
                                    borderRadius: 8, padding: "10px 0", fontFamily: f, fontSize: 13,
                                    fontWeight: 600, cursor: "pointer", width: "100%",
                                }}>
                                    + Create Project
                                </button>
                            </div>
                        </div>

                        {/* Assign members */}
                        <div style={{ background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 14, padding: "20px 22px" }}>
                            <SectionLabel>Assign Members</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 9, color: TEXT3, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>Project</div>
                                    <select style={{ ...inputSt, cursor: "pointer" }} value={assignId ?? ""}
                                        onChange={e => { setAssignId(e.target.value || null); setSelDept(""); setSelEmpId(""); }}>
                                        <option value="">Select project…</option>
                                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 9, color: TEXT3, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>Department</div>
                                    <select style={{ ...inputSt, cursor: "pointer" }} value={selDept}
                                        onChange={e => { setSelDept(e.target.value); setSelEmpId(""); }} disabled={!assignId}>
                                        <option value="">Select department…</option>
                                        {Object.keys(DEPARTMENTS).map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                {selDept && (
                                    <div>
                                        <div style={{ fontFamily: mono, fontSize: 9, color: TEXT3, marginBottom: 5, letterSpacing: "0.07em", textTransform: "uppercase" }}>Employee</div>
                                        <select style={{ ...inputSt, cursor: "pointer" }} value={selEmpId} onChange={e => setSelEmpId(e.target.value)}>
                                            <option value="">Select employee…</option>
                                            {deptEmployees.map(e => (
                                                <option key={e.id} value={e.id} disabled={assignProject?.memberIds.includes(e.id)}>
                                                    {e.name} — {e.role}{assignProject?.memberIds.includes(e.id) ? " ✓" : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <button onClick={handleAddMember} disabled={!assignId || !selEmpId} style={{
                                    marginTop: 2,
                                    background: (!assignId || !selEmpId) ? DIVIDER : ACCENT,
                                    color: (!assignId || !selEmpId) ? TEXT3 : WHITE,
                                    border: "none", borderRadius: 8, padding: "10px 0",
                                    fontFamily: f, fontSize: 13, fontWeight: 600,
                                    cursor: (!assignId || !selEmpId) ? "not-allowed" : "pointer",
                                    width: "100%", transition: "background 0.15s",
                                }}>
                                    Add to Project
                                </button>

                                {assignProject && assignProject.memberIds.length > 0 && (
                                    <div style={{ marginTop: 4 }}>
                                        <div style={{ fontFamily: mono, fontSize: 9, color: TEXT3, marginBottom: 8, letterSpacing: "0.07em", textTransform: "uppercase" }}>Current Members</div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                            {assignProject.memberIds.map(id => {
                                                const emp = empById(id);
                                                if (!emp) return null;
                                                return (
                                                    <div key={id} style={{
                                                        display: "flex", alignItems: "center", gap: 10,
                                                        background: ACCENT_LT, borderRadius: 8, padding: "8px 10px",
                                                    }}>
                                                        <Av name={emp.name} />
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontFamily: f, fontSize: 12, fontWeight: 600, color: TEXT }}>{emp.name}</div>
                                                            <div style={{ fontFamily: f, fontSize: 11, color: TEXT3 }}>{emp.role}</div>
                                                        </div>
                                                        <button onClick={() => handleRemoveMember(assignProject.id, id)} style={{
                                                            background: "none", border: "none", cursor: "pointer",
                                                            color: TEXT3, fontSize: 14, padding: 2, fontFamily: mono,
                                                        }}>×</button>
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
                            {projects.length === 0 ? (
                                <div style={{ textAlign: "center", color: TEXT3, fontFamily: mono, fontSize: 12, padding: "32px 0" }}>
                                    No projects yet
                                </div>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "24px 16px" }}>
                                    {projects.map(p => <RingChart key={p.id} label={p.name} pct={p.pct} />)}
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
                                <span>Employee</span><span>Department</span><span>Role</span>
                                <span style={{ textAlign: "center" as const }}>Projects</span>
                            </div>
                            {ALL_EMPLOYEES.length === 0 ? (
                                <div style={{ textAlign: "center", color: TEXT3, fontFamily: mono, fontSize: 12, padding: "32px 0" }}>
                                    Loading employees…
                                </div>
                            ) : (
                                ALL_EMPLOYEES
                                    .slice()
                                    .sort((a, b) => (engagementMap[b.id] ?? 0) - (engagementMap[a.id] ?? 0))
                                    .map((emp, i) => {
                                        const dept = employees.find(e => e.id === emp.id)?.department ?? "—";
                                        const count = engagementMap[emp.id] ?? 0;
                                        return (
                                            <div key={emp.id} style={{
                                                display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 80px",
                                                padding: "11px 14px",
                                                borderBottom: i < ALL_EMPLOYEES.length - 1 ? `1px solid ${DIVIDER}` : "none",
                                                alignItems: "center",
                                            }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <Av name={emp.name} />
                                                    <span style={{ fontFamily: f, fontSize: 13, fontWeight: 600, color: TEXT }}>{emp.name}</span>
                                                </div>
                                                <span style={{ fontFamily: f, fontSize: 12, color: TEXT2 }}>{dept}</span>
                                                <span style={{ fontFamily: f, fontSize: 12, color: TEXT3 }}>{emp.role}</span>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <span style={{
                                                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                        width: 28, height: 28, borderRadius: "50%",
                                                        background: count > 0 ? ACCENT_LT : BG,
                                                        color: count > 0 ? ACCENT : TEXT3,
                                                        fontFamily: mono, fontSize: 11, fontWeight: 700,
                                                        border: count > 0 ? `1.5px solid #a8d5c0` : `1px solid ${DIVIDER}`,
                                                    }}>{count}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}