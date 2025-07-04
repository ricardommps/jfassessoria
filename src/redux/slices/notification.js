import { createSlice } from '@reduxjs/toolkit';
import { API_ENDPOINTS, jfAppApi } from 'src/utils/axios';

const initialState = {
  notifications: [],
  notificationsStatus: {
    loading: false,
    error: null,
    empty: false,
  },
  notification: null,
  notificationStatus: {
    loading: false,
    error: null,
    empty: false,
  },
  readAt: null,
  readAtStatus: {
    loading: false,
    error: null,
    empty: false,
  },
  createAndEdit: null,
  createAndEditStatus: {
    loading: false,
    error: null,
    empty: false,
  },
  deleteNotification: null,
  deleteNotificationStatus: {
    loading: false,
    error: null,
    empty: false,
  },
};

const slice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    getNotificationsStart(state) {
      state.readAt = null;
      state.readAtStatus.loading = false;
      state.readAtStatus.error = null;
      state.readAtStatus.empty = false;

      state.notifications = [];
      state.notificationsStatus.loading = true;
      state.notificationsStatus.error = null;
      state.notificationsStatus.empty = false;

      state.createAndEdit = null;
      state.createAndEditStatus.loading = false;
      state.createAndEditStatus.error = null;
      state.createAndEditStatus.empty = false;

      state.notification = null;
      state.notificationStatus.loading = false;
      state.notificationStatus.error = null;
      state.notificationStatus.empty = false;

      state.deleteNotification = null;
      state.deleteNotificationStatus.loading = false;
      state.deleteNotificationStatus.error = null;
      state.deleteNotificationStatus.empty = false;
    },
    getNotificationsFailure(state, action) {
      state.notifications = [];
      state.notificationsStatus.loading = false;
      state.notificationsStatus.error = action.payload;
      state.notificationsStatus.empty = false;
    },
    getNotificationsSuccess(state, action) {
      const notifications = action.payload;

      state.notifications = notifications;
      state.notificationsStatus.loading = false;
      state.notificationsStatus.error = false;
      state.notificationsStatus.empty = !notifications.length || notifications.length === 0;
    },

    getNotificationStart(state) {
      state.notification = null;
      state.notificationStatus.loading = true;
      state.notificationStatus.error = null;
      state.notificationStatus.empty = false;

      state.readAt = null;
      state.readAtStatus.loading = false;
      state.readAtStatus.error = null;
      state.readAtStatus.empty = false;
    },
    getNotificationFailure(state, action) {
      state.notification = null;
      state.notificationStatus.loading = false;
      state.notificationStatus.error = action.payload;
      state.notificationStatus.empty = false;
    },
    getNotificationSuccess(state, action) {
      const notification = action.payload;

      state.notification = notification;
      state.notificationStatus.loading = false;
      state.notificationStatus.error = false;
      state.notificationStatus.empty = false;
    },

    readAtStart(state) {
      state.readAt = null;
      state.readAtStatus.loading = true;
      state.readAtStatus.error = null;
      state.readAtStatus.empty = false;
    },
    readAteFailure(state, action) {
      state.readAt = null;
      state.readAtStatus.loading = false;
      state.readAtStatus.error = action.payload;
      state.readAtStatus.empty = false;
    },
    readAtSuccess(state, action) {
      state.readAt = action.payload;
      state.readAtStatus.loading = false;
      state.readAtStatus.error = null;
      state.readAtStatus.empty = false;
    },

    createAndEditStart(state) {
      state.createAndEdit = null;
      state.createAndEditStatus.loading = true;
      state.createAndEditStatus.error = null;
      state.createAndEditStatus.empty = false;
    },
    createAndEditFailure(state, action) {
      state.createAndEdit = null;
      state.createAndEditStatus.loading = false;
      state.createAndEditStatus.error = action.payload;
      state.createAndEditStatus.empty = false;
    },
    createAndEditSuccess(state, action) {
      state.createAndEdit = action.payload;
      state.createAndEditStatus.loading = false;
      state.createAndEditStatus.error = null;
      state.createAndEditStatus.empty = false;
    },

    deleteNotificationStart(state) {
      state.deleteNotification = null;
      state.deleteNotificationStatus.loading = true;
      state.deleteNotificationStatus.error = null;
      state.deleteNotificationStatus.empty = false;
    },
    deleteNotificationFailure(state, action) {
      state.deleteNotification = null;
      state.deleteNotificationStatus.loading = false;
      state.deleteNotificationStatus.error = action.payload;
      state.deleteNotificationStatus.empty = false;
    },
    deleteNotificationSuccess(state, action) {
      state.deleteNotification = action.payload;
      state.deleteNotificationStatus.loading = false;
      state.deleteNotificationStatus.error = null;
      state.deleteNotificationStatus.empty = false;
    },
  },
});

export default slice.reducer;

export function getNotificationsReq(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.getNotificationsStart());
    try {
      const response = await jfAppApi.get(`${API_ENDPOINTS.notifications.all}/${customerId}`);
      dispatch(slice.actions.getNotificationsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getNotificationsFailure(error));
    }
  };
}

export function getNotificationReq(id) {
  return async (dispatch) => {
    dispatch(slice.actions.getNotificationStart());
    try {
      const response = await jfAppApi.get(`${API_ENDPOINTS.notifications.root}/${id}`);
      dispatch(slice.actions.getNotificationSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getNotificationFailure(error));
    }
  };
}

export function readAtReq(notificationId) {
  return async (dispatch) => {
    dispatch(slice.actions.readAtStart());
    try {
      const response = await jfAppApi.get(
        `${API_ENDPOINTS.notifications.readAt}/${notificationId}`,
      );
      dispatch(slice.actions.readAtSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.readAteFailure(error));
    }
  };
}

export function deleteNoticifationReq(notificationId) {
  return async (dispatch) => {
    dispatch(slice.actions.deleteNotificationStart());
    try {
      const response = await jfAppApi.delete(
        `${API_ENDPOINTS.notifications.root}/${notificationId}`,
      );
      dispatch(slice.actions.deleteNotificationSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.deleteNotificationFailure(error));
    }
  };
}

export function createAndEditReq(payload, notificationId) {
  return async (dispatch) => {
    dispatch(slice.actions.createAndEditStart());
    try {
      if (notificationId) {
        const response = await jfAppApi.put(
          `${API_ENDPOINTS.notifications.root}/${notificationId}`,
          payload,
        );
        dispatch(slice.actions.createAndEditSuccess(response.data));
      } else {
        const response = await jfAppApi.post(`${API_ENDPOINTS.notifications.root}`, payload);
        dispatch(slice.actions.createAndEditSuccess(response.data));
      }
    } catch (error) {
      dispatch(slice.actions.createAndEditFailure(error));
    }
  };
}
