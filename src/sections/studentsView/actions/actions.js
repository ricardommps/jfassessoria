import { CardContent } from '@mui/material';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import { programsData } from 'src/_mock';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import CardTitle from 'src/sections/programsView/components/card-title';
import ProgramsList from 'src/sections/programsView/programs/programs-list';
import { hideScroll } from 'src/theme/css';

export function Actions({ currentCustomer, action }) {
  const { programs } = programsData;
  const getTitle = () => {
    switch (action) {
      case 'profile':
        return 'Formulário';
      case 'anamnese':
        return 'Anamnese';
      case 'program':
        return 'Programa';
      default:
        return 'Formulário';
    }
  };
  return (
    <Grid xs={12} md={4} disabled>
      <Card sx={{ height: 'calc(100vh - 150px)', ...hideScroll.y }}>
        <Scrollbar>
          <CardTitle title={getTitle()} />
          <CardContent>
            {action === 'program' && (
              <ProgramsList programs={programs} currentCustomer={currentCustomer} />
            )}
          </CardContent>
        </Scrollbar>
      </Card>
    </Grid>
  );
}

Actions.propTypes = {
  action: PropTypes.string,
  currentCustomer: PropTypes.object,
};
