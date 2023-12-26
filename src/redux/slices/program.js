import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';

const initialState = {
  allPrograms: null,
  allProgramsStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  allChart: null,
  allChartStatus: {
    loading: false,
    error: null,
  },
  archived: null,
  archivedStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  programs: null,
  programsStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  programCreate: null,
  programCreateStatus: {
    loading: false,
    error: null,
  },
  program: null,
  programStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  updateProgramSuccess: null,
  cloneProgramSuccess: null,
  cloneProgramStatus: {
    loading: false,
    error: null,
  },
  sendProgramSuccess: false,
  sendProgramStatus: {
    loading: false,
    error: null,
  },
  viewPdf: false,
  viewPdfStatus: {
    loading: false,
    error: null,
  },
  deleteProgram: null,
  deleteProgramStatus: {
    loading: false,
    error: false,
  },
  hideProgramSuccess: false,
  hideProgramStatus: {
    loading: false,
    error: null,
  },
  showProgramSuccess: false,
  showProgramStatus: {
    loading: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    getAllChartStart(state) {
      state.allChart = null;
      state.allChartStatus.error = null;
      state.allChartStatus.loading = true;
    },
    getAllChartFailure(state, action) {
      state.allChart = null;
      state.allChartStatus.error = action.payload;
      state.allChartStatus.loading = false;
    },
    getAllChartuccess(state, action) {
      const allChart = action.payload;
      state.allChart = allChart;

      state.allChartStatus.error = null;
      state.allChartStatus.loading = false;
    },
    getAllProgramsStart(state) {
      state.allPrograms = null;
      state.allProgramsStatus.empty = false;
      state.allProgramsStatus.error = null;
      state.allProgramsStatus.loading = true;
      state.deleteProgram = null;
      state.deleteProgramStatus.loading = false;
      state.deleteProgramStatus.error = false;
      state.updateProgramSuccess = null;
      state.cloneProgramStatus.loading = false;
      state.cloneProgramStatus.error = null;
      state.cloneProgramSuccess = null;
    },
    getAllProgramsFailure(state, action) {
      state.allProgramsStatus.loading = false;
      state.allProgramsStatus.empty = false;
      state.allProgramsStatus.error = action.payload;
      state.allPrograms = null;
    },
    getAllProgramsSuccess(state, action) {
      const programs = action.payload;
      state.allPrograms = programs;

      state.allProgramsStatus.loading = false;
      state.allProgramsStatus.empty = !programs.length;
      state.allProgramsStatus.error = null;
    },
    getProgramsStart(state) {
      state.programsStatus.loading = true;
      state.programsStatus.empty = false;
      state.programsStatus.error = null;
      state.programCreate = null;
      state.programCreateStatus.loading = false;
      state.programCreateStatus.error = null;
      state.program = null;
      state.updateProgramSuccess = null;
      state.allPrograms = null;
      state.allProgramsStatus.empty = false;
      state.allProgramsStatus.error = null;
      state.allProgramsStatus.loading = false;
      state.archived = null;
      state.archivedStatus.empty = false;
      state.archivedStatus.error = null;
      state.archivedStatus.loading = false;
      state.hideProgramSuccess = null;
      state.hideProgramStatus.error = null;
      state.hideProgramStatus.loading = false;
      state.showProgramSuccess = null;
      state.showProgramStatus.error = null;
      state.showProgramStatus.loading = false;
      state.allChart = null;
      state.allChartStatus.error = null;
      state.allChartStatus.loading = false;
    },
    getProgramsFailure(state, action) {
      state.programsStatus.loading = false;
      state.programsStatus.empty = false;
      state.programsStatus.error = action.payload;
      state.programs = null;
    },
    getProgramsSuccess(state, action) {
      const programs = action.payload;
      state.programs = programs;

      state.programsStatus.loading = false;
      state.programsStatus.empty = !programs.length;
      state.programsStatus.error = null;
    },

    getProgramStart(state) {
      state.programStatus.loading = true;
      state.programStatus.empty = false;
      state.programStatus.error = null;
      state.programCreate = null;
      state.programCreateStatus.loading = false;
      state.programCreateStatus.error = null;
    },
    getProgramFailure(state, action) {
      state.programStatus.loading = false;
      state.programStatus.empty = false;
      state.programStatus.error = action.payload;
    },
    getProgramSuccess(state, action) {
      const program = action.payload;
      state.program = program;

      state.programStatus.loading = false;
      state.programStatus.empty = !program.length;
      state.programStatus.error = null;
    },
    createProgramStart(state) {
      state.programCreate = null;
      state.programCreateStatus.loading = true;
      state.programCreateStatus.error = false;
    },
    createProgramSuccess(state, action) {
      state.programCreate = action.payload;
      state.programCreateStatus.loading = false;
      state.programCreateStatus.error = null;
    },
    createProgramFailure(state, action) {
      state.programCreate = null;
      state.programCreateStatus.loading = true;
      state.programCreateStatus.error = action.payload;
    },
    updateProgramSuccess(state, action) {
      state.updateProgramSuccess = action.payload;
    },

    clearProgram(state) {
      state.programCreate = null;
      state.program = null;
      state.updateProgramSuccess = null;
    },

    clearPrograms(state) {
      state.programsStatus.loading = false;
      state.programsStatus.empty = false;
      state.programsStatus.error = null;
      state.programCreate = null;
      state.programCreateStatus.loading = false;
      state.programCreateStatus.error = null;
      state.programs = null;
      state.program = null;
      state.updateProgramSuccess = null;
      state.allPrograms = null;
      state.allProgramsStatus.empty = false;
      state.allProgramsStatus.error = null;
      state.allProgramsStatus.loading = false;
      state.archived = null;
      state.archivedStatus.empty = false;
      state.archivedStatus.error = null;
      state.archivedStatus.loading = false;
      state.hideProgramSuccess = null;
      state.hideProgramStatus.error = null;
      state.hideProgramStatus.loading = false;
      state.showProgramSuccess = null;
      state.showProgramStatus.error = null;
      state.showProgramStatus.loading = false;
      state.deleteProgram = null;
      state.deleteProgramStatus.error = null;
      state.deleteProgramStatus.loading = false;
      state.sendProgramStatus.loading = false;
      state.sendProgramStatus.error = null;
      state.sendProgramSuccess = null;
      state.cloneProgramStatus.loading = false;
      state.cloneProgramStatus.error = null;
      state.cloneProgramSuccess = null;
      state.viewPdf = null;
      state.viewPdfStatus.error = null;
      state.viewPdfStatus.loading = false;
    },

    cloneProgramStart(state) {
      state.cloneProgramStatus.loading = true;
      state.cloneProgramStatus.error = null;
      state.cloneProgramSuccess = null;
    },
    cloneProgramFailure(state, action) {
      state.cloneProgramStatus.loading = false;
      state.cloneProgramStatus.error = action.payload;
      state.cloneProgramSuccess = null;
    },
    cloneProgramSuccess(state, action) {
      const program = action.payload;
      state.cloneProgramSuccess = program;

      state.cloneProgramStatus.loading = false;
      state.cloneProgramStatus.error = null;
    },

    sendProgramStart(state) {
      state.sendProgramStatus.loading = true;
      state.sendProgramStatus.error = null;
      state.sendProgramSuccess = null;
    },
    sendProgramFailure(state, action) {
      state.sendProgramStatus.loading = false;
      state.sendProgramStatus.error = action.payload;
      state.sendProgramSuccess = null;
    },
    sendProgramSuccess(state, action) {
      state.sendProgramSuccess = action.payload;

      state.sendProgramStatus.loading = false;
      state.sendProgramStatus.error = null;
    },
    getViewPdfStart(state) {
      state.viewPdf = null;
      state.viewPdfStatus.error = null;
      state.viewPdfStatus.loading = true;
    },
    getViewPdfFailure(state, action) {
      state.viewPdfStatus.loading = false;
      state.viewPdfStatus.error = action.payload;
      state.viewPdf = null;
    },
    getViewPdfSuccess(state, action) {
      const viewPdf = action.payload;
      state.viewPdf = viewPdf;

      state.viewPdfStatus.loading = false;
      state.viewPdfStatus.error = null;
    },
    deleteProgramStart(state) {
      state.deleteProgram = null;
      state.deleteProgramStatus.error = null;
      state.deleteProgramStatus.loading = true;
    },
    deleteProgramFailure(state, action) {
      state.deleteProgramStatus.loading = false;
      state.deleteProgramStatus.error = action.payload;
      state.deleteProgram = null;
    },
    deleteProgramSuccess(state, action) {
      const deleteProgram = action.payload;
      state.deleteProgram = deleteProgram;

      state.deleteProgramStatus.loading = false;
      state.deleteProgramStatus.error = null;
    },

    hideProgramStart(state) {
      state.hideProgramSuccess = null;
      state.hideProgramStatus.error = null;
      state.hideProgramStatus.loading = true;
    },
    hideProgramFailure(state, action) {
      state.hideProgramStatus.loading = false;
      state.hideProgramStatus.error = action.payload;
      state.hideProgramSuccess = null;
    },
    hideProgramSuccess(state, action) {
      const hideProgram = action.payload;
      state.hideProgramSuccess = hideProgram;

      state.hideProgramStatus.loading = false;
      state.hideProgramStatus.error = null;
    },

    showProgramStart(state) {
      state.showProgramSuccess = null;
      state.showProgramStatus.error = null;
      state.showProgramStatus.loading = true;
    },
    showProgramFailure(state, action) {
      state.showProgramStatus.loading = false;
      state.showProgramStatus.error = action.payload;
      state.showProgramSuccess = null;
    },
    showProgramSuccess(state, action) {
      const showProgram = action.payload;
      state.showProgramSuccess = showProgram;

      state.showProgramStatus.loading = false;
      state.showProgramStatus.error = null;
    },

    getArchivedProgramsStart(state) {
      state.archivedStatus.empty = false;
      state.archivedStatus.error = null;
      state.archivedStatus.loading = true;
    },
    getArchivedProgramsFailure(state, action) {
      state.archived = null;
      state.archivedStatus.empty = false;
      state.archivedStatus.error = action.payload;
      state.archivedStatus.loading = false;
    },
    getArchivedProgramsSuccess(state, action) {
      const archived = action.payload;
      state.archived = archived;

      state.archivedStatus.loading = false;
      state.archivedStatus.empty = !archived.length;
      state.archivedStatus.error = null;
    },

    clearArchivedPrograms(state) {
      state.archived = null;
      state.archivedStatus.empty = false;
      state.archivedStatus.error = null;
      state.archivedStatus.loading = false;
    },
  },
});

export default slice.reducer;

export function getAllPrograms() {
  return async (dispatch) => {
    dispatch(slice.actions.getAllProgramsStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.program.all}`);
      dispatch(slice.actions.getAllProgramsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getAllProgramsFailure(error));
    }
  };
}

export function getAllPChart() {
  return async (dispatch) => {
    dispatch(slice.actions.getAllChartStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.program.allChart}`);
      dispatch(slice.actions.getAllChartuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getAllChartFailure(error));
    }
  };
}

export function getPrograms(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.getProgramsStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.program.list}/${customerId}`);
      dispatch(slice.actions.getProgramsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getProgramsFailure(error));
    }
  };
}

export function getProgramById(programId) {
  return async (dispatch) => {
    dispatch(slice.actions.getProgramStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.program.register}/${programId}`);
      dispatch(slice.actions.getProgramSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.getProgramFailure(error));
    }
  };
}

export function createProgram(programData) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.createProgramStart());
      const data = { ...programData };
      const response = await axios.post(API_ENDPOINTS.program.register, data);
      dispatch(slice.actions.createProgramSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.createProgramFailure(error));
      console.error(error);
    }
  };
}

export function updateProgram(programUpadate, programId) {
  return async (dispatch) => {
    try {
      const dataUpdate = { ...programUpadate };
      const response = await axios.put(
        `${API_ENDPOINTS.program.register}/${programId}`,
        dataUpdate,
      );
      dispatch(slice.actions.updateProgramSuccess(response.data));
    } catch (error) {
      console.error(error);
    }
  };
}

export function cloneProgram(cloneProgram) {
  return async (dispatch) => {
    dispatch(slice.actions.cloneProgramStart());
    try {
      const data = { ...cloneProgram };
      const response = await axios.post(API_ENDPOINTS.program.clone, data);
      dispatch(slice.actions.cloneProgramSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.cloneProgramFailure(error));
    }
  };
}

export function sendProgram(sendPayload) {
  return async (dispatch) => {
    dispatch(slice.actions.sendProgramStart());
    try {
      const data = { ...sendPayload };
      const response = await axios.post(API_ENDPOINTS.program.send, data);
      dispatch(slice.actions.sendProgramSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.sendProgramFailure(error));
    }
  };
}

export function clearProgram() {
  return async (dispatch) => {
    dispatch(slice.actions.clearProgram());
  };
}

export function clearPrograms() {
  return async (dispatch) => {
    dispatch(slice.actions.clearPrograms());
  };
}

export function getViewPdf(programId) {
  return async (dispatch) => {
    dispatch(slice.actions.getViewPdfStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.program.viewPdf}/${programId}`);
      dispatch(slice.actions.getViewPdfSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getViewPdfFailure(error));
    }
  };
}

export function deleteProgramReq(programId) {
  return async (dispatch) => {
    dispatch(slice.actions.deleteProgramStart());
    try {
      const response = await axios.delete(`${API_ENDPOINTS.program.delete}/${programId}`);
      dispatch(slice.actions.deleteProgramSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.deleteProgramFailure(error));
    }
  };
}

export function hideProgramReq(programId) {
  return async (dispatch) => {
    dispatch(slice.actions.hideProgramStart());
    try {
      const response = await axios.put(`${API_ENDPOINTS.program.hide}/${programId}`);
      dispatch(slice.actions.hideProgramSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hideProgramFailure(error));
    }
  };
}

export function showProgramReq(programId) {
  return async (dispatch) => {
    dispatch(slice.actions.showProgramStart());
    try {
      const response = await axios.put(`${API_ENDPOINTS.program.show}/${programId}`);
      dispatch(slice.actions.showProgramSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.showProgramFailure(error));
    }
  };
}

export function getArchivedPrograms(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.getArchivedProgramsStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.program.archived}/${customerId}`);
      dispatch(slice.actions.getArchivedProgramsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getArchivedProgramsFailure(error));
    }
  };
}

export function clearArchivedPrograms() {
  return async (dispatch) => {
    dispatch(slice.actions.clearArchivedPrograms());
  };
}
