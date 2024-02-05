'use client';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useState } from 'react';
import EmptyContent from 'src/components/empty-content/empty-content';
import Iconify from 'src/components/iconify';
import { getComparator, useTable } from 'src/components/table';
import useMedia from 'src/hooks/use-media';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import MediaListTable from '../media-list-table';

const defaultFilters = {
  name: '',
};

export default function MediaListView() {
  const table = useTable({ defaultRowsPerPage: 10 });
  const router = useRouter();
  const { onGetListMedias, medias, mediasStatus } = useMedia();

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const initialize = useCallback(async () => {
    try {
      onGetListMedias();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (medias) {
      setTableData(medias);
    }
  }, [medias]);

  return (
    <Container maxWidth={'lg'} sx={{ height: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, pb: 2 }}>
        <Button
          color="inherit"
          sx={{ mr: 1 }}
          startIcon={<ArrowCircleLeftIcon />}
          onClick={handleGoBack}
        >
          Voltar
        </Button>
      </Box>
      <Stack direction={'row'}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Mídias
        </Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.medias.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Nova
        </Button>
      </Stack>
      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      ></Stack>
      <Stack>
        {mediasStatus.empty && (
          <EmptyContent
            imgUrl="/assets/icons/empty/ic_content.svg"
            sx={{
              borderRadius: 1.5,
              bgcolor: 'background.default',
              height: '50vh',
            }}
            title={'Nenhum item encontrado'}
          />
        )}

        <MediaListTable
          table={table}
          tableData={tableData}
          dataFiltered={dataFiltered}
          notFound={notFound}
        />
      </Stack>
    </Container>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (customer) => customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }
  return inputData;
}
