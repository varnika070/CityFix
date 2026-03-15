import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import { CATEGORY_ICONS } from "../components/categoryIcons";

export default function CitizenDashboard({ onViewComplaint, onFileComplaint }) {
  const { token, user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const d = await api("/complaints", "GET", null, token);
        setComplaints(d.complaints || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadComplaints();
  }, [token]);

  const filtered = filter === "all"
    ? complaints
    : complaints.filter(c => c.status === filter);

  const counts = {
    total:      complaints.length,
    pending:    complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in-progress" || c.status === "assigned").length,
    resolved:   complaints.filter(c => c.status === "resolved" || c.status === "closed").length,
  };

  return (
    <div style={s.page}>
      <Navbar title="My Complaints" />
      <div style={s.content}>

        {/* Greeting */}
        <div style={s.greeting}>
          <div>
            <h1 style={s.greetTitle}>Good day, {user?.name?.split(" ")[0]} 👋</h1>
            <p style={s.greetSub}>Track and manage your civic complaints</p>
          </div>
          <button style={s.fileBtn} onClick={onFileComplaint}>+ File New Complaint</button>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            { label:"Total Filed",  value:counts.total,      icon:"📋", color:"#818cf8" },
            { label:"Pending",      value:counts.pending,    icon:"⏳", color:"#fbbf24" },
            { label:"In Progress",  value:counts.inProgress, icon:"⚙️", color:"#60a5fa" },
            { label:"Resolved",     value:counts.resolved,   icon:"✅", color:"#4ade80" },
          ].map(x => (
            <div key={x.label} style={s.statCard}>
              <div style={s.statIcon}>{x.icon}</div>
              <div style={{ ...s.statValue, color: x.color }}>{x.value}</div>
              <div style={s.statLabel}>{x.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={s.tabs}>
          {["all","pending","assigned","in-progress","resolved","closed"].map(f => (
            <button
              key={f}
              style={{ ...s.tab, ...(filter === f ? s.tabActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={s.loading}>Loading your complaints...</div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize:"64px", marginBottom:"16px" }}>📭</div>
            <p style={{ color:"rgba(255,255,255,0.3)", marginBottom:"24px", fontSize:"16px" }}>
              No complaints found
            </p>
            <button style={s.fileBtn} onClick={onFileComplaint}>File Your First Complaint</button>
          </div>
        ) : (
          <div style={s.list}>
            {filtered.map(c => (
              <div key={c._id} style={s.card} onClick={() => onViewComplaint(c._id)}>
                <div style={s.catIcon}>{CATEGORY_ICONS[c.category] || "📋"}</div>
                <div style={s.cardBody}>
                  <div style={s.cardTop}>
                    <span style={s.cid}>{c.complaintId}</span>
                    <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                  <h3 style={s.cardTitle}>{c.title}</h3>
                  <p style={s.cardDesc}>{c.description?.substring(0, 120)}...</p>
                  <div style={s.cardMeta}>
                    <span style={s.meta}>📍 {c.location?.address?.substring(0, 40)}</span>
                    <span style={s.meta}>
                      🗓️ {new Date(c.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                    </span>
                    {c.department && <span style={s.meta}>🏛️ {c.department?.name}</span>}
                  </div>
                </div>
                <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"24px", alignSelf:"center" }}>›</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page:       { minHeight:"100vh", background:"#0a0a0f", fontFamily:"Georgia,serif" },
  content:    { maxWidth:"960px", margin:"0 auto", padding:"40px 24px" },
  greeting:   { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"40px", flexWrap:"wrap", gap:"16px" },
  greetTitle: { fontSize:"32px", fontWeight:"700", color:"#fff", margin:"0 0 8px" },
  greetSub:   { color:"rgba(255,255,255,0.4)", fontSize:"15px", margin:0, fontStyle:"italic" },
  fileBtn:    { background:"linear-gradient(135deg,#fbbf24,#f59e0b)", color:"#0a0a0f", border:"none", borderRadius:"8px", padding:"14px 24px", fontSize:"14px", fontWeight:"700", cursor:"pointer" },
  statsGrid:  { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"32px" },
  statCard:   { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"24px 20px", textAlign:"center" },
  statIcon:   { fontSize:"28px", marginBottom:"12px" },
  statValue:  { fontSize:"36px", fontWeight:"700", marginBottom:"4px" },
  statLabel:  { color:"rgba(255,255,255,0.4)", fontSize:"11px", textTransform:"uppercase", letterSpacing:"1px", fontFamily:"monospace" },
  tabs:       { display:"flex", gap:"8px", marginBottom:"24px", flexWrap:"wrap" },
  tab:        { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", padding:"8px 18px", borderRadius:"20px", cursor:"pointer", fontSize:"13px" },
  tabActive:  { background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.4)", color:"#fbbf24" },
  loading:    { textAlign:"center", color:"rgba(255,255,255,0.3)", padding:"80px 0", fontSize:"15px" },
  empty:      { textAlign:"center", padding:"80px 0" },
  list:       { display:"flex", flexDirection:"column", gap:"12px" },
  card:       { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"20px 24px", display:"flex", gap:"16px", cursor:"pointer", alignItems:"flex-start" },
  catIcon:    { width:"48px", height:"48px", background:"rgba(255,255,255,0.05)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 },
  cardBody:   { flex:1, minWidth:0 },
  cardTop:    { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px", flexWrap:"wrap", gap:"8px" },
  cid:        { color:"rgba(255,255,255,0.3)", fontSize:"11px", fontFamily:"monospace", letterSpacing:"1px" },
  cardTitle:  { fontSize:"16px", fontWeight:"600", color:"#fff", margin:"0 0 6px" },
  cardDesc:   { color:"rgba(255,255,255,0.4)", fontSize:"13px", margin:"0 0 12px", lineHeight:1.6 },
  cardMeta:   { display:"flex", gap:"20px", flexWrap:"wrap" },
  meta:       { color:"rgba(255,255,255,0.3)", fontSize:"12px" },
};