import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { removeItems } from 'src/utils/medias';

export const ImageThumbnail = styled('img')(() => ({
  borderRadius: '8px',
  width: 100,
  height: 'auto',
}));

// Função para interseção de IDs
function intersection(a, b) {
  return a.filter((value) => b.some((item) => item.id === value));
}

export default function TransferList({ left, setLeft, right, setRight }) {
  const [checked, setChecked] = useState([]);
  const [searchRightQuery, setSearchRightQuery] = useState('');
  const [searchRightResults, setSearchRightResults] = useState([]);
  const [searchLeftQuery, setSearchLeftQuery] = useState('');
  const [searchLeftResults, setSearchLeftResults] = useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  // Função para mover itens da esquerda para a direita
  const handleCheckedRight = () => {
    const selected = left.filter((item) => leftChecked.includes(item.id));
    const removed = removeItems(left, leftChecked);
    setRight([...right, ...selected]);
    setLeft(removed);
    setChecked([]);
    setSearchLeftResults(removed); // Atualiza resultados de busca na esquerda
    setSearchRightResults([...right, ...selected]); // Atualiza resultados de busca na direita
  };

  // Função para mover itens da direita para a esquerda
  const handleCheckedLeft = () => {
    const selected = right.filter((item) => rightChecked.includes(item.id));
    const removed = removeItems(right, rightChecked);
    setLeft([...left, ...selected]);
    setRight(removed);
    setChecked([]);
    setSearchRightResults(removed); // Atualiza resultados de busca na direita
    setSearchLeftResults([...left, ...selected]); // Atualiza resultados de busca na esquerda
  };

  const handleSearchRight = useCallback(
    (event) => {
      const { value } = event.target;
      setSearchRightQuery(value);

      if (value) {
        const results = right.filter((item) =>
          item.title.toLowerCase().includes(value.toLowerCase()),
        );
        setSearchRightResults(results);
      } else {
        setSearchRightResults(right);
      }
    },
    [right],
  );

  const handleSearchLeft = useCallback(
    (event) => {
      const { value } = event.target;
      setSearchLeftQuery(value);

      if (value) {
        const results = left.filter((item) =>
          item.title.toLowerCase().includes(value.toLowerCase()),
        );
        setSearchLeftResults(results);
      } else {
        setSearchLeftResults(left);
      }
    },
    [left],
  );

  const customList = (title, items, onSearch, searchQuery) => (
    <Card sx={{ borderRadius: 1.5, width: '400px', p: 2 }}>
      <CardHeader
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selecionado`}
        sx={{ p: 2 }}
      />
      <TextField
        placeholder="Buscar..."
        value={searchQuery}
        onChange={onSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ width: '95%', mb: 2 }}
      />
      <Divider />
      <List dense component="div" role="list" sx={{ width: 'auto', height: 220, overflow: 'auto' }}>
        {items.map((item) => {
          const isChecked = checked.includes(item.id);
          return (
            <ListItemButton
              key={item.id}
              role="listitem"
              onClick={handleToggle(item.id)}
              sx={{ padding: 2 }}
            >
              <ListItemIcon>
                <Checkbox
                  disableRipple
                  checked={isChecked}
                  tabIndex={-1}
                  inputProps={{ 'aria-labelledby': item.id }}
                />
              </ListItemIcon>
              <ListItemAvatar>
                <Box sx={{ width: 100, position: 'relative', flexShrink: 0 }}>
                  <ImageThumbnail
                    alt={title}
                    src={item.thumbnail ? item.thumbnail : '/assets/illustrations/image.jpeg'}
                  />
                </Box>
              </ListItemAvatar>
              <ListItemText id={item.id} primary={item.title} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  // useEffect(() => {
  //   if (medias) {
  //     setRight(medias);
  //   }
  // }, [medias]);

  useEffect(() => {
    setSearchRightResults(right);
  }, [right]);

  useEffect(() => {
    setSearchLeftResults(left);
  }, [left]);

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ width: 'auto', p: 3 }}>
      <Grid>
        {customList('Selecionados', searchLeftResults, handleSearchLeft, searchLeftQuery)}
      </Grid>
      <Grid container direction="column" alignItems="center" sx={{ p: 3 }}>
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
          sx={{ my: 1 }}
        >
          <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
        </Button>
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left"
          sx={{ my: 1 }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={18} />
        </Button>
      </Grid>
      <Grid>{customList('Mídias', searchRightResults, handleSearchRight, searchRightQuery)}</Grid>
    </Grid>
  );
}
