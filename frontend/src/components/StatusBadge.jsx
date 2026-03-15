// src/components/StatusBadge.jsx
const STATUS_COLORS = {
  pending:       { bg:"rgba(251,191,36,0.12)",  color:"#fbbf24" },
  assigned:      { bg:"rgba(99,102,241,0.12)",  color:"#818cf8" },
  "in-progress": { bg:"rgba(59,130,246,0.12)",  color:"#60a5fa" },
  resolved:      { bg:"rgba(34,197,94,0.12)",   color:"#4ade80" },
  rejected:      { bg:"rgba(239,68,68,0.12)",   color:"#f87171" },
  closed:        { bg:"rgba(107,114,128,0.12)", color:"#9ca3af" },
};
const PRIORITY_COLORS = {
  low:    { bg:"rgba(34,197,94,0.1)",  color:"#4ade80" },
  medium: { bg:"rgba(251,191,36,0.1)", color:"#fbbf24" },
  high:   { bg:"rgba(249,115,22,0.1)", color:"#fb923c" },
  urgent: { bg:"rgba(239,68,68,0.1)", color:"#f87171" },
};

export function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:c.bg, color:c.color, padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"600", letterSpacing:"0.5px", textTransform:"uppercase", fontFamily:"monospace" }}>
      <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:c.color }}/>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const c = PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;
  return (
    <span style={{ background:c.bg, color:c.color, padding:"3px 8px", borderRadius:"4px", fontSize:"10px", fontWeight:"700", letterSpacing:"1px", textTransform:"uppercase", fontFamily:"monospace" }}>
      {priority}
    </span>
  );
}