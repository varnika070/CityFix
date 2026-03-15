import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({ title }) {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav style={s.nav}>
      <div style={s.left}>
        <span style={s.logo}>City<span style={s.accent}>Fix</span></span>
        {title && <><span style={s.sep}>›</span><span style={s.title}>{title}</span></>}
      </div>
      <div style={s.right}>
        <div style={s.userInfo}>
          <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={s.name}>{user?.name}</div>
            <div style={s.role}>{user?.role?.toUpperCase()}</div>
          </div>
        </div>
        <button style={s.logout} onClick={logout}>Sign Out</button>
      </div>
    </nav>
  );
}

const s = {
  nav:      { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:"64px", background:"rgba(10,10,15,0.95)", borderBottom:"1px solid rgba(255,255,255,0.06)", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(10px)" },
  left:     { display:"flex", alignItems:"center", gap:"12px" },
  logo:     { fontSize:"22px", fontWeight:"900", color:"#fff", fontFamily:"Georgia,serif", letterSpacing:"-0.5px" },
  accent:   { color:"#fbbf24" },
  sep:      { color:"rgba(255,255,255,0.2)", fontSize:"18px" },
  title:    { color:"rgba(255,255,255,0.5)", fontSize:"14px" },
  right:    { display:"flex", alignItems:"center", gap:"20px" },
  userInfo: { display:"flex", alignItems:"center", gap:"10px" },
  avatar:   { width:"36px", height:"36px", borderRadius:"50%", background:"linear-gradient(135deg,#fbbf24,#f59e0b)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"700", color:"#0a0a0f", fontSize:"15px" },
  name:     { color:"#fff", fontSize:"13px", fontWeight:"600" },
  role:     { color:"rgba(255,255,255,0.35)", fontSize:"10px", letterSpacing:"1.5px", fontFamily:"monospace" },
  logout:   { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", padding:"8px 16px", borderRadius:"6px", cursor:"pointer", fontSize:"12px" },
};