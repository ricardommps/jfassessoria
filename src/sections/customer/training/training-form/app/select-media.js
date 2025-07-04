import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import LoadingProgress from 'src/components/loading-progress';
import Scrollbar from 'src/components/scrollbar';
import useMedia from 'src/hooks/use-media';

export default function SelectMedia({ open, handleSave, mediasSelected, onClose, index }) {
  const [currentMediasSelected, setCurrentMediasSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { onGetListMedias, medias } = useMedia();

  // Função para achatar o array de arrays e filtrar duplicatas
  const flattenAndDeduplicateMedias = useCallback((mediasArray) => {
    if (!mediasArray || !Array.isArray(mediasArray)) {
      return [];
    }

    const flattened = mediasArray.flat();

    return flattened
      .filter((item) => item && item.title) // Filtra itens válidos com title
      .sort((a, b) => a.title.localeCompare(b.title))
      .reduce((acc, current) => {
        const duplicate = acc.find((item) => item.id === current.id);
        if (!duplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
  }, []);

  const handleSearch = useCallback(
    (event) => {
      const { value } = event.target;
      setSearchQuery(value);

      if (value) {
        const results = searchOptions.filter(
          (item) => item.title && item.title.toLowerCase().includes(value.toLowerCase()),
        );
        setOptions(results);
      } else {
        setOptions(searchOptions);
      }
    },
    [searchOptions], // Corrigida dependência
  );

  const initialize = useCallback(async () => {
    setLoading(true);
    try {
      await onGetListMedias();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [onGetListMedias]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (medias) {
      const sortedMedias = [...(medias || [])]
        .filter((item) => item && item.title) // Filtra itens válidos
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
    if (mediasSelected) {
      const flattenedMedias = flattenAndDeduplicateMedias(mediasSelected);
      setCurrentMediasSelected(flattenedMedias);
    } else {
      setCurrentMediasSelected([]);
    }
  }, [mediasSelected, flattenAndDeduplicateMedias]);

  const renderHead = (
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          Selecione os vídeos de aquecimento
        </Typography>
      </Toolbar>
    </AppBar>
  );

  const handleToggle = (value) => () => {
    const newMediasSelected = [...currentMediasSelected];
    const currentIndex = newMediasSelected.findIndex((item) => item.id === value.id);

    if (currentIndex === -1) {
      newMediasSelected.push(value);
    } else {
      newMediasSelected.splice(currentIndex, 1);
    }
    setCurrentMediasSelected(newMediasSelected);
  };

  const handleSubmit = () => {
    // Achatar e deduplificar as mídias já selecionadas anteriormente
    const previouslySelected = flattenAndDeduplicateMedias(mediasSelected);

    // Filtrar apenas as novas seleções (que não estavam no mediasSelected original)
    const newSelections = currentMediasSelected.filter(
      (currentMedia) =>
        !previouslySelected.some((previousMedia) => previousMedia.id === currentMedia.id),
    );

    // Enviar apenas as novas seleções
    handleSave(currentMediasSelected, index);
    onClose();
  };
  console.log('---mediasSelected', mediasSelected);
  return (
    <>
      <Drawer
        open={open}
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
                                checked={currentMediasSelected.some(
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
        <Stack
          p={3}
          alignItems="flex-end"
          spacing={2}
          flexDirection={'row'}
          justifyContent={'flex-end'}
        >
          <Button variant="outlined" fullWidth onClick={onClose}>
            Voltar
          </Button>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Salvar
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
