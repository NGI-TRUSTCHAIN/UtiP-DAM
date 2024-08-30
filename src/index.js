import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App';
import Content from './components/defaultLayout/Content';
import ErrorPage from './pages/ErrorPage';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { store } from './store';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Content />,
        children: [
          {
            path: '/:menu',
            element: <Content />,
          },
        ],
        errorElement: <ErrorPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

root.render(
  // <React.StrictMode>
  <PayPalScriptProvider options={{ 'client-id': paypalClientId }}>
    <Provider store={store}>
      <RouterProvider router={router} />;
    </Provider>
  </PayPalScriptProvider>
  // </React.StrictMode>
);

reportWebVitals();
