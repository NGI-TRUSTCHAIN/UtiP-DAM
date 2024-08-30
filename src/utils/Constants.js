export const API_URLS = {
  CHECKOUT: '/ngi-cs/api/checkout', //purchase via paypal
  DATASETS: '/ngi-cs/api/datasets',
  DATASET_ANONYMIZE: '/ngi-cs/api/mobility/', //* add: upload or download at the end
  DATASET: '/ngi-cs/api/dataset/', //* For create and update(add:  dataset_id at the end)
  DATASET_DEFINITION: '/ngi-cs/api/datasetDefinition/',
  DEACTIVATE_ACCOUNT: '/ngi-cs/api/deactivate',
  DELETE_ACCOUNT: '/ngi-cs/api/deleteAccount',
  EMAIL_SEND: '/ngi-cs/api/email/send',
  LICENSE_ACTIVATION: '/ngi-cs/api/invoice/licenseActivation/',
  LICENSE_DEACTIVATION: '/ngi-cs/api/invoice/licenseDeactivation/',
  LICENSE: '/ngi-cs/api/license',
  LOCATIONS: '/ngi-cs/api/locations/',
  MOBILITY_DATASET_DOWNLOAD: '/ngi-cs/api/mobility/download',
  MY_DATASETS: '/ngi-cs/api/myDatasets',
  MY_PURCHASES: '/ngi-cs/api/myPurchases',
  PURCHASE_DETAILS: '/ngi-cs/api/purchase/',
  PREMIUM_DOWNLOAD: '/ngi-cs/api/premium/download',
  SIGN_UP: 'ngi-cs/api/auth/signup',
  SIGN_IN: 'ngi-cs/api/auth/signin',
  UPDATE_ACCOUNT: '/ngi-cs/api/account',
  UPDATE_PASSWORD: '/ngi-cs/api/accountPw',
  VENDOR: '/ngi-cs/api/vendor',

  VISITOR_DETECTION: '/ngi-cs/api/mobility/visitorDetection',
};

export const WEEK_DAYS_CHAR = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const WEEK_DAYS_SHORT = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];
export const WEEK_DAYS_FULL = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const NAV_PATH = {
  about_find_me_here: {
    label: 'What is Find Me Here',
    path: '/about_find_me_here',
  },
  login: {
    label: 'Login',
    path: '/login',
  },

  home: {
    label: 'Home',
    path: '/',
  },
  individual: {
    label: 'Privacy',
    path: '/privacy',
  },
  companies: {
    label: 'Terms',
    path: '/terms',
  },
  about: {
    label: 'Contact',
    path: '/contact',
  },
};

export const CONTINENTS = [
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Oceania', //Australia
  'Africa',
  'Antarctica',
];

export const RISK_LEVEL = {
  0: {
    color: 'primary',
    level: 'no match',
  },
  1: {
    color: 'success',
    level: 'no risk',
  },
  2: { color: 'warning', level: 'low' },
  3: { color: 'danger', level: 'high' },
};

export const DATA_LOADING_MESSAGE = [
  'loading...',
  'Please wait a moment. Data retrieval in progress...',
  'Hang tight! Data is still loading...',
  'Looks like things are taking a bit longer than usual. Please try again later ',
];
