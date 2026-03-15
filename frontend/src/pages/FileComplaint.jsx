import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import { CATEGORY_ICONS } from "../components/categoryIcons";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
const CATEGORIES = ["roads","water_supply","electricity","sanitation","drainage","street_lights","parks","noise_pollution","encroachment","other"];
const PRIORITIES = ["low","medium","high","urgent"];

export default function FileComplaint({ onBack, onSuccess }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ title:"", description:"", category:"", priority:"medium", location:{address:"",ward:"",pincode:""} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(null);

  const set = k => e => setForm({...form,[k]:e.target.value});
  const setLoc = k => e => setForm({...form,location:{...form.location,[k]:e.target.value}});

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try { const d = await api("/complaints","POST",form,token); setSuccess(d.complaint); }
    catch(e) { setError(e.message); } finally { setLoading(false); }
  };

  if(success) return (
    <div style={s.page}><Navbar title="File Complaint"/>
      <div style={s.successPage}>
        <div style={s.successCard}>
          <div style={{fontSize:"64px",marginBottom:"16px"}}>🎉</div>
          <h2 style={s.successTitle}>Complaint Filed Successfully!</h2>
          <div style={s.successId}>{success.complaintId}</div>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:"14px",marginBottom:"32px",lineHeight:1.6}}>
            Your complaint has been registered. You'll be notified as it progresses.
          </p>
          <div style={s.summaryBox}>
            {[["Title",success.title],["Category",`${CATEGORY_ICONS[success.category]} ${success.category?.replace("_"," ")}`],["Priority",success.priority],["Status","⏳ Pending"]].map(([k,v])=>(
              <div key={k} style={s.sdRow}><span>{k}</span><span style={k==="Status"?{color:"#fbbf24"}:{}}>{v}</span></div>
            ))}
          </div>
          <button style={s.btn} onClick={onSuccess}>← Back to Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}><Navbar title="File New Complaint"/>
      <div style={s.content}>
        <div style={s.topBar}>
          <button style={s.back} onClick={onBack}>← Back</button>
          <div style={s.steps}>
            {[1,2].map(n=>(
              <div key={n} style={s.stepItem}>
                <div style={{...s.stepDot,...(step>=n?s.stepDotActive:{})}}>{n}</div>
                <span style={{...s.stepLabel,...(step>=n?s.stepLabelActive:{})}}>{n===1?"Complaint Details":"Location & Submit"}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={s.formCard}>
          {error&&<div style={s.error}>{error}</div>}

          {step===1&&(
            <div>
              <h2 style={s.stepTitle}>📋 What's the issue?</h2>
              <p style={s.stepSub}>Describe the problem you want to report.</p>
              <div style={s.field}>
                <label style={s.label}>Complaint Title *</label>
                <input style={s.input} placeholder="e.g. Large pothole near bus stop" value={form.title} onChange={set("title")}/>
              </div>
              <div style={s.field}>
                <label style={s.label}>Description *</label>
                <textarea style={s.textarea} rows={4} placeholder="Detailed description..." value={form.description} onChange={set("description")}/>
              </div>
              <div style={s.field}>
                <label style={s.label}>Category *</label>
                <div style={s.catGrid}>
                  {CATEGORIES.map(cat=>(
                    <div key={cat} style={{...s.catOpt,...(form.category===cat?s.catSelected:{})}} onClick={()=>setForm({...form,category:cat})}>
                      <span style={{display:"block",fontSize:"22px",marginBottom:"6px"}}>{CATEGORY_ICONS[cat]}</span>
                      <span style={{color:"rgba(255,255,255,0.6)",fontSize:"10px",textTransform:"capitalize"}}>{cat.replace("_"," ")}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={s.field}>
                <label style={s.label}>Priority</label>
                <div style={s.priorityRow}>
                  {PRIORITIES.map(p=>(
                    <button key={p} style={{...s.priorityBtn,...(form.priority===p?s.priorityActive:{})}} onClick={()=>setForm({...form,priority:p})}>
                      {p==="low"?"🟢":p==="medium"?"🟡":p==="high"?"🟠":"🔴"} {p}
                    </button>
                  ))}
                </div>
              </div>
              <button style={{...s.btn,...(!form.title||!form.description||!form.category?s.btnDisabled:{})}}
                onClick={()=>{if(form.title&&form.description&&form.category)setStep(2);}}
                disabled={!form.title||!form.description||!form.category}>
                Next: Add Location →
              </button>
            </div>
          )}

          {step===2&&(
            <div>
              <h2 style={s.stepTitle}>📍 Where is the issue?</h2>
              <p style={s.stepSub}>Help us locate the problem accurately.</p>
              <div style={s.field}>
                <label style={s.label}>Full Address *</label>
                <textarea style={s.textarea} rows={2} placeholder="Street, landmark, area..." value={form.location.address} onChange={setLoc("address")}/>
              </div>
              <div style={s.twoCol}>
                <div style={s.field}>
                  <label style={s.label}>Ward / Zone</label>
                  <input style={s.input} placeholder="e.g. Ward 12" value={form.location.ward} onChange={setLoc("ward")}/>
                </div>
                <div style={s.field}>
                  <label style={s.label}>PIN Code</label>
                  <input style={s.input} placeholder="e.g. 600040" value={form.location.pincode} onChange={setLoc("pincode")}/>
                </div>
              </div>
              <div style={s.summaryBox}>
                <h4 style={{color:"rgba(255,255,255,0.4)",fontSize:"11px",margin:"0 0 12px",textTransform:"uppercase",letterSpacing:"1px",fontFamily:"monospace"}}>Summary</h4>
                {[["Title",form.title],["Category",`${CATEGORY_ICONS[form.category]} ${form.category?.replace("_"," ")}`],["Priority",form.priority]].map(([k,v])=>(
                  <div key={k} style={s.sdRow}><span>{k}</span><span style={{textTransform:"capitalize"}}>{v}</span></div>
                ))}
              </div>
              <div style={s.btnRow}>
                <button style={s.btnBack} onClick={()=>setStep(1)}>← Back</button>
                <button style={{...s.btn,...(!form.location.address?s.btnDisabled:{}),flex:1}}
                  onClick={handleSubmit} disabled={!form.location.address||loading}>
                  {loading?"Submitting...":"Submit Complaint 🚀"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page:        { minHeight:"100vh", background:"#0a0a0f", fontFamily:"Georgia,serif" },
  content:     { maxWidth:"700px", margin:"0 auto", padding:"40px 24px" },
  topBar:      { display:"flex", alignItems:"center", gap:"32px", marginBottom:"32px" },
  back:        { background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:"13px", flexShrink:0, padding:0 },
  steps:       { display:"flex", alignItems:"center", gap:"16px" },
  stepItem:    { display:"flex", alignItems:"center", gap:"8px" },
  stepDot:     { width:"28px", height:"28px", borderRadius:"50%", border:"2px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.3)", fontSize:"12px", fontFamily:"monospace", fontWeight:"700" },
  stepDotActive:{ border:"2px solid #fbbf24", background:"rgba(251,191,36,0.1)", color:"#fbbf24" },
  stepLabel:   { color:"rgba(255,255,255,0.25)", fontSize:"12px" },
  stepLabelActive:{ color:"rgba(255,255,255,0.7)" },
  formCard:    { background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"16px", padding:"40px" },
  error:       { background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", padding:"12px 16px", borderRadius:"8px", fontSize:"14px", marginBottom:"24px" },
  stepTitle:   { fontSize:"24px", fontWeight:"700", color:"#fff", margin:"0 0 8px" },
  stepSub:     { color:"rgba(255,255,255,0.35)", fontSize:"14px", margin:"0 0 32px", fontStyle:"italic" },
  field:       { marginBottom:"24px" },
  label:       { display:"block", color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"10px", fontFamily:"monospace" },
  input:       { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"13px 16px", color:"#fff", fontSize:"14px", outline:"none", boxSizing:"border-box" },
  textarea:    { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"13px 16px", color:"#fff", fontSize:"14px", outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"inherit", lineHeight:1.6 },
  catGrid:     { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"10px" },
  catOpt:      { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", padding:"14px 8px", textAlign:"center", cursor:"pointer" },
  catSelected: { background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.4)" },
  priorityRow: { display:"flex", gap:"10px" },
  priorityBtn: { flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", padding:"12px", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:"13px", textTransform:"capitalize" },
  priorityActive:{ background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.4)", color:"#fbbf24" },
  twoCol:      { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" },
  summaryBox:  { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"10px", padding:"20px", marginBottom:"24px" },
  sdRow:       { display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:"13px", color:"rgba(255,255,255,0.6)" },
  btn:         { width:"100%", background:"linear-gradient(135deg,#fbbf24,#f59e0b)", color:"#0a0a0f", border:"none", borderRadius:"8px", padding:"16px", fontSize:"15px", fontWeight:"700", cursor:"pointer" },
  btnDisabled: { opacity:0.4, cursor:"not-allowed" },
  btnBack:     { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", borderRadius:"8px", padding:"16px 24px", fontSize:"14px", cursor:"pointer" },
  btnRow:      { display:"flex", gap:"12px" },
  successPage: { display:"flex", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 64px)", padding:"40px" },
  successCard: { background:"rgba(255,255,255,0.02)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:"20px", padding:"48px", maxWidth:"480px", width:"100%", textAlign:"center" },
  successTitle:{ fontSize:"26px", fontWeight:"700", color:"#fff", margin:"0 0 12px" },
  successId:   { display:"inline-block", background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.3)", color:"#fbbf24", padding:"8px 20px", borderRadius:"8px", fontFamily:"monospace", fontSize:"18px", fontWeight:"700", marginBottom:"16px", letterSpacing:"2px" },
};