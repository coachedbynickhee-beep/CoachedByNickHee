import { useState, useEffect } from "react";
const LOGO_B64 = null;


// ── Seed Data ────────────────────────────────────────────────────────────────
const COACH = { email: "coach@me.com", password: "coach123", name: "Coach" };

const SEED_NUTRITION = {
  c1: {
    calories: 2250, protein: 130, carbs: 300, fat: 60,
    notes: "Small surplus for lean gain. Carbs concentrated around training. Creatine 5g/day.",
    meals: [
      { id:"m1", name:"Breakfast", description:"3 eggs + 2 whites, oats with banana & honey, black coffee", protein:32, carbs:68, fat:18 },
      { id:"m2", name:"Lunch", description:"Chicken or tofu rice bowl, 1.5 cups rice, stir-fried greens, kimchi", protein:36, carbs:80, fat:13 },
      { id:"m3", name:"Pre-Train", description:"Greek yogurt + berries, or rice cake + whey shake (60–90 min before)", protein:22, carbs:36, fat:3 },
      { id:"m4", name:"Post / Dinner", description:"150g fish or lean beef, 1.5 cups rice or noodles, edamame, vegetables", protein:32, carbs:86, fat:16 },
      { id:"m5", name:"Evening", description:"Cottage cheese or tofu pudding + fruit", protein:18, carbs:30, fat:10 },
    ],
  },
};

const SEED_CLIENTS = [
  { id:"c1", name:"Sarah Lim", email:"sarah@client.com", password:"sarah123", age:32, weight:58, height:162, goal:"Lean muscle gain", programs:["p1"] },
  { id:"c2", name:"Priya Nair", email:"priya@client.com", password:"priya123", age:27, weight:62, height:165, goal:"Strength & tone", programs:[] },
];

const SEED_PROGRAMS = [
  {
    id:"p1", name:"Curve Engine A — Advanced 5-Day", tag:"Advanced · 5 days/week", color:"#CBFB45", assignedTo:["c1"],
    days:[
      { id:"d1", label:"Day 1 — Lower (Glute)", exercises:[
        { id:"e1", name:"Hip Thrust (Smith)", sets:4, reps:"8–12", rest:"90s", notes:"Full extension at top, controlled negative" },
        { id:"e2", name:"Romanian Deadlift", sets:3, reps:"10–12", rest:"90s", notes:"Hinge deep, feel the stretch" },
        { id:"e3", name:"Cable Kickback", sets:3, reps:"15–20", rest:"60s", notes:"Myo-reps on last set" },
        { id:"e4", name:"Seated Abduction", sets:3, reps:"15–20", rest:"60s", notes:"Drop set on final set" },
        { id:"e5", name:"Standing Calf Raise (Smith)", sets:4, reps:"12–15", rest:"60s", notes:"Full stretch at bottom" },
      ]},
      { id:"d2", label:"Day 2 — Upper (Back / Rear Delts)", exercises:[
        { id:"e6", name:"Lat Pulldown", sets:4, reps:"8–12", rest:"90s", notes:"Pull to upper chest, squeeze lats" },
        { id:"e7", name:"Seated Cable Row", sets:3, reps:"10–12", rest:"90s", notes:"Elbows close, full stretch forward" },
        { id:"e8", name:"Face Pull", sets:3, reps:"15–20", rest:"60s", notes:"External rotation at end" },
        { id:"e9", name:"Rear Delt Fly (Pec Deck)", sets:3, reps:"15–20", rest:"60s", notes:"Drop set final set" },
        { id:"e10", name:"Seated Calf Raise", sets:4, reps:"12–15", rest:"60s", notes:"Soleus focus — bent knee" },
      ]},
      { id:"d3", label:"Day 3 — Lower (Quad)", exercises:[
        { id:"e11", name:"Leg Press", sets:4, reps:"10–14", rest:"90s", notes:"High foot placement for glute bias" },
        { id:"e12", name:"Leg Extension", sets:3, reps:"12–15", rest:"60s", notes:"Drop set on final set" },
        { id:"e13", name:"Walking Lunge", sets:3, reps:"12–16/leg", rest:"90s", notes:"Full step, upright torso" },
        { id:"e14", name:"Lying Leg Curl", sets:3, reps:"10–12", rest:"60s", notes:"Lengthened partials after failure" },
        { id:"e15", name:"Standing Calf Raise (Smith)", sets:3, reps:"12–15", rest:"60s", notes:"" },
      ]},
      { id:"d4", label:"Day 4 — Upper (Shoulders)", exercises:[
        { id:"e16", name:"Dumbbell Shoulder Press", sets:4, reps:"8–12", rest:"90s", notes:"Don't lock out at top" },
        { id:"e17", name:"Lateral Raise", sets:4, reps:"15–20", rest:"60s", notes:"Myo-reps on final set" },
        { id:"e18", name:"Cable Lateral Raise", sets:3, reps:"12–15", rest:"60s", notes:"Lengthened partials after failure" },
        { id:"e19", name:"Upright Row (Cable)", sets:3, reps:"12–15", rest:"60s", notes:"Elbows high" },
        { id:"e20", name:"Seated Calf Raise", sets:3, reps:"15–20", rest:"60s", notes:"" },
      ]},
      { id:"d5", label:"Day 5 — Lower (Posterior)", exercises:[
        { id:"e21", name:"Sumo Deadlift", sets:4, reps:"6–10", rest:"120s", notes:"Brace hard, push floor away" },
        { id:"e22", name:"Glute Bridge (Barbell)", sets:3, reps:"12–15", rest:"90s", notes:"Pause 1s at top" },
        { id:"e23", name:"Seated Leg Curl", sets:3, reps:"10–12", rest:"60s", notes:"Lengthened partials after failure" },
        { id:"e24", name:"Hip Abduction Machine", sets:3, reps:"15–20", rest:"60s", notes:"Drop set on final set" },
        { id:"e25", name:"Abs — Cable Crunch", sets:3, reps:"15–20", rest:"60s", notes:"Flex from ribs, not hips" },
      ]},
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const DAY_COLORS = ["#CBFB45","#5BC0FF","#FF6B4A","#B88CFF","#7BE0A0","#F4B740","#FF9F45"];
const fmt = (d) => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
const todayKey = () => new Date().toISOString().slice(0,10);

// ── Workout Log Storage (in-memory, keyed by clientId) ───────────────────────
// Shape: { [clientId]: { [dayId]: [ { date, sets:{ [exId]: [{weight,reps,done}] } } ] } }
const useWorkoutLog = () => {
  const [log, setLog] = useState({});
  const saveSession = (clientId, dayId, sets) => {
    setLog(prev => {
      const clientLog = prev[clientId] || {};
      const dayLog = clientLog[dayId] || [];
      const existing = dayLog.findIndex(s => s.date === todayKey());
      const newEntry = { date: todayKey(), sets };
      const newDayLog = existing >= 0
        ? dayLog.map((s,i) => i === existing ? newEntry : s)
        : [...dayLog, newEntry];
      return { ...prev, [clientId]: { ...clientLog, [dayId]: newDayLog } };
    });
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
  return { log, saveSession, getHistory, getPBs };
};

// ── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [clients, setClients] = useState(SEED_CLIENTS);
  const [programs, setPrograms] = useState(SEED_PROGRAMS);
  const [nutrition, setNutrition] = useState(SEED_NUTRITION);
  const [user, setUser] = useState(null);
  const workoutLog = useWorkoutLog();

  const login = (email, password) => {
    if (email === COACH.email && password === COACH.password) { setUser({ role:"coach" }); return true; }
    const c = clients.find(c => c.email === email && c.password === password);
    if (c) { setUser({ role:"client", id:c.id }); return true; }
    return false;
  };
  const logout = () => setUser(null);

  if (!user) return <Login onLogin={login} />;
  if (user.role === "coach") return (
    <CoachApp clients={clients} setClients={setClients}
      programs={programs} setPrograms={setPrograms}
      nutrition={nutrition} setNutrition={setNutrition}
      workoutLog={workoutLog} onLogout={logout} />
  );
  const clientData = clients.find(c => c.id === user.id);
  return <ClientApp client={clientData} programs={programs}
    nutrition={nutrition[user.id]} workoutLog={workoutLog} onLogout={logout} />;
}

// ── LOGIN ────────────────────────────────────────────────────────────────────
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
  return (
    <div style={S.loginWrap}>
      <div style={S.loginCard}>
        <div style={S.loginLogo}>
          <img src={LOGO_B64} alt="CoachedByNickhee" style={{width:"100%",maxWidth:320,marginBottom:4,objectFit:"contain"}} />
        </div>
        <Field label="Email"><input style={S.input} value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email" onKeyDown={e=>e.key==="Enter"&&submit()} /></Field>
        <Field label="Password"><input style={S.input} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type="password" onKeyDown={e=>e.key==="Enter"&&submit()} /></Field>
        {error && <div style={S.error}>{error}</div>}
        <button style={{...S.btn,width:"100%",marginTop:8}} onClick={submit} disabled={loading}>{loading?"Signing in…":"Sign In →"}</button>
        <div style={S.loginHint}><b>Coach:</b> coach@me.com / coach123<br/><b>Client:</b> sarah@client.com / sarah123</div>
      </div>
    </div>
  );
}

// ── COACH APP ────────────────────────────────────────────────────────────────
function CoachApp({ clients, setClients, programs, setPrograms, nutrition, setNutrition, workoutLog, onLogout }) {
  const [tab, setTab] = useState("clients");
  const [activeClient, setActiveClient] = useState(null);
  const [activeProgram, setActiveProgram] = useState(null);
  const [showNewClient, setShowNewClient] = useState(false);
  const [showNewProgram, setShowNewProgram] = useState(false);

  if (activeProgram) {
    const prog = programs.find(p => p.id === activeProgram);
    return <ProgramBuilder program={prog} setPrograms={setPrograms} onBack={()=>setActiveProgram(null)} />;
  }
  if (activeClient) {
    const c = clients.find(c => c.id === activeClient);
    return <ClientDetail client={c} programs={programs} clients={clients}
      setClients={setClients} setPrograms={setPrograms}
      nutrition={nutrition[c.id]} setNutrition={(n)=>setNutrition(prev=>({...prev,[c.id]:n}))}
      workoutLog={workoutLog}
      onBack={()=>setActiveClient(null)} onOpenProgram={setActiveProgram} />;
  }
  return (
    <div style={S.app}>
      <Topbar title={<img src={LOGO_B64} alt="CoachedByNickhee" style={{height:28,objectFit:"contain"}} />} subtitle="" onLogout={onLogout}
        right={<div style={{display:"flex",gap:8}}>
          <TabBtn label="Clients" active={tab==="clients"} onClick={()=>setTab("clients")} />
          <TabBtn label="Programs" active={tab==="programs"} onClick={()=>setTab("programs")} />
        </div>} />
      <div style={S.content}>
        {tab==="clients" && <>
          <SectionHeader title={`Clients (${clients.length})`} action={<button style={S.btnSm} onClick={()=>setShowNewClient(true)}>+ New Client</button>} />
          <div style={S.grid}>{clients.map(c=><ClientCard key={c.id} client={c} programs={programs} onClick={()=>setActiveClient(c.id)} />)}</div>
        </>}
        {tab==="programs" && <>
          <SectionHeader title={`Programs (${programs.length})`} action={<button style={S.btnSm} onClick={()=>setShowNewProgram(true)}>+ New Program</button>} />
          <div style={S.grid}>{programs.map(p=><ProgramCard key={p.id} program={p} clients={clients} onClick={()=>setActiveProgram(p.id)} />)}</div>
        </>}
      </div>
      {showNewClient && <NewClientModal onClose={()=>setShowNewClient(false)}
        onSave={c=>{setClients(prev=>[...prev,{...c,id:uid(),programs:[]}]);setShowNewClient(false);}} />}
      {showNewProgram && <NewProgramModal onClose={()=>setShowNewProgram(false)}
        onSave={p=>{setPrograms(prev=>[...prev,{...p,id:uid(),days:[],assignedTo:[]}]);setShowNewProgram(false);}} />}
    </div>
  );
}

// ── CLIENT DETAIL (coach view) ────────────────────────────────────────────────
function ClientDetail({ client, programs, clients, setClients, setPrograms, nutrition, setNutrition, workoutLog, onBack, onOpenProgram }) {
  const [tab, setTab] = useState("programs");
  const assigned = programs.filter(p=>p.assignedTo.includes(client.id));
  const unassigned = programs.filter(p=>!p.assignedTo.includes(client.id));

  const assignProgram = (pid) => {
    setPrograms(prev=>prev.map(p=>p.id===pid?{...p,assignedTo:[...p.assignedTo,client.id]}:p));
    setClients(prev=>prev.map(c=>c.id===client.id?{...c,programs:[...c.programs,pid]}:c));
  };

  // Collect all exercises across all assigned programs for PB lookup
  const allExercises = assigned.flatMap(p=>p.days.flatMap(d=>d.exercises));
  const pbs = workoutLog.getPBs(client.id, allExercises);

  return (
    <div style={S.app}>
      <Topbar title={client.name} subtitle={client.goal} onLogout={null}
        left={<button style={S.backBtn} onClick={onBack}>← Back</button>}
        right={<div style={{display:"flex",gap:8}}>
          <TabBtn label="Programs" active={tab==="programs"} onClick={()=>setTab("programs")} />
          <TabBtn label="Nutrition" active={tab==="nutrition"} onClick={()=>setTab("nutrition")} />
          <TabBtn label="Log History" active={tab==="history"} onClick={()=>setTab("history")} />
        </div>} />
      <div style={S.content}>
        <div style={S.statsRow}>
          <Stat label="Age" value={client.age+"y"} /><Stat label="Weight" value={client.weight+"kg"} />
          <Stat label="Height" value={client.height+"cm"} /><Stat label="Programs" value={assigned.length} />
        </div>

        {tab==="programs" && <>
          <SectionHeader title="Assigned Programs" />
          {assigned.length===0 && <Empty text="No programs assigned yet." />}
          <div style={S.grid}>{assigned.map(p=><ProgramCard key={p.id} program={p} clients={clients} onClick={()=>onOpenProgram(p.id)} />)}</div>
          {unassigned.length>0 && <>
            <SectionHeader title="Assign a Program" />
            <div style={S.grid}>{unassigned.map(p=>(
              <div key={p.id} style={S.assignCard}>
                <div style={{...S.programDot,background:p.color}} />
                <div style={S.assignName}>{p.name}</div>
                <button style={S.btnSm} onClick={()=>assignProgram(p.id)}>Assign →</button>
              </div>
            ))}</div>
          </>}
        </>}

        {tab==="nutrition" && <NutritionEditor nutrition={nutrition} onSave={setNutrition} client={client} />}

        {tab==="history" && <CoachLogHistory clientId={client.id} programs={assigned} workoutLog={workoutLog} pbs={pbs} />}
      </div>
    </div>
  );
}

// ── COACH LOG HISTORY ────────────────────────────────────────────────────────
function CoachLogHistory({ clientId, programs, workoutLog, pbs }) {
  const [selProg, setSelProg] = useState(programs[0]?.id || null);
  const [selDay, setSelDay] = useState(null);
  const prog = programs.find(p=>p.id===selProg);

  useEffect(()=>{ setSelDay(null); },[selProg]);

  const day = prog?.days.find(d=>d.id===selDay);
  const history = selDay ? workoutLog.getHistory(clientId, selDay) : [];

  if (programs.length===0) return <Empty text="No programs assigned — assign a program first." />;

  return (
    <div>
      <SectionHeader title="Workout Log History" />
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {programs.map(p=><button key={p.id} style={{...S.tabBtn,...(selProg===p.id?S.tabBtnActive:{})}} onClick={()=>setSelProg(p.id)}>{p.name}</button>)}
      </div>
      {prog && <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {prog.days.map((d,i)=>(
          <button key={d.id} style={{...S.tabBtn,...(selDay===d.id?{...S.tabBtnActive,borderColor:DAY_COLORS[i%DAY_COLORS.length],color:DAY_COLORS[i%DAY_COLORS.length]}:{})}}
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
                      <div key={i} style={S.historySetChip}>{s.weight||"–"}kg × {s.reps||"–"}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </>}
      {!selDay && prog && <Empty text="Select a training day above to view session history." />}
    </div>
  );
}

// ── NUTRITION EDITOR (coach) ──────────────────────────────────────────────────
function NutritionEditor({ nutrition, onSave, client }) {
  const blank = { calories:0, protein:0, carbs:0, fat:0, notes:"", meals:[] };
  const [form, setForm] = useState(nutrition || blank);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const addMeal = () => setForm(p=>({...p,meals:[...p.meals,{id:uid(),name:"New Meal",description:"",protein:0,carbs:0,fat:0}]}));
  const updateMeal = (id,k,v) => setForm(p=>({...p,meals:p.meals.map(m=>m.id===id?{...m,[k]:v}:m)}));
  const deleteMeal = (id) => setForm(p=>({...p,meals:p.meals.filter(m=>m.id!==id)}));

  return (
    <div>
      <SectionHeader title="Nutrition Plan" action={<button style={S.btn} onClick={()=>onSave(form)}>Save Plan</button>} />
      <div style={S.macroGrid}>
        {[["Calories","calories","kcal"],["Protein","protein","g"],["Carbs","carbs","g"],["Fat","fat","g"]].map(([label,key,unit])=>(
          <div key={key} style={S.macroBox}>
            <div style={S.macroLabel}>{label}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:4}}>
              <input style={{...S.input,fontSize:22,fontWeight:800,color:"#CBFB45",background:"transparent",border:"none",width:80,padding:0}}
                type="number" value={form[key]} onChange={e=>f(key,+e.target.value)} />
              <span style={{color:C.muted,fontSize:12}}>{unit}</span>
            </div>
          </div>
        ))}
      </div>
      <Field label="Coach Notes">
        <textarea style={{...S.input,minHeight:72,resize:"vertical"}} value={form.notes} onChange={e=>f("notes",e.target.value)} />
      </Field>
      <SectionHeader title="Meal Plan" action={<button style={S.btnSm} onClick={addMeal}>+ Meal</button>} />
      {form.meals.length===0 && <Empty text="No meals added yet." />}
      {form.meals.map(m=>(
        <div key={m.id} style={S.mealEditorCard}>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input style={{...S.input,flex:2,fontWeight:700}} value={m.name} onChange={e=>updateMeal(m.id,"name",e.target.value)} placeholder="Meal name" />
            <button style={{...S.iconBtn,color:"#ff6b6b"}} onClick={()=>deleteMeal(m.id)}>✕</button>
          </div>
          <textarea style={{...S.input,minHeight:56,resize:"vertical",marginBottom:8}} value={m.description}
            onChange={e=>updateMeal(m.id,"description",e.target.value)} placeholder="Description…" />
          <div style={{display:"flex",gap:8}}>
            {[["P","protein"],["C","carbs"],["F","fat"]].map(([l,k])=>(
              <div key={k} style={{flex:1}}>
                <div style={{fontSize:10,color:C.muted,marginBottom:3}}>{l} (g)</div>
                <input style={{...S.input,textAlign:"center"}} type="number" value={m[k]} onChange={e=>updateMeal(m.id,k,+e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PROGRAM BUILDER ───────────────────────────────────────────────────────────
function ProgramBuilder({ program, setPrograms, onBack }) {
  const [prog, setProg] = useState(program);
  const save = (updated) => { setProg(updated); setPrograms(prev=>prev.map(p=>p.id===updated.id?updated:p)); };
  const addDay = () => save({...prog,days:[...prog.days,{id:uid(),label:`Day ${prog.days.length+1}`,exercises:[]}]});
  const updateDay = (dayId,updated) => save({...prog,days:prog.days.map(d=>d.id===dayId?updated:d)});
  const deleteDay = (dayId) => save({...prog,days:prog.days.filter(d=>d.id!==dayId)});
  return (
    <div style={S.app}>
      <Topbar title={prog.name} subtitle={prog.tag} onLogout={null}
        left={<button style={S.backBtn} onClick={onBack}>← Back</button>}
        right={<span style={{color:"#CBFB45",fontSize:12}}>✓ Auto-saved</span>} />
      <div style={S.content}>
        <SectionHeader title={`Training Days (${prog.days.length})`} action={<button style={S.btnSm} onClick={addDay}>+ Add Day</button>} />
        {prog.days.length===0 && <Empty text="No days yet. Add your first training day." />}
        {prog.days.map((day,di)=>(
          <DayBlock key={day.id} day={day} color={DAY_COLORS[di%DAY_COLORS.length]}
            onChange={u=>updateDay(day.id,u)} onDelete={()=>deleteDay(day.id)} />
        ))}
      </div>
    </div>
  );
}

function DayBlock({ day, color, onChange, onDelete }) {
  const [open, setOpen] = useState(true);
  const [editLabel, setEditLabel] = useState(false);
  const [labelVal, setLabelVal] = useState(day.label);
  const addEx = () => onChange({...day,exercises:[...day.exercises,{id:uid(),name:"New Exercise",sets:3,reps:"10–12",rest:"60s",notes:""}]});
  const updateEx = (exId,field,val) => onChange({...day,exercises:day.exercises.map(e=>e.id===exId?{...e,[field]:val}:e)});
  const deleteEx = (exId) => onChange({...day,exercises:day.exercises.filter(e=>e.id!==exId)});
  const saveLabel = () => { onChange({...day,label:labelVal}); setEditLabel(false); };
  return (
    <div style={{...S.dayBlock,borderLeft:`3px solid ${color}`}}>
      <div style={S.dayHeader} onClick={()=>setOpen(o=>!o)}>
        <div style={S.dayLeft}>
          <span style={{color,fontSize:18,marginRight:8}}>▸</span>
          {editLabel
            ? <input style={{...S.input,padding:"4px 8px",fontSize:14,width:260}} value={labelVal}
                onChange={e=>setLabelVal(e.target.value)} onBlur={saveLabel} onKeyDown={e=>e.key==="Enter"&&saveLabel()}
                onClick={e=>e.stopPropagation()} autoFocus />
            : <span style={S.dayTitle} onClick={e=>{e.stopPropagation();setEditLabel(true)}}>{day.label}</span>
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
        <input style={{...S.exInput,flex:3}} value={ex.name} onChange={e=>onChange("name",e.target.value)} placeholder="Exercise name" />
        <input style={{...S.exInput,flex:1}} value={ex.sets} onChange={e=>onChange("sets",e.target.value)} placeholder="Sets" />
        <input style={{...S.exInput,flex:1.5}} value={ex.reps} onChange={e=>onChange("reps",e.target.value)} placeholder="Reps" />
        <input style={{...S.exInput,flex:1}} value={ex.rest} onChange={e=>onChange("rest",e.target.value)} placeholder="Rest" />
        <input style={{...S.exInput,flex:3}} value={ex.notes} onChange={e=>onChange("notes",e.target.value)} placeholder="Notes…" />
      </div>
      <button style={{...S.iconBtn,color:"#ff6b6b",padding:"4px 6px"}} onClick={onDelete}>✕</button>
    </div>
  );
}

// ── CLIENT APP ────────────────────────────────────────────────────────────────
function ClientApp({ client, programs, nutrition, workoutLog, onLogout }) {
  const [tab, setTab] = useState("training");
  const [activeProg, setActiveProg] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const assigned = programs.filter(p=>p.assignedTo.includes(client.id));

  if (activeDay && activeProg) {
    const prog = programs.find(p=>p.id===activeProg);
    return <DayView day={activeDay} clientId={client.id} workoutLog={workoutLog}
      onBack={()=>setActiveDay(null)} />;
  }
  if (activeProg) {
    const prog = programs.find(p=>p.id===activeProg);
    return <ProgramView program={prog} clientId={client.id} workoutLog={workoutLog}
      onBack={()=>setActiveProg(null)} onSelectDay={d=>{setActiveDay(d);}} />;
  }

  return (
    <div style={S.app}>
      <Topbar title={`Hey, ${client.name.split(" ")[0]} 👋`} subtitle={client.goal} onLogout={onLogout}
        right={<div style={{display:"flex",gap:8}}>
          <TabBtn label="Training" active={tab==="training"} onClick={()=>setTab("training")} />
          <TabBtn label="Nutrition" active={tab==="nutrition"} onClick={()=>setTab("nutrition")} />
          <TabBtn label="History" active={tab==="history"} onClick={()=>setTab("history")} />
        </div>} />
      <div style={S.content}>
        <div style={S.statsRow}>
          <Stat label="Weight" value={client.weight+"kg"} />
          <Stat label="Height" value={client.height+"cm"} />
          <Stat label="Programs" value={assigned.length} />
        </div>

        {tab==="training" && <>
          <SectionHeader title="Your Programs" />
          {assigned.length===0 && <Empty text="Your coach hasn't assigned a program yet." />}
          <div style={S.grid}>{assigned.map(p=>(
            <div key={p.id} style={S.progCard} onClick={()=>setActiveProg(p.id)}>
              <div style={{...S.progAccent,background:p.color}} />
              <div style={S.progName}>{p.name}</div>
              <div style={S.progTag}>{p.tag}</div>
              <div style={S.progDays}>{p.days.length} days · {p.days.reduce((s,d)=>s+d.exercises.length,0)} exercises</div>
              <div style={{...S.btnSm,marginTop:12,display:"inline-block"}}>Open →</div>
            </div>
          ))}</div>
        </>}

        {tab==="nutrition" && <ClientNutritionView nutrition={nutrition} />}

        {tab==="history" && <ClientHistoryView clientId={client.id} programs={assigned} workoutLog={workoutLog} />}
      </div>
    </div>
  );
}

// ── CLIENT NUTRITION VIEW ────────────────────────────────────────────────────
function ClientNutritionView({ nutrition }) {
  if (!nutrition) return (
    <div style={{textAlign:"center",padding:"48px 0"}}>
      <div style={{fontSize:32,marginBottom:12}}>🥗</div>
      <div style={{color:C.muted,fontSize:14}}>Your coach hasn't set a nutrition plan yet.</div>
    </div>
  );
  const { calories, protein, carbs, fat, notes, meals } = nutrition;
  const totP = meals.reduce((s,m)=>s+m.protein,0);
  const totC = meals.reduce((s,m)=>s+m.carbs,0);
  const totF = meals.reduce((s,m)=>s+m.fat,0);
  return (
    <div>
      <SectionHeader title="Your Nutrition Plan" />
      <div style={S.macroGrid}>
        {[["Calories",calories,"kcal","#CBFB45"],["Protein",protein,"g","#5BC0FF"],["Carbs",carbs,"g","#FF6B4A"],["Fat",fat,"g","#B88CFF"]].map(([l,v,u,col])=>(
          <div key={l} style={{...S.macroBox,borderColor:col+"33"}}>
            <div style={{...S.macroLabel,color:col}}>{l}</div>
            <div style={{fontSize:24,fontWeight:800,color:col}}>{v}<span style={{fontSize:13,fontWeight:400,color:C.muted,marginLeft:3}}>{u}</span></div>
          </div>
        ))}
      </div>
      {notes && <div style={S.coachNote}><span style={{color:"#CBFB45",marginRight:6}}>📋</span>{notes}</div>}
      <SectionHeader title="Meal Breakdown" />
      {meals.map(m=>(
        <div key={m.id} style={S.mealViewCard}>
          <div style={S.mealName}>{m.name}</div>
          <div style={S.mealDesc}>{m.description}</div>
          <div style={S.mealMacros}>
            <span style={{color:"#5BC0FF"}}>P {m.protein}g</span>
            <span style={{color:"#FF6B4A"}}>C {m.carbs}g</span>
            <span style={{color:"#B88CFF"}}>F {m.fat}g</span>
            <span style={{color:C.muted}}>{m.protein*4+m.carbs*4+m.fat*9} kcal</span>
          </div>
        </div>
      ))}
      <div style={S.mealTotal}>
        Daily total from meals — P {totP}g · C {totC}g · F {totF}g · {totP*4+totC*4+totF*9} kcal
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

  if (programs.length===0) return <Empty text="No programs assigned yet." />;
  return (
    <div>
      <SectionHeader title="Your Workout History" />
      {programs.length>1 && <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        {programs.map(p=><button key={p.id} style={{...S.tabBtn,...(selProg===p.id?S.tabBtnActive:{})}} onClick={()=>setSelProg(p.id)}>{p.name}</button>)}
      </div>}
      {prog && <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {prog.days.map((d,i)=>(
          <button key={d.id} style={{...S.tabBtn,...(selDay===d.id?{...S.tabBtnActive,borderColor:DAY_COLORS[i%DAY_COLORS.length],color:DAY_COLORS[i%DAY_COLORS.length]}:{})}}
            onClick={()=>setSelDay(selDay===d.id?null:d.id)}>{d.label}</button>
        ))}
      </div>}
      {day && <>
        {/* PBs */}
        {day.exercises.some(ex=>pbs[ex.id]) && <>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Personal Bests</div>
          <div style={S.pbRow}>
            {day.exercises.filter(ex=>pbs[ex.id]).map(ex=>(
              <div key={ex.id} style={S.pbChip}>
                <div style={S.pbVal}>{pbs[ex.id]}kg</div>
                <div style={S.pbName}>{ex.name}</div>
                <div style={S.pbLabel}>🏆 PB</div>
              </div>
            ))}
          </div>
        </>}
        {history.length===0 && <Empty text="No sessions logged for this day yet. Complete a workout to see history." />}
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
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={S.historyExName}>{ex.name}</div>
                    {pbs[ex.id]===best && best>0 && <span style={{fontSize:10,color:"#CBFB45",fontWeight:700}}>🏆 PB</span>}
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
                    {doneSets.map((s,i)=>(
                      <div key={i} style={S.historySetChip}>{s.weight||"–"}kg × {s.reps||"–"}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </>}
      {!selDay && prog && <Empty text="Select a training day to view session history." />}
    </div>
  );
}

// ── PROGRAM VIEW (client) ────────────────────────────────────────────────────
function ProgramView({ program, clientId, workoutLog, onBack, onSelectDay }) {
  const allEx = program.days.flatMap(d=>d.exercises);
  const pbs = workoutLog.getPBs(clientId, allEx);
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
                <div style={{...S.dayTileAccent,background:DAY_COLORS[i%DAY_COLORS.length]}} />
                <div style={S.dayTileName}>{day.label}</div>
                <div style={S.dayTileCount}>{day.exercises.length} exercises</div>
                {lastSession && <div style={{fontSize:10,color:C.muted,marginTop:4}}>Last: {fmt(lastSession.date)}</div>}
                <div style={{color:DAY_COLORS[i%DAY_COLORS.length],fontSize:12,marginTop:8}}>Start →</div>
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
    const sets=[...prev[exId]]; sets[si]={...sets[si],[field]:val}; return {...prev,[exId]:sets};
  });
  const toggleSet = (exId,si) => setLogs(prev=>{
    const sets=[...prev[exId]]; sets[si]={...sets[si],done:!sets[si].done}; return {...prev,[exId]:sets};
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
      <Topbar title={day.label} subtitle={`${completed}/${total} exercises done`} onLogout={null}
        left={<button style={S.backBtn} onClick={onBack}>← Back</button>}
        right={<button style={{...S.btnSm,...(saved?{background:"#7BE0A0"}:{})}} onClick={saveSession}>
          {saved?"✓ Saved!":"💾 Save Session"}
        </button>} />
      <div style={S.content}>
        <div style={S.progressBar}>
          <div style={{...S.progressFill,width:`${total>0?(completed/total)*100:0}%`}} />
        </div>

        {day.exercises.map((ex,i)=>{
          const sets = logs[ex.id]||[];
          const allDone = sets.every(s=>s.done);
          const pb = pbs[ex.id];
          const currentBest = Math.max(...sets.filter(s=>s.done&&s.weight).map(s=>parseFloat(s.weight)||0),0);
          const isNewPB = currentBest > 0 && (!pb || currentBest > pb);
          return (
            <div key={ex.id} style={{...S.workoutCard,flexDirection:"column",opacity:allDone?0.65:1}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                <span style={S.wcNum}>{i+1}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{...S.wcName,textDecoration:allDone?"line-through":"none"}}>{ex.name}</div>
                    {isNewPB && <span style={S.pbBadge}>🏆 New PB!</span>}
                    {!isNewPB && pb && <span style={S.prevPB}>PB {pb}kg</span>}
                  </div>
                  <div style={S.wcMeta}>{ex.sets} sets · {ex.reps} reps · {ex.rest} rest</div>
                  {ex.notes && <div style={S.wcNotes}>{ex.notes}</div>}
                </div>
                {allDone && <span style={{color:"#CBFB45",fontSize:18}}>✓</span>}
              </div>

              <div style={S.setLogWrap}>
                <div style={S.setLogHeader}>
                  <span style={{flex:"0 0 36px"}}>Set</span>
                  <span style={{flex:1}}>Weight (kg)</span>
                  <span style={{flex:1}}>Reps</span>
                  <span style={{flex:"0 0 40px"}}></span>
                </div>
                {sets.map((s,si)=>(
                  <div key={si} style={{...S.setLogRow,background:s.done?"#CBFB4510":"transparent"}}>
                    <span style={{...S.setNum,color:s.done?"#CBFB45":C.muted}}>{si+1}</span>
                    <input style={{...S.setInput,borderColor:s.done?"#CBFB4550":C.line2}} placeholder="—"
                      value={s.weight} type="number" onChange={e=>updateSet(ex.id,si,"weight",e.target.value)} />
                    <input style={{...S.setInput,borderColor:s.done?"#CBFB4550":C.line2}} placeholder="—"
                      value={s.reps} type="number" onChange={e=>updateSet(ex.id,si,"reps",e.target.value)} />
                    <button style={{...S.checkBtn,width:32,height:32,fontSize:13,
                      background:s.done?"#CBFB45":"transparent",color:s.done?"#000":"#CBFB45"}}
                      onClick={()=>toggleSet(ex.id,si)}>{s.done?"✓":"○"}</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {completed===total && total>0 && (
          <div style={S.doneMsg}>
            🎉 Session complete!<br/>
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
  const [form, setForm] = useState({name:"",email:"",password:"",age:"",weight:"",height:"",goal:""});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return (
    <Modal title="New Client" onClose={onClose} onSave={()=>onSave({...form,age:+form.age,weight:+form.weight,height:+form.height})}>
      <Field label="Name"><input style={S.input} value={form.name} onChange={e=>f("name",e.target.value)} /></Field>
      <Field label="Email"><input style={S.input} value={form.email} onChange={e=>f("email",e.target.value)} type="email" /></Field>
      <Field label="Password"><input style={S.input} value={form.password} onChange={e=>f("password",e.target.value)} /></Field>
      <div style={{display:"flex",gap:8}}>
        <Field label="Age"><input style={S.input} value={form.age} onChange={e=>f("age",e.target.value)} type="number" /></Field>
        <Field label="Weight (kg)"><input style={S.input} value={form.weight} onChange={e=>f("weight",e.target.value)} type="number" /></Field>
        <Field label="Height (cm)"><input style={S.input} value={form.height} onChange={e=>f("height",e.target.value)} type="number" /></Field>
      </div>
      <Field label="Goal"><input style={S.input} value={form.goal} onChange={e=>f("goal",e.target.value)} /></Field>
    </Modal>
  );
}

function NewProgramModal({ onClose, onSave }) {
  const [form, setForm] = useState({name:"",tag:"",color:"#CBFB45"});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return (
    <Modal title="New Program" onClose={onClose} onSave={()=>onSave(form)}>
      <Field label="Program Name"><input style={S.input} value={form.name} onChange={e=>f("name",e.target.value)} /></Field>
      <Field label="Tag (e.g. Beginner · 3 days/week)"><input style={S.input} value={form.tag} onChange={e=>f("tag",e.target.value)} /></Field>
      <Field label="Accent Color">
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
          {DAY_COLORS.map(c=>(
            <div key={c} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",
              border:form.color===c?"2px solid #fff":"2px solid transparent"}} onClick={()=>f("color",c)} />
          ))}
        </div>
      </Field>
    </Modal>
  );
}

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

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Topbar({ title, subtitle, onLogout, left, right }) {
  return (
    <div style={S.topbar}>
      <div style={S.topbarLeft}>
        {left}
        <div><div style={S.topbarTitle}>{title}</div>{subtitle&&<div style={S.topbarSub}>{subtitle}</div>}</div>
      </div>
      <div style={S.topbarRight}>
        {right}
        {onLogout&&<button style={S.btnGhost} onClick={onLogout}>Sign out</button>}
      </div>
    </div>
  );
}
function TabBtn({ label, active, onClick }) {
  return <button style={{...S.tabBtn,...(active?S.tabBtnActive:{})}} onClick={onClick}>{label}</button>;
}
function SectionHeader({ title, action }) {
  return <div style={S.sectionHeader}><div style={S.sectionTitle}>{title}</div>{action}</div>;
}
function Field({ label, children }) {
  return <div style={S.loginField}><label style={S.label}>{label}</label>{children}</div>;
}
function ClientCard({ client, programs, onClick }) {
  const count = programs.filter(p=>p.assignedTo.includes(client.id)).length;
  return (
    <div style={S.card} onClick={onClick}>
      <div style={S.cardAvatar}>{client.name.split(" ").map(n=>n[0]).join("")}</div>
      <div style={S.cardName}>{client.name}</div>
      <div style={S.cardMeta}>{client.goal}</div>
      <div style={S.cardMeta}>{client.age}y · {client.weight}kg · {client.height}cm</div>
      <div style={S.cardTag}>{count} program{count!==1?"s":""} assigned</div>
    </div>
  );
}
function ProgramCard({ program, clients, onClick }) {
  const count = (program.assignedTo||[]).length;
  return (
    <div style={S.card} onClick={onClick}>
      <div style={{...S.programDot,background:program.color,width:36,height:36,marginBottom:10}} />
      <div style={S.cardName}>{program.name}</div>
      <div style={S.cardMeta}>{program.tag}</div>
      <div style={S.cardMeta}>{program.days.length} days · {program.days.reduce((s,d)=>s+d.exercises.length,0)} exercises</div>
      <div style={S.cardTag}>{count} client{count!==1?"s":""}</div>
    </div>
  );
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

// ── STYLES ────────────────────────────────────────────────────────────────────
const C = { bg:"#0b0b0d", surface:"#141418", surface2:"#1b1b21",
  line:"rgba(255,255,255,.08)", line2:"rgba(255,255,255,.16)",
  text:"#ECEAE3", muted:"#8f8f99", faint:"#65656e", accent:"#CBFB45" };

const S = {
  app:{ background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"system-ui,sans-serif" },
  loginWrap:{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" },
  loginCard:{ background:C.surface, border:`1px solid ${C.line2}`, borderRadius:16, padding:32, width:"100%", maxWidth:380 },
  loginLogo:{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, marginBottom:28 },
  logoMark:{ width:44, height:44, background:"#CBFB45", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, color:"#000", flexShrink:0 },
  logoTitle:{ fontWeight:800, fontSize:18, color:C.text },
  logoSub:{ fontSize:12, color:C.muted },
  loginField:{ marginBottom:14 },
  label:{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:5 },
  input:{ width:"100%", background:C.surface2, border:`1px solid ${C.line2}`, borderRadius:8, color:C.text, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box" },
  btn:{ background:"#CBFB45", color:"#000", border:"none", borderRadius:8, padding:"10px 20px", fontWeight:700, fontSize:14, cursor:"pointer" },
  btnSm:{ background:"#CBFB45", color:"#000", border:"none", borderRadius:6, padding:"6px 14px", fontWeight:700, fontSize:12, cursor:"pointer" },
  btnGhost:{ background:"transparent", color:C.muted, border:`1px solid ${C.line2}`, borderRadius:8, padding:"8px 16px", fontWeight:600, fontSize:13, cursor:"pointer" },
  error:{ color:"#ff6b6b", fontSize:13, marginBottom:8 },
  loginHint:{ marginTop:20, fontSize:11, color:C.faint, lineHeight:1.7, textAlign:"center" },

  topbar:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${C.line}`, background:C.surface, position:"sticky", top:0, zIndex:10, gap:12, flexWrap:"wrap" },
  topbarLeft:{ display:"flex", alignItems:"center", gap:12 },
  topbarRight:{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" },
  topbarTitle:{ fontWeight:800, fontSize:16, color:C.text },
  topbarSub:{ fontSize:11, color:C.muted, marginTop:1 },
  backBtn:{ background:"transparent", color:C.muted, border:"none", cursor:"pointer", fontSize:13, padding:"6px 10px", borderRadius:6 },

  content:{ padding:"20px 16px", maxWidth:900, margin:"0 auto" },
  sectionHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, marginTop:20 },
  sectionTitle:{ fontWeight:700, fontSize:14, color:C.text },

  grid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 },
  card:{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:12, padding:16, cursor:"pointer" },
  cardAvatar:{ width:40, height:40, background:"#CBFB4522", border:"1px solid #CBFB4544", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, color:"#CBFB45", marginBottom:10 },
  cardName:{ fontWeight:700, fontSize:14, marginBottom:4 },
  cardMeta:{ fontSize:12, color:C.muted, marginBottom:2 },
  cardTag:{ fontSize:11, color:"#CBFB45", marginTop:8, fontWeight:600 },

  statsRow:{ display:"flex", gap:10, marginBottom:4 },
  statBox:{ flex:1, background:C.surface, border:`1px solid ${C.line}`, borderRadius:10, padding:"12px 8px", textAlign:"center" },
  statVal:{ fontSize:18, fontWeight:800, color:"#CBFB45" },
  statLabel:{ fontSize:10, color:C.muted, marginTop:2, textTransform:"uppercase", letterSpacing:0.5 },

  programDot:{ width:12, height:12, borderRadius:"50%", marginBottom:6 },
  progCard:{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:12, padding:16, cursor:"pointer" },
  progAccent:{ height:3, borderRadius:2, marginBottom:12 },
  progName:{ fontWeight:700, fontSize:14, marginBottom:4 },
  progTag:{ fontSize:12, color:C.muted, marginBottom:4 },
  progDays:{ fontSize:12, color:C.faint },

  dayGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 },
  dayTile:{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:12, padding:16, cursor:"pointer" },
  dayTileAccent:{ height:3, borderRadius:2, marginBottom:12 },
  dayTileName:{ fontWeight:700, fontSize:13, marginBottom:4 },
  dayTileCount:{ fontSize:12, color:C.muted },

  dayBlock:{ background:C.surface, borderRadius:10, marginBottom:12, overflow:"hidden" },
  dayHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", cursor:"pointer" },
  dayLeft:{ display:"flex", alignItems:"center", gap:6, flex:1 },
  dayTitle:{ fontWeight:700, fontSize:14, cursor:"text" },
  exCount:{ fontSize:11, color:C.muted, marginLeft:6 },
  iconBtn:{ background:"transparent", color:C.muted, border:"none", cursor:"pointer", fontSize:12, padding:"4px 10px", borderRadius:6, fontWeight:600 },
  exList:{ padding:"0 14px 14px" },
  exRow:{ display:"flex", alignItems:"center", gap:8, marginBottom:8 },
  exNum:{ fontWeight:800, fontSize:13, width:18, flexShrink:0 },
  exFields:{ display:"flex", gap:6, flex:1, flexWrap:"wrap" },
  exInput:{ background:C.surface2, border:`1px solid ${C.line2}`, borderRadius:6, color:C.text, padding:"6px 8px", fontSize:12, minWidth:60 },

  workoutCard:{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:10, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"flex-start", gap:12, transition:"opacity .2s" },
  wcNum:{ width:24, height:24, background:"#CBFB4522", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#CBFB45", flexShrink:0, marginTop:2 },
  wcName:{ fontWeight:700, fontSize:14, marginBottom:3 },
  wcMeta:{ fontSize:12, color:C.muted },
  wcNotes:{ fontSize:11, color:C.faint, marginTop:4, fontStyle:"italic" },
  checkBtn:{ border:"1px solid #CBFB45", borderRadius:8, width:36, height:36, cursor:"pointer", fontWeight:700, fontSize:16, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" },

  setLogWrap:{ borderTop:"1px solid rgba(255,255,255,.07)", paddingTop:10, marginTop:4 },
  setLogHeader:{ display:"flex", alignItems:"center", gap:8, marginBottom:6, fontSize:10, fontWeight:700, color:"#65656e", textTransform:"uppercase", letterSpacing:0.8, padding:"0 2px" },
  setLogRow:{ display:"flex", alignItems:"center", gap:8, marginBottom:6, borderRadius:6, padding:"4px 2px", transition:"background .2s" },
  setNum:{ flex:"0 0 36px", fontSize:12, fontWeight:700, textAlign:"center" },
  setInput:{ flex:1, background:"#1b1b21", border:"1px solid", borderRadius:6, color:"#ECEAE3", padding:"6px 8px", fontSize:13, textAlign:"center", outline:"none", minWidth:0, transition:"border-color .2s" },

  progressBar:{ height:4, background:C.line2, borderRadius:2, marginBottom:20, overflow:"hidden" },
  progressFill:{ height:"100%", background:"#CBFB45", borderRadius:2, transition:"width .4s" },
  doneMsg:{ textAlign:"center", padding:"24px 0", color:"#CBFB45", fontWeight:700, fontSize:16 },

  pbBadge:{ fontSize:10, background:"#CBFB4520", color:"#CBFB45", border:"1px solid #CBFB4540", borderRadius:4, padding:"2px 6px", fontWeight:700 },
  prevPB:{ fontSize:10, color:C.faint, fontWeight:600 },
  pbRow:{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 },
  pbChip:{ background:"#CBFB4510", border:"1px solid #CBFB4530", borderRadius:8, padding:"8px 12px", textAlign:"center" },
  pbVal:{ fontSize:18, fontWeight:800, color:"#CBFB45" },
  pbName:{ fontSize:10, color:C.muted, marginTop:2, maxWidth:100, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  pbLabel:{ fontSize:9, color:"#CBFB45", fontWeight:700, marginTop:2 },

  historySession:{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:10, padding:"14px 16px", marginBottom:10 },
  historyDate:{ fontSize:11, fontWeight:700, color:"#CBFB45", marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 },
  historyEx:{ marginBottom:10 },
  historyExName:{ fontSize:13, fontWeight:700, color:C.text },
  historySetChip:{ background:C.surface2, border:`1px solid ${C.line2}`, borderRadius:6, padding:"3px 10px", fontSize:12, color:C.muted },

  assignCard:{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:10, padding:14, display:"flex", alignItems:"center", gap:10 },
  assignName:{ flex:1, fontSize:13, fontWeight:600 },

  macroGrid:{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 },
  macroBox:{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:10, padding:"12px 14px" },
  macroLabel:{ fontSize:10, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 },

  mealEditorCard:{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:10, padding:14, marginBottom:10 },
  mealViewCard:{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:10, padding:14, marginBottom:10 },
  mealName:{ fontWeight:700, fontSize:14, marginBottom:4 },
  mealDesc:{ fontSize:13, color:C.muted, marginBottom:8, lineHeight:1.5 },
  mealMacros:{ display:"flex", gap:12, fontSize:12, fontWeight:600 },
  mealTotal:{ fontSize:11, color:C.faint, textAlign:"center", padding:"12px 0", borderTop:`1px solid ${C.line}`, marginTop:8 },
  coachNote:{ background:"#CBFB4510", border:"1px solid #CBFB4520", borderRadius:8, padding:"10px 14px", fontSize:13, color:C.muted, marginBottom:16, lineHeight:1.5 },

  overlay:{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 },
  modal:{ background:C.surface, border:`1px solid ${C.line2}`, borderRadius:16, width:"100%", maxWidth:420, maxHeight:"90vh", overflow:"auto" },
  modalHeader:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px", borderBottom:`1px solid ${C.line}` },
  modalTitle:{ fontWeight:700, fontSize:15 },
  modalBody:{ padding:"20px 20px 0" },
  modalFooter:{ display:"flex", justifyContent:"flex-end", gap:8, padding:20 },
  empty:{ color:C.faint, textAlign:"center", padding:"24px 0" },
  tabBtn:{ background:"transparent", color:C.muted, border:`1px solid ${C.line}`, borderRadius:6, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:600 },
  tabBtnActive:{ background:"#CBFB4520", color:"#CBFB45", borderColor:"#CBFB4540" },
};
