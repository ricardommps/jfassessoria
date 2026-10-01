export const PROGRAM_TYPES = {
  RUNNING: 1,
  GYM: 2,
  COMPLEMENTARY: 3,
};

export const isRunningProgram = (type) => !type || type === PROGRAM_TYPES.RUNNING;

export const isGymProgram = (type) =>
  type === PROGRAM_TYPES.GYM || type === PROGRAM_TYPES.COMPLEMENTARY;

export const getProgramTypeLabel = (type) => {
  if (type === PROGRAM_TYPES.COMPLEMENTARY) {
    return 'Complementares';
  }

  if (type === PROGRAM_TYPES.GYM) {
    return 'Treino de força';
  }

  return 'Treino de corrida';
};
