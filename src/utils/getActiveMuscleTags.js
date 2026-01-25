import { muscles } from './muscles';

export function getActiveSvgIds(musclesId) {
  return muscles.filter((m) => musclesId.includes(m.id)).flatMap((m) => m.tags);
}

export function getMuscleNames(musclesId) {
  return muscles.filter((m) => musclesId.includes(m.id)).map((m) => m.muscle);
}

export const getActiveMuscles = (musclesWorked) => {
  return muscles.filter((m) => musclesWorked.includes(m.id));
};
