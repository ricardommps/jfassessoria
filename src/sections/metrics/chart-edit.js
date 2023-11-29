import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Scrollbar from 'src/components/scrollbar';
export default function ChartEdit({ item, open, onClose, ...other }) {
  return (
    <Drawer
      open={open}
      anchor="right"
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: { width: 420 },
      }}
      {...other}
    >
      <Scrollbar sx={{ height: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6"> {item.title} </Typography>
          <IconButton color={'default'} onClick={onClose}>
            <ArrowCircleLeftIcon />
          </IconButton>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
