import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { darken, lighten, styled } from '@mui/system';
import { useEffect, useState } from 'react';
import useMedia from 'src/hooks/use-media';

const heatingTags = ['Aquecimento'];

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),
  ...theme.applyStyles('dark', {
    backgroundColor: darken(theme.palette.primary.main, 0.8),
  }),
}));

const GroupItems = styled('ul')({
  padding: 3,
});

export default function HeatingFind({ handleSaveHeatings, heatingMedias = [] }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { onGetListMedias, medias } = useMedia();

  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      await onGetListMedias(heatingTags);
      setLoading(false);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  useEffect(() => {
    if (medias) {
      const sortedMedias = [...(medias || [])].sort((a, b) => a.title.localeCompare(b.title));
      setOptions(sortedMedias);
    }
  }, [medias]);

  const handleChange = (event, value) => {
    handleSaveHeatings(value);
  };

  return (
    <Autocomplete
      multiple
      limitTags={2}
      fullWidth
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={options}
      disableCloseOnSelect
      isOptionEqualToValue={(option, value) => option.id === value.id} // Compare by unique id
      getOptionLabel={(option) => option.title}
      loading={loading}
      onChange={handleChange}
      value={heatingMedias} // Ensure selected items are reflected
      groupBy={(option) => {
        const firstLetter = option.title[0].toUpperCase();
        return /[0-9]/.test(firstLetter) ? '0-9' : firstLetter;
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props; // Extract `key` from `props`
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={selected} // Automatically checked based on `value`
            />
            {option.title}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Selecione os vídeos de aquecimento"
          placeholder="Vídeos"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderGroup={(params) => (
        <li key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      )}
    />
  );
}