import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';

const initialState = {
  allPrograms: null,
  allProgramsStatus: {
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
};

const slice = createSlice({
  name: 'program',
  initialState,
  reducers: {
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
      state.program = null;
      state.updateProgramSuccess = null;
      state.allPrograms = null;
      state.allProgramsStatus.empty = false;
      state.allProgramsStatus.error = null;
      state.allProgramsStatus.loading = false;
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

    createProgramSuccess(state, action) {
      state.programCreate = action.payload;
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
      state.programs = null;
      state.program = null;
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
      const data = { ...programData };
      const response = await axios.post(API_ENDPOINTS.program.register, data);
      dispatch(slice.actions.createProgramSuccess(response.data));
    } catch (error) {
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
