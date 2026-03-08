import { useState } from "react";
import { questions } from "./questions";
import { saveResults } from "../../lib/store.js";

// ─── Mapeo de preguntas a factores de riesgo ────────────────────────────────
const QUESTION_RISK_FACTORS = {
  1: "instagram_publico",
  2: "ubicacion_publicada",
  3: "telefono_visible",
  4: "mismo_username",
  6: "fotos_sin_filtro",
  8: "email_visible",
  9: "ubicacion_publicada",
  10: "metadatos_fotos",
};

// ─── Paleta ────────────────────────────────────────────────────────────────
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

function getRiskLevel(score) {
  if (score >= 75) return { label: "Crítico", color: T.accent2, level: "critical" };
  if (score >= 50) return { label: "Alto",    color: T.accent2, level: "high" };
  if (score >= 25) return { label: "Medio",   color: T.accent3, level: "medium" };
  return             { label: "Bajo",    color: T.accent,   level: "low" };
}

function extractRiskFactors(answers) {
  const factors = new Set();
  Object.entries(answers).forEach(([questionId, answer]) => {
    if (answer > 0) { // Si respondió "sí"
      const id = parseInt(questionId);
      const riskFactor = QUESTION_RISK_FACTORS[id];
      if (riskFactor) factors.add(riskFactor);
    }
  });
  return Array.from(factors);
}

// ─── Componente ────────────────────────────────────────────────────────────
export default function ExposureTest() {
  const [current,  setCurrent]  = useState(0);   // índice pregunta actual
  const [answers,  setAnswers]  = useState({});
  const [score,    setScore]    = useState(null);
  const [animDir,  setAnimDir]  = useState(1);   // 1 = avanza, -1 = retrocede

  const total      = questions.length;
  const q          = questions[current];
  const answered   = answers[q?.id] !== undefined;
  const progreso   = Math.round((current / total) * 100);
  const isLast     = current === total - 1;

  const handleAnswer = (riskValue) => {
    const newAnswers = { ...answers, [q.id]: riskValue };
    setAnswers(newAnswers);

    // Avanza automáticamente después de un pequeño delay
    setTimeout(() => {
      if (isLast) {
        // Calcular score en la última pregunta
        const total = Object.values(newAnswers).reduce((sum, v) => sum + v, 0);
        const riskInfo = getRiskLevel(total);
        const riskFactors = extractRiskFactors(newAnswers);
        
        setScore(total);
        
        // Guardar en store.js
        saveResults({
          answers: newAnswers,
          score: total,
          riskLevel: riskInfo.level,
          riskFactors: riskFactors,
        });
      } else {
        setAnimDir(1);
        setCurrent((c) => c + 1);
      }
    }, 350);
  };

  const handleBack = () => {
    if (current === 0) return;
    setAnimDir(-1);
    setCurrent((c) => c - 1);
  };

  // ── RESULTADO ──────────────────────────────────────────────────────────
  if (score !== null) {
    const risk = getRiskLevel(score);
    return (
      <div style={s.wrap}>
        <div style={{ ...s.card, borderColor: risk.color + "44", boxShadow: `0 0 60px ${risk.color}18` }}>

          {/* Badge */}
          <span style={{ ...s.badge, color: risk.color, borderColor: risk.color + "44", background: risk.color + "12" }}>
            Nivel de riesgo — {risk.label}
          </span>

          {/* Score */}
          <div style={{ display: "flex", justifyContent: "center", padding: "1rem 0" }}>
            <div style={{ ...s.scoreCircle, borderColor: risk.color, boxShadow: `0 0 40px ${risk.color}55` }}>
              <span style={{ fontSize: "3rem", fontWeight: 800, color: risk.color, fontFamily: T.fontDisplay, lineHeight: 1 }}>
                {score}
              </span>
              <span style={{ fontSize: "0.75rem", color: T.muted, fontFamily: T.fontMono }}>/ 100</span>
            </div>
          </div>

          {/* Descripción */}
          <p style={{ ...s.desc, textAlign: "center" }}>
            {score >= 75 ? "Tu exposición digital es muy alta. Tomá medidas urgentes."
            : score >= 50 ? "Tenés varios factores de riesgo que deberías revisar."
            : score >= 25 ? "Tu exposición es moderada. Hay margen para mejorar."
            : "¡Excelente! Tu huella digital está bien controlada."}
          </p>

          {/* Desglose rápido */}
          <div style={s.breakdown}>
            {questions.map((q) => (
              <div key={q.id} style={s.breakdownItem}>
                <span style={{ color: T.muted, fontSize: "0.72rem", flex: 1, fontFamily: T.fontMono }}>
                  {q.question.length > 48 ? q.question.slice(0, 48) + "…" : q.question}
                </span>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: answers[q.id] > 0 ? T.accent2 : T.accent,
                  fontFamily: T.fontMono,
                  flexShrink: 0,
                }}>
                  {answers[q.id] > 0 ? `+${answers[q.id]}` : "✓ 0"}
                </span>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div style={s.botonesRow}>

            </button>
            <button style={s.btnSecundario} onClick={() => {
              setAnswers({}); setScore(null); setCurrent(0);
            }}>
              Repetir test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PREGUNTA ────────────────────────────────────────────────────────────
  const isYes = answers[q.id] === q.risk;
  const isNo  = answers[q.id] === 0;

  return (
    <div style={s.wrap}>

      {/* Barra de progreso */}
      <div style={s.progresoOuter}>
        <div style={s.progresoTrack}>
          <div style={{
            ...s.progresoBar,
            width: `${progreso}%`,
            transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
        <span style={s.progresoNum}>
          {current + 1}<span style={{ color: T.muted }}>/{total}</span>
        </span>
      </div>

      {/* Card de pregunta */}
      <div style={s.card}>

        {/* Número grande decorativo */}
        <span style={s.bigNum}>{String(current + 1).padStart(2, "0")}</span>

        {/* Categoría implícita basada en risk */}
        <span style={s.riskChip}>
          riesgo +{q.risk} pts
        </span>

        {/* Pregunta */}
        <h3 style={s.qText}>{q.question}</h3>

        {/* Opciones */}
        <div style={s.opcionesGrid}>
          <button
            style={{ ...s.opcionBtn, ...(isYes ? s.opcionSi : {}) }}
            onClick={() => handleAnswer(q.risk)}
          >
            <span style={{
              ...s.radio,
              background:  isYes ? T.accent2 : "transparent",
              borderColor: isYes ? T.accent2 : T.muted,
              boxShadow:   isYes ? `0 0 8px ${T.accent2}88` : "none",
            }}>
              {isYes && <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 900 }}>✓</span>}
            </span>
            <div>
              <div style={{ color: isYes ? T.accent2 : T.text, fontWeight: 600, fontSize: "0.95rem" }}>Sí</div>
              <div style={{ color: T.muted, fontSize: "0.75rem", marginTop: "2px" }}>Aumenta mi exposición</div>
            </div>
          </button>

          <button
            style={{ ...s.opcionBtn, ...(isNo ? s.opcionNo : {}) }}
            onClick={() => handleAnswer(0)}
          >
            <span style={{
              ...s.radio,
              background:  isNo ? T.accent : "transparent",
              borderColor: isNo ? T.accent : T.muted,
              boxShadow:   isNo ? `0 0 8px ${T.accent}88` : "none",
            }}>
              {isNo && <span style={{ color: T.bg, fontSize: "0.6rem", fontWeight: 900 }}>✓</span>}
            </span>
            <div>
              <div style={{ color: isNo ? T.accent : T.text, fontWeight: 600, fontSize: "0.95rem" }}>No</div>
              <div style={{ color: T.muted, fontSize: "0.75rem", marginTop: "2px" }}>No suma riesgo</div>
            </div>
          </button>
        </div>

        {/* Navegación manual */}
        <div style={s.navRow}>
          <button
            style={{ ...s.btnNav, opacity: current === 0 ? 0.25 : 1 }}
            onClick={handleBack}
            disabled={current === 0}
          >
            ← Anterior
          </button>

          {answered && !isLast && (
            <button style={s.btnNavNext} onClick={() => setCurrent((c) => c + 1)}>
              Siguiente →
            </button>
          )}

          {answered && isLast && (
            <button style={s.btnPrimario} onClick={() => {
              const t = Object.values(answers).reduce((sum, v) => sum + v, 0);
              const riskInfo = getRiskLevel(t);
              const riskFactors = extractRiskFactors(answers);
              
              setScore(t);
              
              // Guardar en store.js
              saveResults({
                answers: answers,
                score: t,
                riskLevel: riskInfo.level,
                riskFactors: riskFactors,
              });
            }}>
              Ver resultado →
            </button>
          )}
        </div>
      </div>

      {/* Dots de progreso */}
      <div style={s.dots}>
        {questions.map((_, i) => (
          <span key={i} style={{
            ...s.dot,
            background: i < current
              ? (answers[questions[i].id] > 0 ? T.accent2 : T.accent)
              : i === current
              ? T.text
              : T.surface2,
            width:  i === current ? "20px" : "6px",
            opacity: i === current ? 1 : 0.6,
          }} />
        ))}
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
    gap: "1.25rem",
    padding: "1.5rem 1rem 4rem",
    fontFamily: T.fontMono,
    background: T.bg,
    minHeight: "60vh",
  },
  card: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: "20px",
    padding: "2.25rem",
    maxWidth: "580px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  bigNum: {
    fontFamily: T.fontDisplay,
    fontSize: "0.75rem",
    fontWeight: 800,
    color: T.surface2,
    letterSpacing: "0.1em",
  },
  riskChip: {
    display: "inline-block",
    width: "fit-content",
    color: T.accent2,
    background: "rgba(255,77,109,0.1)",
    border: "1px solid rgba(255,77,109,0.25)",
    borderRadius: "999px",
    fontSize: "0.68rem",
    fontWeight: 600,
    padding: "0.22rem 0.7rem",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
  },
  qText: {
    color: T.text,
    fontSize: "1.25rem",
    fontWeight: 700,
    lineHeight: 1.4,
    margin: 0,
    fontFamily: T.fontDisplay,
    letterSpacing: "-0.01em",
  },
  opcionesGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  opcionBtn: {
    background: T.surface2,
    border: `1px solid ${T.border}`,
    borderRadius: "12px",
    padding: "1rem 1.1rem",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: T.fontMono,
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  opcionSi: {
    background: "rgba(255,77,109,0.06)",
    border: "1px solid rgba(255,77,109,0.35)",
  },
  opcionNo: {
    background: "rgba(232,255,71,0.05)",
    border: "1px solid rgba(232,255,71,0.3)",
  },
  radio: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "1.5px solid",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "0.25rem",
  },
  btnNav: {
    background: "transparent",
    color: T.muted,
    border: "none",
    fontSize: "0.82rem",
    cursor: "pointer",
    fontFamily: T.fontMono,
    padding: "0.4rem 0",
    transition: "color 0.15s",
  },
  btnNavNext: {
    background: T.surface2,
    color: T.text,
    border: `1px solid ${T.border}`,
    borderRadius: "8px",
    padding: "0.6rem 1.25rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: T.fontMono,
    transition: "all 0.15s",
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
  progresoOuter: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    maxWidth: "580px",
    width: "100%",
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
    fontWeight: 600,
    whiteSpace: "nowrap",
    minWidth: "2.8rem",
    textAlign: "right",
  },
  dots: {
    display: "flex",
    gap: "5px",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "580px",
  },
  dot: {
    height: "6px",
    borderRadius: "999px",
    transition: "all 0.3s ease",
    flexShrink: 0,
  },
  badge: {
    display: "inline-block",
    width: "fit-content",
    fontSize: "0.7rem",
    padding: "0.26rem 0.72rem",
    borderRadius: "999px",
    border: "1px solid",
    letterSpacing: "0.07em",
    fontFamily: T.fontMono,
  },
  scoreCircle: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    transition: "box-shadow 0.3s",
  },
  desc: {
    color: T.muted,
    fontSize: "0.9rem",
    lineHeight: 1.65,
    margin: 0,
  },
  breakdown: {
    background: T.surface2,
    border: `1px solid ${T.border}`,
    borderRadius: "10px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.55rem",
  },
  breakdownItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
};