import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Iconify from 'src/components/iconify/iconify';
import SvgColor from 'src/components/svg-color/svg-color';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';
export default function CardItem({ customer, setCustomerForm }) {
  const popover = usePopover();

  const { onCustomerById } = useCustomer();
  const { onClearPrograms, onClearProgram, onListPrograms } = useProgram();
  const { onShowTraining, onClearTrainings } = useTraining();

  const handleOpenCustomer = (id) => {
    onCustomerById(id);
    onClearPrograms();
    onClearProgram();
    onShowTraining(false);
    onClearTrainings();
    setCustomerForm(true);
  };

  const handleOpenProgram = (customerId) => {
    onCustomerById(customerId);
    onListPrograms(customerId);
    setCustomerForm(false);
  };
  return (
    <>
      <Card>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
        <Stack sx={{ p: 3, pb: 2 }}>
          <ListItemText
            sx={{ mb: 1 }}
            primary={<Typography color="inherit">{customer.name}</Typography>}
            secondary={<Typography>{customer.email}</Typography>}
            primaryTypographyProps={{
              typography: 'subtitle1',
            }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />
          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', typography: 'caption' }}
          >
            <Iconify width={16} icon="material-symbols:assignment" />
            {customer?.programs ? customer?.programs.length : ''} Programas
          </Stack>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(1, 1fr)" sx={{ p: 3 }}>
          <Stack
            spacing={0.5}
            flexShrink={0}
            direction="row"
            alignItems="center"
            sx={{ color: 'text.disabled', minWidth: 0 }}
          >
            <Iconify width={16} icon="carbon:warning-filled" sx={{ flexShrink: 0 }} />
            <Typography variant="caption" noWrap>
              Expiração: 22/02/2023
            </Typography>
          </Stack>
        </Box>
      </Card>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenCustomer(customer.id);
            popover.onClose();
          }}
        >
          <SvgColor src="/assets/icons/navbar/ic_user.svg" sx={{ mr: 1 }} />
          Cadastro
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenProgram(customer.id);
            popover.onClose();
          }}
        >
          <SvgColor src="/assets/icons/navbar/icon_runner.svg" sx={{ mr: 1 }} />
          Programas
        </MenuItem>
      </CustomPopover>
    </>
  );
}
