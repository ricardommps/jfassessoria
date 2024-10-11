export function convertMetersToKilometersFormat(meters, hideKm) {
  const kilometers = meters / 100;

  // Formatar quilômetros com duas casas decimais
  const formattedKilometers = kilometers.toFixed(2).replace('.', ',');

  return `${formattedKilometers} ${!hideKm ? 'km' : ''}`;
}

export function convertSecondsToHourMinuteFormat(seconds) {
  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Formatar horas, minutos e segundos com dois dígitos
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  if (hours > 0) {
    // Se houver horas, exibir no formato hh:mm:ss
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    // Se não houver horas, exibir no formato mm:ss
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}

export function convertPaceToSpeed(pace, hideKm) {
  const kilometers = pace / 100;

  // Formatar quilômetros com duas casas decimais
  const formattedKilometers = kilometers.toFixed(2).replace('.', ',');

  return `${formattedKilometers} ${!hideKm ? '/km' : ''}`;
}
