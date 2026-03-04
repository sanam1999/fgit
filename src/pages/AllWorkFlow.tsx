import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";

(() => {
  if (document.getElementById("__wf_fonts")) return;
  const l = document.createElement("link");
  l.id = "__wf_fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
  document.head.appendChild(l);
})();

const f = "'DM Sans', sans-serif";
const mono = "'DM Mono', monospace";

const BG = "#f0f4f2";
const WHITE = "#ffffff";
const DIVIDER = "#e8eeed";
const TEXT = "#656464";
const TEXT2 = "#403d3d";
const TEXT3 = "#8a8a8a";
const AV_BG = "#d6ece3";
const AV_TEXT = "#3d8c6e";
const ACCENT = "#3d8c6e";
const ACCENT_LT = "#eaf5ef";

const RING_COLOR = "#3d8c6e";
const RING_TRACK = "#dff0e8";
const RING_R = 50;
const RING_STROKE = 8;
const RING_SIZE = (RING_R + RING_STROKE) * 2 + 3;

const BADGE: Record<string, { color: string; border: string }> = {
  active: { color: "#3d8c6e", border: "#a8d5c0" },
  "on-leave": { color: "#b07a10", border: "#f0cc7a" },
  inactive: { color: "#7a8a84", border: "#c8d3cf" },
};

interface EmployeeData {
  name: string; role: string; dept: string; deptSub: string;
  totalProjects: number; workingDays: number; workingHours: number;
  status: string; weeklyHours: number[];
  projects: { label: string; pct: number }[];
}
interface LogTask { time: string; desc: string; }
interface LogEntry { date: string; entryTime: string; leaveTime: string; summary: string; tasks: LogTask[]; }

const EMPLOYEE: EmployeeData = {
  name: "Alex Morgan", role: "employee", dept: "DevOps", deptSub: "division",
  totalProjects: 7, workingDays: 48, workingHours: 384, status: "active",
  weeklyHours: [8, 7.5, 8.5, 10, 7, 8, 7.5, 9, 6, 8, 8, 7.5, 5, 2],
  projects: [
    { label: "Pearl City Pos", pct: 35 },
    { label: "Money Management", pct: 25 },
    { label: "Network Defense System", pct: 20 },
    { label: "Prolab R", pct: 20 },
    { label: "Pearl City Pos", pct: 35 },
    { label: "Money Management", pct: 25 },
  ],
};

const LOGS: LogEntry[] = [
  {
    date: "2026/01/02", entryTime: "08.00 AM", leaveTime: "04.00 PM",
    summary: "server up",
    tasks: [{ time: "All day", desc: "Monitored server health and confirmed all services running correctly." }],
  },
  {
    date: "2026/01/03", entryTime: "8.12", leaveTime: "3.49 pm",
    summary: "VPS setup and install all dependencies",
    tasks: [
      { time: "10.00 am", desc: "Introduction to VPS hosting environment and server access setup" },
      { time: "12.00 pm", desc: "Configured Nginx reverse proxy and SSL certificates" },
      { time: "02.00 pm", desc: "Installed Node.js, PM2, and all project dependencies" },
      { time: "End of day", desc: "Introduction to VPS hosting environment and server access" },
    ],
  },
  {
    date: "2026/01/04", entryTime: "09.00 AM", leaveTime: "05.15 PM",
    summary: "Database migration and environment config updates completed",
    tasks: [
      { time: "09.00 am", desc: "Reviewed migration scripts and backup procedures" },
      { time: "11.00 am", desc: "Ran database migration on staging environment" },
      { time: "01.00 pm", desc: "Updated .env config files across all services" },
      { time: "End of day", desc: "Verified all services healthy post-migration" },
    ],
  },
  {
    date: "2026/01/05", entryTime: "08.45 AM", leaveTime: "04.30 PM",
    summary: "CI pipeline setup and automated deployment scripts",
    tasks: [
      { time: "09.00 am", desc: "Set up GitHub Actions workflow for CI" },
      { time: "11.30 am", desc: "Wrote deploy.sh script for zero-downtime deploys" },
      { time: "02.00 pm", desc: "Tested pipeline end-to-end on dev branch" },
      { time: "End of day", desc: "Merged CI config to main, pipeline passing" },
    ],
  },
];

// ── Single ring ───────────────────────────────────────────────────────────────
function RingChart({ label, pct }: { label: string; pct: number }) {
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;
  const circumference = 2 * Math.PI * RING_R;
  const filled = (pct / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} style={{ overflow: "visible" }}>
        <circle cx={cx} cy={cy} r={RING_R} fill="none" stroke={RING_TRACK} strokeWidth={RING_STROKE} />
        <circle
          cx={cx} cy={cy} r={RING_R}
          fill="none"
          stroke={RING_COLOR}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
        <text
          x={cx} y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
          fontWeight={700}
          fontFamily={mono}
          fill={RING_COLOR}
          letterSpacing="-0.3"
        >
          {pct}%
        </text>
      </svg>
      <span style={{
        fontFamily: mono, fontSize: 11, fontWeight: 600,
        color: TEXT3, textTransform: "uppercase" as const, textAlign: "center" as const,
      }}>
        {label}
      </span>
    </div>
  );
}

// ── Rings grid ────────────────────────────────────────────────────────────────
function ProjectRings({ data }: { data: { label: string; pct: number }[] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
      gap: "16px 20px",
      width: "100%",
    }}>
      {data.map((d, i) => <RingChart key={i} label={d.label} pct={d.pct} />)}
    </div>
  );
}

// ── Weekly chart ──────────────────────────────────────────────────────────────
const DAY_LABELS = ["M", "T", "W", "T", "F", "M", "T", "W", "T", "F", "M", "T", "W"];

// Color bands: 0 → grey  |  <7 → red  |  7–7.5 → yellow  |  7.6–8.2 → green  |  >8.2 → dark green
function hourColor(h: number): string {
  if (h <= 0) return DIVIDER;
  if (h < 7) return "#ef4444";
  if (h <= 7.5) return "#eab308";
  if (h <= 8.2) return "#3d8c6e";
  return "#1f5c49";
}

function WeeklyChart({ hours }: { hours: number[] }) {
  const max = Math.max(...hours, 1);
  const W = 500, H = 110, pX = 10, pY = 14;
  const barW = 26;
  const gap = (W - pX * 2 - barW * hours.length) / (hours.length - 1);
  const pts = hours.map((h, i) => ({
    x: pX + i * (barW + gap) + barW / 2,
    y: H - pY - (h / max) * (H - pY * 2), h,
  }));
  const targetY = H - pY - (8 / max) * (H - pY * 2);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ overflow: "visible" }}>
      <line x1={pX} x2={W - pX} y1={targetY} y2={targetY} stroke="#b5d4c8" strokeDasharray="5 3" strokeWidth={1} />
      {pts.map(({ x, y, h }, i) => (
        <rect key={i} x={x - barW / 2} y={y} width={barW} height={H - pY - y}
          fill={hourColor(h)} opacity={0.35} rx={3} />
      ))}
      <polyline points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeLinejoin="round" />
      {pts.map(({ x, y, h }, i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={WHITE} stroke={hourColor(h)} strokeWidth={1.5} />
      ))}
      {pts.map(({ x }, i) => (
        <text key={i} x={x} y={H + 16} textAnchor="middle" fontSize={10} fill={TEXT3} fontFamily={mono}>
          {DAY_LABELS[i]}
        </text>
      ))}
    </svg>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, children }: {
  label: string; value?: string; sub?: string; children?: React.ReactNode;
}) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: WHITE, border: `1px solid ${DIVIDER}`,
      borderRadius: 12, padding: "16px 18px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 500, color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </div>
      {children || (
        <>
          <div style={{ fontFamily: mono, fontSize: 20, fontWeight: 600, color: TEXT, lineHeight: 1.2, letterSpacing: "-0.3px" }}>
            {value}
          </div>
          <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 400, color: TEXT3 }}>{sub}</div>
        </>
      )}
    </div>
  );
}

// ── Employee details ──────────────────────────────────────────────────────────
function EmployeeDetails() {
  const emp = EMPLOYEE;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatCard label="NAME" value={emp.name} sub={emp.role} />
        <StatCard label="DEPARTMENT" value={emp.dept} sub={emp.deptSub} />
        <StatCard label="TOTAL PROJECTS" value={String(emp.totalProjects).padStart(2, "0")} sub="active / completed" />
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatCard label="TOTAL WORKING DAYS" value={String(emp.workingDays)} sub="this quarter" />
        <StatCard label="WORKING HOURS" value={`${emp.workingHours}h`} sub="avg 8h / day" />
        <StatCard label="STATUS">
          <div style={{ marginTop: 2 }}>
            <span style={{
              display: "inline-flex", alignItems: "center",
              padding: "4px 13px", borderRadius: 999,
              border: `1.5px solid ${(BADGE[emp.status] || BADGE.inactive).border}`,
              color: (BADGE[emp.status] || BADGE.inactive).color,
              fontFamily: mono, fontSize: 12, fontWeight: 500,
            }}>
              {emp.status}
            </span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 400, color: TEXT3, marginTop: 4 }}>
            {emp.status === "active" ? "server up" : emp.status === "on-leave" ? "currently away" : "account inactive"}
          </div>
        </StatCard>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {/* Weekly hours */}
        <div style={{ flex: 2, minWidth: 240, background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontFamily: mono, fontSize: 15, fontWeight: 600, color: TEXT3, marginBottom: 14, letterSpacing: "0.08em" }}>
            Weekly Hours Log
          </div>
          <WeeklyChart hours={emp.weeklyHours} />
        </div>
        {/* Project rings */}
        <div style={{ flex: 1, minWidth: 200, background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: TEXT3, marginBottom: 14, letterSpacing: "0.08em" }}>
            Project Breakdown
          </div>
          <ProjectRings data={emp.projects} />
        </div>
      </div>
    </div>
  );
}

// ── Log row ───────────────────────────────────────────────────────────────────
function LogRow({ log, isOpen, onToggle }: { log: LogEntry; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 10, overflow: "hidden" }}>
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 18px", gap: 14,
          cursor: "pointer",
          background: isOpen ? ACCENT_LT : WHITE,
          transition: "background 0.1s",
          userSelect: "none" as const,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 18, flexShrink: 0, color: isOpen ? ACCENT : TEXT3, fontFamily: mono, transition: "color 1s" }}>
            {isOpen ? "⇣" : "→"}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 400, color: TEXT2, flexShrink: 0 }}>
                Entry {log.entryTime}
              </span>
              <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 500, color: TEXT, flex: 1, textAlign: "center", letterSpacing: "-0.1px" }}>
                {log.summary}
              </span>
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 400, color: TEXT3, marginTop: 2 }}>
              Leave {log.leaveTime}
            </div>
          </div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 400, color: TEXT3, flexShrink: 0 }}>
          {log.date}
        </div>
      </div>
      {isOpen && (
        <div style={{ borderTop: `1px solid ${DIVIDER}`, padding: "8px 18px 14px 42px" }}>
          {log.tasks.map((task, i) => (
            <div key={i} style={{
              display: "flex", gap: 18, padding: "7px 0",
              borderBottom: i < log.tasks.length - 1 ? `1px solid ${DIVIDER}` : "none",
            }}>
              <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 400, color: ACCENT, flexShrink: 0, width: 88 }}>
                {task.time}
              </span>
              <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 400, color: TEXT2, lineHeight: 1.5 }}>
                {task.desc}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AllWorkFlow({ employee, logs }: { employee?: EmployeeData; logs?: LogEntry[] }) {
  const emp = employee || EMPLOYEE;
  const entries = logs || LOGS;
  const [openIndex, setOpenIndex] = useState<number | null>(1);
  const initials = emp.name.split(" ").map(n => n[0]).join("");

  return (
    <AppLayout title="All Work Flow">
      <div style={{ fontFamily: mono, background: BG, minHeight: "100vh", padding: "28px 32px", boxSizing: "border-box" }}>

        {/* Page title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 400, color: TEXT3, letterSpacing: "0.12em" }}>
            all work flow
          </span>
          <div style={{ flex: 1, height: 1, background: DIVIDER }} />
        </div>

        {/* Employee details */}
        <div style={{ background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: AV_BG, color: AV_TEXT,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: mono, fontWeight: 700, fontSize: 10, letterSpacing: "0.04em", flexShrink: 0,
            }}>
              {initials}
            </div>
            <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 600, color: TEXT2, letterSpacing: "-0.1px" }}>
              Employee details
            </span>
            <div style={{ flex: 1, height: 1, background: DIVIDER }} />
          </div>
          <EmployeeDetails />
        </div>

        {/* Logs */}
        <div style={{ background: WHITE, border: `1px solid ${DIVIDER}`, borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontFamily: mono, fontSize: 15, fontWeight: 600, color: TEXT3, marginBottom: 12 }}>
            Daily logs
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {entries.map((log, i) => (
              <LogRow key={i} log={log} isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}