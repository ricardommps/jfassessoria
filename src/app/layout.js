// scroll bar
import 'simplebar-react/dist/simplebar.min.css';
// lazy image
import 'moment/min/locales';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import * as moment from 'moment';
import PropTypes from 'prop-types';
// auth
import { AuthConsumer, AuthProvider } from 'src/auth/context/jwt';
import MotionLazy from 'src/components/animate/motion-lazy';
import { DrawerTablePv, TablePvProvider } from 'src/components/drawer-table-pv';
// components
import ProgressBar from 'src/components/progress-bar';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
// locales
import { LocalizationProvider } from 'src/locales';
import AppQueryClientProvider from 'src/providers/QueryClientProvider';
import ReduxProvider from 'src/redux/redux-provider';
// ----------------------------------------------------------------------
// theme
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Joana Foltz',
  description: 'App de assessoria',
  keywords: 'assessoria, corrida, personalS',
  themeColor: '#000000',
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'icon',
      url: '/favicon/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
};
moment.locale('pt-br');

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <AppQueryClientProvider>
          <AuthProvider>
            <ReduxProvider>
              <LocalizationProvider>
                <SettingsProvider
                  defaultSettings={{
                    themeMode: 'dark', // 'light' | 'dark'
                    themeDirection: 'ltr', //  'rtl' | 'ltr'
                    themeContrast: 'default', // 'default' | 'bold'
                    themeLayout: 'mini', // 'vertical' | 'horizontal' | 'mini'
                    themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                    themeStretch: false,
                  }}
                >
                  <TablePvProvider>
                    <ThemeProvider>
                      <MotionLazy>
                        <SnackbarProvider>
                          <SettingsDrawer />
                          <DrawerTablePv />
                          <ProgressBar />
                          <AuthConsumer>{children}</AuthConsumer>
                        </SnackbarProvider>
                      </MotionLazy>
                    </ThemeProvider>
                  </TablePvProvider>
                </SettingsProvider>
              </LocalizationProvider>
            </ReduxProvider>
          </AuthProvider>
        </AppQueryClientProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node,
};
