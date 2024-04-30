import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import exportAsImage from 'src/utils/export-as-image';
export default function RatingItem({ rating }) {
  const popover = usePopover();
  const exportRef = useRef();

  const [type, setType] = useState('testimony');

  const renderTitle = () => {
    if (type === 'testimony') return 'Minha história com a JF Assessoria';
    if (type === 'ratingApp') return 'Avaliação do APP';
    if (type === 'ratingTrainings') return 'Avaliação do treinos';
  };

  const onSuccess = () => {
    enqueueSnackbar('Snapshot salva com sucesso! Agora é so compartilhar nas suas redes sociais.', {
      autoHideDuration: 8000,
      variant: 'success',
    });
  };

  const handleSubmit = () => {
    const userName = rating.customer.name.trim().split(' ').join('-');
    exportAsImage(exportRef.current, `${userName}-screenshot-${type}`, onSuccess);
  };

  const url = rating.customer.avatar && rating.customer.avatar.split('/upload');
  const newAvatar =
    rating.customer.avatar &&
    `${url[0]}/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35/${url[1]}`;
  return (
    <Card sx={{ minHeight: 200 }}>
      <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
      <Box ref={exportRef} sx={{ backgroundColor: '#212B36' }}>
        <Stack direction="row" justifyContent={'unset'} sx={{ p: 1 }}>
          <Box px={2}>
            <Image
              src={rating.customer.avatar ? newAvatar : '/assets/icons/navbar/ic_user.svg'}
              style={{ width: 80, height: 80 }}
            />
          </Box>

          <Stack alignItems="flex-end" pt={4}>
            <ListItemText
              sx={{
                mb: 1,
                mr: 'auto',
              }}
              primary={rating.customer.name}
              primaryTypographyProps={{
                noWrap: true,
                variant: 'subtitle2',
              }}
              secondary={renderTitle()}
              secondaryTypographyProps={{
                noWrap: true,
                component: 'span',
                variant: 'body2',
                color: 'text.primary',
                fontWeight: 'bold',
                pt: 2,
              }}
            />
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                position: 'relative',
                '&:hover': {
                  '& .message-actions': {
                    opacity: 1,
                  },
                },
                pr: 1,
              }}
            >
              {type === 'testimony' && (
                <Stack
                  sx={{
                    p: 1.5,
                    minWidth: 48,
                    maxWidth: 320,
                    borderRadius: 1,
                    typography: 'body2',
                    color: 'grey.800',
                    bgcolor: 'primary.lighter',
                  }}
                >
                  {rating.testimony || 'Não avaliado'}
                </Stack>
              )}
              {type === 'ratingTrainings' && (
                <Stack
                  spacing={2}
                  sx={{
                    position: 'relative',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ListItemText
                      primary={'Satisfação com os treinos'}
                      secondaryTypographyProps={{
                        component: 'span',
                        typography: 'caption',
                        mt: 0.5,
                        color: 'text.disabled',
                      }}
                    />
                  </Stack>
                  {!rating.ratingTrainings && !rating.commentsRatingTrainings && (
                    <Typography variant="body2">Não avaliado</Typography>
                  )}
                  {rating.ratingTrainings && (
                    <Rating value={rating.ratingTrainings} size="small" readOnly />
                  )}

                  {rating.commentsRatingTrainings && (
                    <Stack
                      sx={{
                        p: 1.5,
                        minWidth: 48,
                        maxWidth: 320,
                        borderRadius: 1,
                        typography: 'body2',
                        color: 'grey.800',
                        bgcolor: 'primary.lighter',
                      }}
                    >
                      {rating.commentsRatingTrainings}
                    </Stack>
                  )}
                </Stack>
              )}
              {type === 'ratingApp' && (
                <Stack
                  spacing={2}
                  sx={{
                    position: 'relative',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ListItemText
                      primary={'Satisfação com o APP'}
                      secondaryTypographyProps={{
                        component: 'span',
                        typography: 'caption',
                        mt: 0.5,
                        color: 'text.disabled',
                      }}
                    />
                  </Stack>
                  {!rating.ratingApp && !rating.commentsRatingApp && (
                    <Typography variant="body2">Não avaliado</Typography>
                  )}
                  {rating.ratingApp && <Rating value={rating.ratingApp} size="small" readOnly />}

                  {rating.commentsRatingApp && (
                    <Stack
                      sx={{
                        p: 1.5,
                        minWidth: 48,
                        maxWidth: 320,
                        borderRadius: 1,
                        typography: 'body2',
                        color: 'grey.800',
                        bgcolor: 'primary.lighter',
                      }}
                    >
                      {rating.commentsRatingApp}
                    </Stack>
                  )}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Box width={'100%'} display="flex" justifyContent="flex-end" p={2}>
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="bottom-center"
          sx={{ width: 'auto' }}
        >
          <MenuItem
            onClick={() => {
              popover.onClose();
              setType('testimony');
            }}
          >
            <SmartphoneIcon />
            Ver depoimento
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              setType('ratingApp');
            }}
          >
            <SmartphoneIcon />
            Ver avaliação app
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              setType('ratingTrainings');
            }}
          >
            <FitnessCenterIcon />
            Ver avaliação treino
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              handleSubmit();
            }}
            sx={{ color: 'info.main' }}
          >
            <ScreenshotMonitorIcon />
            Snapshot
          </MenuItem>
        </CustomPopover>
      </Box>
    </Card>
  );
}
