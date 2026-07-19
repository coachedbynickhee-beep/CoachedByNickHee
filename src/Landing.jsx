import React, { useState, useEffect, useRef } from 'react';

// ──────────────────────────────────────────────────────────────
// LANDING PAGE — CoachedByNickHee
// Public page shown before sign in. Fill in the PLACEHOLDER
// sections below with your own photos and text.
// ──────────────────────────────────────────────────────────────

const ACCENT = '#4da3ff';        // luxury sapphire blue
const ACCENT_DEEP = '#2e7de0';   // deeper blue for gradients
const ACCENT_SOFT = 'rgba(77,163,255,0.18)';
const BG = '#0a0a0c';
const CARD = 'rgba(255,255,255,0.04)';
const BORDER = '1px solid rgba(255,255,255,0.08)';
const MUTED = 'rgba(255,255,255,0.55)';

// >>> PLACEHOLDER DATA — replace text and add image URLs <<<
const TESTIMONIALS = [
  { name: 'CLIENT NAME HERE', role: 'e.g. Fat loss client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
  { name: 'CLIENT NAME HERE', role: 'e.g. Strength client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
  { name: 'CLIENT NAME HERE', role: 'e.g. Prep client', quote: 'Testimonial text goes here - paste what your client said about training with you.', img: '' },
];

const TRANSFORMATIONS = [
  { name: 'CLIENT NAME', stat: 'e.g. -12kg in 16 weeks', before: '', after: '' },
  { name: 'CLIENT NAME', stat: 'e.g. +8kg lean mass', before: '', after: '' },
  { name: 'CLIENT NAME', stat: 'e.g. First pull-up achieved', before: '', after: '' },
];

const UPDATES = [
  { date: 'DATE HERE', title: 'TRAINING UPDATE TITLE', body: 'Write your latest training update, programme news or announcement here.' },
  { date: 'DATE HERE', title: 'TRAINING UPDATE TITLE', body: 'Write your latest training update, programme news or announcement here.' },
];

// ── Scroll reveal hook ──────────────────────────────────────────
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

// ── Interactive card with hover lift + blue glow ────────────────
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

// ── Interactive accent button ───────────────────────────────────
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

// ── Text link with animated underline ───────────────────────────
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

function Photo({ src, label, style }) {
  if (src) {
    return <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />;
  }
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.25)', color: MUTED, fontSize: 12,
      letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', padding: 12, ...style }}>
      {label || 'ADD PHOTO'}
    </div>
  );
}

export default function Landing({ onSignIn }) {
  const container = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };
  const heading = { fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: ACCENT, marginBottom: 12, fontWeight: 700 };
  const sectionTitle = { fontSize: 34, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 32px', lineHeight: 1.05 };

  return (
    <div style={{ background: BG, color: '#fff', minHeight: '100vh', fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", position: 'relative', overflow: 'hidden' }}>

      {/* Animated ambient glow + keyframes */}
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

      <div style={{ position: 'relative', zIndex: 1 }}>

      {/* NAV */}
      <nav style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, maxWidth: 1240 }}>
        <div style={{ fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>CoachedByNickHee</div>
        <NavLink onClick={onSignIn}>Sign In &rarr;</NavLink>
      </nav>

      {/* HERO */}
      <header style={{ ...container, paddingTop: 60, paddingBottom: 80 }}>
        <Reveal><div style={heading}>Elite Coaching Platform</div></Reveal>
        <Reveal delay={80}>
          <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 20px' }}>
            Re-Establish<br /><span style={{ background: 'linear-gradient(120deg,' + ACCENT + ',' + ACCENT_DEEP + ')', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Your</span><br />Limits
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p style={{ color: MUTED, fontSize: 18, maxWidth: 560, margin: '0 0 32px' }}>
            {/* PLACEHOLDER: intro line */}
            Real coaching. Real results. Explore client transformations, testimonials and the latest training updates below.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <AccentButton onClick={onSignIn} big>Sign In to Your Dashboard &rarr;</AccentButton>
        </Reveal>
      </header>

      {/* TESTIMONIALS */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 60 }}>
        <Reveal><div style={heading}>What Clients Say</div></Reveal>
        <Reveal delay={60}><h2 style={sectionTitle}>Client Testimonials</h2></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <HoverCard style={{ padding: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', marginBottom: 16 }}>
                  <Photo src={t.img} label="PHOTO" style={{ minHeight: 64 }} />
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 16px', color: 'rgba(255,255,255,0.85)' }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: 14 }}>{t.name}</div>
                <div style={{ color: MUTED, fontSize: 13 }}>{t.role}</div>
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
          {TRANSFORMATIONS.map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <HoverCard style={{ overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div style={{ position: 'relative' }}>
                    <Photo src={t.before} label="BEFORE PHOTO" />
                    <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '2px 8px', fontSize: 10, letterSpacing: 1, borderRadius: 3 }}>BEFORE</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Photo src={t.after} label="AFTER PHOTO" />
                    <span style={{ position: 'absolute', top: 8, left: 8, background: ACCENT, color: '#fff', padding: '2px 8px', fontSize: 10, letterSpacing: 1, borderRadius: 3, fontWeight: 700 }}>AFTER</span>
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.name}</div>
                  <div style={{ color: ACCENT, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{t.stat}</div>
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
          {UPDATES.map((u, i) => (
            <Reveal key={i} delay={i * 90}>
              <HoverCard style={{ padding: 24, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ color: ACCENT, fontSize: 13, fontWeight: 700, letterSpacing: 1, minWidth: 120 }}>{u.date}</div>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{u.title}</div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.6, fontSize: 15 }}>{u.body}</p>
                </div>
              </HoverCard>
            </Reveal>
          ))}
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
