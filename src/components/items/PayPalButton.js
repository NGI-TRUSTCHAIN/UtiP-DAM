import { PayPalButtons } from '@paypal/react-paypal-js';
import React from 'react';
import { globalActions } from '../../store/global';
import { useDispatch } from 'react-redux';

function PayPalButton({ amount, onPaymentError, onPaymentApprove }) {
  const dispatch = useDispatch();

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      const payerName = details.payer.name.given_name;
      const status = details.status;
      const message = `Transaction completed by ${payerName}. Thank you for your purchase!`;
      dispatch(
        globalActions.setToaster({
          message: message,
          type: 'success',
        })
      );
      onPaymentApprove(data, status, message);
    });
  };

  const onError = (err) => {
    dispatch(
      globalActions.setToaster({
        message:
          typeof err === 'string'
            ? err
            : 'An unexpected error occurred. Please try again later.',
        type: 'error',
      })
    );

    onPaymentError(err, 'FAILED');
  };

  if (!amount) return;

  return (
    <PayPalButtons
      style={{ layout: 'vertical' }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount,
              },
              shipping_preference: 'NO_SHIPPING',
            },
          ],
          application_context: {
            shipping_preference: 'NO_SHIPPING',
          },
        });
      }}
      onApprove={onApprove}
      onError={onError}
    />
  );
}

export default PayPalButton;
