import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PropTypes from 'prop-types';
import Label from 'src/components/label';

const TYPE_LABELS = {
  regular: 'Regular',
  pending: 'Pendente',
  barter: 'Permuta',
};

const TYPE_COLORS = {
  regular: 'info',
  pending: 'warning',
  barter: 'default',
};

function parseDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const [year, month, day] = String(value).split('-').map(Number);

  return new Date(year, month - 1, day);
}

function formatDate(value) {
  const date = parseDate(value);

  if (!date) {
    return '-';
  }

  return format(date, "dd/MM/yyyy '·' EEEE", { locale: ptBR });
}

export default function LessonPackageClassRow({
  lessonClass,
  onRemove,
  sequence,
  disabled,
  showStatus,
}) {
  const canRemove = !lessonClass.id || lessonClass.status === 'scheduled';
  const statusLabels = {
    scheduled: 'Programada',
    pending: 'Pendente',
    finished: 'Finalizada',
    canceled: 'Cancelada',
  };
  return (
    <TableRow>
      <TableCell>{sequence}</TableCell>

      <TableCell>
        <Typography variant="subtitle2">{formatDate(lessonClass.scheduledDate)}</Typography>
        {lessonClass.notes && (
          <Typography variant="caption" color="text.secondary">
            {lessonClass.notes}
          </Typography>
        )}
      </TableCell>

      <TableCell>{lessonClass.scheduledTime || 'Sem horário'}</TableCell>

      <TableCell>
        <Label variant="soft" color={TYPE_COLORS[lessonClass.type] || 'default'}>
          {TYPE_LABELS[lessonClass.type] || lessonClass.type}
        </Label>
      </TableCell>

      {showStatus && (
        <TableCell>{statusLabels[lessonClass.status] || 'Programada (nova)'}</TableCell>
      )}

      <TableCell align="right">
        <Tooltip title={canRemove ? 'Excluir aula' : 'Só é possível excluir aulas programadas'}>
          <span>
            <IconButton
              color="error"
              aria-label="Excluir aula"
              disabled={disabled || !canRemove}
              onClick={() => {
                if (canRemove && !disabled) onRemove(lessonClass);
              }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

LessonPackageClassRow.propTypes = {
  disabled: PropTypes.bool,
  showStatus: PropTypes.bool,
  lessonClass: PropTypes.object,
  onRemove: PropTypes.func,
  sequence: PropTypes.number,
};
