import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function parseDateOnly(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const [year, month, day] = String(value).split('T')[0].split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatLessonDate(value) {
  const date = parseDateOnly(value);

  if (!date) {
    return '-';
  }

  const weekday = format(date, 'EEEE', { locale: ptBR }).replace('-feira', '');

  return `${format(date, 'dd/MM')} (${weekday})`;
}

function formatLessonStatus(lessonClass) {
  const labels = [];
  const isPendingLesson = lessonClass.type === 'pending';
  const isRescheduledLesson = !isPendingLesson && lessonClass.status === 'pending';

  if (lessonClass.type === 'barter') {
    labels.push('permuta');
  }

  if (isPendingLesson) {
    labels.push('pendente');
  }

  if (isRescheduledLesson) {
    labels.push('remarcada');
  }

  if (lessonClass.status === 'canceled') {
    labels.push('cancelada');
  }

  if (!labels.length) {
    return '';
  }

  return ` - ${labels.join(' - ')}${isPendingLesson || isRescheduledLesson ? ' ⏳' : ''}`;
}

function formatAmount(value) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function sortClasses(classes) {
  return [...classes].sort((classA, classB) => {
    const dateA = String(classA.scheduledDate || '');
    const dateB = String(classB.scheduledDate || '');

    if (dateA !== dateB) {
      return dateA.localeCompare(dateB);
    }

    return String(classA.scheduledTime || '').localeCompare(String(classB.scheduledTime || ''));
  });
}

export function formatLessonPackageWhatsappMessage(lessonPackage) {
  const classes = sortClasses(lessonPackage?.classes || []);
  const totalLessons = Number(lessonPackage?.totalLessons ?? classes.length);
  const barterCount = classes.filter((lessonClass) => lessonClass.type === 'barter').length;
  const lessonLines = classes.map((lessonClass, index) => {
    const lessonLine = `${index + 1}- ${formatLessonDate(
      lessonClass.scheduledDate,
    )}${formatLessonStatus(lessonClass)}${lessonClass.status === 'finished' ? ' ✅' : ''}`;
    const notes = String(lessonClass.notes || '').trim();

    return notes ? `${lessonLine}\n${notes}` : lessonLine;
  });
  const header = [lessonPackage?.title, lessonPackage?.description].filter(Boolean).join('\n');
  const totalLabel = `${totalLessons} aula${
    totalLessons === 1 ? '' : 's'
  }, sendo ${barterCount} permuta${barterCount === 1 ? '' : 's'}`;
  const sections = [
    header || 'Cronograma de aulas',
    lessonLines.join('\n'),
    `💰${formatAmount(lessonPackage?.totalAmount)} (${totalLabel})`,
    String(lessonPackage?.warnings || '').trim(),
  ].filter(Boolean);

  return sections.join('\n\n');
}
