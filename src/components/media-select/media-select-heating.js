import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import useMedia from 'src/hooks/use-media';

import LoadingProgress from '../loading-progress';
import Scrollbar from '../scrollbar';

const heatingTags = ['Aquecimento'];

export default function MediaSelectHeating({
  drawer,
  handleSaveHeatings,
  heatingMedias,
  handleRemoveHeatings,
  workoutMedias,
}) {
  const [mediasSelected, setMediasSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { onGetListMedias, medias } = useMedia();

  const handleSearch = useCallback(
    (event) => {
      const { value } = event.target;
      setSearchQuery(value);

      if (value) {
        const results = searchOptions.filter((item) =>
          item.title.toLowerCase().includes(value.toLowerCase()),
        );
        setOptions(results);
      } else {
        setOptions(searchOptions);
      }
    },
    [options],
  );

  const initialize = useCallback(async () => {
    setLoading(true);
    try {
      await onGetListMedias(heatingTags);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (medias) {
      const sortedMedias = [...(medias || [])]
        .sort((a, b) => a.title.localeCompare(b.title))
        .reduce((acc, current) => {
          const duplicate = acc.find((item) => item.id === current.id);
          if (!duplicate) {
            acc.push(current);
          }
          return acc;
        }, []);
      const filteredSortedMedias = sortedMedias.filter(
        (item) => !workoutMedias.some((removeItem) => removeItem.id === item.id),
      );
      setOptions(filteredSortedMedias);
      setSearchOptions(filteredSortedMedias);
    }
  }, [medias]);

  useEffect(() => {
    if (heatingMedias) {
      const newMedias = [...(heatingMedias || [])]
        .sort((a, b) => a.title.localeCompare(b.title))
        .reduce((acc, current) => {
          const duplicate = acc.find((item) => item.id === current.id);
          if (!duplicate) {
            acc.push(current);
          }
          return acc;
        }, []);
      setMediasSelected(newMedias);
    }
  }, [heatingMedias]);

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Selecione os vídeos de aquecimento
      </Typography>

      <IconButton onClick={drawer.onFalse}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const handleToggle = (value) => () => {
    const newMediasSelected = [...mediasSelected];
    const currentIndex = newMediasSelected.findIndex((item) => item.id === value.id);

    if (currentIndex === -1) {
      newMediasSelected.push(value);
      handleSaveHeatings(newMediasSelected);
    } else {
      newMediasSelected.splice(currentIndex, 1);
      handleRemoveHeatings([value]);
    }
    setMediasSelected(newMediasSelected);
  };
  return (
    <>
      <Drawer
        open={drawer.value}
        anchor="right"
        ModalProps={{
          keepMounted: true, // Garante que o Drawer não feche automaticamente ao interagir com o Dialog
          disablePortal: true, // Garante que o Drawer seja renderizado no mesmo nível do Dialog
        }}
        sx={{ zIndex: 1800 }}
      >
        {renderHead}

        <Divider />
        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box>
              <TextField
                fullWidth
                placeholder="Buscar..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              {loading && <LoadingProgress />}
              {!loading && options.length > 0 && (
                <Box>
                  <List>
                    {options.map((item) => (
                      <Fragment key={item.id}>
                        <ListItem disablePadding>
                          <ListItemButton role={undefined} dense onClick={handleToggle(item)}>
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': item.id }}
                                checked={mediasSelected.some(
                                  (selectedMedia) => selectedMedia.id === item.id,
                                )}
                              />
                            </ListItemIcon>
                            <ListItemText id={item.id} primary={item.title} />
                          </ListItemButton>
                        </ListItem>
                        <Divider component="li" />
                      </Fragment>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
