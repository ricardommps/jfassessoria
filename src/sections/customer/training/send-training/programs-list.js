import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import useProgram from 'src/hooks/use-program';

export default function ProgramsList({ onSelectProgram, type, vs2 }) {
  const { allPrograms, onListAllPrograms, allProgramsStatus } = useProgram();

  const [filteredPrograms, setFilteredPrograms] = useState([]);

  useEffect(() => {
    onListAllPrograms();
  }, []);

  useEffect(() => {
    if (allPrograms) {
      const filteredData = allPrograms.filter((item) => item.type === type && item.vs2 === vs2);
      setFilteredPrograms(filteredData);
    }
  }, [allPrograms]);
  return (
    <>
      {(filteredPrograms?.length || allProgramsStatus?.loading) && (
        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {(allProgramsStatus.loading ? Array.from(new Array(3)) : filteredPrograms).map(
            (program, index) => {
              const labelId = `checkbox-list-secondary-label-${program?.id}`;
              return (
                <ListItem
                  key={program ? program.id : index}
                  secondaryAction={
                    program ? (
                      <Checkbox
                        edge="end"
                        inputProps={{ 'aria-labelledby': labelId }}
                        onChange={() => onSelectProgram(program.id)}
                      />
                    ) : (
                      <Skeleton variant="rectangular" width={20} height={20} />
                    )
                  }
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemText
                      id={labelId}
                      primary={program ? program?.name : <Skeleton />}
                      secondary={
                        <Stack>
                          <Typography>{program?.customer?.name || <Skeleton />}</Typography>
                        </Stack>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            },
          )}
        </List>
      )}
    </>
  );
}
// <
