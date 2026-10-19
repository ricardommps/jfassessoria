import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PropTypes from 'prop-types';
import Label from 'src/components/label';
import LoadingProgress from 'src/components/loading-progress';
import { useLessonPackageClasses } from 'src/hooks/use-lesson-packages';

const CLASS_TYPE_LABELS = {
  regular: 'Regular',
  pending: 'Pendente',
  barter: 'Permuta',
};

const CLASS_STATUS_LABELS = {
  scheduled: 'Programada',
  pending: 'Pendente',
  finished: 'Finalizada',
  canceled: 'Cancelada',
};

const CLASS_STATUS_COLORS = {
  scheduled: 'info',
  pending: 'warning',
  finished: 'success',
  canceled: 'error',
};

function formatDate(value) {
  if (!value) {
    return '-';
  }

  const [date] = String(value).split('T');
  const [year, month, day] = date.split('-').map(Number);

  return format(new Date(year, month - 1, day), "dd/MM/yyyy '·' EEE", { locale: ptBR });
}

function formatTime(value) {
  if (!value) {
    return '-';
  }

  return String(value).slice(0, 5);
}

export default function LessonPackageDetail({ open, onClose, lessonPackage }) {
  const { data: classes = [], isLoading, error } = useLessonPackageClasses(lessonPackage?.id, open);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6">{lessonPackage?.title || 'Aulas do pacote'}</Typography>
            <Typography variant="body2" color="text.secondary">
              Cronograma de aulas do pacote selecionado.
            </Typography>
          </Stack>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ position: 'relative', minHeight: 220 }}>
        {isLoading && <LoadingProgress />}

        {error && (
          <Typography color="error" variant="body2">
            Não foi possível carregar as aulas deste pacote.
          </Typography>
        )}

        {!isLoading && !error && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Observação</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {classes.map((lessonClass) => (
                  <TableRow key={lessonClass.id}>
                    <TableCell>{formatDate(lessonClass.scheduledDate)}</TableCell>
                    <TableCell>{formatTime(lessonClass.scheduledTime)}</TableCell>
                    <TableCell>{CLASS_TYPE_LABELS[lessonClass.type] || lessonClass.type}</TableCell>
                    <TableCell>
                      <Label
                        variant="soft"
                        color={CLASS_STATUS_COLORS[lessonClass.status] || 'default'}
                      >
                        {CLASS_STATUS_LABELS[lessonClass.status] || lessonClass.status}
                      </Label>
                    </TableCell>
                    <TableCell>{lessonClass.notes || '-'}</TableCell>
                  </TableRow>
                ))}

                {!classes.length && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Nenhuma aula cadastrada neste pacote.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}

LessonPackageDetail.propTypes = {
  lessonPackage: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
