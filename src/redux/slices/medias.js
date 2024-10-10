import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';

const mockData = [
  {
    id: 40,
    title: 'Teste Video 40',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 39,
    title: 'Teste Video 39',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 38,
    title: 'Teste Video 38',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 37,
    title: 'Teste Video 37',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 36,
    title: 'Teste Video 36',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 35,
    title: 'Teste Video 35',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 34,
    title: 'Teste Video 34',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 33,
    title: 'Teste Video 33',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 32,
    title: 'Teste video 32',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 31,
    title: 'Teste Video 31',
    thumbnail: 'http://img.youtube.com/vi/AdsP9iasPoc/0.jpg',
    videoUrl: 'https://youtube.com/shorts/AdsP9iasPoc',
    instrucctions:
      'Colocar um step no encosto da máquina para apoiar o quadril e ficar de forma que o mesmo fique numa posição de 45° como no vídeo',
    blocked: false,
  },
  {
    id: 30,
    title: 'Teste vide 30',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 29,
    title: 'Teste ID 29',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 28,
    title: 'Teste ID 28',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 27,
    title: 'Teste ID 27',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 26,
    title: 'Teste ID 26',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 25,
    title: 'Teste ID 25',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 24,
    title: 'Teste ID 24',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 23,
    title: 'Teste ID 23',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 22,
    title: 'Teste ID 22',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 21,
    title: 'Teste ID 21',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 20,
    title: 'Teste Video 20',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 19,
    title: 'Teste Video 19',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 18,
    title: 'Teste Video 18',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 17,
    title: 'Teste Video 17',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 16,
    title: 'Teste Video 16',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 15,
    title: 'Teste Video 15',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 14,
    title: 'Teste Video 14',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 13,
    title: 'Teste Video 13',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 12,
    title: 'Abdução Máquina',
    thumbnail: 'http://img.youtube.com/vi/RvWFjLTpw_k/0.jpg',
    videoUrl: 'https://youtube.com/shorts/RvWFjLTpw_k',
    instrucctions:
      'Para o movimento de abdução, você deve fazer força empurrando a máquina para fora, afastando os joelhos. Depois você deve voltar à posição inicial lentamente, mantendo a tensão dos músculos em vez de soltar o peso da máquina de uma vez',
    blocked: false,
  },
  {
    id: 11,
    title: 'Abdução Máquina 45º',
    thumbnail: 'http://img.youtube.com/vi/AdsP9iasPoc/0.jpg',
    videoUrl: 'https://youtube.com/shorts/AdsP9iasPoc',
    instrucctions:
      'Colocar um step no encosto da máquina para apoiar o quadril e ficar de forma que o mesmo fique numa posição de 45° como no vídeo',
    blocked: false,
  },
  {
    id: 10,
    title: 'Abdução Caneleira',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 9,
    title: 'Teste ID 9',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 8,
    title: 'Teste ID 8',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 7,
    title: 'Teste ID 7',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 6,
    title: 'Teste ID 6',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 5,
    title: 'Teste ID 5',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 4,
    title: 'Teste ID 4',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 3,
    title: 'Teste ID 3',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 2,
    title: 'Teste ID 2',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
  {
    id: 1,
    title: 'Teste ID 1',
    thumbnail: 'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg',
    videoUrl: 'https://youtube.com/shorts/2glJKuLyRhE',
    instrucctions:
      'Como fazer? Deite-se de lado, pernas estendidas e unidas, caneleiras. presas nos tornozelos, um braço segurando a cabeça e. outro flexionado na frente do corpo',
    blocked: false,
  },
];
const initialState = {
  medias: [],
  mediasStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  mediaCreate: null,
  mediaCreateStatus: {
    loading: false,
    error: null,
  },
  media: null,
  mediaStatus: {
    loading: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'medias',
  initialState,
  reducers: {
    getAllMediasStart(state) {
      state.medias = [];
      state.mediasStatus.error = null;
      state.mediasStatus.loading = true;
      state.mediasStatus.empty = false;
      state.mediaCreate = null;
      state.mediaCreateStatus.loading = false;
      state.mediaCreateStatus.error = null;
      state.media = null;
      state.mediaStatus.error = null;
      state.mediaStatus.loading = false;
    },
    getAllMediasFailure(state, action) {
      state.medias = [];
      state.mediasStatus.error = action.payload;
      state.mediasStatus.loading = false;
      state.mediasStatus.empty = false;
    },
    getAllMediasSuccess(state, action) {
      const medias = action.payload;
      state.medias = medias;

      state.mediasStatus.error = null;
      state.mediasStatus.loading = false;
      state.mediasStatus.empty = !medias.length || medias.length === 0;
    },

    createMediaStart(state) {
      state.mediaCreate = null;
      state.mediaCreateStatus.loading = true;
      state.mediaCreateStatus.error = null;
    },
    createMediaFailure(state, action) {
      const error = action.payload;

      state.mediaCreate = null;
      state.mediaCreateStatus.loading = false;
      state.mediaCreateStatus.error = error;
    },
    createMediaSuccess(state, action) {
      const mediaCreate = action.payload;

      state.mediaCreate = mediaCreate;
      state.mediaCreateStatus.loading = false;
      state.mediaCreateStatus.error = null;
    },
    getMediaStart(state) {
      state.media = null;
      state.mediaStatus.error = null;
      state.mediaStatus.loading = true;
    },
    getMediaFailure(state, action) {
      state.medias = null;
      state.mediaStatus.error = action.payload;
      state.mediaStatus.loading = false;
    },
    getMediaSuccess(state, action) {
      const media = action.payload;
      state.media = media;

      state.mediaStatus.error = null;
      state.mediaStatus.loading = false;
    },
  },
});

export default slice.reducer;

export function getListMedias() {
  return async (dispatch) => {
    dispatch(slice.actions.getAllMediasStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.medias.root}`);
      dispatch(slice.actions.getAllMediasSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getAllMediasFailure(error));
    }
  };
}

export function getMediasWithStretchTag() {
  return async (dispatch) => {
    dispatch(slice.actions.getAllMediasStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.medias.root}/stretchTag`);
      dispatch(slice.actions.getAllMediasSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getAllMediasFailure(error));
    }
  };
}

export function createMedia(payload) {
  return async (dispatch) => {
    dispatch(slice.actions.createMediaStart());
    try {
      const data = { ...payload };
      const response = await axios.post(`${API_ENDPOINTS.medias.root}`, data);
      dispatch(slice.actions.createMediaSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.createMediaFailure(error));
    }
  };
}

export function getMediaById(id) {
  return async (dispatch) => {
    dispatch(slice.actions.getMediaStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.medias.root}/${id}`);
      dispatch(slice.actions.getMediaSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.getMediaFailure(error));
    }
  };
}
