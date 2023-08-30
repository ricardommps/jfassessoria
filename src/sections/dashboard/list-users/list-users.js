import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
// @mui
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { addHours, format } from 'date-fns';
import PropTypes from 'prop-types';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

export default function ListUsers({ title, subheader, tableLabels, tableData, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 2 }} />

      <TableContainer sx={{ overflow: 'unset', height: '50vh' }}>
        <Scrollbar sx={{ minWidth: 720 }}>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <ListUsersRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

ListUsers.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function ListUsersRow({ row }) {
  const theme = useTheme();
  const { payments } = row;

  const checkDueDate = (dueDate, paymentDate) => {
    if (!dueDate) {
      return theme.palette.warning.main;
    }
    const paymentDateTimezone = paymentDate && addHours(new Date(paymentDate), 3).toISOString();
    const currentDate = new Date().toISOString();
    const dueDateTimezone = addHours(new Date(dueDate), 3).toISOString();
    if (!paymentDateTimezone && dueDateTimezone < currentDate) {
      return theme.palette.error.main;
    }
    return theme.palette.success.main;
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={row.name}
            secondary={row.email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell
          sx={{
            whiteSpace: 'nowrap',
            color: checkDueDate(payments[0]?.dueDate, payments[0]?.paymentDate),
          }}
        >
          {payments[0]?.id ? format(addHours(new Date(payments[0]?.dueDate), 3), 'dd/MM/yyyy') : ''}
        </TableCell>

        <TableCell>
          {row.isRunner && <Typography>Assessoria de corrida</Typography>}
          {row.isStrength && <Typography>Assessoria de força</Typography>}
        </TableCell>

        <TableCell>
          <Chip label={row.active ? 'Ativo' : 'Inativo'} color={row.active ? 'primary' : 'error'} />
        </TableCell>
      </TableRow>
    </>
  );
}

ListUsersRow.propTypes = {
  row: PropTypes.object,
};
