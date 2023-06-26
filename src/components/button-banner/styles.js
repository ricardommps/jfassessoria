import { Button as ButtonMt } from '@mui/material';
import { styled } from '@mui/material/styles';
export const Button = styled(ButtonMt)(() => ({
  background: '#191919',
  color: '#777',
  fontSize: '14px',
  textTransform: 'inherit',
  width: '100px',
  fontWeight: 400,
  margin: '0!important',
  float: 'right',
  minWidth: '45%',
  height: ' max-content',
  alignSelf: 'flex-end',
}));

export const OverlayBox = styled('div')(({ height }) => ({
  borderRadius: '16px',
  background: 'rgba(0,0,0,.75)',
  width: 'calc(100% - 29px)',
  height: height,
  position: 'absolute',
  zIndex: '999',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  padding: '0 30px',
  fontSize: '16px',
  color: '#f7951e',
}));
