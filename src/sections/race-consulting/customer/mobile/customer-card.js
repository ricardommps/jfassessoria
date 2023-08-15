import Box from '@mui/material/Box';

import CardItem from './card-item';
export default function CustomerCard({ customers, setCustomerForm }) {
  return (
    <Box
      gap={1}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
      }}
      p={2}
    >
      {customers.map((customer) => (
        <CardItem customer={customer} setCustomerForm={setCustomerForm} key={customer.id} />
      ))}
    </Box>
  );
}
