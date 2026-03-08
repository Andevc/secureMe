import React, { useState } from 'react';

export default function RecommendationCard({ recommendation, index = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!recommendation) return null;

  const { icon, title, description, urgency, steps } = recommendation;

  // Configuración de colores según urgencia con la paleta oscura
  const urgencyConfig = {
    alta: {
      accentColor: '#ff4d6d',
      badgeBg: 'rgba(255, 77, 109, 0.15)',
      badgeText: '#ff4d6d',
      badgeBorder: 'rgba(255, 77, 109, 0.3)',
      label: 'URGENTE',
      glow: 'rgba(255, 77, 109, 0.2)'
    },
    media: {
      accentColor: '#e8ff47',
      badgeBg: 'rgba(232, 255, 71, 0.15)',
      badgeText: '#e8ff47',
      badgeBorder: 'rgba(232, 255, 71, 0.3)',
      label: 'IMPORTANTE',
      glow: 'rgba(232, 255, 71, 0.2)'
    },
    baja: {
      accentColor: '#47c5ff',
      badgeBg: 'rgba(71, 197, 255, 0.15)',
      badgeText: '#47c5ff',
      badgeBorder: 'rgba(71, 197, 255, 0.3)',
      label: 'RECOMENDADO',
      glow: 'rgba(71, 197, 255, 0.2)'
    }
  };

  const config = urgencyConfig[urgency] || urgencyConfig.media;

  return (
    <>
      <style>{`
        @keyframes slideInTable {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .recommendation-row {
          animation: slideInTable 0.4s ease-out forwards;
          animation-delay: ${index * 80}ms;
          opacity: 0;
        }

        .recommendation-row:hover {
          transform: translateX(4px);
          box-shadow: -4px 0 0 ${config.accentColor}, 0 4px 20px ${config.glow};
          border-color: ${config.accentColor};
        }

        .expand-button {
          transition: all 0.2s ease;
        }

        .expand-button:hover {
          background-color: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 15px ${config.glow};
        }

        .step-item {
          position: relative;
          padding-left: 28px;
          margin-bottom: 14px;
        }

        .step-item::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 9px;
          width: 6px;
          height: 6px;
          background-color: ${config.accentColor};
          border-radius: 50%;
          box-shadow: 0 0 8px ${config.accentColor};
        }

        .steps-container {
          animation: expandSteps 0.3s ease-out;
        }

        @keyframes expandSteps {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
      `}</style>

      <div
        className="recommendation-row"
        style={{
          backgroundColor: '#0e1320',
          borderRadius: '0',
          border: '1px solid rgba(255,255,255,0.06)',
          borderLeft: `4px solid ${config.accentColor}`,
          marginBottom: '0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Fila principal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 120px 1fr 140px',
            alignItems: 'center',
            padding: '20px 24px',
            gap: '20px',
            cursor: 'pointer'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Ícono */}
          <div style={{ fontSize: '42px', textAlign: 'center', lineHeight: '1' }}>
            {icon}
          </div>

          {/* Badge */}
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                borderRadius: '6px',
                backgroundColor: config.badgeBg,
                color: config.badgeText,
                border: `1.5px solid ${config.badgeBorder}`,
                whiteSpace: 'nowrap',
                fontFamily: 'DM Mono, monospace',
                textShadow: `0 0 10px ${config.glow}`
              }}
            >
              {config.label}
            </span>
          </div>

          {/* Contenido */}
          <div>
            <h3
              style={{
                fontSize: '17px',
                fontWeight: '700',
                color: '#e8eaf0',
                marginBottom: '6px',
                lineHeight: '1.3',
                fontFamily: 'Syne, sans-serif'
              }}
            >
              {title}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
                margin: 0
              }}
            >
              {description}
            </p>
          </div>

          {/* Botón */}
          <div style={{ textAlign: 'right' }}>
            <button
              className="expand-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: config.accentColor,
                backgroundColor: 'transparent',
                border: `1.5px solid ${config.accentColor}`,
                borderRadius: '8px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'Syne, sans-serif'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              <span style={{ fontSize: '10px' }}>
                {isExpanded ? '▼' : '▶'}
              </span>
              <span>{isExpanded ? 'Ocultar' : 'Ver pasos'}</span>
            </button>
          </div>
        </div>

        {/* Pasos expandibles */}
        {isExpanded && steps && steps.length > 0 && (
          <div
            className="steps-container"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: '#141b2d',
              padding: '24px 24px 24px 100px'
            }}
          >
            <h4
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: config.accentColor,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'DM Mono, monospace'
              }}
            >
              📝 Pasos a seguir:
            </h4>
            <div>
              {steps.map((step, idx) => (
                <div key={idx} className="step-item">
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#e8eaf0',
                      lineHeight: '1.6'
                    }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}