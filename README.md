# 🛡️ SecureMe — Simulador de Exposición Digital

> **Conoce tu exposición digital. Actúa antes de ser víctima.**

SecureMe es una aplicación web educativa que analiza qué tan expuesta está tu información personal en internet y simula cómo un atacante podría recolectarla. El objetivo es **concientizar y prevenir la violencia digital** antes de que ocurra.

Todo el procesamiento ocurre en el navegador — ningún dato sale de tu dispositivo.

---

## ✨ Funcionalidades

### 📋 Test de Exposición Digital
Responde 10 preguntas sobre tus hábitos digitales: privacidad de redes sociales, publicación de ubicación, visibilidad del teléfono, reutilización de usernames, metadatos en fotos, y más. Cada respuesta pondera factores de riesgo reales.

### 📊 Score de Riesgo (0–100)
El sistema calcula un puntaje de exposición y lo clasifica en cuatro niveles:

| Nivel | Rango | Color |
|-------|-------|-------|
| Bajo | 0–24 | 🟡 Amarillo |
| Medio | 25–49 | 🔵 Azul |
| Alto | 50–74 | 🔴 Rojo |
| Crítico | 75–100 | 🔴 Rojo intenso |

### 🛡️ Recomendaciones Personalizadas
Basadas en los factores de riesgo detectados, la plataforma genera consejos específicos ordenados por urgencia (Urgente / Importante / Recomendado) con pasos accionables para cada uno.

### 📚 Guía de Prevención de Violencia Digital
20 recomendaciones generales de seguridad digital, organizadas en tres categorías: acciones urgentes, importantes y buenas prácticas.

---

## 🏗️ Arquitectura

```
Usuario
   │
   ▼
Interfaz Web (Astro)
   │
   ├── Páginas: /, /test, /resultados, /recomendaciones
   └── Layout global con NavBar y Footer
   │
   ▼
Componentes Interactivos (React)
   │
   ├── ExposureTest     → Cuestionario con progreso y animaciones
   └── RecommendationsView + RecommendationCard → Resultados y consejos
   │
   ▼
Motor de Análisis (JavaScript — cliente)
   │
   ├── questions.js         → Banco de preguntas con peso de riesgo
   ├── recommendations.js   → Mapa de factores → recomendaciones
   └── store.js             → Persistencia en localStorage
```

> **100% client-side** — sin backend, sin base de datos, sin telemetría.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework principal | [Astro](https://astro.build) |
| Componentes interactivos | React |
| Lenguaje | JavaScript |
| Estilos | Tailwind CSS + CSS-in-JS |
| Fuentes | Syne + DM Mono (Google Fonts) |
| Persistencia | `localStorage` (solo en el dispositivo del usuario) |

---

## 📁 Estructura del Proyecto

```
src/
├── assets/
├── components/
│   ├── recommendation/
│   │   ├── RecommendationCard.jsx
│   │   └── RecommendationsView.jsx
│   ├── test/
│   │   ├── ExposureTest.jsx
│   │   └── questions.js
│   └── ui/
│       ├── NavBar.astro
│       └── Footer.astro
├── layouts/
│   └── Layout.astro
├── lib/
│   ├── recommendations.js
│   └── store.js
├── pages/
│   ├── index.astro
│   ├── test.astro
│   ├── resultados.astro
│   └── recomendaciones.astro
└── styles/
    └── global.css
```

---

## ⚡ Instalación y Uso

```bash
# Clonar el repositorio
git clone https://github.com/Andevc/secureme.git
cd secureme

# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm run dev

# Build para producción
pnpm run build
```

---

## 🔒 Privacidad

SecureMe fue diseñado con un enfoque **privacy-first**:

- ✅ Ningún dato es enviado a servidores externos
- ✅ Las respuestas del test se guardan únicamente en `localStorage` de tu navegador
- ✅ Sin cookies de seguimiento ni analíticas de terceros
- ✅ Sin registro de usuario requerido

---

## 👥 Equipo — Pacha Devs

Proyecto desarrollado por 5 estudiantes para hackathon:

| Colaborador | GitHub |
|-------------|--------|
| Andres E. | [@Andevc](https://github.com/Andevc) |
| Josue M. | [@Josue](https://github.com/Josselmen) |
| Sonny G. | [@Sonny](https://github.com/astetes771) |
| Alvaro C. | [@Alvaro](https://github.com/alvaro09918) |
| Erick M. | [@Erick](https://github.com/ERICKMMJ) |

> ¿Eres parte del equipo? Abre un PR para añadir tu info aquí. 🙌

---

## ⚠️ Aviso Legal

SecureMe es una **herramienta educativa de concientización**. La simulación no accede ni almacena información real de ninguna red social o plataforma externa. Si estás siendo víctima de doxing o violencia digital, contacta a las autoridades competentes de tu país.

---

## 📄 Licencia

MIT © 2026 Pacha Devs
