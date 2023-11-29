import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Advanced, Beginner, Intermediary } from '../race-consulting/program/styles';

export default function PHMetricsTableRow({ row, selected, onSelectRow }) {
  const renderDifficultyLevel = (difficylty) => {
    if (difficylty === 'Iniciante') {
      return (
        <span>
          <Beginner>{difficylty}</Beginner>
        </span>
      );
    }
    if (difficylty === 'Intermediário') {
      return (
        <span>
          <Intermediary>{difficylty}</Intermediary>
        </span>
      );
    }

    return (
      <span>
        <Advanced>{difficylty}</Advanced>
      </span>
    );
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>
          {format(new Date(row.reference_month), 'MMMM/yyyy', { locale: ptBR })}
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{renderDifficultyLevel(row.difficulty_level)}</TableCell>
        <TableCell>{row.pace}</TableCell>
        <TableCell>{row.pace_vla}</TableCell>
        <TableCell>{row.pace_vlan}</TableCell>
      </TableRow>
    </>
  );
}
