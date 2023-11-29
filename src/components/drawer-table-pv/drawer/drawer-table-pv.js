'use client';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Iconify from '../../iconify';
import TablePaceSpeed from '../../table-pace-speed';
import { useTablePvContext } from '../context';
export default function DrawerTablePv() {
  const tablePv = useTablePvContext();
  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Tabela PV
      </Typography>
      <IconButton onClick={tablePv.onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderTable = (
    <Stack>
      <TablePaceSpeed minWidth={200} />
    </Stack>
  );
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={tablePv.open}
      onClose={tablePv.onClose}
      PaperProps={{
        sx: { width: 320 },
      }}
      sx={{
        zIndex: 1400,
        position: 'absolute',
      }}
    >
      {renderHead}

      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderTable}
    </Drawer>
  );
}
