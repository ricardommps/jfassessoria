export function renderType(type) {
  switch (Number(type)) {
    case 1:
      return 'Métricas de desempenho';
    case 2:
      return 'Métricas de competição';
    case 3:
      return 'Métricas de parametros fisiológicos';
    default:
      return '';
  }
}
