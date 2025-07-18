// src/core/types/common/PatientChart.ts

export type EstadoEmocional = 'estable' | 'ansioso' | 'crisis';

export interface RangoFechas {
  inicio: string; // formato ISO
  fin: string;
}

export interface ResumenEstados {
  estable: number;
  ansioso: number;
  crisis: number;
}

export interface DetalleEstado {
  fecha: string; // formato ISO
  estado: EstadoEmocional;
}

export interface PacienteGraficas {
  pacienteId: string;
  nombre: string;
  periodo: 'diario' | 'semanal' | 'mensual' | 'anual';
  rango: RangoFechas;
  resumen: ResumenEstados;
  detallado: DetalleEstado[];
}

/**
 * Interfaz para las lecturas diarias resumidas de un juguete.
 * Corresponde a los items dentro de la respuesta de /api/Toys/{macAddress}/readings/summary
 */
export interface DailyReading {
  date: string; // Formato de fecha ISO, ej: "2025-06-24T21:40:28.3230107"
  status: EstadoEmocional; // El estado emocional predominante para ese día (estable, ansioso, crisis)
  totalHours: number; // Horas totales de actividad para el día
  averageMetric: number; // Métrica promedio para el día
  peakMetric: number; // Métrica pico para el día

  // Campos adicionales que se usan o se pueden añadir en el frontend para la UI
  day?: number; // Día del mes (ej: 24)
  subtitle?: string; // Título secundario para la tarjeta (ej: "Horas diarias cambio de estado")
  name?: string; // Nombre del paciente (añadido en el frontend para conveniencia)
  emotions?: string[]; // Array de strings para las etiquetas de emoción (ej: ["Feliz", "Ansioso"])
  predominantEmotionState?: EstadoEmocional; // El estado emocional predominante (estable, ansioso, crisis)
}