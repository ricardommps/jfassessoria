import { styled } from '@mui/material/styles';

export const Box = styled('div')(() => ({
  background: '#272727',
  padding: '20px',
  textAlign: 'center',
  height: '160px',
  width: '320px',
  margin: 'calc(50vh - 160px) auto',
  borderRadius: '16px',
  border: '1px solid #333',
  boxShadow:
    '0 2px 1px -1px rgb(0 0 0 / 20%), 0 1px 1px 0 rgb(0 0 0 / 14%), 0 1px 3px 0 rgb(0 0 0 / 12%)',
}));
