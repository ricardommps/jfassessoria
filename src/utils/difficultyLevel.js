export function difficultyLevel(level) {
  switch (level) {
    case 'Iniciante':
      return 'iniciante';
    case 'Intermediário':
      return 'intermediario';
    case 'Avançado':
      return 'avancado';
    case 'Expert':
      return 'expert';
    default:
      return 'default';
  }
}
