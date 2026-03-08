import { useState } from "react";

// ─── Paleta de diseño ──────────────────────────────────────────────────────
const T = {
  bg:          "#080b10",
  surface:     "#0e1320",
  surface2:    "#141b2d",
  border:      "rgba(255,255,255,0.06)",
  accent:      "#e8ff47",
  accent2:     "#ff4d6d",
  accent3:     "#47c5ff",
  text:        "#e8eaf0",
  muted:       "#6b7280",
  fontDisplay: "'Syne', sans-serif",
  fontMono:    "'DM Mono', monospace",
};

// ─── Datos de preguntas ────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: "nombre_real",
    text: "¿Usás tu nombre real en tus redes sociales?",
    category: "identidad",
    options: [
      { label: "Sí, en todas",       value: "alto",  weight: 15 },
      { label: "Solo en algunas",     value: "medio", weight: 8  },
      { label: "No, uso seudónimo",   value: "bajo",  weight: 0  },
    ],
  },
  {
    id: "foto_perfil",
    text: "¿Tu foto de perfil muestra claramente tu cara?",
    category: "identidad",
    options: [
      { label: "Sí, en la mayoría",  value: "alto",  weight: 12 },
      { label: "Solo en una red",     value: "medio", weight: 6  },
      { label: "No uso fotos reales", value: "bajo",  weight: 0  },
    ],
  },
  {
    id: "ubicacion_perfil",
    text: "¿Tu perfil muestra en qué ciudad o país vivís?",
    category: "ubicacion",
    options: [
      { label: "Sí, ciudad exacta",    value: "alto",  weight: 18 },
      { label: "Solo el país",          value: "medio", weight: 7  },
      { label: "No muestro ubicación",  value: "bajo",  weight: 0  },
    ],
  },
  {
    id: "instagram_privado",
    text: "¿Tu cuenta de Instagram es pública?",
    category: "redes sociales",
    options: [
      { label: "Sí, pública",                       value: "alto",  weight: 14 },
      { label: "Privada pero con muchos seguidores", value: "medio", weight: 5  },
      { label: "Privada y selectiva",                value: "bajo",  weight: 0  },
    ],
  },
  {
    id: "lugar_trabajo",
    text: "¿Tenés publicado tu lugar de trabajo o estudio?",
    category: "identidad",
    options: [
      { label: "Sí, con nombre exacto", value: "alto",  weight: 13 },
      { label: "Solo el rubro/área",     value: "medio", weight: 5  },
      { label: "No lo publico",          value: "bajo",  weight: 0  },
    ],
  },
  {
    id: "checkins",
    text: "¿Publicás fotos con ubicación activada o hacés check-in en lugares?",
    category: "ubicacion",
    options: [
      { label: "Frecuentemente", value: "alto",  weight: 16 },
      { label: "A veces",         value: "medio", weight: 7  },
      { label: "Nunca",           value: "bajo",  weight: 0  },
    ],
  },
  {
    id: "numero_telefono",
    text: "¿Tu número de teléfono está visible en algún perfil público?",
    category: "contacto",
    options: [
      { label: "Sí",                     value: "alto",  weight: 20 },
      { label: "Solo en grupos privados", value: "medio", weight: 8  },
      { label: "No",                      value: "bajo",  weight: 0  },
    ],
  },
  {
    id: "contrasenas",
    text: "¿Usás la misma contraseña en varias plataformas?",
    category: "hábitos digitales",
    options: [
      { label: "Sí, en la mayoría",   value: "alto",  weight: 14 },
      { label: "En algunas",           value: "medio", weight: 6  },
      { label: "No, todas distintas",  value: "bajo",  weight: 0  },
    ],
  },
  {
    id: "email_publico",
    text: "¿Tu email personal aparece en algún sitio público (bio, GitHub, etc.)?",
    category: "contacto",
    options: [
      { label: "Sí",                     value: "alto",  weight: 11 },
      { label: "Uso un email secundario", value: "medio", weight: 4  },
      { label: "No",                      value: "bajo",  weight: 0  },
    ],
  },
  {
    id: "fotos_hogar",
    text: "¿Publicás fotos donde se ve el exterior o interior de tu casa?",
    category: "ubicacion",
    options: [
      { label: "Sí, seguido", value: "alto",  weight: 17 },
      { label: "Alguna vez",   value: "medio", weight: 7  },
      { label: "Nunca",        value: "bajo",  weight: 0  },
    ],
  },
];

// ─── Score ─────────────────────────────────────────────────────────────────
function calcularScore(answers) {
  const maxPosible = QUESTIONS.reduce((sum, q) =>
    sum + Math.max(...q.options.map((o) => o.weight)), 0);
  const total = Object.values(answers).reduce((sum, w) => sum + w, 0);
  const score = Math.round((total / maxPosible) * 100);
  const factores = [...new Set(
    QUESTIONS.filter((q) => answers[q.id] !== undefined && answers[q.id] >= 10)
             .map((q) => q.category)
  )];
  const nivel = score >= 75 ? "crítico" : score >= 50 ? "alto" : score >= 25 ? "medio" : "bajo";
  return { score, nivel, factores };
}

// ─── Niveles ───────────────────────────────────────────────────────────────
const NIVEL_CONFIG = {
  bajo:    { color: T.accent,  label: "Bajo",    desc: "¡Excelente! Tu huella digital está bien controlada."             },
  medio:   { color: T.accent3, label: "Medio",   desc: "Tu exposición es moderada. Hay margen para mejorar."             },
  alto:    { color: T.accent2, label: "Alto",    desc: "Tenés varios factores de riesgo que deberías revisar."           },
  crítico: { color: T.accent2, label: "Crítico", desc: "Tu exposición digital es muy alta. Tomá medidas urgentes."       },
};

// ─── Componente ────────────────────────────────────────────────────────────
export default function ExposureTest() {
  const [step,       setStep]       = useState(0);
  const [answers,    setAnswers]    = useState({});
  const [selected,   setSelected]   = useState(null);
  const [resultado,  setResultado]  = useState(null);

  const totalPreguntas = QUESTIONS.length;
  const preguntaIndex  = step - 1;
  const preguntaActual = QUESTIONS[preguntaIndex];
  const progreso       = step === 0 ? 0 : Math.round((preguntaIndex / totalPreguntas) * 100);

  function handleSiguiente() {
    if (selected === null) return;
    const newAnswers = { ...answers, [preguntaActual.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (preguntaIndex + 1 >= totalPreguntas) {
      const res = calcularScore(newAnswers);
      setResultado(res);
      try { localStorage.setItem("doxcheck_resultado", JSON.stringify(res)); } catch (_) {}
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  }

  // ── INTRO ────────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div style={s.wrap}>
        <div style={s.card}>
          <span style={s.badge}>10 preguntas · ~2 minutos</span>
          <h2 style={s.cardTitle}>Antes de empezar</h2>
          <p style={s.cardDesc}>
            Respondé con honestidad. No guardamos ningún dato personal.
            Todo el procesamiento ocurre en tu navegador.
          </p>
          <ul style={s.featureList}>
            {[
              { icon: "◈", text: "Analizamos tu huella digital",           color: T.accent  },
              { icon: "◉", text: "Calculamos tu score de exposición",       color: T.accent3 },
              { icon: "◆", text: "Te damos recomendaciones personalizadas", color: T.accent2 },
            ].map(({ icon, text, color }) => (
              <li key={text} style={s.featureItem}>
                <span style={{ color, fontSize: "0.95rem" }}>{icon}</span>
                <span style={{ color: T.text, fontSize: "0.88rem" }}>{text}</span>
              </li>
            ))}
          </ul>
          <button style={s.btnPrimario} onClick={() => setStep(1)}>
            Comenzar test →
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTADO ────────────────────────────────────────────────────────────
  if (resultado) {
    const cfg = NIVEL_CONFIG[resultado.nivel];
    return (
      <div style={s.wrap}>
        <div style={{
          ...s.card,
          borderColor: cfg.color + "44",
          boxShadow: `0 0 40px ${cfg.color}22`,
        }}>
          <span style={{ ...s.badge, color: cfg.color, borderColor: cfg.color + "55", background: cfg.color + "12" }}>
            Nivel de riesgo — {cfg.label}
          </span>

          {/* Círculo de score */}
          <div style={{ display: "flex", justifyContent: "center", margin: "0.5rem 0" }}>
            <div style={{ ...s.scoreCircle, borderColor: cfg.color, boxShadow: `0 0 32px ${cfg.color}44` }}>
              <span style={{ fontSize: "2.8rem", fontWeight: 800, color: cfg.color, fontFamily: T.fontDisplay, lineHeight: 1 }}>
                {resultado.score}
              </span>
              <span style={{ fontSize: "0.78rem", color: T.muted, fontFamily: T.fontMono }}>/ 100</span>
            </div>
          </div>

          <p style={{ ...s.cardDesc, textAlign: "center" }}>{cfg.desc}</p>

          {resultado.factores.length > 0 && (
            <div style={s.tagsRow}>
              {resultado.factores.map((f) => (
                <span key={f} style={{ ...s.tag, color: cfg.color, borderColor: cfg.color + "44", background: cfg.color + "0e" }}>
                  {f}
                </span>
              ))}
            </div>
          )}

          <div style={s.botonesRow}>
            <button style={s.btnPrimario} onClick={() => window.location.href = "/recomendaciones"}>
              Ver recomendaciones →
            </button>
            <button style={s.btnSecundario} onClick={() => {
              setStep(0); setAnswers({}); setResultado(null); setSelected(null);
            }}>
              Repetir test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PREGUNTA ─────────────────────────────────────────────────────────────
  return (
    <div style={s.wrap}>
      {/* Progreso */}
      <div style={s.progresoWrapper}>
        <div style={s.progresoTrack}>
          <div style={{ ...s.progresoBar, width: `${progreso}%`, transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
        <span style={s.progresoNum}>
          {preguntaIndex + 1}
          <span style={{ color: T.muted }}>/{totalPreguntas}</span>
        </span>
      </div>

      <div style={s.card}>
        <span style={s.categoria}>{preguntaActual.category}</span>
        <h2 style={s.preguntaTexto}>{preguntaActual.text}</h2>

        <div style={s.opcionesGrid}>
          {preguntaActual.options.map((opcion) => {
            const isOn = selected === opcion.weight;
            return (
              <button
                key={opcion.value}
                style={{ ...s.opcionBtn, ...(isOn ? s.opcionActiva : {}) }}
                onClick={() => setSelected(opcion.weight)}
              >
                <span style={{
                  ...s.radio,
                  background:   isOn ? T.accent : "transparent",
                  borderColor:  isOn ? T.accent : T.muted,
                  boxShadow:    isOn ? `0 0 8px ${T.accent}66` : "none",
                }}>
                  {isOn && <span style={{ color: T.bg, fontSize: "0.6rem", fontWeight: 900, lineHeight: 1 }}>✓</span>}
                </span>
                <span style={{ color: isOn ? T.text : T.muted, transition: "color 0.15s", fontSize: "0.9rem" }}>
                  {opcion.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          style={{ ...s.btnPrimario, opacity: selected === null ? 0.3 : 1, cursor: selected === null ? "not-allowed" : "pointer" }}
          onClick={handleSiguiente}
          disabled={selected === null}
        >
          {preguntaIndex + 1 === totalPreguntas ? "Ver mi resultado →" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}

// ─── Estilos ───────────────────────────────────────────────────────────────
const s = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1.5rem 1rem 4rem",
    fontFamily: T.fontMono,
    background: T.bg,
  },
  card: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: "16px",
    padding: "2.25rem",
    maxWidth: "600px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  badge: {
    display: "inline-block",
    width: "fit-content",
    background: T.surface2,
    color: T.muted,
    border: `1px solid ${T.border}`,
    fontSize: "0.7rem",
    padding: "0.26rem 0.72rem",
    borderRadius: "999px",
    letterSpacing: "0.07em",
    fontFamily: T.fontMono,
  },
  cardTitle: {
    color: T.text,
    fontSize: "1.5rem",
    fontWeight: 700,
    margin: 0,
    fontFamily: T.fontDisplay,
    letterSpacing: "-0.02em",
  },
  cardDesc: {
    color: T.muted,
    fontSize: "0.9rem",
    lineHeight: 1.65,
    margin: 0,
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    background: T.surface2,
    border: `1px solid ${T.border}`,
    borderRadius: "8px",
    padding: "0.6rem 1rem",
  },
  btnPrimario: {
    background: T.accent,
    color: T.bg,
    border: "none",
    borderRadius: "10px",
    padding: "0.88rem 1.75rem",
    fontSize: "0.88rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: T.fontMono,
    letterSpacing: "0.02em",
    transition: "opacity 0.2s",
    alignSelf: "flex-start",
  },
  btnSecundario: {
    background: "transparent",
    color: T.muted,
    border: `1px solid ${T.border}`,
    borderRadius: "10px",
    padding: "0.88rem 1.5rem",
    fontSize: "0.88rem",
    cursor: "pointer",
    fontFamily: T.fontMono,
  },
  botonesRow: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    alignItems: "center",
  },
  progresoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    maxWidth: "600px",
    width: "100%",
    marginBottom: "0.75rem",
  },
  progresoTrack: {
    flex: 1,
    height: "2px",
    background: T.surface2,
    borderRadius: "999px",
    overflow: "hidden",
  },
  progresoBar: {
    height: "100%",
    background: T.accent,
    borderRadius: "999px",
    boxShadow: `0 0 6px ${T.accent}`,
  },
  progresoNum: {
    color: T.text,
    fontSize: "0.76rem",
    fontFamily: T.fontMono,
    fontWeight: 600,
    whiteSpace: "nowrap",
    minWidth: "2.8rem",
    textAlign: "right",
  },
  categoria: {
    color: T.accent3,
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  preguntaTexto: {
    color: T.text,
    fontSize: "1.18rem",
    fontWeight: 600,
    lineHeight: 1.45,
    margin: 0,
    fontFamily: T.fontDisplay,
    letterSpacing: "-0.01em",
  },
  opcionesGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
  },
  opcionBtn: {
    background: T.surface2,
    border: `1px solid ${T.border}`,
    borderRadius: "10px",
    padding: "0.85rem 1rem",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: T.fontMono,
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
  },
  opcionActiva: {
    background: "rgba(232,255,71,0.05)",
    border: `1px solid rgba(232,255,71,0.35)`,
  },
  radio: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "1.5px solid",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },
  scoreCircle: {
    width: "148px",
    height: "148px",
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    transition: "box-shadow 0.3s",
  },
  tagsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
  },
  tag: {
    border: "1px solid",
    borderRadius: "999px",
    padding: "0.22rem 0.7rem",
    fontSize: "0.72rem",
    letterSpacing: "0.06em",
    fontFamily: T.fontMono,
  },
};