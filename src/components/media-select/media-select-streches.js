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

const tags = ['Alongamento ativo', 'Alongamento passivo', 'Alongamentos'];

export default function MediaSelectStreches({
  drawer,
  handleSaveStreches,
  strechesMedias,
  handleRemoveStreches,
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
      await onGetListMedias(tags);
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
      setOptions(sortedMedias);
      setSearchOptions(sortedMedias);
    }
  }, [medias]);

  useEffect(() => {
    if (strechesMedias) {
      const newMedias = [...(strechesMedias || [])]
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
  }, [strechesMedias]);

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Selecione os vídeos de alongamentos ativos e educativos de corrida
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
      handleSaveStreches(newMediasSelected);
    } else {
      newMediasSelected.splice(currentIndex, 1);
      handleRemoveStreches([value]);
    }
    setMediasSelected(newMediasSelected);
  };
  return (
    <>
      <Drawer
        open={drawer.value}
        anchor="right"
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
        ModalProps={{
          keepMounted: true, // Garante que o Drawer não feche automaticamente ao interagir com o Dialog
          disablePortal: true, // Garante que o Drawer seja renderizado no mesmo nível do Dialog
        }}
        sx={{ zIndex: 1500 }}
      >
        {renderHead}

        <Divider />
        <Box px={2} pt={2}>
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
        <Box p={2}>
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
      </Drawer>
    </>
  );
}
