import { API_URLS } from '../utils/Constants';
import axios from 'axios';

export const anonymizeApi = ({ request, method, source }) => {
  const url =
    method === 'post'
      ? API_URLS.DATASET_ANONYMIZE + 'upload'
      : API_URLS.DATASET_ANONYMIZE + 'download';

  if (method === 'post') {
    const requestData = request?.data;
    let postData = new FormData();
    postData.append('k', new Blob([requestData?.k], { type: 'text/plain' }));
    postData.append('file', requestData?.file);

    let config = {
      method: 'post',
      url: url,
      headers: {
        'Content-type': 'multipart/form-data',
        'Access-Control-Expose-Header': 'Performance-Metrics',
        ...requestData?.getHeaders?.(),
      },
      data: postData,
      cancelToken: source.token,
    };
    return axios.request(config);
  } else {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
      params: request.params,
      cancelToken: source.token,
    };

    return axios.get(url, config);
  }
};

export const auditApi = ({ request, source }) => {
  const url = API_URLS.DATASET_ANONYMIZE + 'audit';

  const requestData = request?.data;
  let postData = new FormData();
  postData.append('k', new Blob([requestData?.k], { type: 'text/plain' }));
  postData.append('file', requestData?.file);

  let config = {
    method: 'post',
    url: url,
    headers: {
      'Content-type': 'multipart/form-data',
      ...requestData?.getHeaders?.(),
    },
    data: postData,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const visitorDetectionApi = ({ request, source }) => {
  const url = API_URLS.VISITOR_DETECTION;

  const config = {
    headers: {
      'Content-type': 'application/json',
    },
    params: request.params,
    cancelToken: source.token,
  };

  return axios.get(url, config);
};
