// @mui
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

export default function TableRowItem({ row, selected, onSelectProgram }) {
  const labelId = `checkbox-list-secondary-label-${row?.id}`;
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <>
            {row ? (
              <Checkbox
                edge="end"
                inputProps={{ 'aria-labelledby': labelId }}
                onChange={() => onSelectProgram(row.id)}
              />
            ) : (
              <Skeleton variant="rectangular" width={20} height={20} />
            )}
          </>
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center', padding: '23px' }}>
          <ListItemText
            primary={row?.customer?.name || <Skeleton />}
            secondary={
              <Stack>
                <Typography sx={{ color: 'text.primary' }}>
                  {row.name ? `Programa: ${row.name}` : <Skeleton />}
                </Typography>
              </Stack>
            }
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
