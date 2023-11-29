import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { format } from 'date-fns';
import { fShortenNumber } from 'src/utils/format-number';
export default function MetricsTableRow({ row, selected, onSelectRow, type }) {
  const { date_published, tf_paces } = row;

  const mediaPaces = (paces) => {
    const soma = paces.reduce((t, n) => Number(n) + Number(t), 0);
    const media = soma / paces.length;
    return media.toFixed(2);
  };

  const renderDistance = () => {
    if (row.distance) {
      return `${fShortenNumber(row.distance)}m`;
    }
    return '';
  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>{format(new Date(date_published), 'dd MMM yyyy')}</TableCell>
        {type === 1 ? (
          <>
            <TableCell>{tf_paces.map((pace) => pace).join(' - ')}</TableCell>
            <TableCell>{mediaPaces(tf_paces)}</TableCell>
          </>
        ) : (
          <>
            <TableCell>{renderDistance()}</TableCell>
            <TableCell>{row.pace}</TableCell>
          </>
        )}
      </TableRow>
    </>
  );
}
