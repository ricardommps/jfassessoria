import { useCallback } from 'react';
import {
  deletePayment,
  getPayments,
  paymentCreatedReq,
  updatePayment,
} from 'src/redux/slices/payment';
import { useDispatch, useSelector } from 'src/redux/store';
export default function usePayment() {
  const dispatch = useDispatch();
  const {
    payments,
    paymentsStatus,
    paymentCreated,
    paymentCreatedStatus,
    updatePaymentSuccess,
    paymentError,
    deletePaymentSuccess,
  } = useSelector((state) => state.payment);

  const onListPayments = useCallback(
    (customerId) => {
      dispatch(getPayments(customerId));
    },
    [dispatch],
  );

  const onCreatePayment = useCallback(
    (payment) => {
      dispatch(paymentCreatedReq(payment));
    },
    [dispatch],
  );

  const onUpdatePayment = useCallback(
    (paymentUpdate, paymentId) => {
      dispatch(updatePayment(paymentUpdate, paymentId));
    },
    [dispatch],
  );

  const onDeletePayment = useCallback(
    (paymentId) => {
      dispatch(deletePayment(paymentId));
    },
    [dispatch],
  );

  return {
    payments,
    paymentsStatus,
    onListPayments,
    onCreatePayment,
    paymentCreated,
    paymentCreatedStatus,
    onUpdatePayment,
    updatePaymentSuccess,
    paymentError,
    onDeletePayment,
    deletePaymentSuccess,
  };
}
