import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { ButtonIcon } from 'src/components/button-icon/button-icon';
import Scrollbar from 'src/components/scrollbar/scrollbar';

import {
  ActionsHeader,
  CardListContent,
  CardListItem,
  CheckboxAction,
  Container,
  ImgBox,
  TxtBox,
  TxtBoxInterval,
  TxtBoxName,
  TxtBoxRepetition,
} from './styles';

export function WorkoutsList({ workouts, setCurrentWorkoutEdit }) {
  const [workoutsSelected, setWorkoutsSelected] = useState([]);
  const onSelectRow = useCallback(
    (inputValue, e) => {
      e.stopPropagation();
      const newSelected = workoutsSelected.includes(inputValue)
        ? workoutsSelected.filter((value) => value !== inputValue)
        : [...workoutsSelected, inputValue];

      setWorkoutsSelected(newSelected);
    },
    [workoutsSelected],
  );

  const onSelectAllRows = useCallback((checked, inputValue) => {
    if (checked) {
      setWorkoutsSelected(inputValue);
      return;
    }
    setWorkoutsSelected([]);
  }, []);
  const handleEditWorkout = (workout) => {
    setCurrentWorkoutEdit(workout);
  };

  const handleSelectAllWorkouts = (checked) => {
    onSelectAllRows(
      checked,
      workouts.map((item) => item.id),
    );
  };

  return (
    <Container>
      <Scrollbar>
        <ActionsHeader>
          <InputAdornment position="end" sx={{ mr: 1, mb: 3, ml: 0 }}>
            <Checkbox
              onChange={(event) => handleSelectAllWorkouts(event.target.checked)}
              checked={!!workouts.length && workoutsSelected.length === workouts.length}
            />
            <ButtonIcon disabled>
              <Tooltip title="Apagar treino" placement="top">
                <DeleteIcon sx={{ fontSize: '28px', width: '28px', height: '30px' }} />
              </Tooltip>
            </ButtonIcon>
          </InputAdornment>
          <hr />
        </ActionsHeader>
        <CardListContent>
          {workouts.map((workout) => (
            <CardListItem key={workout.id} onClick={() => handleEditWorkout(workout)}>
              <CheckboxAction>
                <Checkbox
                  checked={workoutsSelected.includes(workout.id)}
                  onClick={(event) => onSelectRow(workout.id, event)}
                />
              </CheckboxAction>
              <ImgBox>
                <img src={workout.cover_url} />
              </ImgBox>
              <TxtBox>
                <TxtBoxName>{workout.name}</TxtBoxName>
                <TxtBoxRepetition>{workout.series_repetitions}</TxtBoxRepetition>
                <TxtBoxInterval>Intervalo: {workout.intervals}</TxtBoxInterval>
              </TxtBox>
            </CardListItem>
          ))}
        </CardListContent>
      </Scrollbar>
    </Container>
  );
}

WorkoutsList.propTypes = {
  workouts: PropTypes.array,
  setCurrentWorkoutEdit: PropTypes.func,
};
