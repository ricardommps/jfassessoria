import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
// @mui
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 228 187"
        enableBackground="new 0 0 228 187"
      >
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>
        <path
          fill="#F9F9F9"
          opacity="1.000000"
          stroke="none"
          d=" M124.876122,143.998764   C124.876122,99.359200 124.876122,55.219494 124.876122,10.743345   C155.569000,10.743345 185.964417,10.743345 216.668442,10.743345   C216.668442,15.712367 216.668442,20.617933 216.668442,26.001850   C192.262177,26.001850 167.902649,26.001850 143.279602,26.001850   C143.279602,43.213577 143.279602,59.954426 143.279602,77.059250   C163.785812,77.059250 184.212280,77.059250 204.961304,77.059250   C204.961304,82.493309 204.961304,87.568413 204.961304,92.953049   C184.347504,92.953049 163.903702,92.953049 143.096161,92.953049   C143.096161,115.667480 143.096161,138.081436 143.096161,160.751038   C136.989746,160.751038 131.243484,160.751038 124.876122,160.751038   C124.876122,155.350342 124.876122,149.924484 124.876122,143.998764  z"
        />
        <path
          fill="#F8F8F8"
          opacity="1.000000"
          stroke="none"
          d=" M56.581635,163.644836   C41.220394,164.437866 27.844580,161.093872 17.381584,149.552200   C10.482255,141.941589 8.210177,132.682114 7.595613,122.847496   C7.541553,121.982399 9.252440,120.249084 10.204118,120.204254   C15.654129,119.947464 21.122458,120.079422 26.722437,120.079422   C27.141693,127.970360 28.772169,134.871048 34.318352,140.397110   C41.789989,147.841644 50.811211,147.300522 59.921070,145.438446   C68.570305,143.670517 72.027481,136.738007 73.878143,129.097610   C74.881752,124.954231 74.955803,120.517860 74.966202,116.212486   C75.047081,82.719337 75.010361,49.225891 75.010010,15.732541   C75.009995,14.112394 75.010010,12.492248 75.010010,10.644573   C81.398705,10.644573 87.329948,10.644573 94.010376,10.644573   C94.010376,12.736117 94.010635,14.657841 94.010345,16.579563   C94.004967,51.905243 93.985825,87.230934 93.999336,122.556602   C94.007187,143.063812 80.829292,161.168030 58.968212,163.095062   C58.314602,163.152695 57.679905,163.424942 56.581635,163.644836  z"
        />
      </svg>
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
