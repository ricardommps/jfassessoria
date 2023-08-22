import PaymentList from './paymentList';
export default function Payment({ open, onClose, customerId }) {
  return (
    <>
      <PaymentList open={open} onClose={onClose} customerId={customerId} />
    </>
  );
}
