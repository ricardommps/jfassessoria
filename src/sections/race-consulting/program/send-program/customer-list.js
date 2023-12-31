import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useCustomer from 'src/hooks/use-customer';

export default function CustomerList({ onSelectCustomer, currentCustomerId }) {
  const { customersReview } = useCustomer();
  return (
    <>
      {customersReview.length && (
        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {customersReview.map((customer) => {
            const labelId = `checkbox-list-secondary-label-${customer.id}`;
            return (
              <ListItem
                key={customer.id}
                secondaryAction={
                  <Checkbox
                    disabled={customer.id === currentCustomerId}
                    onChange={() => onSelectCustomer(customer.id)}
                    edge="end"
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                }
                disablePadding
              >
                <ListItemButton disabled={customer.id === currentCustomerId}>
                  <ListItemText
                    id={labelId}
                    primary={customer.name}
                    secondary={
                      <Stack pl={2}>
                        <Typography>{customer.email}</Typography>
                      </Stack>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
}
