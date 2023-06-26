'use client';

// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from '@mui/x-date-pickers/locales';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

export default function LocalizationProvider({ children }) {
  return (
    <MuiLocalizationProvider
      dateAdapter={AdapterDateFns}
      locale={ptBR}
      localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      {children}
    </MuiLocalizationProvider>
  );
}

LocalizationProvider.propTypes = {
  children: PropTypes.node,
};
