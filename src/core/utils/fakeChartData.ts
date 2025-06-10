import { PacienteGraficas } from '../types/common/PatientChart';

export const fakeData: PacienteGraficas = {
  pacienteId: '12345',
  nombre: 'Juan Pérez',
  periodo: 'mensual',
  rango: {
    inicio: '2025-05-01',
    fin: '2025-05-31',
  },
  resumen: {
    estable: 15,
    ansioso: 10,
    crisis: 6,
  },
  detallado: [
    { fecha: '2025-05-01', estado: 'estable' },
    { fecha: '2025-05-02', estado: 'estable' },
    { fecha: '2025-05-03', estado: 'ansioso' },
    { fecha: '2025-05-04', estado: 'crisis' },
    { fecha: '2025-05-05', estado: 'estable' },
    { fecha: '2025-05-06', estado: 'crisis' },
    // ...
  ],
};