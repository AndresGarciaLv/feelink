// utils/clinicalUtils.ts
import { ClinicalState, ClinicalAnalysis } from '../../data/chartdata';
import ClinicalColors from '../../shared/components/constants/clinicalcolors';

// // Función para determinar el estado clínico basado en presión
export const getPressureState = (pressure: number): ClinicalState => {
  if (pressure >= 0 && pressure <= 60) {
    return { state: 'stable', label: 'Estable', color: ClinicalColors.stable };
  } else if (pressure > 60 && pressure <= 87) {
    return { state: 'anxious', label: 'Ansioso', color: ClinicalColors.anxious };
  } else {
    return { state: 'crisis', label: 'Crisis', color: ClinicalColors.crisis };
  }
};

// // Función para determinar el estado de movimiento
export const getMovementState = (accelValue: number): ClinicalState => {
  const magnitude = Math.abs(accelValue);
  if (magnitude <= 0.3) {
    return { state: 'stable', label: 'Calmo', color: ClinicalColors.stable };
  } else if (magnitude <= 0.8) {
    return { state: 'anxious', label: 'Inquieto', color: ClinicalColors.anxious };
  } else {
    return { state: 'crisis', label: 'Agitado', color: ClinicalColors.crisis };
  }
};

// // Función para obtener interpretación clínica
export const getInterpretationText = (chartType: string, state: 'stable' | 'anxious' | 'crisis'): string => {
  const interpretations: Record<string, Record<string, string>> = {
    'Monitoreo de Presión Táctil': {
      stable: 'El niño muestra un nivel de contacto físico normal y calmado. Indica regulación emocional adecuada.',
      anxious: 'Se observa incremento en la necesidad de estimulación táctil, sugiriendo posible estado de ansiedad leve.',
      crisis: 'Presión táctil intensa indica posible estado de crisis sensorial o emocional. Requiere intervención inmediata.'
    },
    'Análisis de Movimiento Corporal': {
      stable: 'Movimientos corporales dentro de rangos típicos, indicando estado de calma y autorregulación.',
      anxious: 'Incremento en la actividad motora, posiblemente relacionado con estimming o búsqueda sensorial.',
      crisis: 'Movimientos intensos o repetitivos que pueden indicar desregulación sensorial o crisis autística.'
    },
    'Patrón de Rotación y Estimming': {
      stable: 'Sin patrones rotacionales significativos, comportamiento motor típico.',
      anxious: 'Presencia de movimientos rotacionales que pueden indicar autoestimulación o procesamiento sensorial.',
      crisis: 'Rotaciones intensas características de episodios de desregulación o crisis autística.'
    }
  };
  
  return interpretations[chartType]?.[state] || 'Evaluando patrones de comportamiento...';
};

// // Función para obtener recomendaciones terapéuticas
export const getTherapeuticRecommendation = (analysis: ClinicalAnalysis): string => {
  const { pressure, movement, rotation } = analysis;
  
  if (pressure.state === 'crisis' || movement.state === 'crisis') {
    return "Se detectan signos de crisis sensorial. Considere implementar estrategias de regulación inmediatas: ambiente calmado, reducir estímulos, ofrecer objetos sensoriales preferidos.";
  } else if (pressure.state === 'anxious' || movement.state === 'anxious') {
    return "El paciente muestra signos de ansiedad. Recomiende actividades de autorregulación: respiración profunda, presión profunda, actividades proprioceptivas.";
  } else {
    return "Estado estable observado. Continúe con las actividades terapéuticas actuales y mantenga el ambiente estructurado para promover la regulación.";
  }
};

// // Función para color de batería
export const getBatteryColor = (level: number): string => {
  if (level > 60) return ClinicalColors.stable;
  if (level > 30) return ClinicalColors.anxious;
  return ClinicalColors.crisis;
};