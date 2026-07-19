import React from 'react';

// ============================================================
// LANDING PAGE  -  CoachedByNickHee
// Public page shown before sign in. Fill in the PLACEHOLDER
// sections below with your own photos and text.
// ============================================================

const ACCENT = '#d4f542';
const BG = '#0a0a0c';
const CARD = 'rgba(255,255,255,0.04)';
const BORDER = '1px solid rgba(255,255,255,0.08)';
const MUTED = 'rgba(255,255,255,0.55)';

// >>> PLACEHOLDER DATA - replace text and add image URLs <<<
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
    <div style={{ background: BG, color: '#fff', minHeight: '100vh', fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" }}>

      {/* NAV */}
      <nav style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, maxWidth: 1240 }}>
        <div style={{ fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>CoachedByNickHee</div>
        <a onClick={onSignIn} href="#signin"
           onClickCapture={(e) => { e.preventDefault(); onSignIn && onSignIn(); }}
           style={{ color: ACCENT, fontWeight: 700, textDecoration: 'none', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }}>
          Sign In &rarr;
        </a>
      </nav>

      {/* HERO */}
      <header style={{ ...container, paddingTop: 60, paddingBottom: 80 }}>
        <div style={heading}>Elite Coaching Platform</div>
        <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 20px' }}>
          Re-Establish<br /><span style={{ color: ACCENT }}>Your</span><br />Limits
        </h1>
        <p style={{ color: MUTED, fontSize: 18, maxWidth: 560, margin: '0 0 32px' }}>
          {/* PLACEHOLDER: intro line */}
          Real coaching. Real results. Explore client transformations, testimonials and the latest training updates below.
        </p>
        <a href="#signin" onClick={(e) => { e.preventDefault(); onSignIn && onSignIn(); }}
           style={{ display: 'inline-block', background: ACCENT, color: '#000', fontWeight: 800, padding: '16px 40px',
           borderRadius: 4, textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }}>
          Sign In to Your Dashboard &rarr;
        </a>
      </header>

      {/* TESTIMONIALS */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 60 }}>
        <div style={heading}>What Clients Say</div>
        <h2 style={sectionTitle}>Client Testimonials</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 10, padding: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', marginBottom: 16 }}>
                <Photo src={t.img} label="PHOTO" style={{ minHeight: 64 }} />
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 16px', color: 'rgba(255,255,255,0.85)' }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: 14 }}>{t.name}</div>
              <div style={{ color: MUTED, fontSize: 13 }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 60 }}>
        <div style={heading}>Proof It Works</div>
        <h2 style={sectionTitle}>Transformations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {TRANSFORMATIONS.map((t, i) => (
            <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <div style={{ position: 'relative' }}>
                  <Photo src={t.before} label="BEFORE PHOTO" />
                  <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '2px 8px', fontSize: 10, letterSpacing: 1, borderRadius: 3 }}>BEFORE</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Photo src={t.after} label="AFTER PHOTO" />
                  <span style={{ position: 'absolute', top: 8, left: 8, background: ACCENT, color: '#000', padding: '2px 8px', fontSize: 10, letterSpacing: 1, borderRadius: 3, fontWeight: 700 }}>AFTER</span>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.name}</div>
                <div style={{ color: ACCENT, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{t.stat}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRAINING UPDATES */}
      <section style={{ ...container, paddingTop: 40, paddingBottom: 80 }}>
        <div style={heading}>Latest News</div>
        <h2 style={sectionTitle}>Training Updates</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {UPDATES.map((u, i) => (
            <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 10, padding: 24, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ color: ACCENT, fontSize: 13, fontWeight: 700, letterSpacing: 1, minWidth: 120 }}>{u.date}</div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{u.title}</div>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.6, fontSize: 15 }}>{u.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / FOOTER */}
      <footer style={{ borderTop: BORDER, padding: '48px 0' }}>
        <div style={{ ...container, textAlign: 'center' }}>
          <h3 style={{ fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 20px' }}>Ready to start?</h3>
          <a href="#signin" onClick={(e) => { e.preventDefault(); onSignIn && onSignIn(); }}
             style={{ display: 'inline-block', background: ACCENT, color: '#000', fontWeight: 800, padding: '16px 40px',
             borderRadius: 4, textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }}>
            Sign In &rarr;
          </a>
          <div style={{ color: MUTED, fontSize: 13, marginTop: 28 }}>&copy; CoachedByNickHee &middot; Re-establishing limitations, one rep at a time.</div>
        </div>
      </footer>
    </div>
  );
}
