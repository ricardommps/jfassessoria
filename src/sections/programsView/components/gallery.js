import { Box } from '@mui/material';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { _mock } from 'src/_mock';

const RATIO = ['4/3', '3/4', '6/4', '4/6', '16/9', '9/16', '21/9', '9/21', '1/1'];

const IMAGES = RATIO.map((ratio, index) => ({
  ratio,
  url: _mock.image.cover(index + 1),
}));

export default function Gallery({ open, onClose }) {
  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose}>
      <DialogTitle>
        <Typography variant="h3" align="center">
          Selecione uma capa para o Programa
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(8, 1fr)',
          }}
          sx={{ p: 3 }}
        >
          {IMAGES.map((img) => (
            <Button key={img.ratio} onClick={onClose}>
              <Image
                key={img.ratio}
                alt={img.ratio}
                src="https://supertreinosapp.com/img/free/ADAPTACAO.jpg"
                sx={{ borderRadius: 2 }}
                width={94}
                height={125}
              />
            </Button>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Gallery.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
