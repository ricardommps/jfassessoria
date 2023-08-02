import { useCallback } from 'react';
import {
  clearProgram,
  clearPrograms,
  cloneProgram,
  createProgram,
  getAllPrograms,
  getProgramById,
  getPrograms,
  getViewPdf,
  sendProgram,
  updateProgram,
} from 'src/redux/slices/program';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useProgram() {
  const dispatch = useDispatch();
  const {
    allPrograms,
    allProgramsStatus,
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
    viewPdf,
    viewPdfStatus,
  } = useSelector((state) => state.program);

  const onListPrograms = useCallback(
    (customerId) => {
      dispatch(getPrograms(customerId));
    },
    [dispatch],
  );

  const onListAllPrograms = useCallback(() => {
    dispatch(getAllPrograms());
  }, [dispatch]);

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

  const onViewPdf = useCallback(
    (programId) => {
      dispatch(getViewPdf(programId));
    },
    [dispatch],
  );

  return {
    allPrograms,
    allProgramsStatus,
    programs,
    programsStatus,
    programCreate,
    program,
    programStatus,
    updateProgramSuccess,
    onListAllPrograms,
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
    onViewPdf,
    viewPdf,
    viewPdfStatus,
  };
}
