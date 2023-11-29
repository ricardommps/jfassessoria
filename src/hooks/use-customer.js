import { useCallback } from 'react';
import {
  clearCustomer,
  createCustomer,
  deleteCustomerReq,
  getCustomerById,
  getCustomers,
  getCustomersReview,
  updateCustomer,
} from 'src/redux/slices/customers';
import { useDispatch, useSelector } from 'src/redux/store';

export default function useCustomer() {
  const dispatch = useDispatch();
  const {
    customers,
    customersStatus,
    customerCreate,
    customer,
    customerStatus,
    updateCustomerSuccess,
    deleteCustomer,
    deleteCustomerStatus,
    customersReview,
    customersReviewStatus,
  } = useSelector((state) => state.customer);

  const onCreateCustomer = useCallback(
    (newCustomer) => {
      dispatch(createCustomer(newCustomer));
    },
    [dispatch],
  );

  const onListCustomersReview = useCallback(() => {
    dispatch(getCustomersReview());
  }, [dispatch]);

  const onListCustomers = useCallback(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const onCustomerById = useCallback(
    (customerId) => {
      dispatch(getCustomerById(customerId));
    },
    [dispatch],
  );

  const onClearCustome = useCallback(() => {
    dispatch(clearCustomer());
  }, [dispatch]);

  const onUpdateCustomer = useCallback(
    (customerUpdate, customerId) => {
      dispatch(updateCustomer(customerUpdate, customerId));
    },
    [dispatch],
  );

  const onDeleteCustomer = useCallback(
    (customerId) => {
      dispatch(deleteCustomerReq(customerId));
    },
    [dispatch],
  );

  return {
    customers,
    customersStatus,
    customerCreate,
    customer,
    customerStatus,
    onCreateCustomer,
    onListCustomers,
    onCustomerById,
    onClearCustome,
    onUpdateCustomer,
    updateCustomerSuccess,
    onDeleteCustomer,
    deleteCustomer,
    deleteCustomerStatus,
    customersReview,
    customersReviewStatus,
    onListCustomersReview,
  };
}
