import { useEffect, useState } from 'react';
import { getRecommendations } from '../../lib/recommendations.js';
import { getResults } from '../../lib/store.js';
import RecommendationCard from './RecommendationCard.jsx';

export default function RecommendationsView() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapeo de niveles de riesgo a español
  const levelMap = {
    'low': 'Bajo',
    'medium': 'Medio',
    'high': 'Alto',
    'critical': 'Crítico'
  };

  // Mapeo de colores según nivel de riesgo
  const colorMap = {
    'low': {
      primary: '#e8ff47',      // accent (verde/amarillo)
      secondary: 'rgba(232, 255, 71, 0.3)',
      glow: 'rgba(232, 255, 71, 0.2)'
    },
    'medium': {
      primary: '#47c5ff',      // accent3 (azul)
      secondary: 'rgba(71, 197, 255, 0.3)',
      glow: 'rgba(71, 197, 255, 0.2)'
    },
    'high': {
      primary: '#ff4d6d',      // accent2 (rojo)
      secondary: 'rgba(255, 77, 109, 0.3)',
      glow: 'rgba(255, 77, 109, 0.2)'
    },
    'critical': {
      primary: '#ff4d6d',      // accent2 (rojo intenso)
      secondary: 'rgba(255, 77, 109, 0.5)',
      glow: 'rgba(255, 77, 109, 0.3)'
    }
  };

  // Mensajes dinámicos según nivel de riesgo
  const messagesMap = {
    'low': {
      emoji: '✅',
      title: '¡Excelente trabajo!',
      text: 'Tu huella digital está bien controlada. Mantén estos buenos hábitos de seguridad y sigue siendo consciente de lo que compartes en línea.'
    },
    'medium': {
      emoji: '⚠️',
      title: '¡Buenas noticias!',
      text: 'Tu exposición es moderada. Cada acción que tomes reduce tu exposición digital. Empieza por las recomendaciones urgentes y avanza a tu ritmo.'
    },
    'high': {
      emoji: '⚡',
      title: '¡Es hora de actuar!',
      text: 'Tienes varios factores de riesgo que deberías revisar pronto. Las recomendaciones urgentes son prioritarias. Comienza con ellas esta semana.'
    },
    'critical': {
      emoji: '🚨',
      title: '¡Acción urgente requerida!',
      text: 'Tu exposición digital es muy alta. Es crucial que implementes las recomendaciones URGENTES de inmediato para proteger tu privacidad.'
    }
  };

  useEffect(() => {
    // Leer los datos almacenados en localStorage
    const savedResults = getResults();
    setResults(savedResults || {
      score: 0,
      riskLevel: 'low',
      riskFactors: []
    });
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>;
  }

  const riskLevelSpanish = levelMap[results?.riskLevel] || 'Medio';
  const riskColor = colorMap[results?.riskLevel] || colorMap.low;
  const messageContent = messagesMap[results?.riskLevel] || messagesMap.medium;
  const recommendations = getRecommendations(results?.riskFactors || []);

  // Contar por urgencia
  const urgentCount = recommendations.filter((r) => r.urgency === 'alta').length;
  const importantCount = recommendations.filter((r) => r.urgency === 'media').length;
  const recommendedCount = recommendations.filter((r) => r.urgency === 'baja').length;

  return (
    <>
      {/* Score Card con estilos dinámicos - CENTRADO */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '28px 48px',
          borderRadius: '16px',
          background: 'var(--surface2)',
          border: `2px solid ${riskColor.primary}`,
          boxShadow: `0 0 40px ${riskColor.secondary}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 700,
            color: riskColor.primary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '8px',
            margin: 0
          }}>
            Tu nivel de riesgo
          </p>
          <p style={{
            fontSize: '64px',
            fontWeight: 800,
            color: riskColor.primary,
            lineHeight: 1,
            margin: '12px 0',
            textShadow: `0 0 20px ${riskColor.glow}`
          }}>
            {results?.score}<span style={{
              fontSize: '36px',
              color: 'var(--muted)'
            }}>/100</span>
          </p>
          <p style={{
            fontSize: '16px',
            fontWeight: 700,
            color: riskColor.primary,
            marginTop: '8px',
            margin: 0
          }}>
            Riesgo {riskLevelSpanish}
          </p>
        </div>
      </div>

      {/* Alert motivacional - CON MENSAJE DINÁMICO */}
      <div className="alert-box">
        <div className="alert-icon">{messageContent.emoji}</div>
        <div className="alert-content">
          <p className="alert-title">{messageContent.title}</p>
          <p className="alert-text">
            {messageContent.text}
          </p>
        </div>
      </div>

      {/* Tabla de recomendaciones */}
      <div className="table-container">
        {recommendations.length === 0 ? (
          <div className="empty-state">
            <p style={{ textAlign: 'center', padding: '3rem' }}>
              📋 Para ver tus recomendaciones personalizadas, 
              <a href="/test" style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginLeft: '0.5rem' }}>
                completa el test de seguridad
              </a>
            </p>
          </div>
        ) : (
          <>
            {/* Header de la tabla */}
            <div className="table-header">
              <div className="table-header-grid">
                <div className="header-cell" style={{ textAlign: 'center' }}>Tipo</div>
                <div className="header-cell" style={{ textAlign: 'center' }}>Urgencia</div>
                <div className="header-cell">Recomendación</div>
                <div className="header-cell" style={{ textAlign: 'right' }}>Acción</div>
              </div>
            </div>

            {/* Body de la tabla */}
            <div className="table-body">
              {recommendations.map((rec, index) => (
                <RecommendationCard 
                  key={rec.id}
                  recommendation={rec}
                  index={index}
                />
              ))}
            </div>

            {/* Footer con estadísticas */}
            <div className="table-footer">
              <p className="footer-text">
                📊 Total: <strong>{recommendations.length} recomendaciones</strong> • 
                Urgentes: <strong>{urgentCount}</strong> • 
                Importantes: <strong>{importantCount}</strong> • 
                Recomendadas: <strong>{recommendedCount}</strong>
              </p>
            </div>
          </>
        )}
      </div>

      {/* CTA Final */}
      <div className="cta-container">
        <div className="cta-box">
          <h2 className="cta-title">¿Qué sigue?</h2>
          <p className="cta-text">
            Implementa estas recomendaciones y vuelve a hacer el test en una semana 
            para ver cómo ha mejorado tu score.
          </p>
          <div className="cta-buttons">
            <a href="/test" className="btn btn-primary">
              🔄 Volver al Test
            </a>
            <a href="/" className="btn btn-secondary">
              🏠 Volver al Inicio
            </a>
          </div>
        </div>
      </div>

      {/* Estilos CSS para el componente */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        :root {
          --bg: #080b10;
          --surface: #0e1320;
          --surface2: #141b2d;
          --border: rgba(255,255,255,0.06);
          --accent: #e8ff47;
          --accent2: #ff4d6d;
          --accent3: #47c5ff;
          --text: #e8eaf0;
          --muted: #6b7280;
          --font-display: 'Syne', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        /* Alert box */
        .alert-box {
          display: flex;
          gap: 20px;
          background: var(--surface2);
          color: var(--text);
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 40px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .alert-icon {
          font-size: 32px;
          line-height: 1;
          flex-shrink: 0;
        }

        .alert-content {
          flex: 1;
        }

        .alert-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--accent);
          margin-top: 0;
        }

        .alert-text {
          color: var(--muted);
          line-height: 1.6;
          font-size: 15px;
          margin: 0;
        }

        /* Tabla */
        .table-container {
          background: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          margin-bottom: 40px;
        }

        .table-header {
          background: var(--surface2);
          border-bottom: 1px solid var(--border);
          padding: 0 24px;
        }

        .table-header-grid {
          display: grid;
          grid-template-columns: 80px 120px 1fr 140px;
          gap: 20px;
          padding: 16px 0;
        }

        .header-cell {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: var(--font-mono);
        }

        .table-body {
          /* Las filas se agregan aquí */
        }

        .table-footer {
          background: var(--surface2);
          border-top: 1px solid var(--border);
          padding: 16px 24px;
          text-align: center;
        }

        .footer-text {
          font-size: 13px;
          color: var(--muted);
          margin: 0;
          font-family: var(--font-mono);
        }

        .footer-text strong {
          color: var(--accent);
          font-weight: 700;
        }

        .empty-state {
          padding: 48px 24px;
          text-align: center;
          color: var(--muted);
        }

        .empty-state a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 700;
        }

        .empty-state a:hover {
          text-decoration: underline;
        }

        /* CTA */
        .cta-container {
          margin-top: 56px;
          text-align: center;
        }

        .cta-box {
          background: var(--surface);
          border-radius: 16px;
          padding: 40px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .cta-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 16px;
          margin-top: 0;
        }

        .cta-text {
          color: var(--muted);
          line-height: 1.7;
          font-size: 16px;
          max-width: 600px;
          margin: 0 auto 28px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 14px 32px;
          font-weight: 700;
          border-radius: 10px;
          text-decoration: none;
          font-size: 15px;
          transition: all 0.2s;
          display: inline-block;
          font-family: var(--font-display);
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: var(--accent);
          color: var(--bg);
          box-shadow: 0 4px 12px rgba(232, 255, 71, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(232, 255, 71, 0.5);
        }

        .btn-secondary {
          background: transparent;
          color: var(--accent3);
          border: 2px solid var(--accent3);
        }

        .btn-secondary:hover {
          background: var(--surface2);
          box-shadow: 0 0 20px rgba(71, 197, 255, 0.3);
        }

        @media (max-width: 768px) {
          .table-header-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .header-cell {
            display: none;
          }

          .btn {
            width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>
    </>
  );
}
