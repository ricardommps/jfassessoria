import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
// @mui
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
// utils
import { statusText, trainingProgramText, typeText } from 'src/utils/text-converter';

// ----------------------------------------------------------------------

export default function ListUsers({ title, subheader, tableLabels, tableData, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 2 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
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

  const isLight = theme.palette.mode === 'light';

  const popover = usePopover();

  const handleDownload = () => {
    popover.onClose();
    console.info('DOWNLOAD', row.id);
  };

  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.id);
  };

  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', row.id);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.id);
  };

  const renderAvatar = (
    <Box sx={{ position: 'relative', mr: 2 }}>
      <Avatar
        src={row.avatarUrl || ''}
        sx={{
          width: 48,
          height: 48,
          color: 'text.secondary',
          bgcolor: 'background.neutral',
        }}
      />
    </Box>
  );

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {renderAvatar}
          <ListItemText primary={row.message} />
        </TableCell>

        <TableCell>
          <Label
            variant={isLight ? 'soft' : 'filled'}
            color={
              (row.trainingProgram === 'in_progress' && 'success') ||
              (row.trainingProgram === 'close_to_expiration' && 'warning') ||
              'error'
            }
          >
            {trainingProgramText(row.trainingProgram).toUpperCase()}
          </Label>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(row.date), 'dd MMM yyyy')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>{typeText(row.type)}</TableCell>

        <TableCell>
          <Label
            variant={isLight ? 'soft' : 'filled'}
            color={
              (row.status === 'active' && 'success') ||
              (row.status === 'expired' && 'warning') ||
              'error'
            }
          >
            {statusText(row.status).toLocaleUpperCase()}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:cloud-download-fill" />
          Download
        </MenuItem>

        <MenuItem onClick={handlePrint}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

ListUsersRow.propTypes = {
  row: PropTypes.object,
};
