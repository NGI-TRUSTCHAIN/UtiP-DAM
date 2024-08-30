import { API_URLS } from '../utils/Constants';
import Cookies from 'universal-cookie';
import axios from 'axios';

export const signupApi = ({ request, source }) => {
  const url = API_URLS.SIGN_UP;

  let data = JSON.stringify(request.data);

  let config = {
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    cancelToken: source.token,
    data: data,
  };

  return axios.request(config);
};

export const signinApi = ({ request, source }) => {
  const url = API_URLS.SIGN_IN;

  let data = JSON.stringify(request.data);

  let config = {
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    cancelToken: source.token,
    data: data,
  };

  return axios.request(config);
};

export const updateAccountApi = ({ request, source }) => {
  const url = API_URLS.UPDATE_ACCOUNT;
  let data = JSON.stringify(request.data);
  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: data,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const updateAccountPasswordApi = ({ request, source }) => {
  const url = API_URLS.UPDATE_PASSWORD;
  let data = JSON.stringify(request.data);
  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: data,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const myDatasetsApi = ({ request, source }) => {
  const url = API_URLS.MY_DATASETS;

  const cookies = new Cookies();
  const token = cookies.get('token');

  let params = request.params;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: params,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const deActivateAccountApi = ({ request, source }) => {
  const url = API_URLS.DEACTIVATE_ACCOUNT;

  const cookies = new Cookies();
  const token = cookies.get('token');

  let params = request.params;

  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: params,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const vendorApi = ({ request, method, source }) => {
  const url = API_URLS.VENDOR;

  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: request.params,
    data: request.data,
    cancelToken: source.token,
  };

  return axios.request(config);
};

//* create or update license
export const licenseApi = ({ request, method, source }) => {
  const url = request?.id
    ? API_URLS.LICENSE + '/' + request.id
    : API_URLS.LICENSE;

  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: method || 'post', //* patch or post
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: request.params,
    data: request.data,
    cancelToken: source.token,
  };

  return axios.request(config);
};

//* active , archived licenses
export const licensesApi = ({ request, source }) => {
  const url = API_URLS.LICENSE + 's';

  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: request.params,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const pendingLicensesApi = ({ request, source }) => {
  const url = API_URLS.LICENSE + 's/approval';

  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: request.params,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const licenseActivationApi = ({ request, source }) => {
  const url = API_URLS.LICENSE_ACTIVATION + request?.id; // + {id}

  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: request?.params,
    data: request?.data,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const licenseDeactivationApi = ({ request, source }) => {
  const url = API_URLS.LICENSE_DEACTIVATION + request?.id; // + {id}

  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: request?.params,
    data: request?.data,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const licenseDeleteApi = ({ request, source }) => {
  const url = API_URLS.LICENSE + '/' + request?.id; // + {id}

  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const deleteAccountApi = async ({ source }) => {
  const url = API_URLS.DELETE_ACCOUNT;

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

export const downloadPremiumApi = async ({ request, source }) => {
  const url = API_URLS.PREMIUM_DOWNLOAD;
  const uuid = request?.apiKey;

  const config = {
    headers: {
      'Api-Key': `${uuid}`, // response from /checkout api
      'Content-type': 'application/json',
      'Accept-Encoding': 'gzip,deflate,compress',
    },
    responseType: 'blob',
    params: request.params,
    cancelToken: source.token,
  };
  return await axios.get(url, config);
};

export const myPurchasesApi = ({ request, source }) => {
  const url = API_URLS.MY_PURCHASES;

  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: request.params,
    cancelToken: source.token,
  };

  return axios.request(config);
};

export const purchaseDetailsApi = ({ request, source }) => {
  const url = API_URLS.MY_PURCHASES + request?.id;

  const cookies = new Cookies();
  const token = cookies.get('token');

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: request.params,
    cancelToken: source.token,
  };

  return axios.request(config);
};
