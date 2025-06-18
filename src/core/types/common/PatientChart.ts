// /types/PatientChart.ts
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
