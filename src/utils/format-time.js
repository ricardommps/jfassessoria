import { format, formatDistanceToNow, getTime } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  // Verifica se o código está rodando em produção (não local)
  const isProduction = process.env.NODE_ENV === 'production';

  if (!date) return '';

  // Cria a data a partir da string recebida
  const parsedDate = new Date(date);

  // Se não estiver rodando localmente, adiciona 3 horas
  if (isProduction) {
    parsedDate.setHours(parsedDate.getHours() + 3);
  }

  // Formata a data para o formato desejado
  return format(parsedDate, fm, { locale: ptBR });
}

// executionDay is a calendar date, not a UTC timestamp. Parsing YYYY-MM-DD
// with new Date shifts it to the previous day in Brazilian time zones.
export function fDateOnly(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  if (!date) return '';

  const value = String(date);
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const parsedDate = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(date);

  return format(parsedDate, fm, { locale: ptBR });
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
