import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

export function IntensityBadges({ intensities, unitMeasurement }) {
  if (!intensities || intensities.length === 0) return null;

  const parsedIntensities = intensities.map((intensity) => {
    try {
      return JSON.parse(intensity);
    } catch {
      return intensity;
    }
  });

  const intensityValues = parsedIntensities.map((intensity) => {
    if (intensity.value) return intensity.value;
    if (intensity.intensitie) return intensity.intensitie;
    return intensity;
  });

  const noEmptyValues = intensityValues.filter((str) => str !== '');

  return (
    <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)" width={'50px'} pt={3}>
      {noEmptyValues.map((item, index) => (
        <Badge badgeContent={index + 1} color="info" key={`intensities-badge-key-${index}`}>
          <Chip
            label={`${item} ${unitMeasurement === 'pace' ? 'min' : 'km/h'}`}
            key={`intensities-key-${index}`}
            sx={{ width: '100px' }}
          />
        </Badge>
      ))}
    </Box>
  );
}
