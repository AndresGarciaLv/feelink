export function estadoToNumeric(estado: string): number {
  switch (estado) {
    case 'estable':
      return 1;
    case 'ansioso':
      return 2;
    case 'crisis':
      return 3;
    default:
      return 0;
  }
}
