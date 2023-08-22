'use client';

// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ptBR from 'date-fns/locale/pt-BR';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

export default function LocalizationProvider({ children }) {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      {children}
    </MuiLocalizationProvider>
  );
}

LocalizationProvider.propTypes = {
  children: PropTypes.node,
};
