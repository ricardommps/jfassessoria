import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useExpiringLessonPackages } from 'src/hooks/use-lesson-packages';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

function getDaysLabel(days) {
  if (days < 0) {
    const elapsed = Math.abs(days);
    return `Vencido há ${elapsed} ${elapsed === 1 ? 'dia' : 'dias'}`;
  }
  if (days === 0) return 'Vence hoje';
  if (days === 1) return '1 dia restante';
  return `${days} dias restantes`;
}

function getSeverityColor(days) {
  if (days <= 2) return 'error';
  if (days <= 4) return 'warning';
  return 'info';
}

export default function ExpiringLessonPackages() {
  const {
    data: packages = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useExpiringLessonPackages();

  return (
    <Card sx={{ height: '55vh', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="PACOTES A VENCER" subheader={'Próximos 7 dias'} sx={{ mb: 1 }} />

      <Stack spacing={1.5} sx={{ px: 2, pb: 2, flex: 1, overflowY: 'auto' }}>
        {isLoading && (
          <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
            <CircularProgress size={28} />
          </Stack>
        )}

        {!isLoading && isError && (
          <Stack
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%', textAlign: 'center' }}
          >
            <ErrorOutlineOutlinedIcon color="error" fontSize="large" />
            <Typography variant="subtitle2" color="error">
              Erro ao carregar pacotes
            </Typography>
            <Button size="small" disabled={isFetching} onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </Stack>
        )}

        {!isLoading && !isError && packages.length === 0 && (
          <Stack
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%', textAlign: 'center', color: 'text.secondary' }}
          >
            <EventAvailableOutlinedIcon fontSize="large" />
            <Typography variant="subtitle2">Nenhum pacote próximo ao vencimento</Typography>
            <Typography variant="caption">
              O vencimento considera a data da última aula de cada pacote ativo.
            </Typography>
          </Stack>
        )}

        {!isLoading &&
          !isError &&
          packages.map((lessonPackage) => {
            const color = getSeverityColor(lessonPackage.daysUntilExpiration);
            const href = paths.dashboard.customer.lessonPackages(lessonPackage.customerId);

            return (
              <Stack
                key={lessonPackage.packageId}
                direction="row"
                alignItems="flex-start"
                spacing={1.5}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: (theme) => `${theme.palette[color].main}14`,
                  border: (theme) => `1px solid ${theme.palette[color].main}33`,
                }}
              >
                <Avatar src={lessonPackage.avatar || undefined} alt={lessonPackage.customerName} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Link component={RouterLink} href={href} color="text.primary" variant="subtitle2">
                    {lessonPackage.customerName}
                  </Link>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {lessonPackage.title}
                  </Typography>
                  <Stack spacing={0.75} alignItems="flex-start">
                    <Chip
                      icon={<AccessTimeOutlinedIcon />}
                      label={getDaysLabel(lessonPackage.daysUntilExpiration)}
                      color={color}
                      size="small"
                      sx={{ fontSize: '0.75rem', height: 22 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Última aula: {format(parseISO(lessonPackage.endDate), 'dd/MM/yyyy')}
                    </Typography>
                  </Stack>
                </Box>
                <Tooltip title="Ver pacote">
                  <IconButton
                    component={RouterLink}
                    href={href}
                    size="small"
                    aria-label="Ver pacote"
                  >
                    <OpenInNewOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          })}
      </Stack>
    </Card>
  );
}
