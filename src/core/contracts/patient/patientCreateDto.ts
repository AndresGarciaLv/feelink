// src/core/contracts/patient/patientCreateDto.ts
export interface PatientCreateDto {
  name: string;
  lastName: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  therapistIds?: string[] | null;
  tutorsIds?: string[] | null;
}
