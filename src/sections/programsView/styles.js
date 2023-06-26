import { styled } from '@mui/material/styles';

export const TopperMenu = styled('div')(() => ({
  zIndex: 999,
  top: 0,
  float: 'left',
  width: '100%',
  height: '55px',
  padding: '5px 0',
  display: 'flex',
}));

export const ButtonBack = styled('div')(() => ({
  float: 'left',
  margin: '12px 0 0 12px',
  opacity: 0.7,
  borderRadius: '26px',
  height: '26px',
  width: '26px',
}));
