import { API_URLS } from '../utils/Constants';
import Cookies from 'universal-cookie';
import axios from 'axios';

export const checkoutApi = async ({ request, source }) => {
  const url = API_URLS.CHECKOUT;
  const cookies = new Cookies();
  const token = cookies.get('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
    cancelToken: source.token,
  };

  return await axios.post(url, request.data, config);
};

export const datasetsApi = async ({ source }) => {
  const url = API_URLS.DATASETS;
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
    cancelToken: source.token,
  };

  return await axios.get(url, config);
};

export const datasetApi = async ({ request, source }) => {
  let url = API_URLS.DATASET + request.params;

  const config = {
    headers: {
      'Content-type': 'application/json',
    },
    cancelToken: source.token,
  };

  return await axios.get(url, config);
};

export const datasetPutApi = async ({ request, source }) => {
  let url = API_URLS.DATASET_DEFINITION + request.params; // {datasetDefinitionId}

  const cookies = new Cookies();
  const token = cookies.get('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
    cancelToken: source.token,
    data: request.data,
  };

  return await axios.put(url, request.data, config);
};

export const datasetDeleteApi = async ({ request, source }) => {
  let url;
  if (request?.allDates) {
    url = API_URLS.DATASET_DEFINITION + request.params; // /datasetDefinition/{id}
  } else {
    url = API_URLS.DATASET + request.params; // /dataset/{id}
  }

  const cookies = new Cookies();
  const token = cookies.get('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
    cancelToken: source.token,
  };

  return await axios.delete(url, config);
};

export const datasetUpdateApi = ({ request, source }) => {
  const url = `${API_URLS.DATASET_ANONYMIZE}/anonymizationJob`;
  const cookies = new Cookies();
  const token = cookies.get('token');

  const requestData = request?.data;

  let postData = new FormData();

  postData.append('file', requestData?.file);
  postData.append('dataset', new Blob([JSON.stringify(requestData?.dataset)]));

  const config = {
    method: 'post',
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'multipart/form-data',
      ...requestData?.getHeaders?.(),
    },
    data: postData,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const emailSendApi = ({ request, source }) => {
  const url = API_URLS.EMAIL_SEND;
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
    cancelToken: source.token,
  };

  return axios.post(url, request.data, config);
};

export const locationsApi = ({ request, source }) => {
  const url = API_URLS.LOCATIONS + request.params?.datasetDefinitionId;

  const config = {
    headers: {
      'Content-type': 'application/json',
    },
    cancelToken: source.token,
  };

  return axios.get(url, config);
};

export const mobilityDatasetDownloadApi = async ({ request, source }) => {
  const url = API_URLS.MOBILITY_DATASET_DOWNLOAD;
  const config = {
    headers: {
      'Content-type': 'application/json',
      'Accept-Encoding': 'gzip,deflate,compress',
    },
    responseType: 'blob',
    params: request.params,
    cancelToken: source.token,
  };

  return await axios.get(url, config);
};
