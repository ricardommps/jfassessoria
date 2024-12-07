import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { useBoolean } from 'src/hooks/use-boolean';

export default function MediaItem({ media }) {
  const details = useBoolean();
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar
            sx={{ width: 60, height: 60 }}
            variant="square"
            alt="Remy Sharp"
            src={media?.thumbnail || 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg'}
          />
        </ListItemAvatar>
        <ListItemText primary={media.title} />
      </ListItem>
    </>
  );
}
