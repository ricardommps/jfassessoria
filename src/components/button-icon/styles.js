import { styled } from '@mui/material/styles';
export const Button = styled('div')(({ disabled }) => ({
  color: '#777',
  background: 'transparent',
  fontSize: '14px',
  textTransform: 'capitalize',
  fontWeight: '400',
  padding: '0',
  height: '32px',
  width: '40px',
  cursor: 'pointer',
  textAlign: 'center',
  ...(disabled && {
    color: '#333',
    cursor: 'default',
  }),
}));
