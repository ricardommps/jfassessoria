// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    customerChangePassword: (id) => `${ROOTS.DASHBOARD}/customer-change-password/${id}`,
    security: `${ROOTS.DASHBOARD}/security`,
    customersRacing: `${ROOTS.DASHBOARD}/customersRacing`,
    customer: {
      root: `${ROOTS.DASHBOARD}/customer`,
      profile: (id) => `${ROOTS.DASHBOARD}/customer/profile/${id}`,
      create: (type, id) => `${ROOTS.DASHBOARD}/customer/create/${type}/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/customer/edit/${id}`,
    },
    metrics: {
      root: (id) => `${ROOTS.DASHBOARD}/metrics/${id}`,
      create: (type, id) => `${ROOTS.DASHBOARD}/metrics/create/${type}/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/metrics/edit/${id}`,
    },
    medias: {
      root: `${ROOTS.DASHBOARD}/medias`,
      new: `${ROOTS.DASHBOARD}/medias/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/medias/${id}/edit`,
    },
    program: {
      root: (id) => `${ROOTS.DASHBOARD}/program/${id}`,
      create: (id) => `${ROOTS.DASHBOARD}/program/create/${id}`,
    },
    feedBack: {
      root: (id) => `${ROOTS.DASHBOARD}/feedback/${id}`,
    },
    rating: {
      root: `${ROOTS.DASHBOARD}/rating`,
    },
    notification: {
      root: (id) => `${ROOTS.DASHBOARD}/notification/${id}`,
      create: (id, notificationId) =>
        `${ROOTS.DASHBOARD}/notification/${id}/create${notificationId ? `/${notificationId}` : ''}`,
    },
  },
};
