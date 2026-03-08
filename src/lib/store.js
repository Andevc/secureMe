// store.js
// Estado global de SecureMe
// Persiste las respuestas del test y el score entre páginas usando localStorage

const STORAGE_KEY = 'SecureMe_state';

// Estructura base del estado
const defaultState = {
  answers: {},        // { questionId: boolean } — respuestas del test
  score: null,        // número 0-100
  riskLevel: null,    // 'low' | 'medium' | 'high' | 'critical'
  riskFactors: [],    // string[] — factores de riesgo detectados
  completedAt: null,  // timestamp ISO
};

// ─────────────────────────────────────────
// GUARDAR
// ─────────────────────────────────────────

export function saveResults({ answers, score, riskLevel, riskFactors }) {
  const state = {
    answers,
    score,
    riskLevel,
    riskFactors,
    completedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('SecureMe: no se pudo guardar el estado', e);
  }

  return state;
}

// ─────────────────────────────────────────
// LEER
// ─────────────────────────────────────────

export function getResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('SecureMe: no se pudo leer el estado', e);
    return null;
  }
}

// ─────────────────────────────────────────
// VERIFICAR si ya completó el test
// ─────────────────────────────────────────

export function hasResults() {
  const state = getResults();
  return state !== null && state.score !== null;
}

// ─────────────────────────────────────────
// LIMPIAR (para reiniciar el test)
// ─────────────────────────────────────────

export function clearResults() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('SecureMe: no se pudo limpiar el estado', e);
  }
}

// ─────────────────────────────────────────
// HELPERS de nivel de riesgo
// ─────────────────────────────────────────

export function getRiskLabel(riskLevel) {
  const labels = {
    low:      'Bajo',
    medium:   'Medio',
    high:     'Alto',
    critical: 'Crítico',
  };
  return labels[riskLevel] ?? 'Desconocido';
}

export function getRiskColor(riskLevel) {
  const colors = {
    low:      '#22c55e',
    medium:   '#f59e0b',
    high:     '#ff4d6d',
    critical: '#7f1d1d',
  };
  return colors[riskLevel] ?? '#6b7280';
}