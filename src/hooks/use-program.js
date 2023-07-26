import { useCallback } from 'react';
import {
  clearProgram,
  clearPrograms,
  cloneProgram,
  createProgram,
  getProgramById,
  getPrograms,
  sendProgram,
  updateProgram,
} from 'src/redux/slices/program';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useProgram() {
  const dispatch = useDispatch();
  const {
    programs,
    programsStatus,
    programCreate,
    program,
    programStatus,
    updateProgramSuccess,
    cloneProgramSuccess,
    cloneProgramStatus,
    sendProgramSuccess,
    sendProgramStatus,
  } = useSelector((state) => state.program);
  const onListPrograms = useCallback(
    (customerId) => {
      dispatch(getPrograms(customerId));
    },
    [dispatch],
  );

  const onCreateProgram = useCallback(
    (newProgram) => {
      dispatch(createProgram(newProgram));
    },
    [dispatch],
  );

  const onProgramById = useCallback(
    (programId) => {
      dispatch(getProgramById(programId));
    },
    [dispatch],
  );

  const onUpdateProgram = useCallback(
    (programUpdate, programId) => {
      dispatch(updateProgram(programUpdate, programId));
    },
    [dispatch],
  );

  const onClearProgram = useCallback(() => {
    dispatch(clearProgram());
  }, [dispatch]);

  const onClearPrograms = useCallback(() => {
    dispatch(clearPrograms());
  }, [dispatch]);

  const onCloneProgram = useCallback(
    (newProgram) => {
      dispatch(cloneProgram(newProgram));
    },
    [dispatch],
  );

  const onSendProgram = useCallback(
    (newProgram) => {
      dispatch(sendProgram(newProgram));
    },
    [dispatch],
  );

  return {
    programs,
    programsStatus,
    programCreate,
    program,
    programStatus,
    updateProgramSuccess,
    onListPrograms,
    onClearProgram,
    onCreateProgram,
    onProgramById,
    onUpdateProgram,
    onClearPrograms,
    cloneProgramSuccess,
    cloneProgramStatus,
    onCloneProgram,
    onSendProgram,
    sendProgramSuccess,
    sendProgramStatus,
  };
}
