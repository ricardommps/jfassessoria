import { Typography } from '@mui/material';
import { extractUrl } from 'src/utils/extract-url';

import TextMaxLine from '../text-max-line';

export function WorkoutLinkDisplay({ link }) {
  if (!link) return null;

  const url = extractUrl(link);

  if (!url) {
    return (
      <Typography variant="caption" color="text.secondary">
        Link inválido
      </Typography>
    );
  }

  return (
    <TextMaxLine
      asLink
      target="_blank"
      rel="noopener noreferrer"
      href={url}
      color="primary"
      sx={{ maxWidth: 200 }}
    >
      Link do treino
    </TextMaxLine>
  );
}
