import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';

const initialState = {
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
};

const slice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    getProgramsStart(state) {
      state.programsStatus.loading = true;
      state.programsStatus.empty = false;
      state.programsStatus.error = null;
      state.programCreate = null;
      state.program = null;
      state.updateProgramSuccess = null;
    },
    getProgramsFailure(state, action) {
      state.programsStatus.loading = false;
      state.programsStatus.empty = false;
      state.programsStatus.error = action.payload;
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
  },
});

export default slice.reducer;

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
