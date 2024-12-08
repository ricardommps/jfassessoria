import { format, formatDistanceToNow, getTime } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm, { locale: ptBR }) : '';
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
