import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types'; // @mui

//
import EmptyContent from '../empty-content';

// ----------------------------------------------------------------------

export default function TableNoData({ notFound, sx }) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            filled
            title="No Data"
            sx={{
              py: 10,
              ...sx,
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}

TableNoData.propTypes = {
  notFound: PropTypes.bool,
  sx: PropTypes.object,
};
