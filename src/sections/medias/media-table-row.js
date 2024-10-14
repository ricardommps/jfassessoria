import { LoadingButton } from '@mui/lab';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import useMedia from 'src/hooks/use-media';

import MediaThumbnail from './media-thumbnail';
export default function MediaTableRow({ row, handleEditRow }) {
  const theme = useTheme();
  const details = useBoolean();
  const popover = usePopover();
  const onDelete = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const { onDeleteMediaById, deleteMedia, deleteStatus, onGetListMedias } = useMedia();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { title, instrucctions, blocked, thumbnail, tags } = row;
  const defaultStyles = {
    borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
  };

  const handleDelete = () => {
    setLoadingDelete(true);
    onDelete.onFalse();
    onDeleteMediaById(row.id);
  };

  useEffect(() => {
    if (deleteStatus.error) {
      enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
        autoHideDuration: 8000,
        variant: 'error',
      });
      setLoadingDelete(false);
      onGetListMedias();
    }
  }, [deleteStatus.error]);

  useEffect(() => {
    if (deleteMedia) {
      enqueueSnackbar('Deletado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      setLoadingDelete(false);
      onGetListMedias();
    }
  }, [deleteMedia]);

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });
  const RenderTags = () => (
    <Stack>
      {tags.map((tag, index) => (
        <Typography key={`tags-${index}`}>{tag}</Typography>
      ))}
    </Stack>
  );
  return (
    <>
      <TableRow
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20,
            },
          },
          [`& .${tableCellClasses.root}`]: {
            ...defaultStyles,
          },
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              ...defaultStyles,
            },
          }),
        }}
      >
        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <MediaThumbnail thumbnail={thumbnail} />
            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {title}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell onClick={handleClick}>
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {instrucctions}
          </Typography>
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {blocked ? 'Bloqueado' : 'Ativo'}
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <RenderTags />
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete.onTrue();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Deletar
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleEditRow(row.id);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>
      </CustomPopover>
      {onDelete.value && (
        <ConfirmDialog
          open={onDelete.value}
          onClose={onDelete.onFalse}
          title={'Deseja DELETAR a mídia?'}
          action={
            <LoadingButton
              variant="contained"
              color="success"
              onClick={handleDelete}
              loading={loadingDelete}
            >
              Confirmar
            </LoadingButton>
          }
        />
      )}
    </>
  );
}
