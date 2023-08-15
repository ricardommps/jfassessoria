import { format } from 'date-fns';
import { useCallback } from 'react';
import {
  clearProgram,
  clearPrograms,
  cloneProgram,
  createProgram,
  deleteProgramReq,
  getAllPrograms,
  getProgramById,
  getPrograms,
  getViewPdf,
  sendProgram,
  updateProgram,
} from 'src/redux/slices/program';
import { useDispatch, useSelector } from 'src/redux/store';

import useCustomer from './use-customer';
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
    deleteProgram,
    deleteProgramStatus,
  } = useSelector((state) => state.program);

  const { customer } = useCustomer();

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

  const onDeleteProgram = useCallback(
    (programId) => {
      dispatch(deleteProgramReq(programId));
    },
    [dispatch],
  );

  const getFcValue = () => {
    if (customer.birthDate) {
      const birthdateValue = format(new Date(customer.birthDate), 'dd/MM/yyyy');
      if (birthdateValue) {
        const from = birthdateValue.split('/');
        var birthdateTimeStamp = new Date(from[2], from[1] - 1, from[0]);
        var cur = new Date();
        var diff = cur - birthdateTimeStamp;
        var currentAge = Math.floor(diff / 31557600000);
        return currentAge ? 220 - currentAge : '';
      }
    }
    return null;
  };

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
    getFcValue,
    onDeleteProgram,
    deleteProgram,
    deleteProgramStatus,
  };
}
