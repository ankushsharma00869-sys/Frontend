export const BASE_URL = 'http://localhost:8080/api/v1.0';

const apiEndPoints = {
  FETCH_FILES: `${BASE_URL}/files/my`,
  GET_CREDITS: `${BASE_URL}/users/credits`,

  TOGGLE_FILE: (id) => `${BASE_URL}/files/${id}/toggle-public`,
  DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
  DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,

  UPLOAD_FILE: `${BASE_URL}/files/upload`,

  PUBLIC_FILE_VIEW: (id) => `${BASE_URL}/files/public/${id}`,
  PUBLIC_VIEW_LINK: (id) => `${BASE_URL}/files/view/${id}`,
  CREATE_ORDER: `${BASE_URL}/payments/create-order`,
  VERIFY_PAYMENT: `${BASE_URL}/payments/verify-payment`,
  TRANSACTIONS: `${BASE_URL}/transactions`,
};

export default apiEndPoints;
