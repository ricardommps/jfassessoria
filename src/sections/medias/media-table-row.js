import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';

import MediaThumbnail from './media-thumbnail';
export default function MediaTableRow({ row }) {
  const theme = useTheme();
  const details = useBoolean();
  const popover = usePopover();
  const { title, instrucctions, blocked, thumbnail } = row;
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

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });
  return (
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
          <MediaThumbnail />
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
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
