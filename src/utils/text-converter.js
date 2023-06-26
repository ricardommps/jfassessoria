export function trainingProgramText(currentText) {
  switch (currentText) {
    case 'in_progress':
      return 'Em progresso';
    case 'close_to_expiration':
      return 'Próximo da expiração';
    case 'overdue':
      return 'Vencido';
    default:
      return 'Não definido';
  }
}

export function statusText(currentStatus) {
  switch (currentStatus) {
    case 'active':
      return 'Ativo';
    case 'expired':
      return 'Vencido';
    case 'blocked':
      return 'Bloqueado';
    default:
      return 'Não definido';
  }
}

export function typeText(currentType) {
  switch (currentType) {
    case 'consulting':
      return 'Consultoria';
    case 'online':
      return 'Atendimento online';
    case 'race':
      return 'Corrida';
    case 'personal':
      return 'Presencial';
    default:
      return 'Não definido';
  }
}
