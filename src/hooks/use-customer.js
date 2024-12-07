import { useCallback } from 'react';
import {
  changePassword,
  clearCustomer,
  createCustomer,
  deleteCustomerReq,
  getCustomerById,
  getCustomers,
  getCustomersReview,
  getCustomerV2,
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
    customerError,
    changePasswordSuccess,
    changePasswordStatus,
  } = useSelector((state) => state.customer);

  const onCreateCustomer = useCallback(
    async (newCustomer) => {
      await dispatch(createCustomer(newCustomer));
    },
    [dispatch],
  );
  const onListCustomersReview = useCallback(async () => {
    await dispatch(getCustomersReview());
  }, [dispatch]);

  const onListCustomers = useCallback(async () => {
    await dispatch(getCustomers());
  }, [dispatch]);

  const onListCustomersV2 = useCallback(async () => {
    await dispatch(getCustomerV2());
  }, [dispatch]);

  const onCustomerById = useCallback(
    async (customerId) => {
      await dispatch(getCustomerById(customerId));
    },
    [dispatch],
  );

  const onClearCustome = useCallback(() => {
    dispatch(clearCustomer());
  }, [dispatch]);

  const onUpdateCustomer = useCallback(
    async (customerUpdate, customerId) => {
      await dispatch(updateCustomer(customerUpdate, customerId));
    },
    [dispatch],
  );

  const onDeleteCustomer = useCallback(
    async (customerId) => {
      await dispatch(deleteCustomerReq(customerId));
    },
    [dispatch],
  );

  const onChangePassword = useCallback(
    async (updatePassword, customerId) => {
      await dispatch(changePassword(updatePassword, customerId));
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
    customerError,
    onChangePassword,
    changePasswordSuccess,
    changePasswordStatus,
    onListCustomersV2,
  };
}
