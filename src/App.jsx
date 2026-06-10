// ── CoachedByNickHee Platform ─────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
// ── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://jzievdnzlntbtjoitcgc.supabase.co";
const SUPABASE_KEY = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aWV2ZG56bG50YnRqb2l0Y2djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MDcwMzIsImV4cCI6MjA5NjA4MzAzMn0",
  "6xaC_SijPt2SUVX4Lc8FuqaMVpkwP1l-PdW32yXOdGk",
].join(".");
// Supabase client — used for authentication (sessions, login, token refresh)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
function useIsMobile(breakpoint = 768) {
const [isMobile, setIsMobile] = useState(
typeof window !== "undefined" ? window.innerWidth < breakpoint : false
);
useEffect(() => {
const onResize = () => setIsMobile(window.innerWidth < breakpoint);
window.addEventListener("resize", onResize);
onResize();
return () => window.removeEventListener("resize", onResize);
}, [breakpoint]);
return isMobile;
}
const uid = () => Math.random().toString(36).slice(2, 9);
const todayKey = () => new Date().toISOString().slice(0,10);
const fmt = (d) => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"
const DAY_COLORS = ["#FF6B4A","#5BC0FF","#7BE0A0","#F4B740","#B88CFF","#FF9F45","#4FD1C5"]
const MEASUREMENT_FIELDS = [
{ key:"date", label:"Date", type:"date" },
{ key:"age", label:"Age", type:"number", unit:"yrs" },
{ key:"weight", label:"Weight", type:"number", unit:"kg" },
{ key:"height", label:"Height", type:"number", unit:"cm" },
{ key:"neck", label:"Neck", type:"number", unit:"cm" },
{ key:"shoulders", label:"Shoulders", type:"number", unit:"cm" },
{ key:"arms", label:"Arms", type:"number", unit:"cm" },
{ key:"waist", label:"Waist", type:"number", unit:"cm" },
{ key:"hips", label:"Hips", type:"number", unit:"cm" },
{ key:"mid_thigh", label:"Mid-Thigh", type:"number", unit:"cm" },
{ key:"calves", label:"Calves", type:"number", unit:"cm" },
{ key:"bodyfat", label:"Body Fat", type:"number", unit:"%" },
];
const LOGO_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA4QAAAEbCAIAAAANg93TAAEAAElEQ
// ── Supabase Client ──────────────────────────────────────────────────────────
const sb = {
async query(table, method="GET", body=null, params="") {
const url = `${SUPABASE_URL}/rest/v1/${table}${params}`;
// Use the logged-in user's access token so RLS policies apply.
// Falls back to the anon key when no one is logged in.
let token = SUPABASE_KEY;
try {
const { data } = await supabase.auth.getSession();
if (data?.session?.access_token) token = data.session.access_token;
} catch (e) { /* not logged in — use anon key */ }
const res = await fetch(url, {
method,
headers: {
"apikey": SUPABASE_KEY,
"Authorization": `Bearer ${token}`,
"Content-Type": "application/json",
"Prefer": method === "POST" ? "return=representation" : method === "PATCH" ? "return=
},
body: body ? JSON.stringify(body) : null,
});
if (!res.ok) { const e = await res.text(); throw new Error(e); }
const text = await res.text();
return text ? JSON.parse(text) : null;
},
get: (table, params="") => sb.query(table, "GET", null, params),
post: (table, body) => sb.query(table, "POST", body),
patch: (table, body, params) => sb.query(table, "PATCH", body, params),
delete: (table, params) => sb.query(table, "DELETE", null, params),
};
const C = {
bg:"#080809", surface:"#0f0f12", surface2:"#16161b",
line:"rgba(255,255,255,.06)", line2:"rgba(255,255,255,.12)",
text:"#F0EDE6", muted:"#7a7a85", faint:"#4a4a55", accent:"#D4F53C",
glute:"#FF6B4A", quad:"#5BC0FF", ham:"#7BE0A0", abd:"#F4B740",
back:"#B88CFF", sh:"#FF9F45", cf:"#4FD1C5",
};
const S = {
app:{ boxSizing:"border-box", overflowX:"hidden", background:"#080809", backgroundImage:"ra
loginWrap:{ background:"radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, #0b0b0d 70%)", minHe
loginCard:{ background:C.surface, border:`1px solid ${C.line2}`, borderRadius:16, padding:4
loginLogo:{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, marginBotto
logoMark:{ width:44, height:44, background:"#FFFFFF", borderRadius:10, display:"flex", alig
logoTitle:{ fontWeight:800, fontSize:18, color:C.text },
logoSub:{ fontSize:12, color:C.muted },
loginField:{ marginBottom:14 },
label:{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacin
input:{ width:"100%", background:"rgba(22,22,27,0.8)", border:"1px solid rgba(255,255,255,0
btn:{ background:C.accent, color:"#080809", border:"none", borderRadius:10, padding:"11px 2
btnSm:{ background:"#FFFFFF", color:"#000", border:"none", borderRadius:6, padding:"6px 14p
btnGhost:{ background:"transparent", color:C.muted, border:"1px solid rgba(255,255,255,0.1)
error:{ color:"#ff6b6b", fontSize:13, marginBottom:8 },
loginHint:{ marginTop:20, fontSize:11, color:C.faint, lineHeight:1.7, textAlign:"center" },
topbar:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px
topbarLeft:{ display:"flex", alignItems:"center", gap:12 },
topbarRight:{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" },
topbarTitle:{ fontWeight:400, fontSize:22, color:C.text, fontFamily:"'Bebas Neue',sans-seri
topbarSub:{ fontSize:11, color:C.muted, marginTop:1 },
backBtn:{ background:"transparent", color:C.muted, border:"none", cursor:"pointer", fontSiz
content:{ padding:"20px 18px", maxWidth:920, margin:"0 auto" },
sectionHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", margin
sectionTitle:{ fontWeight:700, fontSize:10, color:C.faint, textTransform:"uppercase", lette
grid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(220px,100%),1fr))",
card:{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:12, padding:16, cur
cardAvatar:{ width:40, height:40, background:"#FFFFFF22", border:"1px solid #FFFFFF44", bor
cardName:{ fontWeight:800, fontSize:15, marginBottom:6, letterSpacing:"-0.02em", lineHeight
cardMeta:{ fontSize:12, color:C.muted, marginBottom:2 },
cardTag:{ fontSize:11, color:"#FFFFFF", marginTop:8, fontWeight:600 },
statsRow:{ display:"flex", gap:8, marginBottom:4, flexWrap:"wrap" },
statBox:{ flex:1, background:"rgba(15,15,18,0.8)", border:"1px solid rgba(255,255,255,0.06)
statVal:{ fontSize:18, fontWeight:800, color:"#FFFFFF" },
statLabel:{ fontSize:9, color:C.faint, marginTop:2, textTransform:"uppercase", letterSpacin
programDot:{ width:12, height:12, borderRadius:"50%", marginBottom:6 },
progCard:{ background:"rgba(15,15,18,0.9)", border:"1px solid rgba(255,255,255,0.06)", bord
progAccent:{ height:3, borderRadius:0, marginBottom:14, marginLeft:-16, marginRight:-16, ma
progName:{ fontWeight:400, fontSize:22, marginBottom:6, fontFamily:"'Bebas Neue',sans-serif
progTag:{ fontSize:12, color:C.muted, marginBottom:4 },
progDays:{ fontSize:12, color:C.faint },
dayGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(150px,100%),1fr)
dayTile:{ background:"rgba(15,15,18,0.9)", border:"1px solid rgba(255,255,255,0.06)", borde
dayTileAccent:{ height:3, borderRadius:2, marginBottom:12 },
dayTileName:{ fontWeight:400, fontSize:20, marginBottom:6, fontFamily:"'Bebas Neue',sans-se
dayTileCount:{ fontSize:12, color:C.muted },
dayBlock:{ background:"rgba(15,15,18,0.9)", border:"1px solid rgba(255,255,255,0.06)", bord
dayHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1
dayLeft:{ display:"flex", alignItems:"center", gap:6, flex:1 },
dayTitle:{ fontWeight:800, fontSize:14, cursor:"text", letterSpacing:"-0.01em" },
exCount:{ fontSize:11, color:C.muted, marginLeft:6 },
iconBtn:{ background:"transparent", color:C.muted, border:"none", cursor:"pointer", fontSiz
exList:{ padding:"0 14px 14px" },
exRow:{ display:"flex", alignItems:"center", gap:8, marginBottom:8 },
exNum:{ fontWeight:800, fontSize:13, width:18, flexShrink:0 },
exFields:{ display:"flex", gap:6, flex:1, flexWrap:"wrap", minWidth:0 },
exInput:{ background:C.surface2, border:`1px solid ${C.line2}`, borderRadius:6, color:C.tex
workoutCard:{ background:"rgba(15,15,18,0.9)", border:"1px solid rgba(255,255,255,0.06)", b
wcNum:{ width:24, height:24, background:"#FFFFFF22", borderRadius:6, display:"flex", alignI
wcName:{ fontWeight:800, fontSize:15, marginBottom:3, letterSpacing:"-0.01em" },
wcMeta:{ fontSize:12, color:C.muted },
wcNotes:{ fontSize:11, color:C.faint, marginTop:4, fontStyle:"italic" },
checkBtn:{ border:"1px solid #FFFFFF", borderRadius:8, width:36, height:36, cursor:"pointer
},
setLogWrap:{ borderTop:"1px solid rgba(255,255,255,.07)", paddingTop:10, marginTop:4 setLogHeader:{ display:"flex", alignItems:"center", gap:8, marginBottom:6, fontSize:10, fon
setLogRow:{ display:"flex", alignItems:"center", gap:8, marginBottom:6, borderRadius:6, pad
setNum:{ flex:"0 0 36px", fontSize:12, fontWeight:700, textAlign:"center" },
setInput:{ flex:1, background:"rgba(22,22,27,0.8)", border:"1px solid rgba(255,255,255,0.08
progressBar:{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2, marginBottom:2
progressFill:{ height:"100%", background:"#FFFFFF", borderRadius:2, transition:"width .4s"
doneMsg:{ textAlign:"center", padding:"24px 0", color:"#FFFFFF", fontWeight:700, fontSize:1
pbBadge:{ fontSize:10, background:"#FFFFFF20", color:"#FFFFFF", border:"1px solid #FFFFFF40
prevPB:{ fontSize:10, color:C.faint, fontWeight:600 },
pbRow:{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 },
pbChip:{ background:"#FFFFFF10", border:"1px solid #FFFFFF30", borderRadius:8, padding:"8px
pbVal:{ fontSize:22, fontWeight:400, color:C.accent, fontFamily:"'Bebas Neue',sans-serif" }
pbName:{ fontSize:10, color:C.muted, marginTop:2, maxWidth:100, overflow:"hidden", textOver
pbLabel:{ fontSize:9, color:"#FFFFFF", fontWeight:700, marginTop:2 },
historySession:{ background:"rgba(15,15,18,0.9)", border:"1px solid rgba(255,255,255,0.06)"
historyDate:{ fontSize:11, fontWeight:700, color:"#FFFFFF", marginBottom:10, textTransform:
historyEx:{ marginBottom:10 },
historyExName:{ fontSize:13, fontWeight:700, color:C.text },
historySetChip:{ background:C.surface2, border:`1px solid ${C.line}`, borderRadius:999, pad
assignCard:{ background:"rgba(15,15,18,0.9)", border:"1px solid rgba(255,255,255,0.06)", bo
assignName:{ flex:1, fontSize:13, fontWeight:600 },
macroGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(120px,100%),1f
macroBox:{ background:"rgba(15,15,18,0.9)", border:"1px solid rgba(255,255,255,0.06)", bord
macroLabel:{ fontSize:9, color:C.faint, fontWeight:700, textTransform:"uppercase", letterSp
mealEditorCard:{ background:"rgba(15,15,18,0.9)", border:"1px solid rgba(255,255,255,0.06)"
mealViewCard:{ background:"rgba(15,15,18,0.9)", border:"1px solid rgba(255,255,255,0.06)",
mealName:{ fontWeight:800, fontSize:15, marginBottom:4, letterSpacing:"-0.01em" },
mealDesc:{ fontSize:13, color:C.muted, marginBottom:8, lineHeight:1.5 },
mealMacros:{ display:"flex", gap:12, fontSize:12, fontWeight:600 },
mealTotal:{ fontSize:11, color:C.faint, textAlign:"center", padding:"12px 0", borderTop:`1p
coachNote:{ background:"#FFFFFF10", border:"1px solid #FFFFFF20", borderRadius:8, padding:"
overlay:{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)", backdropFilter:"blur(8px
modal:{ background:"#0f0f12", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, wi
modalHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:
modalTitle:{ fontWeight:700, fontSize:15 },
modalBody:{ padding:"20px 20px 0" },
modalFooter:{ display:"flex", justifyContent:"flex-end", gap:8, padding:20 },
empty:{ color:C.faint, textAlign:"center", padding:"24px 0" },
tabBtn:{ background:"transparent", color:C.faint, border:"1px solid rgba(255,255,255,0.08)"
tabBtnActive:{ background:"#FFFFFF20", color:"#FFFFFF", borderColor:"#FFFFFF40" },
};
const useWorkoutLog = () => {
const [log, setLog] = useState({});
const saveSession = async (clientId, dayId, sets) => {
const date = todayKey();
try {
const existing = await sb.get("workout_logs", `?client_id=eq.${clientId}&day_id=eq.${da
if (existing && existing.length > 0) {
await sb.patch("workout_logs", { sets }, `?client_id=eq.${clientId}&day_id=eq.${dayId
} else {
await sb.post("workout_logs", { client_id: clientId, day_id: dayId, date, sets });
}
} catch(e) { console.error("Error saving session:", e); }
setLog(prev => {
const clientLog = prev[clientId] || {};
const dayLog = clientLog[dayId] || [];
const existing = dayLog.findIndex(s => s.date === date);
const newEntry = { date, sets };
const newDayLog = existing >= 0 ? dayLog.map((s,i)=>i===existing?newEntry:s) : [...dayL
return { ...prev, [clientId]: { ...clientLog, [dayId]: newDayLog } };
});
};
const loadHistory = async (clientId, dayId) => {
if (log[clientId]?.[dayId]) return;
try {
if (rows) {
const rows = await sb.get("workout_logs", `?client_id=eq.${clientId}&day_id=eq.${dayId}
setLog(prev => ({
...prev,
[clientId]: { ...(prev[clientId]||{}), [dayId]: rows.map(r=>({date:r.date,sets:r.se
}));
}
} catch(e) { console.error("Error loading history:", e); }
};
const getHistory = (clientId, dayId) => log[clientId]?.[dayId] || [];
const getPBs = (clientId, exercises) => {
const pbs = {};
const clientLog = log[clientId] || {};
exercises.forEach(ex => {
let best = null;
Object.values(clientLog).forEach(dayLog => {
dayLog.forEach(session => {
const exSets = session.sets[ex.id] || [];
exSets.forEach(s => {
const w = parseFloat(s.weight);
if (!isNaN(w) && (best === null || w > best)) best = w;
});
});
});
if (best !== null) pbs[ex.id] = best;
});
return pbs;
};
return { log, saveSession, loadHistory, getHistory, getPBs };
};
// ── LOGIN ────────────────────────────────────────────────────────────────────
function Topbar({ title, subtitle, onLogout, left, right }) {
return (
<div style={S.topbar}>
<div style={S.topbarLeft}>
{left}
<div><div style={S.topbarTitle}>{title}</div>{subtitle&&<div style={S.topbarSub}>{sub
</div>
<div style={S.topbarRight}>
{right}
{onLogout&&<button style={S.btnGhost} onClick={onLogout}>Sign out</button>}
</div>
</div>
);
}
function TabBtn({ label, active, onClick }) {
return <button style={{...S.tabBtn,...(active?S.tabBtnActive:{})}} onClick={onClick}>{label
}
function SectionHeader({ title, action }) {
return <div style={S.sectionHeader}><div style={S.sectionTitle}>{title}</div>{action}</div>
}
function Field({ label, children }) {
return <div style={S.loginField}><label style={S.label}>{label}</label>{children}</div>;
}
function Stat({ label, value }) {
return (
<div style={S.statBox}>
<div style={S.statVal}>{value}</div>
<div style={S.statLabel}>{label}</div>
</div>
);
}
function Empty({ text, small }) {
return <div style={{...S.empty,fontSize:small?12:14}}>{text}</div>;
}
// ── NUTRITION ASSIGNER (coach assigns plan to client) ────────────────────────
function Modal({ title, onClose, onSave, children }) {
return (
<div style={S.overlay}>
<div style={S.modal}>
<div style={S.modalHeader}>
<div style={S.modalTitle}>{title}</div>
<button style={S.iconBtn} onClick={onClose}>✕</button>
</div>
<div style={S.modalBody}>{children}</div>
<div style={S.modalFooter}>
<button style={S.btnGhost} onClick={onClose}>Cancel</button>
<button style={S.btn} onClick={onSave}>Save →</button>
</div>
</div>
</div>
);
}
// ── NUTRITION ASSIGNER (coach assigns plan to client) ────────────────────────
function ClientCard({ client, programs, onClick, onDelete }) {
const count = programs.filter(p=>p.assignedTo.includes(client.id)).length;
return (
<div style={S.card} onClick={onClick}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div style={S.cardAvatar}>{client.name.split(" ").map(n=>n[0]).join("")}</div>
<button style={{background:"transparent",border:"1px solid #ff6b6b",color:"#ff6b6b",b
onClick={e=>{e.stopPropagation();if(window.confirm("Remove "+client.name+"?"))onDel
</div>
<div style={S.cardName}>{client.name}</div>
<div style={S.cardMeta}>{client.goal}</div>
<div style={S.cardMeta}>{client.age}y · {client.weight}kg · {client.height}cm</div>
<div style={S.cardTag}>{count} program{count!==1?"s":""} assigned</div>
</div>
);
}
function ProgramCard({ program, clients, onClick, onDelete }) {
const count = (program.assignedTo||[]).length;
return (
<div style={S.card} onClick={onClick}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marg
<div style={{...S.programDot,background:program.color,width:36,height:36}} />
{onDelete && <button style={{background:"transparent",border:"1px solid #ff6b6b",colo
onClick={e=>{e.stopPropagation();if(window.confirm("Delete "+program.name+"?"))onDe
</div>
<div style={S.cardName}>{program.name}</div>
<div style={S.cardMeta}>{program.tag}</div>
<div style={S.cardMeta}>{program.days.length} days · {program.days.reduce((s,d)=>s+d.ex
<div style={S.cardTag}>{count} client{count!==1?"s":""}</div>
</div>
);
}
function NutritionPlanEditor({ plan, onSave, onBack }) {
const blank = { calories:0, protein:0, carbs:0, fat:0, notes:"", meals:[] };
const [form, setForm] = useState({ ...blank, ...plan });
const [saved, setSaved] = useState(false);
const f = (k,v) => setForm(p=>({...p,[k]:v}));
const addMeal = () => setForm(p=>({...p,meals:[...p.meals,{id:uid(),name:"New Meal",descrip
const updateMeal = (id,k,v) => setForm(p=>({...p,meals:p.meals.map(m=>m.id===id?{...m,[k]:v
const deleteMeal = (id) => setForm(p=>({...p,meals:p.meals.filter(m=>m.id!==id)}));
const handleSave = () => {
onSave(form);
setSaved(true);
setTimeout(()=>setSaved(false), 2000);
};
return (
<div>
<SectionHeader title={form.name||"Edit Plan"} action={
<div style={{display:"flex",gap:8}}>
<button style={S.btnGhost} onClick={onBack}>← Plans</button>
<button style={{...S.btn,...(saved?{background:"#7BE0A0"}:{})}} onClick={handleSave
{saved ? "✓ Saved!" : "Save Plan"}
</button>
</div>
} />
<Field label="Plan Name">
<input style={S.input} value={form.name||""} onChange={e=>f("name",e.target.value)} p
</Field>
<div style={S.macroGrid}>
{[["Calories","calories","kcal"],["Protein","protein","g"],["Carbs","carbs","g"],["Fa
<div key={key} style={S.macroBox}>
<div style={S.macroLabel}>{label}</div>
<div style={{display:"flex",alignItems:"baseline",gap:4}}>
<input style={{...S.input,fontSize:22,fontWeight:800,color:C.accent,background:
type="number" value={form[key]} onChange={e=>f(key,+e.target.value)} />
<span style={{color:C.muted,fontSize:12}}>{unit}</span>
</div>
</div>
))}
</div>
<Field label="Coach Notes">
<textarea style={{...S.input,minHeight:72,resize:"vertical"}} value={form.notes} onCh
placeholder="e.g. Small surplus for lean gain. Carbs concentrated around training."
</Field>
<SectionHeader title="Meal Plan" action={<button style={S.btnSm} onClick={addMeal}>+ Me
{form.meals.length===0 && <Empty text="No meals added yet. Click '+ Meal' to build the
{form.meals.map(m=>(
<div key={m.id} style={S.mealEditorCard}>
<div style={{display:"flex",gap:8,marginBottom:8}}>
<input style={{...S.input,flex:2,fontWeight:700}} value={m.name} onChange={e=>upd
<button style={{...S.iconBtn,color:"#ff6b6b"}} onClick={()=>deleteMeal(m.id)}>✕</
</div>
<textarea style={{...S.input,minHeight:56,resize:"vertical",marginBottom:8}} value=
onChange={e=>updateMeal(m.id,"description",e.target.value)} placeholder="Describe
<div style={{display:"flex",gap:8}}>
{[["P (g)","protein"],["C (g)","carbs"],["F (g)","fat"]].map(([l,k])=>(
<div key={k} style={{flex:1}}>
<div style={{fontSize:10,color:C.muted,marginBottom:3,fontWeight:700,textTran
<input style={{...S.input,textAlign:"center"}} type="number" value={m[k]} onC
</div>
))}
</div>
</div>
))}
</div>
);
}
function NutritionAssigner({ plans, onSavePlan, onDeletePlan, onSetActive, onMount }) {
useEffect(()=>{ if(onMount) onMount(); },[]);
const [editing, setEditing] = useState(null); // plan id or "new"
if (editing) {
const existing = editing === "new" ? { id: uid(), name:"", calories:0, protein:0, carbs:0
return (
<NutritionPlanEditor
plan={existing}
onSave={data=>{ onSavePlan(data); setEditing(null); }}
onBack={()=>setEditing(null)}
/>
);
}
Plan'
return (
<div>
<SectionHeader title="Nutrition Plans" action={<button style={S.btn} onClick={()=>setEd
{(!plans||plans.length===0) && <Empty text="No nutrition plans yet. Click '+ New {(plans||[]).map(plan=>(
<div key={plan.id} style={{...S.mealViewCard, display:"flex", alignItems:"center", ga
<div style={{flex:1}}>
<div style={{fontWeight:800,fontSize:15,marginBottom:3}}>
{plan.name||"Untitled Plan"}
{plan.is_active && <span style={{marginLeft:8,fontSize:10,background:"#7BE0A022
</div>
<div style={{fontSize:12,color:C.muted}}>{plan.calories} kcal · P {plan.protein}g
</div>
<div style={{display:"flex",gap:8,flexShrink:0}}>
{!plan.is_active && (
<button style={{...S.btnSm,background:"#7BE0A022",color:"#7BE0A0",border:"1px s
Set Active
</button>
)}
<button style={S.btnSm} onClick={()=>setEditing(plan.id)}>Edit</button>
<button style={{...S.btnSm,background:"transparent",color:"#ff6b6b",border:"1px s
onClick={()=>{ if(window.confirm("Delete \""+( plan.name||"this plan")+"\"?"))
Delete
</button>
</div>
</div>
))}
</div>
);
}
// ── MEASUREMENTS PANEL ────────────────────────────────────────────────────────
function MeasurementsPanel({ measurements, onSave, clientName }) {
const blank = MEASUREMENT_FIELDS.reduce((acc,f)=>({...acc,[f.key]:f.type==="date"?new Date(
const [form, setForm] = useState(blank);
const [showForm, setShowForm] = useState(false);
const [saved, setSaved] = useState(false);
const f = (k,v) => setForm(p=>({...p,[k]:v}));
const handleSave = () => {
const entry = {...form};
MEASUREMENT_FIELDS.forEach(field => { if(field.type==="number" && entry[field.key]) entry
onSave(entry);
setSaved(true);
setForm(blank);
setTimeout(()=>{ setSaved(false); setShowForm(false); }, 1500);
};
const sorted = [...measurements].sort((a,b)=>new Date(b.date)-new Date(a.date));
return (
<div>
<SectionHeader title={`Measurements (${measurements.length})`}
action={<button style={S.btnSm} onClick={()=>setShowForm(s=>!s)}>{showForm?"Cancel":"
{showForm && (
<div style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:14,paddin
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr)
{MEASUREMENT_FIELDS.map(field=>(
<div key={field.key}>
<div style={{fontSize:10,color:C.faint,fontWeight:700,textTransform:"uppercas
{field.label}{field.unit?` (${field.unit})`:""}
</div>
<input style={{...S.input,padding:"8px 10px"}} type={field.type}
value={form[field.key]} onChange={e=>f(field.key,e.target.value)} />
</div>
))}
</div>
<button style={{...S.btn,...(saved?{background:"#7BE0A0"}:{})}} onClick={handleSave
{saved?"✓ Saved!":"Save Measurements →"}
</button>
</div>
)}
{sorted.length===0 && !showForm && <Empty text="No measurements recorded yet. Click '+
{sorted.length>0 && (
<>
{/* Latest snapshot */}
{sorted[0] && (
<div style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:14,pa
<div style={{fontSize:10,color:C.accent,fontWeight:800,textTransform:"uppercase
Latest — {sorted[0].date}
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,
{MEASUREMENT_FIELDS.filter(f=>f.key!=="date"&&sorted[0][f.key]).map(field=>(
<div key={field.key} style={{textAlign:"center",background:C.surface2,borde
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.tex
{sorted[0][field.key]}<span style={{fontSize:14,color:C.muted}}>{field.
</div>
<div style={{fontSize:9,color:C.faint,fontWeight:700,textTransform:"upper
</div>
))}
</div>
</div>
)}
{/* History table */}
{sorted.length>1 && (
<>
<SectionHeader title="History" />
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
<thead>
<tr style={{borderBottom:`1px solid ${C.line}`}}>
{MEASUREMENT_FIELDS.map(f=>(
<th key={f.key} style={{padding:"8px 10px",textAlign:"left",color:C.f
{f.label}
</th>
))}
</tr>
</thead>
<tbody>
{sorted.map((row,i)=>(
<tr key={i} style={{borderBottom:`1px solid ${C.line}`,opacity:i===0?1:
{MEASUREMENT_FIELDS.map(f=>(
<td key={f.key} style={{padding:"10px 10px",color:i===0?C.text:C.mu
{row[f.key]||"—"}{row[f.key]&&f.unit?<span style={{color:C.faint,
</td>
))}
</tr>
))}
</tbody>
</table>
</div>
</>
)}
</>
)}
</div>
);
}
// ── WEEKLY CHECK-IN FORM (client fills in) ───────────────────────────────────
function ClientCheckinForm({ checkins, onSave }) {
const getWeekStart = () => {
const d = new Date();
const day = d.getDay();
const diff = d.getDate() - day + (day === 0 ? -6 : 1);
return new Date(d.setDate(diff)).toISOString().slice(0,10);
};
const weekStart = getWeekStart();
const existing = checkins.find(c => c.week_start === weekStart) || {};
const [form, setForm] = useState({
week_start: weekStart,
sleep_quality: existing.sleep_quality || 5,
stress: existing.stress || 5,
energy: existing.energy || 5,
adherence: existing.adherence || 5,
water_intake: existing.water_intake || "",
steps: existing.steps || "",
notes: existing.notes || "",
});
const [saved, setSaved] = useState(false);
const f = (k,v) => setForm(p=>({...p,[k]:v}));
const handleSave = async () => {
await onSave(form);
setSaved(true);
setTimeout(()=>setSaved(false), 2000);
};
const SliderField = ({label, field, emoji}) => (
<div style={{background:C.surface2,borderRadius:12,padding:16,marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBo
<div style={{fontSize:13,fontWeight:700,color:C.text}}>{emoji} {label}</div>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.accent,lineHeig
</div>
<input type="range" min="1" max="10" value={form[field]}
onChange={e=>f(field,+e.target.value)}
style={{width:"100%",accentColor:C.accent,cursor:"pointer"}} />
<div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.faint,ma
<span>Poor</span><span>Average</span><span>Excellent</span>
</div>
</div>
);
return (
<div>
<SectionHeader title={`Week of ${weekStart}`} />
<div style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:16,padding:
backgroundImage:"radial-gradient(ellipse at 100% 0%,rgba(203,251,69,0.05),transparent
<div style={{fontSize:10,color:C.accent,fontWeight:800,textTransform:"uppercase",lett
Weekly Check-In
</div>
<SliderField label="Sleep Quality" field="sleep_quality" emoji=" <SliderField label="Stress Level" field="stress" emoji=" <SliderField label="Energy Level" field="energy" emoji=" " />
" />
<SliderField label="Training Adherence" field="adherence" emoji=" " />
" />
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
<div>
<div style={{fontSize:10,color:C.faint,fontWeight:700,textTransform:"uppercase",l
<input style={{...S.input}} value={form.water_intake} onChange={e=>f("water_intak
</div>
<div>
</div>
</div>
<div style={{fontSize:10,color:C.faint,fontWeight:700,textTransform:"uppercase",l
<input style={{...S.input}} value={form.steps} onChange={e=>f("steps",e.target.va
<div>
</div>
<div style={{fontSize:10,color:C.faint,fontWeight:700,textTransform:"uppercase",let
<textarea style={{...S.input,minHeight:100,resize:"vertical"}} value={form.notes}
onChange={e=>f("notes",e.target.value)} placeholder="How did the week go? Any str
<button style={{...S.btn,width:"100%",marginTop:16,padding:"14px",...(saved?{backgrou
{saved ? "✓ Submitted!" : "Submit Check-In →"}
</button>
</div>
{/* Past check-ins */}
{checkins.filter(c=>c.week_start!==weekStart).length > 0 && (
<>
<SectionHeader title="Past Check-Ins" />
{checkins.filter(c=>c.week_start!==weekStart).sort((a,b)=>b.week_start.localeCompar
<div key={i} style={{background:C.surface,border:`1px solid ${C.line}`,borderRadi
<div style={{fontSize:10,color:C.accent,fontWeight:800,textTransform:"uppercase
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBot
{[[" ","Sleep",c.sleep_quality],[" ","Stress",c.stress],[" ","Energy",c.en
<div key={label} style={{textAlign:"center",background:C.surface2,borderRad
<div style={{fontSize:10,marginBottom:2}}>{emoji}</div>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:C.tex
<div style={{fontSize:9,color:C.faint,marginTop:2,fontWeight:700,textTran
</div>
))}
</div>
</div>
{c.notes && <div style={{fontSize:13,color:C.muted,borderTop:`1px solid ${C.lin
))}
</>
)}
</div>
);
}
// ── COACH CHECK-IN VIEW ───────────────────────────────────────────────────────
function CoachCheckinView({ checkins, clientName }) {
if (!checkins || checkins.length === 0) return (
<div style={{textAlign:"center",padding:"48px 0"}}>
<div style={{fontSize:32,marginBottom:12}}> </div>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:C.text,marginBottom
<div style={{color:C.muted,fontSize:14}}>{clientName} hasn't submitted a check-in yet.<
</div>
);
const sorted = [...checkins].sort((a,b)=>b.week_start.localeCompare(a.week_start));
return (
<div>
<SectionHeader title={`Check-ins (${checkins.length})`} />
{sorted.map((c,i)=>(
<div key={i} style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:1
...(i===0?{backgroundImage:"radial-gradient(ellipse at 100% 0%,rgba(203,251,69,0.05
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marg
<div style={{fontSize:10,color:C.accent,fontWeight:800,textTransform:"uppercase",
Week of {c.week_start}
</div>
{i===0 && <span style={{fontSize:10,background:"rgba(203,251,69,0.1)",color:C.acc
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom
{[[" ","Sleep Quality",c.sleep_quality],[" ","Stress",c.stress],[" ","Energy"
const color = val>=8?"#7BE0A0":val>=5?C.accent:"#FF6B4A";
return (
<div key={label} style={{textAlign:"center",background:C.surface2,borderRadiu
<div style={{fontSize:12,marginBottom:4}}>{emoji}</div>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color,lineHei
<div style={{fontSize:9,color:C.faint,marginTop:4,fontWeight:700,textTransf
</div>
);
})}
</div>
{(c.water_intake||c.steps) && (
<div style={{display:"flex",gap:12,marginBottom:c.notes?12:0}}>
{c.water_intake && <div style={{background:C.surface2,borderRadius:8,padding:"8
{c.steps && <div style={{background:C.surface2,borderRadius:8,padding:"8px 14px
</div>
)}
{c.notes && (
<div style={{background:C.surface2,borderRadius:10,padding:14,fontSize:13,color:C
<div style={{fontSize:10,color:C.accent,fontWeight:700,textTransform:"uppercase
{c.notes}
</div>
)}
</div>
))}
</div>
);
}
// ── HABITS EDITOR (coach sets habits) ─────────────────────────────────────────
function HabitsEditor({ habits, onSave, clientName }) {
const [list, setList] = useState(habits || []);
const [newHabit, setNewHabit] = useState("");
const [saved, setSaved] = useState(false);
useEffect(()=>{ setList(habits||[]); },[habits]);
const addHabit = () => {
if(!newHabit.trim()) return;
setList(prev=>[...prev,{id:uid(),label:newHabit.trim(),emoji:" "}]);
setNewHabit("");
};
const removeHabit = (id) => setList(prev=>prev.filter(h=>h.id!==id));
const updateEmoji = (id,emoji) => setList(prev=>prev.map(h=>h.id===id?{...h,emoji}:h));
const handleSave = async () => {
await onSave(list);
setSaved(true);
setTimeout(()=>setSaved(false),2000);
};
const EMOJIS = [" "," "," "," "," "," "," "," "," "," "," "," "];
return (
<div>
<SectionHeader title="Daily Habits" action={
<button style={{...S.btn,...(saved?{background:"#7BE0A0"}:{})}} onClick={handleSave}>
{saved?"✓ Saved!":"Save Habits →"}
</button>
} />
<div style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:14,padding:
<div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",lette
Set daily habits for {clientName}
</div>
{list.length===0 && <Empty text="No habits set yet. Add habits below." />}
{list.map(h=>(
<div key={h.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,b
<select value={h.emoji} onChange={e=>updateEmoji(h.id,e.target.value)}
style={{background:"transparent",border:"none",fontSize:18,cursor:"pointer",out
{EMOJIS.map(e=><option key={e} value={e}>{e}</option>)}
</select>
<div style={{flex:1,fontSize:14,fontWeight:600,color:C.text}}>{h.label}</div>
<button style={{background:"transparent",border:"none",color:"#ff6b6b",cursor:"po
</div>
))}
<div style={{display:"flex",gap:8,marginTop:14}}>
<input style={{...S.input,flex:1}} value={newHabit} onChange={e=>setNewHabit(e.targ
placeholder="e.g. Drink 2L of water" onKeyDown={e=>e.key==="Enter"&&addHabit()} /
<button style={S.btnSm} onClick={addHabit}>+ Add</button>
</div>
</div>
</div>
);
}
// ── CLIENT HABITS VIEW (client logs daily) ────────────────────────────────────
function ClientHabitsView({ habits, habitLogs, onLog }) {
const today = new Date().toISOString().slice(0,10);
const todayLog = habitLogs[today] || {};
const [completions, setCompletions] = useState(todayLog);
const [saved, setSaved] = useState(false);
useEffect(()=>{ setCompletions(habitLogs[today]||{}); },[habitLogs, today]);
if (!habits || habits.length === 0) return (
<div style={{textAlign:"center",padding:"48px 0"}}>
<div style={{fontSize:32,marginBottom:12}}> </div>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:C.text,marginBottom
<div style={{color:C.muted,fontSize:14}}>Your coach will set your daily habits soon.</d
</div>
);
const toggle = (id) => setCompletions(prev=>({...prev,[id]:!prev[id]}));
const doneCount = habits.filter(h=>completions[h.id]).length;
const handleSave = async () => {
await onLog(today, completions);
setSaved(true);
setTimeout(()=>setSaved(false),2000);
};
// Last 7 days for streak
const last7 = Array.from({length:7},(_,i)=>{
const d = new Date();
d.setDate(d.getDate()-i);
return d.toISOString().slice(0,10);
}).reverse();
return (
<div>
<SectionHeader title={`Today — ${today}`} />
{/* Progress ring */}
<div style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:16,padding:
backgroundImage:"radial-gradient(ellipse at 100% 0%,rgba(203,251,69,0.06),transparent
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:72,color:doneCount===habit
{doneCount}<span style={{fontSize:32,color:C.muted}}>/{habits.length}</span>
</div>
<div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.15e
{doneCount===habits.length?"All habits complete! ":"Habits completed today"}
</div>
{/* Progress bar */}
<div style={{background:C.surface2,borderRadius:999,height:6,marginTop:16,overflow:"h
<div style={{height:"100%",background:`linear-gradient(90deg,${C.accent},#a8e800)`,
width:`${habits.length>0?(doneCount/habits.length)*100:0}%`,transition:"width .4s
</div>
</div>
{/* Habit checklist */}
<div style={{marginBottom:16}}>
{habits.map(h=>(
<div key={h.id}
style={{display:"flex",alignItems:"center",gap:14,background:C.surface,border:`1p
borderRadius:12,padding:"14px 16px",marginBottom:8,cursor:"pointer",transition:
opacity:completions[h.id]?0.7:1}}
onClick={()=>toggle(h.id)}>
<div style={{fontSize:22}}>{h.emoji}</div>
<div style={{flex:1,fontSize:14,fontWeight:700,color:C.text,textDecoration:comple
<div style={{width:28,height:28,borderRadius:999,border:`2px solid ${completions[
background:completions[h.id]?C.accent:"transparent",display:"flex",alignItems:"
color:"#000",fontSize:14,fontWeight:800,transition:"all .2s"}}>
{completions[h.id]?"✓":""}
</div>
</div>
))}
</div>
<button style={{...S.btn,width:"100%",padding:14,...(saved?{background:"#7BE0A0"}:{})}}
{saved?"✓ Saved!":"Save Today's Habits →"}
</button>
{/* 7-day streak view */}
<div style={{marginTop:24}}>
<SectionHeader title="Last 7 Days" />
<div style={{display:"flex",gap:8}}>
{last7.map(date=>{
const log = habitLogs[date]||{};
const done = habits.filter(h=>log[h.id]).length;
const pct = habits.length>0?done/habits.length:0;
const isToday = date===today;
return (
<div key={date} style={{flex:1,textAlign:"center"}}>
<div style={{fontSize:9,color:C.faint,fontWeight:700,marginBottom:6,textTrans
{new Date(date+"T12:00:00").toLocaleDateString("en",{weekday:"short"})}
</div>
<div style={{height:48,background:C.surface2,borderRadius:8,position:"relativ
<div style={{position:"absolute",bottom:0,left:0,right:0,height:`${pct*100}
background:pct===1?C.accent:`rgba(203,251,69,${0.3+pct*0.4})`,transition:
</div>
<div style={{fontSize:10,color:pct===1?C.accent:C.muted,fontWeight:700,margin
{done}/{habits.length}
</div>
</div>
);
})}
</div>
</div>
</div>
);
}
// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function ClientNutritionView({ nutrition }) {
if (!nutrition) return (
<div style={{textAlign:"center",padding:"48px 0"}}>
<div style={{fontSize:32,marginBottom:12}}> </div>
<div style={{color:C.muted,fontSize:14}}>Your coach hasn't set a nutrition plan yet.</d
</div>
);
const { calories, protein, carbs, fat, notes, meals } = nutrition;
const totP = meals.reduce((s,m)=>s+m.protein,0);
const totC = meals.reduce((s,m)=>s+m.carbs,0);
const totF = meals.reduce((s,m)=>s+m.fat,0);
return (
<div>
<SectionHeader title="Your Nutrition Plan" />
</sp
<div style={S.macroGrid}>
{[["Calories",calories,"kcal","#FFFFFF"],["Protein",protein,"g","#FFFFFF"],["Carbs",c
<div key={l} style={{...S.macroBox,borderColor:col+"33"}}>
<div style={{...S.macroLabel,color:col}}>{l}</div>
<div style={{fontSize:24,fontWeight:800,color:col}}>{v}<span style={{fontSize:13,
</div>
))}
</div>
{notes && <div style={S.coachNote}><span style={{color:"#FFFFFF",marginRight:6}}> <SectionHeader title="Meal Breakdown" />
{meals.map(m=>(
<div key={m.id} style={S.mealViewCard}>
<div style={S.mealName}>{m.name}</div>
<div style={S.mealDesc}>{m.description}</div>
<div style={S.mealMacros}>
<span style={{color:"#FFFFFF"}}>P {m.protein}g</span>
<span style={{color:"#CCCCCC"}}>C {m.carbs}g</span>
<span style={{color:"#999999"}}>F {m.fat}g</span>
<span style={{color:C.muted}}>{m.protein*4+m.carbs*4+m.fat*9} kcal</span>
</div>
</div>
))}
<div style={S.mealTotal}>
Daily total from meals — P {totP}g · C {totC}g · F {totF}g · {totP*4+totC*4+totF*9} k
</div>
</div>
);
}
// ── CLIENT HISTORY VIEW ───────────────────────────────────────────────────────
function ClientHistoryView({ clientId, programs, workoutLog }) {
const [selProg, setSelProg] = useState(programs[0]?.id||null);
const [selDay, setSelDay] = useState(null);
const prog = programs.find(p=>p.id===selProg);
useEffect(()=>setSelDay(null),[selProg]);
const day = prog?.days.find(d=>d.id===selDay);
const history = selDay ? workoutLog.getHistory(clientId, selDay) : [];
const allExercises = programs.flatMap(p=>p.days.flatMap(d=>d.exercises));
const pbs = workoutLog.getPBs(clientId, allExercises);
useEffect(()=>{ if(selDay) workoutLog.loadHistory(clientId, selDay); },[selDay]);
if (programs.length===0) return <Empty text="No programs assigned yet." />;
return (
<div>
<SectionHeader title="Your Workout History" />
{programs.length>1 && <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12
{programs.map(p=><button key={p.id} style={{...S.tabBtn,...(selProg===p.id?S.tabBtnAc
</div>}
{prog && <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
{prog.days.map((d,i)=>(
<button key={d.id} style={{...S.tabBtn,...(selDay===d.id?{...S.tabBtnActive,borderC
onClick={()=>setSelDay(selDay===d.id?null:d.id)}>{d.label}</button>
))}
</div>}
{day && <>
{/* PBs */}
{day.exercises.some(ex=>pbs[ex.id]) && <>
<div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",let
<div style={S.pbRow}>
{day.exercises.filter(ex=>pbs[ex.id]).map(ex=>(
<div key={ex.id} style={S.pbChip}>
<div style={S.pbVal}>{pbs[ex.id]}kg</div>
<div style={S.pbName}>{ex.name}</div>
<div style={S.pbLabel}> PB</div>
</div>
))}
</div>
</>}
{history.length===0 && <Empty text="No sessions logged for this day yet. Complete a w
{[...history].reverse().map((session,si)=>(
<div key={si} style={S.historySession}>
<div style={S.historyDate}>{fmt(session.date)}{si===0?" · Most Recent":""}</div>
{day.exercises.map(ex=>{
const sets = session.sets[ex.id]||[];
const doneSets = sets.filter(s=>s.done);
if(doneSets.length===0) return null;
const best = Math.max(...doneSets.map(s=>parseFloat(s.weight)||0));
return (
<div key={ex.id} style={S.historyEx}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-betwe
<div style={S.historyExName}>{ex.name}</div>
{pbs[ex.id]===best && best>0 && <span style={{fontSize:10,color:"#FFFFFF"
</div>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
{doneSets.map((s,i)=>(
<div key={i} style={S.historySetChip}>{s.weight||"–"}kg × {s.reps||"–"}
))}
</div>
</div>
);
})}
</div>
))}
</>}
</div>
{!selDay && prog && <Empty text="Select a training day to view session history." />}
);
}
// ── WEEKLY CHECK-IN FORM (client fills in) ───────────────────────────────────
function ClientMeasurementsView({ measurements }) {
if (!measurements || measurements.length === 0) return (
<div style={{textAlign:"center",padding:"48px 0"}}>
<div style={{fontSize:32,marginBottom:12}}> </div>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:C.text,marginBottom
<div style={{color:C.muted,fontSize:14}}>Your coach will record your measurements soon.
</div>
);
const sorted = [...measurements].sort((a,b)=>b.date.localeCompare(a.date));
const latest = sorted[0];
return (
<div>
<SectionHeader title="Your Measurements" />
<div style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:16,padding:
<div style={{fontSize:10,color:C.accent,fontWeight:800,textTransform:"uppercase",lett
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",
{MEASUREMENT_FIELDS.filter(f=>f.key!=="date"&&latest[f.key]).map(field=>(
<div key={field.key} style={{background:C.surface2,borderRadius:12,padding:"12px
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:C.text,line
<div style={{fontSize:9,color:C.faint,fontWeight:700,textTransform:"uppercase",
</div>
))}
</div>
</div>
{sorted.length>1 && <>
<SectionHeader title="History" />
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
<thead><tr style={{borderBottom:`1px solid ${C.line}`}}>
{MEASUREMENT_FIELDS.map(f=>(<th key={f.key} style={{padding:"8px 10px",textAlig
</tr></thead>
<tbody>{sorted.map((row,i)=>(<tr key={i} style={{borderBottom:`1px solid ${C.line
{MEASUREMENT_FIELDS.map(f=>(<td key={f.key} style={{padding:"10px",color:i===0?
</tr>))}</tbody>
</table>
</div>
</>}
</div>
);
}
// ── CLIENT DASHBOARD ──────────────────────────────────────────────────────────
function ProgramView({ program, clientId, workoutLog, onBack, onSelectDay }) {
const allEx = program.days.flatMap(d=>d.exercises);
const pbs = workoutLog.getPBs(clientId, allEx);
useEffect(()=>{
program.days.forEach(d => workoutLog.loadHistory(clientId, d.id));
}, [program.id]);
return (
<div style={S.app}>
<Topbar title={program.name} subtitle={program.tag} onLogout={null}
left={<button style={S.backBtn} onClick={onBack}>← Back</button>} />
<div style={S.content}>
<SectionHeader title="Training Days" />
<div style={S.dayGrid}>
{program.days.map((day,i)=>{
const history = workoutLog.getHistory(clientId, day.id);
const lastSession = history[history.length-1];
return (
<div key={day.id} style={S.dayTile} onClick={()=>onSelectDay(day)}>
<div style={{...S.dayTileAccent,background:DAY_COLORS[i%DAY_COLORS.length]}}
<div style={S.dayTileName}>{day.label}</div>
<div style={S.dayTileCount}>{day.exercises.length} exercises</div>
{lastSession && <div style={{fontSize:10,color:C.muted,marginTop:4}}>Last: {f
<div style={{color:DAY_COLORS[i%DAY_COLORS.length],fontSize:12,marginTop:8}}>
</div>
);
})}
</div>
</div>
</div>
);
}
// ── DAY VIEW (workout + logger) ───────────────────────────────────────────────
function DayView({ day, clientId, workoutLog, onBack }) {
useEffect(()=>{ workoutLog.loadHistory(clientId, day.id); },[]);
const initLogs = () => {
const l = {};
day.exercises.forEach(ex=>{
const count = parseInt(ex.sets)||3;
// Pre-fill with last session's weights if available
const history = workoutLog.getHistory(clientId, day.id);
const last = history[history.length-1];
l[ex.id] = Array.from({length:count},(_,i)=>({
weight: last?.sets[ex.id]?.[i]?.weight || "",
reps: "",
done: false,
}));
});
return l;
};
const [logs, setLogs] = useState(initLogs);
const [saved, setSaved] = useState(false);
const updateSet = (exId,si,field,val) => setLogs(prev=>{
const sets=[...prev[exId]]; sets[si]={...sets[si],[field]:val}; return {...prev,[exId]:se
const toggleSet = (exId,si) => setLogs(prev=>{
const sets=[...prev[exId]]; sets[si]={...sets[si],done:!sets[si].done}; return {...prev,[
});
});
const exDone = (exId) => logs[exId]?.every(s=>s.done);
const total = day.exercises.length;
const completed = day.exercises.filter(ex=>exDone(ex.id)).length;
// Get PBs for this day's exercises
const pbs = workoutLog.getPBs(clientId, day.exercises);
const saveSession = () => {
workoutLog.saveSession(clientId, day.id, logs);
setSaved(true);
setTimeout(()=>setSaved(false), 3000);
};
return (
<div style={S.app}>
<Topbar title={day.label} subtitle={`${completed}/${total} exercises done`} onLogout={n
left={<button style={S.backBtn} onClick={onBack}>← Back</button>}
right={<button style={{...S.btnSm,...(saved?{background:"#7BE0A0"}:{})}} onClick={sav
{saved?"✓ Saved!":" Save Session"}
</button>} />
<div style={S.content}>
<div style={S.progressBar}>
<div style={{...S.progressFill,width:`${total>0?(completed/total)*100:0}%`}} </div>
/>
{day.exercises.map((ex,i)=>{
const sets = logs[ex.id]||[];
const allDone = sets.every(s=>s.done);
const pb = pbs[ex.id];
const currentBest = Math.max(...sets.filter(s=>s.done&&s.weight).map(s=>parseFloat(
const isNewPB = currentBest > 0 && (!pb || currentBest > pb);
return (
<div key={ex.id} style={{...S.workoutCard,flexDirection:"column",opacity:allDone?
<div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
<span style={S.wcNum}>{i+1}</span>
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<div style={{...S.wcName,textDecoration:allDone?"line-through":"none"}}>{
{isNewPB && <span style={S.pbBadge}> New PB!</span>}
{!isNewPB && pb && <span style={S.prevPB}>PB {pb}kg</span>}
</div>
<div style={S.wcMeta}>{ex.sets} sets · {ex.reps} reps · {ex.rest} rest</div
{ex.notes && <div style={S.wcNotes}>{ex.notes}</div>}
</div>
{allDone && <span style={{color:"#FFFFFF",fontSize:18}}>✓</span>}
</div>
<div style={S.setLogWrap}>
<div style={S.setLogHeader}>
<span style={{flex:"0 0 36px"}}>Set</span>
<span style={{flex:1}}>Weight (kg)</span>
<span style={{flex:1}}>Reps</span>
<span style={{flex:"0 0 40px"}}></span>
</div>
{sets.map((s,si)=>(
<div key={si} style={{...S.setLogRow,background:s.done?"#FFFFFF10":"transpa
<span style={{...S.setNum,color:s.done?"#FFFFFF":C.muted}}>{si+1}</span>
<input style={{...S.setInput,borderColor:s.done?"#FFFFFF50":C.line2}} pla
value={s.weight} type="number" onChange={e=>updateSet(ex.id,si,"weight"
<input style={{...S.setInput,borderColor:s.done?"#FFFFFF50":C.line2}} pla
value={s.reps} type="number" onChange={e=>updateSet(ex.id,si,"reps",e.t
<button style={{...S.checkBtn,width:32,height:32,fontSize:13,
background:s.done?"#FFFFFF":"transparent",color:s.done?"#000":"#FFFFFF"
onClick={()=>toggleSet(ex.id,si)}>{s.done?"✓":"○"}</button>
</div>
))}
</div>
</div>
);
})}
{completed===total && total>0 && (
<div style={S.doneMsg}>
Session complete!<br/>
<button style={{...S.btn,marginTop:12}} onClick={saveSession}>
{saved?"✓ Saved!":"Save this session →"}
</button>
</div>
)}
</div>
</div>
);
}
// ── MODALS ────────────────────────────────────────────────────────────────────
function NewClientModal({ onClose, onSave }) {
const [form, setForm] = useState({name:"",email:"",password:"",age:"",weight:"",height:"",g
const f=(k,v)=>setForm(p=>({...p,[k]:v}));
return (
<Modal title="New Client" onClose={onClose} onSave={()=>onSave({...form,age:+form.age,wei
<Field label="Name"><input style={S.input} value={form.name} onChange={e=>f("name",e.ta
<Field label="Email"><input style={S.input} value={form.email} onChange={e=>f("email",e
<Field label="Password"><input style={S.input} value={form.password} onChange={e=>f("pa
<div style={{display:"flex",gap:8}}>
<Field label="Age"><input style={S.input} value={form.age} onChange={e=>f("age",e.tar
<Field label="Weight (kg)"><input style={S.input} value={form.weight} onChange={e=>f(
<Field label="Height (cm)"><input style={S.input} value={form.height} onChange={e=>f(
</div>
<Field label="Goal"><input style={S.input} value={form.goal} onChange={e=>f("goal",e.ta
</Modal>
);
}
function NewProgramModal({ onClose, onSave }) {
const [form, setForm] = useState({name:"",tag:"",color:"#FFFFFF"});
const f=(k,v)=>setForm(p=>({...p,[k]:v}));
return (
<Modal title="New Program" onClose={onClose} onSave={()=>onSave(form)}>
<Field label="Program Name"><input style={S.input} value={form.name} onChange={e=>f("na
<Field label="Tag (e.g. Beginner · 3 days/week)"><input style={S.input} value={form.tag
<Field label="Accent Color">
<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
{DAY_COLORS.map(c=>(
<div key={c} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"p
border:form.color===c?"2px solid #fff":"2px solid transparent"}} onClick={()=>f
))}
</div>
</Field>
</Modal>
);
}
function EditClientModal({ client, onClose, onSave }) {
const [form, setForm] = useState({name:client.name,email:client.email,age:client.age,weight
const f=(k,v)=>setForm(p=>({...p,[k]:v}));
return (
<Modal title="Edit Client" onClose={onClose} onSave={()=>onSave(form)}>
<Field label="Name"><input style={S.input} value={form.name} onChange={e=>f("name",e.ta
<Field label="Email"><input style={S.input} value={form.email} onChange={e=>f("email",e
<div style={{display:"flex",gap:8}}>
<Field label="Age"><input style={S.input} value={form.age} onChange={e=>f("age",+e.ta
<Field label="Weight (kg)"><input style={S.input} value={form.weight} onChange={e=>f(
<Field label="Height (cm)"><input style={S.input} value={form.height} onChange={e=>f(
</div>
<Field label="Goal"><input style={S.input} value={form.goal} onChange={e=>f("goal",e.ta
</Modal>
);
}
// ── COACH LOG HISTORY ────────────────────────────────────────────────────────
function ClientDashboard({ client, assigned, nutrition, measurements, workoutLog, habits, hab
const latest = measurements && measurements.length > 0 ? [...measurements].sort((a,b)=>b.da
const allEx = assigned.flatMap(p=>p.days.flatMap(d=>d.exercises));
const pbs = workoutLog.getPBs(client.id, allEx);
const pbCount = Object.keys(pbs).length;
const recentSessions = [];
assigned.forEach(prog => {
prog.days.forEach(day => {
const hist = workoutLog.getHistory(client.id, day.id);
if (hist.length > 0) recentSessions.push({date:hist[hist.length-1].date,dayLabel:day.la
});
});
recentSessions.sort((a,b)=>new Date(b.date)-new Date(a.date));
const getWeekStart = () => { const d=new Date(); const day=d.getDay(); const diff=d.getDate
const hasCheckin = checkins && checkins.some(c=>c.week_start===getWeekStart());
const today = new Date().toISOString().slice(0,10);
const todayHabitLog = habitLogs[today]||{};
const habitsDone = (habits||[]).filter(h=>todayHabitLog[h.id]).length;
return (
<div>
{/* Hero stats */}
<div style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:16,padding:
<div style={{fontSize:10,color:C.accent,fontWeight:800,textTransform:"uppercase",lett
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
{[{val:client.weight+"kg",label:"Weight"},{val:client.height+"cm",label:"Height"},{
<div key={s.label} style={{textAlign:"center"}}>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.text,line
<div style={{fontSize:9,color:C.faint,fontWeight:700,textTransform:"uppercase",
</div>
))}
</div>
</div>
{/* Check-in nudge */}
{!hasCheckin && (
<div style={{background:"rgba(203,251,69,0.06)",border:"1px solid rgba(203,251,69,0.2
<div style={{fontSize:10,color:C.accent,fontWeight:800,textTransform:"uppercase",le
<div style={{fontSize:13,color:C.muted,marginBottom:8}}>Your coach is waiting for y
<div style={{fontSize:12,color:C.accent,fontWeight:700}}>Submit now →</div>
</div>
)}
{/* Habits today */}
{habits && habits.length > 0 && (
<div style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:14,paddin
<div style={{fontSize:10,color:C.accent,fontWeight:800,textTransform:"uppercase",le
<div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:8}}>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:42,color:habitsDone===
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:C.muted}}>/ {
</div>
<div style={{background:C.surface2,borderRadius:999,height:5,overflow:"hidden"}}>
<div style={{height:"100%",background:`linear-gradient(90deg,${C.accent},#a8e800)
</div>
<div style={{marginTop:8,fontSize:12,color:C.accent,fontWeight:700}}>Log habits →</
</div>
)}
{/* Programs */}
{assigned.length > 0 && (
<div style={{marginBottom:14}}>
<SectionHeader title="Active Programs" action={<button style={S.btnSm} onClick={onG
<div style={S.grid}>{assigned.slice(0,2).map(p=>(
<div key={p.id} style={S.progCard} onClick={onGoPrograms}>
<div style={{...S.progAccent,background:p.color}} />
<div style={S.progName}>{p.name}</div>
<div style={S.progTag}>{p.tag}</div>
<div style={S.progDays}>{p.days.length} days · {p.days.reduce((s,d)=>s+d.exerci
</div>
))}</div>
</div>
)}
{assigned.length===0 && (
<div style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:14,paddin
<div style={{fontSize:32,marginBottom:8}}> </div>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:C.text,marginBo
<div style={{fontSize:13,color:C.muted}}>Your coach will assign your program soon.<
</div>
)}
{/* Recent sessions */}
{recentSessions.length > 0 && (
<div style={{marginBottom:14}}>
<SectionHeader title="Recent Sessions" />
{recentSessions.slice(0,3).map((s,i)=>(
<div key={i} style={{...S.historySession,display:"flex",alignItems:"center",gap:1
<div style={{width:4,height:36,borderRadius:2,background:s.color,flexShrink:0}}
<div style={{flex:1}}>
<div style={{fontWeight:700,fontSize:13}}>{s.dayLabel}</div>
<div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.progName}</div>
</div>
<div style={{fontSize:11,color:C.faint,fontWeight:700}}>{fmt(s.date)}</div>
</div>
))}
</div>
)}
{/* Nutrition teaser */}
{nutrition && (
<div style={{background:C.surface,border:`1px solid ${C.line}`,borderRadius:14,paddin
<div style={{fontSize:10,color:C.accent,fontWeight:800,textTransform:"uppercase",le
<div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
{[["Calories",nutrition.calories,"kcal"],["Protein",nutrition.protein,"g"],["Carb
<div key={l} style={{textAlign:"center"}}>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:C.text,li
<div style={{fontSize:9,color:C.faint,fontWeight:700,textTransform:"uppercase
</div>
))}
</div>
</div>
<div style={{marginTop:10,fontSize:12,color:C.accent,fontWeight:700}}>View full pla
)}
</div>
);
}
// ── CLIENT APP ────────────────────────────────────────────────────────────────
function ClientApp({ client, programs, nutrition, workoutLog, loadNutrition, measurements, lo
const [tab, setTab] = useState("dashboard");
const [activeProg, setActiveProg] = useState(null);
const [activeDay, setActiveDay] = useState(null);
const assigned = programs.filter(p=>p.assignedTo.includes(client.id));
useEffect(()=>{ if(loadNutrition) loadNutrition(); if(loadMeasurements) loadMeasurements();
if (activeDay && activeProg) {
return <DayView day={activeDay} clientId={client.id} workoutLog={workoutLog} onBack={()=>
}
if (activeProg) {
const prog = programs.find(p=>p.id===activeProg);
return <ProgramView program={prog} clientId={client.id} workoutLog={workoutLog}
onBack={()=>setActiveProg(null)} onSelectDay={d=>setActiveDay(d)} />;
}
const tabs = [
{id:"dashboard",label:"Dashboard"},
{id:"programs",label:"Programs"},
{id:"nutrition",label:"Nutrition"},
{id:"measurements",label:"Measurements"},
{id:"checkin",label:"Check-In"},
{id:"habits",label:"Habits"},
{id:"history",label:"Log History"},
];
return (
<div style={S.app}>
<div style={{...S.topbar,flexDirection:"column",alignItems:"flex-start",gap:0,padding:"
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:
<div>
<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:C.text,letter
Hey, {client.name.split(" ")[0]}
</div>
<div style={{fontSize:12,color:C.muted,marginTop:2}}>{client.goal}</div>
</div>
<button style={S.btnGhost} onClick={onLogout}>Sign out</button>
</div>
<div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:12,width:"100%",scro
{tabs.map(t=>(
<button key={t.id} style={{...S.tabBtn,...(tab===t.id?S.tabBtnActive:{}),flexShri
onClick={()=>setTab(t.id)}>{t.label}</button>
))}
</div>
</div>
<div style={S.content}>
{tab==="dashboard" && <ClientDashboard client={client} assigned={assigned} nutrition=
{tab==="programs" && <>
<SectionHeader title="Your Programs" />
{assigned.length===0 && <Empty text="Your coach hasn't assigned a program yet." />}
<div style={S.grid}>{assigned.map(p=>(
<div key={p.id} style={S.progCard} onClick={()=>setActiveProg(p.id)}>
<div style={{...S.progAccent,background:p.color}} />
<div style={S.progName}>{p.name}</div>
<div style={S.progTag}>{p.tag}</div>
<div style={S.progDays}>{p.days.length} days · {p.days.reduce((s,d)=>s+d.exerci
<div style={{...S.btnSm,marginTop:12,display:"inline-block"}}>Open →</div>
</div>
))}</div>
</>}
{tab==="nutrition" && <ClientNutritionView nutrition={nutrition} />}
{tab==="measurements" && <ClientMeasurementsView measurements={measurements||[]} />}
{tab==="checkin" && <ClientCheckinForm checkins={checkins||[]} onSave={saveCheckin} /
{tab==="habits" && <ClientHabitsView habits={habits||[]} habitLogs={habitLogs||{}} on
{tab==="history" && <ClientHistoryView clientId={client.id} programs={assigned} worko
</div>
</div>
);
}
// ── CLIENT DETAIL (coach view) ────────────────────────────────────────────────
function CoachLogHistory({ clientId, programs, workoutLog, pbs }) {
const [selProg, setSelProg] = useState(programs[0]?.id || null);
const [selDay, setSelDay] = useState(null);
const prog = programs.find(p=>p.id===selProg);
useEffect(()=>{ setSelDay(null); },[selProg]);
const day = prog?.days.find(d=>d.id===selDay);
const history = selDay ? workoutLog.getHistory(clientId, selDay) : [];
useEffect(()=>{ if(selDay) workoutLog.loadHistory(clientId, selDay); },[selDay]);
if (programs.length===0) return <Empty text="No programs assigned — assign a program first.
return (
<div>
<SectionHeader title="Workout Log History" />
<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
{programs.map(p=><button key={p.id} style={{...S.tabBtn,...(selProg===p.id?S.tabBtnAc
</div>
{prog && <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
{prog.days.map((d,i)=>(
<button key={d.id} style={{...S.tabBtn,...(selDay===d.id?{...S.tabBtnActive,borderC
onClick={()=>setSelDay(selDay===d.id?null:d.id)}>{d.label}</button>
))}
</div>}
{day && <>
{/* Personal Bests for this day */}
<div style={S.pbRow}>
{day.exercises.filter(ex=>pbs[ex.id]).map(ex=>(
<div key={ex.id} style={S.pbChip}>
<div style={S.pbVal}>{pbs[ex.id]}kg</div>
<div style={S.pbName}>{ex.name}</div>
<div style={S.pbLabel}>PB</div>
</div>
))}
</div>
{history.length===0 && <Empty text="No sessions logged yet for this day." />}
{[...history].reverse().map((session,si)=>(
<div key={si} style={S.historySession}>
<div style={S.historyDate}>{fmt(session.date)}</div>
{day.exercises.map(ex=>{
const sets = session.sets[ex.id]||[];
const doneSets = sets.filter(s=>s.done);
if(doneSets.length===0) return null;
return (
<div key={ex.id} style={S.historyEx}>
<div style={S.historyExName}>{ex.name}</div>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
{doneSets.map((s,i)=>(
<div key={i} style={S.historySetChip}>{s.weight||"–"}kg × {s.reps||"–"}
))}
</div>
</div>
);
})}
</div>
))}
</>}
{!selDay && prog && <Empty text="Select a training day above to view session history."
</div>
);
}
// ── NUTRITION EDITOR (coach) ──────────────────────────────────────────────────
function NutritionEditor({ nutrition, onSave, client, onMount }) {
const blank = { calories:0, protein:0, carbs:0, fat:0, notes:"", meals:[] };
const [form, setForm] = useState(nutrition || blank);
useEffect(()=>{ if(onMount) onMount(); },[]);
const f = (k,v) => setForm(p=>({...p,[k]:v}));
const addMeal = () => setForm(p=>({...p,meals:[...p.meals,{id:uid(),name:"New Meal",descrip
const updateMeal = (id,k,v) => setForm(p=>({...p,meals:p.meals.map(m=>m.id===id?{...m,[k]:v
const deleteMeal = (id) => setForm(p=>({...p,meals:p.meals.filter(m=>m.id!==id)}));
return (
<div>
<SectionHeader title="Nutrition Plan" action={<button style={S.btn} onClick={()=>onSave
<div style={S.macroGrid}>
{[["Calories","calories","kcal"],["Protein","protein","g"],["Carbs","carbs","g"],["Fa
<div key={key} style={S.macroBox}>
<div style={S.macroLabel}>{label}</div>
<div style={{display:"flex",alignItems:"baseline",gap:4}}>
<input style={{...S.input,fontSize:22,fontWeight:800,color:"#FFFFFF",background
type="number" value={form[key]} onChange={e=>f(key,+e.target.value)} />
<span style={{color:C.muted,fontSize:12}}>{unit}</span>
</div>
</div>
))}
</div>
<Field label="Coach Notes">
<textarea style={{...S.input,minHeight:72,resize:"vertical"}} value={form.notes} onCh
</Field>
<SectionHeader title="Meal Plan" action={<button style={S.btnSm} onClick={addMeal}>+ Me
{form.meals.length===0 && <Empty text="No meals added yet." />}
{form.meals.map(m=>(
<div key={m.id} style={S.mealEditorCard}>
<div style={{display:"flex",gap:8,marginBottom:8}}>
<input style={{...S.input,flex:2,fontWeight:700}} value={m.name} onChange={e=>upd
<button style={{...S.iconBtn,color:"#ff6b6b"}} onClick={()=>deleteMeal(m.id)}>✕</
</div>
<textarea style={{...S.input,minHeight:56,resize:"vertical",marginBottom:8}} onChange={e=>updateMeal(m.id,"description",e.target.value)} placeholder="Descript
<div style={{display:"flex",gap:8}}>
{[["P","protein"],["C","carbs"],["F","fat"]].map(([l,k])=>(
<div key={k} style={{flex:1}}>
value=
<div style={{fontSize:10,color:C.muted,marginBottom:3}}>{l} (g)</div>
<input style={{...S.input,textAlign:"center"}} type="number" value={m[k]} onC
</div>
))}
</div>
</div>
))}
</div>
);
}
// ── App Root ─────────────────────────────────────────────────────────────────
// ── App Root ─────────────────────────────────────────────────────────────────
function DayBlock({ day, color, onChange, onDelete }) {
const [open, setOpen] = useState(true);
const [editLabel, setEditLabel] = useState(false);
const [labelVal, setLabelVal] = useState(day.label);
const addEx = () => onChange({...day,exercises:[...day.exercises,{id:uid(),name:"New Exerci
const updateEx = (exId,field,val) => onChange({...day,exercises:day.exercises.map(e=>e.id==
const deleteEx = (exId) => onChange({...day,exercises:day.exercises.filter(e=>e.id!==exId)}
const saveLabel = () => { onChange({...day,label:labelVal}); setEditLabel(false); };
return (
<div style={{...S.dayBlock,borderLeft:`3px solid ${color}`}}>
<div style={S.dayHeader} onClick={()=>setOpen(o=>!o)}>
<div style={S.dayLeft}>
<span style={{color,fontSize:18,marginRight:8}}>▸</span>
{editLabel
? <input style={{...S.input,padding:"4px 8px",fontSize:14,width:260}} value={labe
onChange={e=>setLabelVal(e.target.value)} onBlur={saveLabel} onKeyDown={e=>e.
onClick={e=>e.stopPropagation()} autoFocus />
: <span style={S.dayTitle} onClick={e=>{e.stopPropagation();setEditLabel(true)}}>
}
<span style={S.exCount}>{day.exercises.length} exercises</span>
</div>
<div style={{display:"flex",gap:8}} onClick={e=>e.stopPropagation()}>
<button style={S.iconBtn} onClick={addEx}>+ Exercise</button>
<button style={{...S.iconBtn,color:"#ff6b6b"}} onClick={onDelete}>✕</button>
</div>
</div>
{open && <div style={S.exList}>
{day.exercises.length===0 && <Empty text="No exercises." small />}
{day.exercises.map((ex,i)=>(
<ExRow key={ex.id} ex={ex} index={i+1} color={color}
onChange={(f,v)=>updateEx(ex.id,f,v)} onDelete={()=>deleteEx(ex.id)} />
))}
</div>}
</div>
);
}
function ExRow({ ex, index, color, onChange, onDelete }) {
return (
<div style={S.exRow}>
<span style={{...S.exNum,color}}>{index}</span>
<div style={S.exFields}>
<input style={{...S.exInput,flex:3}} value={ex.name} onChange={e=>onChange("name",e.t
<input style={{...S.exInput,flex:1}} value={ex.sets} onChange={e=>onChange("sets",e.t
<input style={{...S.exInput,flex:1.5}} value={ex.reps} onChange={e=>onChange("reps",e
<input style={{...S.exInput,flex:1}} value={ex.rest} onChange={e=>onChange("rest",e.t
<input style={{...S.exInput,flex:3}} value={ex.notes} onChange={e=>onChange("notes",e
</div>
<button style={{...S.iconBtn,color:"#ff6b6b",padding:"4px 6px"}} onClick={onDelete}>✕</
</div>
);
}
// ── CLIENT APP ────────────────────────────────────────────────────────────────
// ── CLIENT DASHBOARD ──────────────────────────────────────────────────────────
function ProgramBuilder({ program, onUpdate, onBack }) {
const [prog, setProg] = useState(program);
const save = (updated) => { setProg(updated); onUpdate(updated); };
const addDay = () => save({...prog,days:[...prog.days,{id:uid(),label:`Day ${prog.days.leng
const updateDay = (dayId,updated) => save({...prog,days:prog.days.map(d=>d.id===dayId?updat
const deleteDay = (dayId) => save({...prog,days:prog.days.filter(d=>d.id!==dayId)});
return (
<div style={S.app}>
<Topbar title={prog.name} subtitle={prog.tag} onLogout={null}
left={<button style={S.backBtn} onClick={onBack}>← Back</button>}
right={<span style={{color:"#FFFFFF",fontSize:12}}>✓ Auto-saved</span>} />
<div style={S.content}>
<SectionHeader title={`Training Days (${prog.days.length})`} action={<button style={S
{prog.days.length===0 && <Empty text="No days yet. Add your first training day." />}
{prog.days.map((day,di)=>(
<DayBlock key={day.id} day={day} color={DAY_COLORS[di%DAY_COLORS.length]}
onChange={u=>updateDay(day.id,u)} onDelete={()=>deleteDay(day.id)} />
))}
</div>
</div>
);
}
function ClientDetail({ client, programs, clients, updateClient, updateProgram, assignProgram
const [tab, setTab] = useState("programs");
const [showEdit, setShowEdit] = useState(false);
const assigned = programs.filter(p=>p.assignedTo.includes(client.id));
const unassigned = programs.filter(p=>!p.assignedTo.includes(client.id));
const doAssignProgram = (pid) => {
assignProgram(pid, client.id);
};
// Collect all exercises across all assigned programs for PB lookup
const allExercises = assigned.flatMap(p=>p.days.flatMap(d=>d.exercises));
const pbs = workoutLog.getPBs(client.id, allExercises);
return (
<div style={S.app}>
<Topbar title={client.name} subtitle={client.goal} onLogout={null}
left={<button style={S.backBtn} onClick={onBack}>← Back</button>}
right={<div style={{display:"flex",gap:8}}>
<button style={S.btnGhost} onClick={()=>setShowEdit(true)}> Edit</button>
<TabBtn label="Programs" active={tab==="programs"} onClick={()=>setTab("programs")}
<TabBtn label="Nutrition" active={tab==="nutrition"} onClick={()=>setTab("nutrition
<TabBtn label="Measurements" active={tab==="measurements"} onClick={()=>{setTab("me
<TabBtn label="Check-ins" active={tab==="checkins"} onClick={()=>{setTab("checkins"
<TabBtn label="Habits" active={tab==="habits"} onClick={()=>{setTab("habits");loadH
<TabBtn label="Log History" active={tab==="history"} onClick={()=>setTab("history")
</div>} />
<div style={S.content}>
<div style={S.statsRow}>
<Stat label="Age" value={client.age+"y"} /><Stat label="Weight" value={client.weigh
<Stat label="Height" value={client.height+"cm"} /><Stat label="Programs" value={ass
</div>
{tab==="programs" && <>
<SectionHeader title="Assigned Programs" />
{assigned.length===0 && <Empty text="No programs assigned yet." />}
<div style={S.grid}>{assigned.map(p=>(
<div key={p.id} style={{position:"relative"}}>
<ProgramCard program={p} clients={clients} onClick={()=>onOpenProgram(p.id)} />
<button style={{position:"absolute",top:10,right:10,background:"transparent",bo
onClick={e=>{e.stopPropagation();if(window.confirm("Remove this program from
</div>
))}</div>
{unassigned.length>0 && <>
<SectionHeader title="Assign a Program" />
<div style={S.grid}>{unassigned.map(p=>(
<div key={p.id} style={S.assignCard}>
<div style={{...S.programDot,background:p.color}} />
<div style={S.assignName}>{p.name}</div>
<button style={S.btnSm} onClick={()=>doAssignProgram(p.id)}>Assign →</button>
</div>
))}</div>
</>}
</>}
{tab==="nutrition" && <NutritionAssigner plans={nutrition} onSavePlan={saveNutrition}
{tab==="history" && <CoachLogHistory clientId={client.id} programs={assigned} workout
{tab==="measurements" && <MeasurementsPanel measurements={measurements} onSave={saveM
{tab==="checkins" && <CoachCheckinView checkins={checkins} clientName={client.name} /
{tab==="habits" && <HabitsEditor habits={habits} onSave={saveHabits} clientName={clie
</div>
{showEdit && <EditClientModal client={client} onClose={()=>setShowEdit(false)}
onSave={updated=>{updateClient(client.id,updated);setShowEdit(false);}} />}
</div>
);
}
// ── EDIT CLIENT MODAL ─────────────────────────────────────────────────────────
function CoachApp({ clients, programs, nutrition, addClient, updateClient, removeClient, addP
const [tab, setTab] = useState("clients");
const [activeClient, setActiveClient] = useState(null);
const [activeProgram, setActiveProgram] = useState(null);
const [showNewClient, setShowNewClient] = useState(false);
const [showNewProgram, setShowNewProgram] = useState(false);
if (activeProgram) {
const prog = programs.find(p => p.id === activeProgram);
return <ProgramBuilder program={prog} onUpdate={updateProgram} onBack={()=>setActiveProgr
}
if (activeClient) {
const c = clients.find(c => c.id === activeClient);
return <ClientDetail client={c} programs={programs} clients={clients}
updateClient={updateClient} updateProgram={updateProgram} assignProgram={assignProgram}
nutrition={nutrition[c.id]||[]} saveNutrition={(n)=>saveNutrition(c.id,n)} deleteNutrit
measurements={measurements[c.id]||[]} saveMeasurement={(d)=>saveMeasurement(c.id,d)} lo
checkins={checkins[c.id]||[]} loadCheckins={()=>loadCheckins(c.id)}
habits={habits[c.id]||[]} saveHabits={(h)=>saveHabits(c.id,h)} loadHabits={()=>loadHabi
workoutLog={workoutLog}
onBack={()=>setActiveClient(null)} onOpenProgram={setActiveProgram} />;
}
return (
<div style={S.app}>
<Topbar title={<img src={LOGO_B64} alt="CoachedByNickhee" style={{height:28,objectFit:"
right={<div style={{display:"flex",gap:8}}>
<TabBtn label="Clients" active={tab==="clients"} onClick={()=>setTab("clients")} />
<TabBtn label="Programs" active={tab==="programs"} onClick={()=>setTab("programs")}
</div>} />
<div style={S.content}>
{tab==="clients" && <>
<SectionHeader title={`Clients (${clients.length})`} action={<button style={S.btnSm
<div style={S.grid}>{clients.map(c=><ClientCard key={c.id} client={c} programs={pro
</>}
{tab==="programs" && <>
<SectionHeader title={`Programs (${programs.length})`} action={<button style={S.btn
<div style={S.grid}>{programs.map(p=><ProgramCard key={p.id} program={p} clients={c
</>}
</div>
{showNewClient && <NewClientModal onClose={()=>setShowNewClient(false)}
onSave={c=>{addClient(c);setShowNewClient(false);}} />}
{showNewProgram && <NewProgramModal onClose={()=>setShowNewProgram(false)}
onSave={p=>{addProgram(p);setShowNewProgram(false);}} />}
</div>
);
}
// ── CLIENT DETAIL (coach view) ────────────────────────────────────────────────
function Login({ onLogin }) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const submit = async () => {
setLoading(true); setError("");
await new Promise(r => setTimeout(r, 400));
if (!onLogin(email, password)) setError("Invalid email or password.");
setLoading(false);
};
const stats = [
{ val:"500+", label:"Sessions Logged" },
{ val:"12", label:"Programs Built" },
{ val:"100%", label:"Custom Plans" },
];
const quotes = [
"Re-establishing limitations, one rep at a time.",
"Your body is capable. Your mind decides.",
"Progress is built in the dark, shown in the light.",
];
const isMobile = useIsMobile();
return (
<div style={{display:"flex", flexDirection: isMobile?"column":"row", minHeight:"100vh", b
{/* LEFT — Visual Panel */}
<div style={{
flex: isMobile?"0 0 260px":"0 0 55%", position:"relative", overflow:"hidden",
background:"#0b0b0d",
display:"flex", flexDirection:"column", justifyContent:"flex-end",
padding: isMobile?"24px":"48px",
minHeight: isMobile?"260px":"auto",
}}>
{/* Background image via Unsplash (free, no auth needed) */}
<div style={{
position:"absolute", inset:0,
backgroundImage:"url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgc
backgroundSize:"cover", backgroundPosition:"center center",
filter:"brightness(0.50) contrast(1.08) saturate(0.80)",
}} />
{/* Gradient overlay */}
<div style={{
position:"absolute", inset:0,
background:"linear-gradient(to top, #0b0b0d 25%, rgba(11,11,13,0.1) 60%, rgba(11,11
}} />
{/* Accent glow */}
<div style={{
position:"absolute", top:"-20%", right:"-10%",
width:"60%", height:"60%",
background:"radial-gradient(circle, rgba(203,251,69,0.08) 0%, transparent 70%)",
pointerEvents:"none",
}} />
{/* Content */}
<div style={{position:"relative", zIndex:2}}>
{/* Kicker */}
<div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
<div style={{width:28, height:2, background:"#CBFB45"}} />
<span style={{fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", colo
Elite Coaching Platform
</span>
</div>
{/* Headline */}
<div style={{
fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,7vw,88px)",
lineHeight:0.9, textTransform:"uppercase", color:"#ECEAE3",
marginBottom:16,
}}>
Re-Establish<br/>
<span style={{color:"#CBFB45"}}>Your</span><br/>
Limits
</div>
{/* Quote */}
<p style={{color:"#8f8f99", fontSize:14, maxWidth:"42ch", lineHeight:1.6, marginBot
{quotes[0]}
</p>
{/* Stats row - hide on very small */}
<div style={{display:"flex", gap:24, flexWrap:"wrap"}}>
{stats.map(s=>(
<div key={s.val}>
<div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:"#CBFB4
<div style={{fontSize:10, textTransform:"uppercase", letterSpacing:"0.15em",
</div>
))}
</div>
</div>
</div>
{/* RIGHT — Login Form */}
<div style={{
flex:"1", display:"flex", flexDirection:"column",
justifyContent:"center", padding: isMobile?"24px":"48px",
background:"#09090b",
minHeight: isMobile?"auto":"100vh",
}}>
{/* Logo */}
<div style={{marginBottom: isMobile?24:44}}>
<img src={LOGO_B64} alt="CoachedByNickhee" style={{width:"100%", maxWidth: isMobile
</div>
{/* Welcome text */}
<div style={{marginBottom:32}}>
<div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:"#ECEAE3", le
Welcome Back
</div>
</div>
<div style={{fontSize:13, color:"#8f8f99", lineHeight:1.6}}>Sign in to access your
{/* Form */}
<div style={{marginBottom:14}}>
<label style={{fontSize:10, fontWeight:700, color:"#65656e", textTransform:"upperca
<input style={{...S.input, fontSize:15}} value={email} onChange={e=>setEmail(e.targ
placeholder="your@email.com" type="email" onKeyDown={e=>e.key==="Enter"&&submit()
</div>
<div style={{marginBottom:8}}>
<label style={{fontSize:10, fontWeight:700, color:"#65656e", textTransform:"upperca
<input style={{...S.input, fontSize:15}} value={password} onChange={e=>setPassword(
placeholder="••••••••" type="password" onKeyDown={e=>e.key==="Enter"&&submit()} /
</div>
{error && <div style={{color:"#ff6b6b", fontSize:13, marginBottom:8, fontWeight:600}}
<button style={{
...S.btn, width:"100%", marginTop:16, padding:"14px 20px",
fontSize:15, letterSpacing:"0.1em", textTransform:"uppercase",
}} onClick={submit} disabled={loading}>
{loading ? "Signing in…" : "Sign In →"}
</button>
<div style={{marginTop:32, fontSize:12, color:"#65656e", lineHeight:1.7}}>
Contact your coach if you need login details.
</div>
{/* Bottom accent */}
<div style={{marginTop:"auto", paddingTop:48, display:"flex", alignItems:"center", ga
<div style={{width:20, height:1, background:"rgba(255,255,255,0.1)"}} />
<span style={{fontSize:10, color:"#65656e", letterSpacing:"0.2em", textTransform:"u
</div>
</div>
</div>
);
}
// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
export default function App() {
const [clients, setClients] = useState([]);
const [programs, setPrograms] = useState([]);
const [nutrition, setNutrition] = useState({});
const [measurements, setMeasurements] = useState({});
const [checkins, setCheckins] = useState({});
const [habits, setHabits] = useState({});
const [habitLogs, setHabitLogs] = useState({});
const [user, setUser] = useState(null);
const [authChecked, setAuthChecked] = useState(false);
const [loading, setLoading] = useState(false);
const workoutLog = useWorkoutLog();
// Load all data from Supabase
const loadData = async () => {
try {
const [c, p] = await Promise.all([
sb.get("clients", "?order=created_at"),
sb.get("programs", "?order=created_at"),
]);
setClients(c || []);
setPrograms((p || []).map(prog => ({
...prog,
assignedTo: prog.assigned_to || [],
days: prog.days || [],
})));
} catch(e) { console.error("Load error:", e); }
};
useEffect(() => { loadData(); }, []);
// Given a logged-in auth user, figure out if they're the coach or a client.
const resolveUser = async (authUser) => {
if (!authUser) return null;
// Is this auth user registered as a coach?
try {
const coachRows = await sb.get("coaches", `?user_id=eq.${authUser.id}`);
if (coachRows && coachRows.length > 0) return { role: "coach", authId: authUser.id };
} catch (e) { console.error("coach check failed:", e); }
// Otherwise, find their client row by user_id
try {
const clientRows = await sb.get("clients", `?user_id=eq.${authUser.id}`);
if (clientRows && clientRows.length > 0) return { role: "client", id: clientRows[0].id,
} catch (e) { console.error("client lookup failed:", e); }
return null;
};
// Restore session on page load
useEffect(() => {
(async () => {
try {
const { data } = await supabase.auth.getSession();
if (data?.session?.user) {
const resolved = await resolveUser(data.session.user);
setUser(resolved);
}
} catch (e) { console.error("session restore failed:", e); }
setAuthChecked(true);
})();
}, []);
const login = async (email, password) => {
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error || !data?.user) return false;
const resolved = await resolveUser(data.user);
if (!resolved) {
// Authenticated but not linked to a coach or client record
await supabase.auth.signOut();
return false;
}
setUser(resolved);
return true;
};
const logout = async () => {
await supabase.auth.signOut();
setUser(null);
};
// Wrapped setters that sync to Supabase
const addClient = async (clientData) => {
try {
const toSave = {...clientData, client_password: clientData.password}; delete toSave.pas
if (result && result[0]) setClients(prev => [...prev, result[0]]);
} catch(e) { alert("Error saving client: " + e.message); }
};
const updateClient = async (id, data) => {
try {
await sb.patch("clients", data, `?id=eq.${id}`);
setClients(prev => prev.map(c => c.id === id ? {...c, ...data} : c));
} catch(e) { alert("Error updating client: " + e.message); }
};
const removeClient = async (id) => {
try {
await sb.delete("clients", `?id=eq.${id}`);
setClients(prev => prev.filter(c => c.id !== id));
} catch(e) { alert("Error removing client: " + e.message); }
};
const addProgram = async (progData) => {
try {
const toSave = { name: progData.name, tag: progData.tag, color: progData.color, days: [
const result = await sb.post("programs", toSave);
if (result && result[0]) setPrograms(prev => [...prev, {...result[0], assignedTo: [], d
} catch(e) { alert("Error saving program: " + e.message); }
};
const updateProgram = async (prog) => {
try {
const toSave = { name: prog.name, tag: prog.tag, color: prog.color, days: prog.days, as
await sb.patch("programs", toSave, `?id=eq.${prog.id}`);
setPrograms(prev => prev.map(p => p.id === prog.id ? prog : p));
} catch(e) { console.error("Error updating program:", e); }
};
const deleteProgram = async (progId) => {
try {
await sb.delete("programs", `?id=eq.${progId}`);
setPrograms(prev => prev.filter(p => p.id !== progId));
} catch(e) { alert("Error deleting program: " + e.message); }
};
const assignProgram = async (programId, clientId) => {
const prog = programs.find(p => p.id === programId);
if (!prog) return;
const newAssigned = [...(prog.assignedTo || []), clientId];
await updateProgram({...prog, assignedTo: newAssigned});
};
const saveNutrition = async (clientId, data) => {
try {
// data has an id already (new or existing)
const existing = await sb.get("nutrition_plans", `?id=eq.${data.id}`);
if (existing && existing.length > 0) {
await sb.patch("nutrition_plans", { ...data, updated_at: new Date().toISOString() },
} else {
await sb.post("nutrition_plans", { ...data, client_id: clientId });
}
setNutrition(prev => {
const current = prev[clientId] || [];
const exists = current.find(p => p.id === data.id);
const updated = exists ? current.map(p => p.id === data.id ? data : p) : [...current,
return { ...prev, [clientId]: updated };
});
} catch(e) { alert("Error saving nutrition plan: " + e.message); }
};
const deleteNutrition = async (clientId, planId) => {
try {
await sb.delete("nutrition_plans", `?id=eq.${planId}`);
setNutrition(prev => ({ ...prev, [clientId]: (prev[clientId]||[]).filter(p => p.id !==
} catch(e) { alert("Error deleting nutrition plan: " + e.message); }
};
const setActiveNutrition = async (clientId, planId) => {
try {
// Deactivate all plans for this client, then activate the chosen one
await sb.patch("nutrition_plans", { is_active: false }, `?client_id=eq.${clientId}`);
await sb.patch("nutrition_plans", { is_active: true }, `?id=eq.${planId}`);
setNutrition(prev => ({
...prev,
[clientId]: (prev[clientId]||[]).map(p => ({ ...p, is_active: p.id === planId }))
}));
} catch(e) { alert("Error setting active plan: " + e.message); }
};
const loadNutrition = async (clientId) => {
if (nutrition[clientId] !== undefined) return;
try {
const result = await sb.get("nutrition_plans", `?client_id=eq.${clientId}&order=created
setNutrition(prev => ({ ...prev, [clientId]: result || [] }));
} catch(e) { console.error("Error loading nutrition:", e); }
};
const saveMeasurement = async (clientId, data) => {
try {
await sb.post("measurements", {...data, client_id: clientId});
setMeasurements(prev => ({...prev, [clientId]: [...(prev[clientId]||[]), data]}));
} catch(e) { console.error("Error saving measurement:", e); }
};
const loadMeasurements = async (clientId) => {
if (measurements[clientId]) return;
try {
const result = await sb.get("measurements", `?client_id=eq.${clientId}&order=date.desc`
if (result) setMeasurements(prev => ({...prev, [clientId]: result}));
} catch(e) { console.error("Error loading measurements:", e); }
};
if (!authChecked) return null;
if (!user) return <Login onLogin={login} />;
// ── Check-in functions ──
const saveCheckin = async (clientId, data) => {
try {
const existing = await sb.get("checkins", `?client_id=eq.${clientId}&week_start=eq.${da
if (existing && existing.length > 0) {
await sb.patch("checkins", data, `?client_id=eq.${clientId}&week_start=eq.${data.week
} else {
await sb.post("checkins", {...data, client_id: clientId});
}
setCheckins(prev => ({...prev, [clientId]: [...(prev[clientId]||[]).filter(c=>c.week_st
} catch(e) { console.error("Error saving checkin:", e); }
};
const loadCheckins = async (clientId) => {
if (checkins[clientId]) return;
try {
const result = await sb.get("checkins", `?client_id=eq.${clientId}&order=week_start.des
if (result) setCheckins(prev => ({...prev, [clientId]: result}));
} catch(e) { console.error("Error loading checkins:", e); }
};
// ── Habit functions ──
const saveHabits = async (clientId, habitList) => {
try {
const existing = await sb.get("habits", `?client_id=eq.${clientId}`);
if (existing && existing.length > 0) {
await sb.patch("habits", {habits: habitList, updated_at: new Date().toISOString()}, `
} else {
await sb.post("habits", {client_id: clientId, habits: habitList});
}
setHabits(prev => ({...prev, [clientId]: habitList}));
} catch(e) { console.error("Error saving habits:", e); }
};
const loadHabits = async (clientId) => {
if (habits[clientId]) return;
try {
const result = await sb.get("habits", `?client_id=eq.${clientId}`);
if (result && result[0]) setHabits(prev => ({...prev, [clientId]: result[0].habits || [
else setHabits(prev => ({...prev, [clientId]: []}));
} catch(e) { console.error("Error loading habits:", e); }
};
const saveHabitLog = async (clientId, date, completions) => {
try {
const existing = await sb.get("habit_logs", `?client_id=eq.${clientId}&date=eq.${date}`
if (existing && existing.length > 0) {
await sb.patch("habit_logs", {completions}, `?client_id=eq.${clientId}&date=eq.${date
} else {
await sb.post("habit_logs", {client_id: clientId, date, completions});
}
setHabitLogs(prev => ({...prev, [clientId]: {...(prev[clientId]||{}), [date]: completio
} catch(e) { console.error("Error saving habit log:", e); }
};
const loadHabitLogs = async (clientId) => {
try {
if (result) {
const result = await sb.get("habit_logs", `?client_id=eq.${clientId}&order=date.desc&li
const byDate = {};
result.forEach(r => { byDate[r.date] = r.completions; });
setHabitLogs(prev => ({...prev, [clientId]: byDate}));
}
} catch(e) { console.error("Error loading habit logs:", e); }
};
if (user.role === "coach") return (
<CoachApp clients={clients} programs={programs} nutrition={nutrition}
addClient={addClient} updateClient={updateClient} removeClient={removeClient}
addProgram={addProgram} updateProgram={updateProgram} assignProgram={assignProgram} del
saveNutrition={saveNutrition} deleteNutrition={deleteNutrition} setActiveNutrition={set
measurements={measurements} saveMeasurement={saveMeasurement} loadMeasurements={loadMea
checkins={checkins} loadCheckins={loadCheckins}
habits={habits} saveHabits={saveHabits} loadHabits={loadHabits}
workoutLog={workoutLog} onLogout={logout} />
);
const clientData = clients.find(c => c.id === user.id);
const clientPlans = nutrition[user.id] || [];
const activePlan = clientPlans.find(p => p.is_active) || null;
return <ClientApp client={clientData} programs={programs}
nutrition={activePlan} workoutLog={workoutLog}
loadNutrition={() => loadNutrition(user.id)}
measurements={measurements[user.id]||[]} loadMeasurements={() => loadMeasurements(user.id
checkins={checkins[user.id]||[]} saveCheckin={(d) => saveCheckin(user.id, d)} loadCheckin
habits={habits[user.id]||[]} saveHabitLog={(date,c) => saveHabitLog(user.id, date, c)}
habitLogs={habitLogs[user.id]||{}} loadHabitLogs={() => loadHabitLogs(user.id)}
onLogout={logout} />;
}
