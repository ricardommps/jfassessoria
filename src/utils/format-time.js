// eslint-disable-next-line simple-import-sort/imports
import { format, formatDistanceToNow, getTime, parseISO, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import ptBR from 'date-fns/locale/pt-BR';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd/MM/yyyy'; // Formato default
  const timeZone = 'America/Sao_Paulo'; // Fuso horário de São Paulo (Brasil)

  if (!date) return '';
  console.log('-date---', date);

  // Se a data for uma string no formato ISO, usamos parseISO para garantir que ela seja interpretada corretamente
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  // Converte a data para o fuso horário de São Paulo
  const zonedDate = utcToZonedTime(parsedDate, timeZone);
  console.log('-zonedDate---', zonedDate);

  // Ajusta para o início do dia no fuso horário de São Paulo
  const startOfDayDate = startOfDay(zonedDate);

  // Formata a data para o formato desejado
  const formattedDate = format(startOfDayDate, fm, { locale: ptBR });

  return formattedDate;
}

export function fDateMetrics(date, newFormat) {
  const fm = newFormat || 'yyyy-MM-dd';

  return date ? format(new Date(date), fm, { locale: ptBR }) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm, { locale: ptBR }) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function addHours(date, hours) {
  const hoursToAdd = hours * 60 * 60 * 1000;
  date.setTime(date.getTime() + hoursToAdd);
  return date;
}
