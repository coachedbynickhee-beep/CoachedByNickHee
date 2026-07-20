import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sb } from './App.jsx';

// Daily-rotating fat-loss training tips (one shown per day, changes at midnight)
const FAT_LOSS_TIPS = [
  { title: 'Build Your Deficit Around Protein', body: 'Anchor a fat-loss phase with a moderate calorie deficit of roughly 300-500 kcal/day and protein at 1.6-2.2g per kg of bodyweight. High protein preserves lean muscle in a deficit and keeps you fuller, so you drop fat while holding onto the size and strength you\'ve built.' },
  { title: 'Keep Lifting Heavy While Cutting', body: 'Don\'t drop your working weights just because you\'re eating less. Maintaining intensity and load on your key compound lifts tells the body to protect muscle. Aim to at least maintain strength on squats, presses and pulls throughout the cut.' },
  { title: 'Let Steps Do the Heavy Lifting', body: 'Daily step targets of 8,000-12,000 burn meaningful calories without the recovery cost of endless cardio. Walking is low-fatigue, easy to sustain, and scales your energy expenditure day after day - a far better long-term fat-loss lever than grinding hours on the treadmill.' },
  { title: 'Protect Your Sleep', body: 'Aim for 7-9 hours of quality sleep. Poor sleep raises hunger hormones, worsens recovery, and makes it harder to hold muscle in a deficit. Consistent sleep is one of the most underrated fat-loss tools you have.' },
  { title: 'Prioritise Progressive Overload', body: 'Fat loss is the goal, but progress in the gym is what keeps muscle on your frame. Keep chasing small wins - an extra rep, a little more load, cleaner technique - so your body has a reason to stay muscular while the fat comes off.' },
  { title: 'Use Refeeds and Diet Breaks', body: 'Long, aggressive deficits blunt performance, mood and hunger control. Schedule periodic higher-carb refeed days or short maintenance diet breaks. These restore training quality and adherence, making the overall cut more sustainable and effective.' },
  { title: 'Front-Load Your Protein', body: 'Spread protein across the day with 3-5 servings of roughly 0.4g per kg each. Even distribution supports muscle protein synthesis and appetite control far better than cramming most of your protein into one meal.' },
  { title: 'Manage Fatigue, Not Just Calories', body: 'Recovery matters more in a deficit. Watch for lingering soreness, poor sleep and stalled lifts - these signal you need to manage volume and rest, not just cut more food. Train hard, but recover harder.' },
  { title: 'Add Cardio Strategically', body: 'Use cardio as a tool, not a punishment. Start with the minimum needed to keep fat loss moving and add more only when progress stalls. This preserves your ability to ramp it up later instead of maxing out early.' },
  { title: 'Track Progress Beyond the Scale', body: 'Bodyweight fluctuates daily with water, food and sleep. Use weekly averages, progress photos, waist measurements and gym performance together. A truer picture keeps you from over-reacting to normal scale noise.' },
  { title: 'Aim for 0.5-1% Bodyweight Per Week', body: 'A sustainable fat-loss rate of about 0.5-1% of bodyweight per week protects muscle and performance. Faster isn\'t better - slower, controlled loss keeps more of your hard-earned size while the fat comes off.' },
  { title: 'Fill Up on Volume Foods', body: 'Lean proteins, vegetables and high-fibre carbs deliver a lot of food for fewer calories. Building meals around these keeps you satisfied in a deficit without blowing your intake - satiety is the secret weapon of an easy cut.' },
  { title: 'Time Carbs Around Training', body: 'Place a larger share of your daily carbs before and after your workouts. This fuels hard training and supports recovery when it matters most, helping you keep intensity high even as overall calories come down.' },
  { title: 'Stay Consistent Over Perfect', body: 'The best fat-loss plan is the one you can repeat. A slightly imperfect approach you follow every week beats a flawless plan you abandon. Consistency across weeks and months is what actually reveals the physique underneath.' }
];


// ──────────────────────────────────────────────────────────────
// LANDING PAGE — CoachedByNickHee
// Content is editable in-page when signed in as the coach.
// Everyone else sees the saved content read-only.
// ──────────────────────────────────────────────────────────────

const ACCENT = '#4da3ff';        // luxury sapphire blue
const ACCENT_DEEP = '#2e7de0';   // deeper blue for gradients
const ACCENT_SOFT = 'rgba(77,163,255,0.18)';
const BG = '#0a0a0c';
const CARD = 'rgba(255,255,255,0.04)';
const BORDER = '1px solid rgba(255,255,255,0.08)';
const MUTED = 'rgba(255,255,255,0.55)';

const DEFAULT_CONTENT = {
  hero: {
    kicker: 'Elite Coaching Platform',
    intro: 'Real coaching. Real results. Explore client transformations, testimonials and the latest training updates below.',
  },
  testimonials: [
    { name: 'CLIENT NAME HERE', role: 'e.g. Fat loss client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
    { name: 'CLIENT NAME HERE', role: 'e.g. Strength client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
    { name: 'CLIENT NAME HERE', role: 'e.g. Prep client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
  ],
  transformations: [
    { name: 'CLIENT NAME', stat: 'e.g. -12kg in 16 weeks', before: '', after: '' },
    { name: 'CLIENT NAME', stat: 'e.g. +8kg lean mass', before: '', after: '' },
    { name: 'CLIENT NAME', stat: 'e.g. First pull-up achieved', before: '', after: '' },
  ],
  updates: [
    { date: 'DATE HERE', title: 'TRAINING UPDATE TITLE', body: 'Write your latest training update, programme news or announcement here.' },
    { date: 'DATE HERE', title: 'TRAINING UPDATE TITLE', body: 'Write your latest training update, programme news or announcement here.' },
  ],
};

function useIsCoach() {
  const [isCoach, setIsCoach] = useState(false);
  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem('cbnh_user');
        const u = raw ? JSON.parse(raw) : null;
        setIsCoach(!!u && u.role === 'coach');
      } catch (e) { setIsCoach(false); }
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);
  return isCoach;
}

async function loadContent() {
  try {
    const rows = await sb.get('landing_content', '?id=eq.1&select=data');
    if (rows && rows.length && rows[0].data && Object.keys(rows[0].data).length) {
      return rows[0].data;
    }
  } catch (e) { /* table may not exist yet – fall back to defaults */ }
  return null;
}

async function saveContent(data) {
  const updated = await sb.patch('landing_content', { data, updated_at: new Date().toISOString() }, '?id=eq.1');
  if (!updated || !updated.length) {
    await sb.post('landing_content', { id: 1, data });
  }
  return true;
}

function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0, style }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} style={{
      transition: 'opacity 0.7s ease, transform 0.7s ease',
      transitionDelay: delay + 'ms',
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : 'translateY(28px)',
      ...style,
    }}>{children}</div>
  );
}

function EditableText({ value, onChange, editing, multiline, placeholder, style, tag }) {
  if (!editing) {
    const Tag = tag || 'span';
    return <Tag style={style}>{value}</Tag>;
  }
  const shared = {
    value: value,
    onChange: (e) => onChange(e.target.value),
    placeholder: placeholder || '',
    style: {
      ...style,
      width: '100%',
      boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(77,163,255,0.5)',
      borderRadius: 6,
      color: 'inherit',
      font: 'inherit',
      padding: '6px 8px',
      outline: 'none',
    },
  };
  return multiline
    ? <textarea rows={3} {...shared} />
    : <input type="text" {...shared} />;
}

function HoverCard({ children, style, hoverStyle }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: CARD,
        border: h ? '1px solid rgba(77,163,255,0.55)' : BORDER,
        borderRadius: 10,
        transition: 'transform 0.35s cubic-bezier(.2,.8,.2,1), box-shadow 0.35s ease, border-color 0.35s ease',
        transform: h ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: h ? '0 18px 40px -12px rgba(77,163,255,0.35)' : '0 0 0 rgba(0,0,0,0)',
        ...style,
        ...(h ? hoverStyle : null),
      }}
    >{children}</div>
  );
}

function AccentButton({ children, onClick, big }) {
  const [h, setH] = useState(false);
  return (
    <a href="#signin" onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-block',
        background: h ? 'linear-gradient(135deg,' + ACCENT + ',' + ACCENT_DEEP + ')' : ACCENT,
        color: '#fff', fontWeight: 800,
        padding: big ? '16px 40px' : '10px 22px',
        borderRadius: 4, textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
        transform: h ? 'translateY(-2px) scale(1.03)' : 'none',
        boxShadow: h ? '0 12px 30px -6px rgba(77,163,255,0.6)' : '0 4px 14px -6px rgba(77,163,255,0.4)',
      }}
    >{children}</a>
  );
}

function NavLink({ children, onClick }) {
  const [h, setH] = useState(false);
  return (
    <a href="#signin"
      onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ color: ACCENT, fontWeight: 700, textDecoration: 'none', fontSize: 14, letterSpacing: 1,
        textTransform: 'uppercase', cursor: 'pointer', position: 'relative', paddingBottom: 4 }}>
      {children}
      <span style={{ position: 'absolute', left: 0, bottom: 0, height: 2, background: ACCENT,
        width: h ? '100%' : '0%', transition: 'width 0.3s ease', borderRadius: 2 }} />
    </a>
  );
}

function Photo({ src, label, style, editing, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const pick = () => { if (inputRef.current) inputRef.current.click(); };
  const onFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setErr(''); setUploading(true);
    try {
      const url = await sb.upload('landing', file);
      onChange(url);
    } catch (ex) {
      setErr('Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {src
        ? <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 64, ...style }} />
        : <div style={{ width: '100%', height: '100%', minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.25)', color: MUTED, fontSize: 12,
            letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', padding: 12, ...style }}>
            {label || 'ADD PHOTO'}
          </div>}
      {editing && (
        <>
          <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
          <button type="button" onClick={(e) => { e.stopPropagation(); pick(); }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: uploading ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.28)', color: '#fff',
              border: '1px solid rgba(77,163,255,0.7)', borderRadius: 4, fontSize: 12, fontWeight: 700,
              letterSpacing: 1, textTransform: 'uppercase', transition: 'background 0.2s ease' }}>
            {uploading ? 'Uploading…' : (err ? err : (src ? 'Change photo' : 'Upload photo'))}
          </button>
        </>
      )}
    </div>
  );
}

export default function Landing({ onSignIn }) {
  const isCoach = useIsCoach();
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let alive = true;
    loadContent().then((data) => {
      if (alive && data) setContent({ ...DEFAULT_CONTENT, ...data });
    });
    return () => { alive = false; };
  }, []);

  const setHero = (key, val) => setContent((c) => ({ ...c, hero: { ...c.hero, [key]: val } }));
  const setItem = (section, idx, key, val) => setContent((c) => {
    const arr = c[section].map((it, i) => i === idx ? { ...it, [key]: val } : it);
    return { ...c, [section]: arr };
  });

  const handleSave = useCallback(async () => {
    setSaving(true); setStatus('');
    try {
      await saveContent(content);
      setStatus('Saved');
      setEditing(false);
      setTimeout(() => setStatus(''), 2500);
    } catch (e) {
      setStatus('Save failed — is the landing_content table set up?');
    } finally {
      setSaving(false);
    }
  }, [content]);

  const handleCancel = () => {
    setEditing(false); setStatus('');
    loadContent().then((data) => setContent(data ? { ...DEFAULT_CONTENT, ...data } : DEFAULT_CONTENT));
  };

  const container = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };
  const heading = { fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: ACCENT, marginBottom: 12, fontWeight: 700 };
  const sectionTitle = { fontSize: 34, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 32px', lineHeight: 1.05 };

  return (
    <div style={{ background: BG, color: '#fff', minHeight: '100vh', fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @keyframes floatGlow { 0%{transform:translate(0,0) scale(1);} 50%{transform:translate(40px,30px) scale(1.15);} 100%{transform:translate(0,0) scale(1);} }
        @keyframes floatGlow2 { 0%{transform:translate(0,0) scale(1);} 50%{transform:translate(-50px,-20px) scale(1.1);} 100%{transform:translate(0,0) scale(1);} }
      `}</style>
      <div aria-hidden style={{ position: 'absolute', top: -180, right: -120, width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle,' + ACCENT_SOFT + ',transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none',
        animation: 'floatGlow 14s ease-in-out infinite', zIndex: 0 }} />
      <div aria-hidden style={{ position: 'absolute', top: 320, left: -160, width: 460, height: 460, borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(46,125,224,0.14),transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none',
        animation: 'floatGlow2 18s ease-in-out infinite', zIndex: 0 }} />

      {isCoach && (
        <div style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 24px', background: 'rgba(10,10,12,0.92)', backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(77,163,255,0.35)' }}>
          <span style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: ACCENT, fontWeight: 700 }}>Coach mode</span>
          <span style={{ flex: 1 }} />
          {status && <span style={{ fontSize: 13, color: MUTED }}>{status}</span>}
          {!editing && (
            <button onClick={() => setEditing(true)}
              style={{ cursor: 'pointer', background: ACCENT, color: '#fff', border: 'none', fontWeight: 700,
                padding: '8px 18px', borderRadius: 5, letterSpacing: 1, textTransform: 'uppercase', fontSize: 12 }}>Edit page</button>
          )}
          {editing && (
            <>
              <button onClick={handleCancel} disabled={saving}
                style={{ cursor: 'pointer', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                  padding: '8px 18px', borderRadius: 5, letterSpacing: 1, textTransform: 'uppercase', fontSize: 12 }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                style={{ cursor: 'pointer', background: ACCENT, color: '#fff', border: 'none', fontWeight: 700,
                  padding: '8px 18px', borderRadius: 5, letterSpacing: 1, textTransform: 'uppercase', fontSize: 12 }}>{saving ? 'Saving…' : 'Save'}</button>
            </>
          )}
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>

      {/* NAV */}
      <nav style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, maxWidth: 1240 }}>
        <div style={{ fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>CoachedByNickHee</div>
        <NavLink onClick={onSignIn}>Sign In &rarr;</NavLink>
      </nav>

      {/* HERO */}
      <header style={{ ...container, paddingTop: 60, paddingBottom: 80, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 40, alignItems: 'center' }}>
        <div>
        <Reveal>
          <EditableText tag="div" style={heading} editing={editing}
            value={content.hero.kicker} onChange={(v) => setHero('kicker', v)} placeholder="Kicker" />
        </Reveal>
        <Reveal delay={80}>
          <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 20px' }}>
            Re-Establish<br /><span style={{ background: 'linear-gradient(120deg,' + ACCENT + ',' + ACCENT_DEEP + ')', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Your</span><br />Limits
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <EditableText tag="p" multiline editing={editing}
            style={{ color: MUTED, fontSize: 18, maxWidth: 560, margin: '0 0 32px' }}
            value={content.hero.intro} onChange={(v) => setHero('intro', v)} placeholder="Intro line" />
        </Reveal>
        <Reveal delay={240}>
          <AccentButton onClick={onSignIn} big>Sign In to Your Dashboard &rarr;</AccentButton>
        </Reveal>
              </div>
        <Reveal delay={200}>
          <div aria-hidden="true" style={{ position: 'relative', width: '100%', minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%,' + ACCENT + ',' + ACCENT_DEEP + ')', filter: 'blur(4px)', boxShadow: '0 30px 120px ' + ACCENT_SOFT }} />
            <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid ' + ACCENT_SOFT, transform: 'scale(1.35)' }} />
            <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid ' + ACCENT_SOFT, transform: 'scale(1.7)' }} />
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: ACCENT_SOFT, top: '12%', right: '8%', filter: 'blur(2px)' }} />
            <div style={{ position: 'relative', fontSize: 64, fontWeight: 900, letterSpacing: 4, textTransform: 'uppercase', background: 'linear-gradient(120deg,' + ACCENT + ',' + ACCENT_DEEP + ')', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CBH</div>
          </div>
        </Reveal>
      </header>

      {/* TESTIMONIALS */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 60 }}>
        <Reveal><div style={heading}>What Clients Say</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Client Testimonials</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {content.testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <HoverCard style={{ padding: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', marginBottom: 16 }}>
                  <Photo src={t.img} label="PHOTO" editing={editing} onChange={(v) => setItem('testimonials', i, 'img', v)} style={{ minHeight: 64 }} />
                </div>
                <EditableText tag="p" multiline editing={editing}
                  style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 16px', color: 'rgba(255,255,255,0.85)' }}
                  value={t.quote} onChange={(v) => setItem('testimonials', i, 'quote', v)} placeholder="Testimonial quote" />
                <EditableText tag="div" editing={editing}
                  style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: 14 }}
                  value={t.name} onChange={(v) => setItem('testimonials', i, 'name', v)} placeholder="Client name" />
                <EditableText tag="div" editing={editing}
                  style={{ color: MUTED, fontSize: 13 }}
                  value={t.role} onChange={(v) => setItem('testimonials', i, 'role', v)} placeholder="Client role" />
              </HoverCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 60 }}>
        <Reveal><div style={heading}>Proof It Works</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Transformations</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {content.transformations.map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <HoverCard style={{ overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div style={{ position: 'relative' }}>
                    <Photo src={t.before} label="BEFORE PHOTO" editing={editing} onChange={(v) => setItem('transformations', i, 'before', v)} />
                    <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '2px 8px', fontSize: 10, letterSpacing: 1, borderRadius: 3 }}>BEFORE</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Photo src={t.after} label="AFTER PHOTO" editing={editing} onChange={(v) => setItem('transformations', i, 'after', v)} />
                    <span style={{ position: 'absolute', top: 8, left: 8, background: ACCENT, color: '#fff', padding: '2px 8px', fontSize: 10, letterSpacing: 1, borderRadius: 3, fontWeight: 700 }}>AFTER</span>
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <EditableText tag="div" editing={editing}
                    style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}
                    value={t.name} onChange={(v) => setItem('transformations', i, 'name', v)} placeholder="Client name" />
                  <EditableText tag="div" editing={editing}
                    style={{ color: ACCENT, fontSize: 14, fontWeight: 600, marginTop: 4 }}
                    value={t.stat} onChange={(v) => setItem('transformations', i, 'stat', v)} placeholder="Result / stat" />
                </div>
              </HoverCard>
            </Reveal>
          ))}
        </div>
      </section>


      {/* TRAINING UPDATES */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 80 }}>
        <Reveal><div style={heading}>Latest News</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Training Updates</h2></Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(() => {
              const _tip = FAT_LOSS_TIPS[Math.floor(Date.now() / 86400000) % FAT_LOSS_TIPS.length];
              const _today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
              return (
                <Reveal>
                  <HoverCard style={{ padding: 24, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ color: ACCENT, fontSize: 13, fontWeight: 700, letterSpacing: 1, minWidth: 120 }}>{_today}</div>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{_tip.title}</div>
                      <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.6 }}>{_tip.body}</p>
                    </div>
                  </HoverCard>
                </Reveal>
              );
            })()}
        </div>
      </section>

      {/* CTA / FOOTER */}
      <footer style={{ borderTop: BORDER, padding: '48px 0' }}>
        <div style={{ ...container, textAlign: 'center' }}>
          <h3 style={{ fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 20px' }}>Ready to start?</h3>
          <AccentButton onClick={onSignIn} big>Sign In &rarr;</AccentButton>
          <div style={{ color: MUTED, fontSize: 13, marginTop: 28 }}>&copy; CoachedByNickHee &middot; Re-establishing limitations, one rep at a time.</div>
        </div>
      </footer>

      </div>
    </div>
  );
}
