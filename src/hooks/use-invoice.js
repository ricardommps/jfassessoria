import { useCallback } from 'react';
import { createAndEditReq, deleteInvoiceReq, getInvoicesReq } from 'src/redux/slices/invoice';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useInvoice() {
  const dispatch = useDispatch();
  const { invoices, invoicesStatus } = useSelector((state) => state.invoice);

  const onGetInvoices = useCallback(
    async (customerId) => {
      await dispatch(getInvoicesReq(customerId)); // Retorna a Promise
    },
    [dispatch],
  );

  const onCreateAndEditInvoice = useCallback(
    async (payload, invoiceId) => {
      await dispatch(createAndEditReq(payload, invoiceId));
    },
    [dispatch],
  );

  const onDeleteInvoice = useCallback(
    async (invoiceId) => {
      await dispatch(deleteInvoiceReq(invoiceId));
    },
    [dispatch],
  );

  return {
    onGetInvoices,
    invoices,
    invoicesStatus,
    onCreateAndEditInvoice,
    onDeleteInvoice,
  };
}
