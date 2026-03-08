// Mapa completo de factores de riesgo → recomendaciones
const RECOMMENDATIONS_MAP = {
  instagram_publico: {
    id: 'instagram_publico',
    icon: '🔒',
    title: 'Cambia tu perfil de Instagram a privado',
    description: 'Tu perfil público permite que cualquiera vea tus fotos, ubicaciones y actividad. Cambiar a privado te da control sobre quién ve tu contenido.',
    urgency: 'alta',
    steps: [
      'Ve a tu perfil → Menú (☰) → Configuración',
      'Privacidad → Privacidad de la cuenta',
      'Activa "Cuenta privada"'
    ]
  },
  
  ubicacion_publicada: {
    id: 'ubicacion_publicada',
    icon: '📍',
    title: 'Deja de publicar tu ubicación en tiempo real',
    description: 'Compartir dónde estás permite que te rastreen. Un atacante podría saber tu rutina, dónde vives o trabajas.',
    urgency: 'alta',
    steps: [
      'No etiquetes ubicaciones en posts de Instagram/Facebook',
      'Desactiva "Añadir ubicación" en historias',
      'Publica ubicaciones DESPUÉS de irte del lugar'
    ]
  },
  
  telefono_visible: {
    id: 'telefono_visible',
    icon: '📱',
    title: 'Oculta tu número de teléfono',
    description: 'Tu teléfono visible puede usarse para encontrar más información sobre ti, acosarte o venderse en bases de datos filtradas.',
    urgency: 'alta',
    steps: [
      'Revisa la configuración de privacidad de Facebook/Instagram',
      'En "¿Quién puede ver tu número?" → selecciona "Solo yo"',
      'Evita publicar tu número en biografías o posts'
    ]
  },
  
  mismo_username: {
    id: 'mismo_username',
    icon: '🔄',
    title: 'Usa diferentes usernames en cada red social',
    description: 'Usar el mismo @usuario en todas partes facilita que te encuentren en múltiples plataformas con una sola búsqueda.',
    urgency: 'media',
    steps: [
      'Crea usernames únicos para cada red social',
      'Evita usar tu nombre real completo como username',
      'No uses variaciones obvias (ej: maria_lopez, marialopez, maria.lopez)'
    ]
  },
  
  email_visible: {
    id: 'email_visible',
    icon: '✉️',
    title: 'Oculta tu email de perfiles públicos',
    description: 'Tu email puede usarse para phishing, spam, o buscar más información tuya en filtraciones de datos.',
    urgency: 'media',
    steps: [
      'Elimina tu email de biografías de redes sociales',
      'Usa emails secundarios para redes sociales',
      'Verifica tu email en haveibeenpwned.com'
    ]
  },
  
  fotos_sin_filtro: {
    id: 'fotos_sin_filtro',
    icon: '🖼️',
    title: 'Revisa qué publicas en tus fotos',
    description: 'Las fotos pueden revelar: tu casa, tu escuela, matrículas de autos, nombres de lugares. Un atacante puede usar esto para ubicarte.',
    urgency: 'media',
    steps: [
      'Antes de subir una foto, revisa el fondo',
      'Tapa matrículas, direcciones visibles, nombres de calles',
      'Evita fotos frente a lugares reconocibles cerca de tu casa'
    ]
  },
  
  info_personal_bio: {
    id: 'info_personal_bio',
    icon: '📝',
    title: 'Elimina información personal de tu biografía',
    description: 'Fecha de nacimiento, ciudad, escuela/universidad en tu bio facilitan la ingeniería social y el robo de identidad.',
    urgency: 'baja',
    steps: [
      'Edita tu biografía en redes sociales',
      'Elimina: fecha de nacimiento completa, ciudad exacta, lugar de trabajo/estudio',
      'Sé creativo pero vago (ej: "Amante del café ☕" en vez de "Trabajo en Starbucks de Reforma")'
    ]
  },
  
  amigos_publicos: {
    id: 'amigos_publicos',
    icon: '👥',
    title: 'Oculta tu lista de amigos/seguidores',
    description: 'Tu lista de contactos revela tu círculo social. Un atacante puede usarlos para ingeniería social o encontrar más información sobre ti.',
    urgency: 'baja',
    steps: [
      'Facebook: Configuración → Privacidad → ¿Quién puede ver tu lista de amigos? → Solo yo',
      'Instagram: no puedes ocultarlos, pero puedes hacer tu cuenta privada',
      'LinkedIn: Configuración → Visibilidad → Conexiones → Solo tú'
    ]
  },
  
  metadatos_fotos: {
    id: 'metadatos_fotos',
    icon: '🗺️',
    title: 'Elimina metadatos GPS de tus fotos',
    description: 'Las fotos tomadas con tu celular guardan la ubicación exacta donde fueron tomadas. Esto puede revelar tu casa, trabajo o lugares frecuentes.',
    urgency: 'alta',
    steps: [
      'iPhone: Ajustes → Privacidad → Servicios de ubicación → Cámara → Nunca',
      'Android: Cámara → Ajustes → Desactiva "Guardar ubicación"',
      'Antes de subir fotos antiguas, usa apps como "Metapho" para eliminar metadatos'
    ]
  },
  
  redes_vinculadas: {
    id: 'redes_vinculadas',
    icon: '🔗',
    title: 'Desvincula tus redes sociales entre sí',
    description: 'Vincular Facebook con Instagram, Twitter, etc. crea un rastro digital más fácil de seguir.',
    urgency: 'baja',
    steps: [
      'Desvincula cuentas en la configuración de cada red social',
      'Evita usar "Iniciar sesión con Facebook/Google"',
      'No compartas automáticamente posts entre plataformas'
    ]
  }
};

/**
 * Obtiene recomendaciones personalizadas basadas en los factores de riesgo detectados
 * @param {Array<string>} factors - Array de IDs de factores de riesgo (ej: ['instagram_publico', 'telefono_visible'])
 * @returns {Array<Object>} Array de objetos de recomendación ordenados por urgencia
 */
export function getRecommendations(factors) {
  if (!factors || factors.length === 0) {
    return [];
  }

  // Filtrar solo las recomendaciones que corresponden a los factores detectados
  const recommendations = factors
    .map(factorId => RECOMMENDATIONS_MAP[factorId])
    .filter(rec => rec !== undefined); // Por si algún factor no tiene recomendación

  // Ordenar por urgencia: alta → media → baja
  const urgencyOrder = { alta: 1, media: 2, baja: 3 };
  
  return recommendations.sort((a, b) => {
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });
}

/**
 * Obtiene una sola recomendación por su ID
 * @param {string} factorId - ID del factor de riesgo
 * @returns {Object|null} Objeto de recomendación o null si no existe
 */
export function getRecommendation(factorId) {
  return RECOMMENDATIONS_MAP[factorId] || null;
}

/**
 * Obtiene todas las recomendaciones disponibles (útil para debug)
 * @returns {Object} Mapa completo de recomendaciones
 */
export function getAllRecommendations() {
  return RECOMMENDATIONS_MAP;
}