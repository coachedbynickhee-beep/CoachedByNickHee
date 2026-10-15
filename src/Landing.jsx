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
  // Coaching copy + booking links (editable in Coach mode → Edit page)
  online: {
    heroKicker: 'Online & 1-on-1 Coaching',
    heroIntro: 'For people who are done starting over. Train with me in person or be coached online from anywhere — either way you get a fully personalised plan, real accountability and a coach in your corner, so you finally build the body, and the person, you keep promising yourself.',
    ptLocation: 'Sessions are held in person at a time that suits you. Message me for the location and current availability.',
    applyUrl: '',   // paste your Typeform link here (or in Edit page)
    callUrl: '',    // paste your Calendly link here (or in Edit page)
    capacity: 'I only take on a limited number of clients at a time so every one of them gets my full attention. If a spot is open, apply below.',
  },
  hero: {
    kicker: 'Elite Coaching Platform',
    intro: 'Real coaching. Real results. Explore client transformations, testimonials and the latest training updates below.',
  },
  testimonials: [
    { name: 'CLIENT NAME HERE', role: 'e.g. Fat loss client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
    { name: 'CLIENT NAME HERE', role: 'e.g. Strength client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
    { name: 'CLIENT NAME HERE', role: 'e.g. Prep client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
    { name: 'CLIENT NAME HERE', role: 'e.g. Body recomposition client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
    { name: 'CLIENT NAME HERE', role: 'e.g. Competition prep client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
    { name: 'CLIENT NAME HERE', role: 'e.g. 1-on-1 / online coaching client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
  ],
  transformations: [
    { name: 'CLIENT NAME', stat: 'e.g. -12kg in 16 weeks', before: '', after: '' },
    { name: 'CLIENT NAME', stat: 'e.g. +8kg lean mass', before: '', after: '' },
    { name: 'CLIENT NAME', stat: 'e.g. First pull-up achieved', before: '', after: '' },
    { name: 'CLIENT NAME', stat: 'e.g. Down 2 dress sizes', before: '', after: '' },
    { name: 'CLIENT NAME', stat: 'e.g. 8kg squat PB', before: '', after: '' },
    { name: 'CLIENT NAME', stat: 'e.g. 12 week transformation', before: '', after: '' },
  ],
  updates: [
    { date: 'DATE HERE', title: 'TRAINING UPDATE TITLE', body: 'Write your latest training update, programme news or announcement here.' },
    { date: 'DATE HERE', title: 'TRAINING UPDATE TITLE', body: 'Write your latest training update, programme news or announcement here.' },
  ],
};

// Merge saved content over defaults (keeps new default keys if older saved data lacks them)
function mergeContent(data) {
  if (!data) return DEFAULT_CONTENT;
  return { ...DEFAULT_CONTENT, ...data, online: { ...DEFAULT_CONTENT.online, ...(data.online || {}) } };
}

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

// External CTA (Typeform / Calendly). Opens in a new tab.
function LinkButton({ href, children, big, ghost }) {
  const [h, setH] = useState(false);
  const live = !!href;
  return (
    <a href={live ? href : '#apply'} target={live ? '_blank' : undefined} rel={live ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-block', textAlign: 'center', boxSizing: 'border-box',
        background: ghost ? (h ? 'rgba(77,163,255,0.12)' : 'transparent') : (h ? 'linear-gradient(135deg,' + ACCENT + ',' + ACCENT_DEEP + ')' : ACCENT),
        color: '#fff', fontWeight: 800,
        border: ghost ? '1px solid rgba(77,163,255,0.6)' : '1px solid transparent',
        padding: big ? '16px 34px' : '10px 22px',
        borderRadius: 4, textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase', fontSize: big ? 15 : 13,
        cursor: 'pointer',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
        transform: h ? 'translateY(-2px)' : 'none',
        boxShadow: ghost ? 'none' : (h ? '0 12px 30px -6px rgba(77,163,255,0.6)' : '0 4px 14px -6px rgba(77,163,255,0.4)'),
      }}
    >{children}</a>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: BORDER }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          padding: '20px 0', textAlign: 'left', font: 'inherit', fontSize: 16, fontWeight: 700 }}>
        <span>{q}</span>
        <span style={{ color: ACCENT, fontSize: 22, lineHeight: 1, transition: 'transform 0.25s ease', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.65, margin: '0 0 20px', maxWidth: 760 }}>{a}</p>
      </div>
    </div>
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
      if (alive && data) setContent(mergeContent(data));
    });
    return () => { alive = false; };
  }, []);

  const setOnline = (key, val) => setContent((c) => ({ ...c, online: { ...c.online, [key]: val } }));
  const setHero = (key, val) => setContent((c) => ({ ...c, hero: { ...c.hero, [key]: val } }));
  const setItem = (section, idx, key, val) => setContent((c) => {
    const arr = c[section].map((it, i) => i === idx ? { ...it, [key]: val } : it);
    return { ...c, [section]: arr };
  });

  const addItem = (section, template) => setContent((c) => ({ ...c, [section]: [ ...(c[section]||[]), template ] }));

  const removeItem = (section, idx) => setContent((c) => ({ ...c, [section]: (c[section]||[]).filter((_, i) => i !== idx) }));

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
    loadContent().then((data) => setContent(mergeContent(data)));
  };

  const o = content.online || DEFAULT_CONTENT.online;
  const applyHref = o.applyUrl || o.callUrl || '';
  const gradText = { background: 'linear-gradient(120deg,' + ACCENT + ',' + ACCENT_DEEP + ')', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
  const container = { maxWidth: 1200, margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' };
  const heading = { fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: ACCENT, marginBottom: 12, fontWeight: 700 };
  const sectionTitle = { fontSize: 'clamp(26px,5vw,36px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 32px', lineHeight: 1.05 };

  return (
    <div style={{ background: BG, color: '#fff', minHeight: '100vh', fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @keyframes floatGlow { 0%{transform:translate(0,0) scale(1);} 50%{transform:translate(40px,30px) scale(1.15);} 100%{transform:translate(0,0) scale(1);} }
        @media (max-width: 560px) { .cbnh-hide-sm { display: none; } }
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
      <nav style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, maxWidth: 1240, gap: 16 }}>
        <div style={{ fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', fontSize: 'clamp(13px,3.5vw,16px)' }}>CoachedByNickHee</div>
      </nav>

      {/* Coach-only: booking links */}
      {editing && (
        <div style={{ ...container, marginTop: 8 }}>
          <div style={{ border: '1px solid rgba(77,163,255,0.4)', borderRadius: 8, padding: 16, display: 'grid', gap: 10, background: 'rgba(77,163,255,0.06)' }}>
            <div style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: ACCENT, fontWeight: 700 }}>Booking links &amp; details (only you see this)</div>
            <label style={{ fontSize: 13, color: MUTED }}>Typeform application link — used by every "Apply" button
              <EditableText editing value={o.applyUrl} onChange={(v) => setOnline('applyUrl', v.trim())} placeholder="https://form.typeform.com/to/…" style={{ marginTop: 4, color: '#fff' }} />
            </label>
            <label style={{ fontSize: 13, color: MUTED }}>1-on-1 location / availability — shown in the FAQ
              <EditableText editing value={o.ptLocation} onChange={(v) => setOnline('ptLocation', v)} placeholder="e.g. Private studio in Tanjong Pagar, weekday mornings & evenings" style={{ marginTop: 4, color: '#fff' }} />
            </label>
            <label style={{ fontSize: 13, color: MUTED }}>Calendly link — used by every "Book a call" button
              <EditableText editing value={o.callUrl} onChange={(v) => setOnline('callUrl', v.trim())} placeholder="https://calendly.com/…" style={{ marginTop: 4, color: '#fff' }} />
            </label>
          </div>
        </div>
      )}
      {isCoach && !editing && (!o.applyUrl || !o.callUrl) && (
        <div style={{ ...container, marginTop: 8 }}>
          <div style={{ fontSize: 13, color: '#ffcf70', border: '1px solid rgba(255,207,112,0.4)', borderRadius: 8, padding: '10px 14px' }}>
            Your {!o.applyUrl && 'Typeform'}{!o.applyUrl && !o.callUrl && ' and '}{!o.callUrl && 'Calendly'} link {(!o.applyUrl && !o.callUrl) ? 'are' : 'is'} missing — click <b>Edit page</b> to add {(!o.applyUrl && !o.callUrl) ? 'them' : 'it'} so visitors can apply.
          </div>
        </div>
      )}

      {/* HERO */}
      <header style={{ ...container, paddingTop: 56, paddingBottom: 56, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 40, alignItems: 'center' }}>
        <div>
          <Reveal>
            <EditableText tag="div" style={heading} editing={editing}
              value={o.heroKicker} onChange={(v) => setOnline('heroKicker', v)} placeholder="Kicker" />
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontSize: 'clamp(40px,10.5vw,68px)', fontWeight: 900, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 22px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>Re-Establish</span><br /><span style={gradText}>Your</span><br />Limits
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <EditableText tag="p" multiline editing={editing}
              style={{ color: 'rgba(255,255,255,0.72)', fontSize: 18, lineHeight: 1.6, maxWidth: 560, margin: '0 0 32px' }}
              value={o.heroIntro} onChange={(v) => setOnline('heroIntro', v)} placeholder="Who your coaching is for and what changes" />
          </Reveal>
          <Reveal delay={240}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <LinkButton href={applyHref} big>Apply for Coaching &rarr;</LinkButton>
              {o.callUrl && <LinkButton href={o.callUrl} big ghost>Book a Free Call</LinkButton>}
            </div>
            <div style={{ color: MUTED, fontSize: 13, marginTop: 14 }}>Takes 3 minutes. No payment, no pressure — just a conversation about your goals.</div>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <div style={{ position: 'relative', width: '100%', minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div aria-hidden="true" style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%,' + ACCENT + ',' + ACCENT_DEEP + ')', filter: 'blur(4px)', boxShadow: '0 30px 120px ' + ACCENT_SOFT, opacity: 0.85 }} />
            <div aria-hidden="true" style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid ' + ACCENT_SOFT, transform: 'scale(1.35)' }} />
            <div aria-hidden="true" style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid ' + ACCENT_SOFT, transform: 'scale(1.7)' }} />
            {/* "Your week" preview card */}
            <div style={{ position: 'relative', width: 260, background: 'rgba(10,10,12,0.82)', backdropFilter: 'blur(10px)', border: '1px solid rgba(77,163,255,0.35)', borderRadius: 14, padding: 20, boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)' }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 14 }}>Your week, coached</div>
              {[
                ['Training plan', 'Updated for you'],
                ['Nutrition targets', 'Set to your goal'],
                ['Weekly check-in', 'Reviewed by Nick'],
                ['Progress tracked', 'Every week, every lift'],
              ].map(([a, b], k) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: k ? BORDER : 'none' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: ACCENT_SOFT, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, flexShrink: 0 }}>✓</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{a}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </header>

      {/* TRUST STRIP */}
      <div style={{ borderTop: BORDER, borderBottom: BORDER, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ ...container, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, padding: '22px 24px' }}>
          {['In person or online', '1-on-1 attention, every week', 'Coached by Nick, not a bot', 'Plans built around your life'].map((t, k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 700, letterSpacing: 0.3 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />{t}
            </div>
          ))}
        </div>
      </div>

      {/* THE PROBLEM → THE SHIFT */}
      <section style={{ ...container, paddingTop: 80, paddingBottom: 40 }}>
        <Reveal><div style={heading}>Sound Familiar?</div></Reveal>
        <Reveal delay={60}><h2 style={{ ...sectionTitle, maxWidth: 820 }}>You don't need more information. <span style={gradText}>You need a coach.</span></h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 40, alignItems: 'start' }}>
          <Reveal delay={100}>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                'You\'ve tried the apps, the free plans and the 30-day challenges — and ended up back where you started.',
                'You train, but you\'re not sure it\'s working. The scale, the mirror and the gym all say different things.',
                'You start strong on Monday. By the weekend, life has taken over again.',
                'You know what to do. Doing it consistently, on your own, is the hard part.',
              ].map((t, k) => (
                <div key={k} style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.78)', fontSize: 15.5, lineHeight: 1.6 }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 900 }}>—</span><span>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={180}>
            <HoverCard style={{ padding: 28 }}>
              <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 12 }}>The shift</div>
              <p style={{ fontSize: 17, lineHeight: 1.65, margin: '0 0 14px' }}>Lasting change isn't a 12-week sprint. It's becoming the kind of person who trains, eats and recovers well <i>without needing motivation</i>.</p>
              <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0, color: MUTED }}>Coaching — in person or online — gives you the plan, the feedback and the accountability to build those habits — and the confidence that comes with keeping promises to yourself.</p>
            </HoverCard>
          </Reveal>
        </div>
      </section>

      {/* CHOOSE YOUR COACHING */}
      <section style={{ ...container, paddingTop: 60, paddingBottom: 20 }}>
        <Reveal><div style={heading}>Two Ways To Work With Me</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Choose Your Coaching</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {[
            { tag: 'In Person', title: '1-on-1 Personal Training', lead: 'Train side by side with me. Every rep coached, every session planned — the fastest way to learn, lift with confidence and stay accountable.',
              points: ['Private sessions with Nick', 'Hands-on technique coaching on every lift', 'Sessions planned around your goal and progress', 'Nutrition guidance and support between sessions'],
              cta: 'Apply for 1-on-1', featured: false },
            { tag: 'Anywhere', title: 'Online Coaching', lead: 'Your plan, your schedule, your gym — with me reviewing your progress every week and adjusting everything that needs it.',
              points: ['Personalised training & nutrition plan', 'Weekly 1:1 check-ins and feedback', 'Form reviews from your training videos', 'Direct message access to me'],
              cta: 'Apply for Online', featured: true },
          ].map((c, k) => (
            <Reveal key={k} delay={k * 90}>
              <HoverCard style={{ padding: 30, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', ...(c.featured ? { border: '1px solid rgba(77,163,255,0.4)' } : null),
                background: c.featured ? 'linear-gradient(180deg, rgba(77,163,255,0.09), rgba(255,255,255,0.03))' : CARD }}>
                <span style={{ alignSelf: 'flex-start', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: ACCENT, background: ACCENT_SOFT, padding: '4px 10px', borderRadius: 999, marginBottom: 16 }}>{c.tag}</span>
                <div style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>{c.title}</div>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.6, margin: '0 0 18px' }}>{c.lead}</p>
                <div style={{ flex: 1, marginBottom: 22 }}>
                  {c.points.map((t, j) => (
                    <div key={j} style={{ display: 'flex', gap: 12, padding: '7px 0', fontSize: 14.5, lineHeight: 1.5 }}><span style={{ color: ACCENT, fontWeight: 900 }}>✓</span>{t}</div>
                  ))}
                </div>
                <LinkButton href={applyHref} ghost={!c.featured}>{c.cta} &rarr;</LinkButton>
              </HoverCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={150}>
          <p style={{ color: MUTED, fontSize: 14, marginTop: 18 }}>Not sure which suits you? Apply anyway — we'll work it out together on your free call. Many clients combine both.</p>
        </Reveal>
      </section>

      {/* WHAT YOU GET */}
      <section style={{ ...container, paddingTop: 60, paddingBottom: 40 }}>
        <Reveal><div style={heading}>Included Either Way</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Everything You Need. Nothing You Don't.</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {[
            ['Bespoke Training Plan', 'Built around your body, schedule, equipment and goal — gym or home — and adjusted as you progress. Never a template.'],
            ['Nutrition That Fits Your Life', 'Flexible targets and guidance built around foods you actually enjoy, so results don\'t cost you your social life.'],
            ['Weekly Check-Ins', 'Every week I review your training, nutrition, recovery and photos, then tell you exactly what to adjust next.'],
            ['Form & Technique Coaching', 'Coached live in our sessions or through your training videos — clear cues so you train safely and progress faster.'],
            ['Mindset & Habit Coaching', 'Confidence, consistency and a healthier relationship with food and training — the part most plans ignore.'],
            ['Progress You Can See', 'Bodyweight, measurements, photos and strength tracked week to week, so you always know what\'s working.'],
          ].map(([t, d], k) => (
            <Reveal key={k} delay={k * 70}>
              <HoverCard style={{ padding: 28, height: '100%', boxSizing: 'border-box' }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, color: ACCENT, lineHeight: 1, marginBottom: 14, letterSpacing: 1 }}>{String(k + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.01em' }}>{t}</div>
                <p style={{ fontSize: 14, lineHeight: 1.65, margin: 0, color: MUTED }}>{d}</p>
              </HoverCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <section style={{ ...container, paddingTop: 60, paddingBottom: 60 }} id="results">
        <Reveal><div style={heading}>Proof It Works</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Client Transformations</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {content.transformations.map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <HoverCard style={{ overflow: 'hidden' }}>
                {editing && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
                    <button type="button" style={{ background: 'transparent', color: MUTED, border: '1px solid ' + BORDER, borderRadius: 6, padding: '2px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 700 }} onClick={() => removeItem('transformations', i)}>Remove</button>
                  </div>
                )}
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
          {editing && (
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
              <button type="button" style={{ background: 'transparent', color: ACCENT, border: '1px dashed ' + ACCENT, padding: '12px 28px', borderRadius: 8, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', fontSize: 13, cursor: 'pointer' }} onClick={() => addItem('transformations', { name: '', stat: '', before: '', after: '' })}>+ Add Transformation</button>
            </div>
          )}
      </section>


      {/* TESTIMONIALS */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 60 }}>
        <Reveal><div style={heading}>In Their Words</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Client Testimonials</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {content.testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <HoverCard style={{ padding: 24 }}>
                {editing && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
                    <button type="button" style={{ background: 'transparent', color: MUTED, border: '1px solid ' + BORDER, borderRadius: 6, padding: '2px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 700 }} onClick={() => removeItem('testimonials', i)}>Remove</button>
                  </div>
                )}
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
          {editing && (
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
              <button type="button" style={{ background: 'transparent', color: ACCENT, border: '1px dashed ' + ACCENT, padding: '12px 28px', borderRadius: 8, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', fontSize: 13, cursor: 'pointer' }} onClick={() => addItem('testimonials', { name: '', role: '', quote: '', img: '' })}>+ Add Testimonial</button>
            </div>
          )}
      </section>

      {/* WHO IT'S FOR */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 60 }}>
        <Reveal><div style={heading}>Is This For You?</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Coaching Isn't For Everyone</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          <Reveal delay={80}>
            <HoverCard style={{ padding: 28, height: '100%', boxSizing: 'border-box', border: '1px solid rgba(77,163,255,0.35)' }}>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>It's a great fit if you…</div>
              {['Are ready to commit for at least 12 weeks', 'Want a plan built for you, not a PDF', 'Will check in honestly every week — good weeks and bad', 'Care about how you feel and perform, not just the scale', 'Want to learn the "why" so you can keep results for life'].map((t, k) => (
                <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', fontSize: 15, lineHeight: 1.5 }}><span style={{ color: ACCENT, fontWeight: 900 }}>✓</span>{t}</div>
              ))}
            </HoverCard>
          </Reveal>
          <Reveal delay={160}>
            <HoverCard style={{ padding: 28, height: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>It's probably not for you if you…</div>
              {['Want a quick fix or a crash diet', 'Aren\'t willing to track anything', 'Expect results without changing habits', 'Are looking for the cheapest option'].map((t, k) => (
                <div key={k} style={{ display: 'flex', gap: 12, padding: '7px 0', fontSize: 15, lineHeight: 1.5, color: MUTED }}><span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900 }}>✕</span>{t}</div>
              ))}
            </HoverCard>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 60 }}>
        <Reveal><div style={heading}>The Process</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>How It Works</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 28, marginTop: 12 }}>
          {[
            ['Apply', 'Fill in a short application about your goals, history and lifestyle. Takes about 3 minutes.'],
            ['Strategy Call', 'If we look like a good fit, we jump on a free call to map out your goal and pick the right option — online, in person or both.'],
            ['Onboard', 'You receive your personalised plan — and, for 1-on-1 clients, we book in your first session.'],
            ['Train & Progress', 'Train with me or on your own, log every session and check in weekly. I adjust your plan so progress never stalls.'],
          ].map(([t, d], k) => (
            <Reveal key={k} delay={k * 80}>
              <div style={{ position: 'relative', paddingTop: 4 }}>
                <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1, color: ACCENT, opacity: 0.95, marginBottom: 10 }}>{String(k + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.6, color: MUTED }}>{d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 60, maxWidth: 900 }}>
        <Reveal><div style={heading}>Questions</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Coaching FAQ</h2></Reveal>
        <Reveal delay={100}>
          <div style={{ borderTop: BORDER }}>
            <FaqItem q="What's the difference between online and 1-on-1 coaching?" a="1-on-1 means we train together in person — I'm next to you coaching every rep, correcting technique and pushing the pace. Online means you train on your own schedule, anywhere, with a personalised plan and weekly check-ins with me. Both include personalised training, nutrition guidance and progress tracking, and you can combine them." />
            <FaqItem q="Where are 1-on-1 sessions held?" a={o.ptLocation} />
            <FaqItem q="Do I need a gym membership?" a="No. Your plan is built around whatever you have — a full commercial gym, a home setup or minimal equipment. Tell me in your application and I'll programme for it. (For 1-on-1 sessions, we'll train at our agreed location.)" />
            <FaqItem q="I'm a complete beginner. Is this right for me?" a="Yes. Beginners often see the fastest progress with proper coaching. We start at your level, teach you the key movements and build from there." />
            <FaqItem q="How do the weekly check-ins work?" a="Once a week you send me your check-in — weight, measurements, photos, how training and nutrition went, and how you're feeling. I review everything and send back your adjustments and feedback." />
            <FaqItem q="How quickly will I see results?" a="Most clients notice changes in energy, strength and habits within the first few weeks. Visible physique changes depend on your starting point and consistency — which is exactly why I ask for a minimum 12-week commitment." />
            <FaqItem q="How much does it cost?" a="It depends on your goal and the level of support you need. We'll go through the options on your free call, with no pressure to sign up." />
            <FaqItem q="Can I message you between check-ins?" a="Yes. You get direct access to me for questions about training, nutrition or anything that comes up during the week." />
          </div>
        </Reveal>
      </section>

      {/* FINAL APPLY CTA */}
      <section id="apply" style={{ ...container, paddingTop: 40, paddingBottom: 80 }}>
        <Reveal>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, border: '1px solid rgba(77,163,255,0.4)', padding: 'clamp(32px,6vw,64px)', textAlign: 'center',
            background: 'radial-gradient(ellipse at top, rgba(77,163,255,0.22), rgba(10,10,12,0.4) 70%)' }}>
            <div style={heading}>Your Next Step</div>
            <h2 style={{ fontSize: 'clamp(30px,5.5vw,48px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, margin: '0 0 18px' }}>
              Stop Starting Over.<br /><span style={gradText}>Start Being Coached.</span>
            </h2>
            <EditableText tag="p" multiline editing={editing}
              style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, lineHeight: 1.6, maxWidth: 620, margin: '0 auto 30px', display: 'block' }}
              value={o.capacity} onChange={(v) => setOnline('capacity', v)} placeholder="Availability note" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              <LinkButton href={applyHref} big>Apply for Coaching &rarr;</LinkButton>
              {o.callUrl && <LinkButton href={o.callUrl} big ghost>Book a Free Call</LinkButton>}
            </div>
          </div>
        </Reveal>
      </section>

      {/* TRAINING UPDATES */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 80 }}>
        <Reveal><div style={heading}>Free Value, Every Day</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Coaching Tips</h2></Reveal>
        <Reveal delay={100}>
          <div style={{ display: 'inline-block', marginBottom: 24, padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: ACCENT, background: ACCENT_SOFT, border: '1px solid ' + ACCENT_SOFT }}>New Tip Daily</div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {(() => {
              // Two different tips each day: today's tip plus a bonus tip, both rotate at midnight
              const day = Math.floor(Date.now() / 86400000);
              const n = FAT_LOSS_TIPS.length;
              const tips = [
                { label: "Today's Tip", tip: FAT_LOSS_TIPS[day % n] },
                { label: 'Bonus Tip', tip: FAT_LOSS_TIPS[(day + Math.floor(n / 2)) % n] },
              ];
              return tips.map(({ label, tip }, k) => (
                <Reveal key={k} delay={k * 90}>
                  <HoverCard style={{ padding: 26, height: '100%', boxSizing: 'border-box' }}>
                    <div style={{ color: ACCENT, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>{label}</div>
                    <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontSize: 16 }}>{tip.title}</div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.65, fontSize: 15 }}>{tip.body}</p>
                  </HoverCard>
                </Reveal>
              ));
            })()}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: BORDER, padding: '40px 0' }}>
        <div style={{ ...container, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: MUTED, fontSize: 13 }}>&copy; CoachedByNickHee &middot; Re-establishing limits, one rep at a time.</div>
        </div>
      </footer>

      </div>
    </div>
  );
}
