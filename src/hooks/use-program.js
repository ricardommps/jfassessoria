import { format } from 'date-fns';
import { useCallback } from 'react';
import {
  clearArchivedPrograms,
  clearProgram,
  clearPrograms,
  cloneProgram,
  createProgram,
  deleteProgramReq,
  getAllPChart,
  getAllPrograms,
  getArchivedPrograms,
  getProgramById,
  getPrograms,
  getProgramsV2,
  getViewPdf,
  hideProgramReq,
  sendProgram,
  showProgramReq,
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
    programCreateStatus,
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
    hideProgramSuccess,
    hideProgramStatus,
    showProgramSuccess,
    showProgramStatus,
    archived,
    archivedStatus,
    allChart,
    allChartStatus,
  } = useSelector((state) => state.program);

  const { customer } = useCustomer();

  const onListArquivedPrograms = useCallback(
    (customerId) => {
      dispatch(getArchivedPrograms(customerId));
    },
    [dispatch],
  );

  const onListPrograms = useCallback(
    async (customerId) => {
      await dispatch(getPrograms(customerId));
    },
    [dispatch],
  );

  const onListProgramsV2 = useCallback(
    async (customerId) => {
      await dispatch(getProgramsV2(customerId));
    },
    [dispatch],
  );

  const onListAllPrograms = useCallback(() => {
    dispatch(getAllPrograms());
  }, [dispatch]);

  const onListAllChart = useCallback(() => {
    dispatch(getAllPChart());
  }, [dispatch]);

  const onCreateProgram = useCallback(
    async (newProgram) => {
      await dispatch(createProgram(newProgram));
    },
    [dispatch],
  );

  const onProgramById = useCallback(
    async (programId) => {
      await dispatch(getProgramById(programId));
    },
    [dispatch],
  );

  const onUpdateProgram = useCallback(
    async (programUpdate, programId) => {
      await dispatch(updateProgram(programUpdate, programId));
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

  const onDeleteProgramAsync = useCallback(
    async (programId) => {
      await dispatch(deleteProgramReq(programId));
    },
    [dispatch],
  );

  const onHideProgram = useCallback(
    (programId) => {
      dispatch(hideProgramReq(programId));
    },
    [dispatch],
  );

  const onShowProgram = useCallback(
    (programId) => {
      dispatch(showProgramReq(programId));
    },
    [dispatch],
  );

  const onClearArchivedPrograms = useCallback(() => {
    dispatch(clearArchivedPrograms());
  }, [dispatch]);

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
    programCreateStatus,
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
    onHideProgram,
    hideProgramSuccess,
    hideProgramStatus,
    onListArquivedPrograms,
    archived,
    archivedStatus,
    onClearArchivedPrograms,
    onShowProgram,
    showProgramSuccess,
    showProgramStatus,
    allChart,
    allChartStatus,
    onListAllChart,
    onDeleteProgramAsync,
    onListProgramsV2,
  };
}
