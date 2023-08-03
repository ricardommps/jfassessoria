import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { runningPace } from 'src/utils/running-pace';

export default function TablePaceSpeed({ pace, paceVla, paceVlan }) {
  return (
    <>
      <Stack pt={3} direction="row" spacing={2} justifyContent={'center'} alignItems={'center'}>
        <Chip label={`Pace: ${pace}`} sx={{ backgroundColor: '#f57f17' }} />
        <Chip label={`Pace Vla: ${paceVla}`} sx={{ backgroundColor: '#00b0ff' }} />
        <Chip label={`Pace Vlan: ${paceVlan}`} sx={{ backgroundColor: '#1de9b6' }} />
      </Stack>
      <Box
        pt={3}
        rowGap={0}
        columnGap={0}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, .5fr)',
          sm: 'repeat(2, .5fr)',
        }}
        textAlign={'center'}
      >
        <Typography sx={{ backgroundColor: 'gray' }}>Pace</Typography>
        <Typography sx={{ backgroundColor: 'gray' }}>Km/H</Typography>
        {runningPace.map((item) => (
          <Fragment key={item.pace}>
            <Typography
              sx={{
                backgroundColor:
                  parseFloat(pace).toFixed(2) === parseFloat(item.pace).toFixed(2)
                    ? '#f57f17'
                    : parseFloat(paceVla).toFixed(2) === parseFloat(item.pace).toFixed(2)
                    ? '#00b0ff'
                    : parseFloat(paceVlan).toFixed(2) === parseFloat(item.pace).toFixed(2)
                    ? '#1de9b6'
                    : '#fff8e1',
                color: '#212121',
              }}
            >
              {item.pace}
            </Typography>
            <Typography
              sx={{
                backgroundColor:
                  parseFloat(pace).toFixed(2) === parseFloat(item.pace).toFixed(2)
                    ? '#f57f17'
                    : parseFloat(paceVla).toFixed(2) === parseFloat(item.pace).toFixed(2)
                    ? '#00b0ff'
                    : parseFloat(paceVlan).toFixed(2) === parseFloat(item.pace).toFixed(2)
                    ? '#1de9b6'
                    : '#fff8e1',
                color: '#212121',
              }}
            >
              {item.speed}
            </Typography>
          </Fragment>
        ))}
      </Box>
    </>
  );
}
