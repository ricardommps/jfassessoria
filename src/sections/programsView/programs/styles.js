import { styled } from '@mui/material/styles';
import Image from 'next/image';

export const Container = styled('span')(() => ({
  color: '#f7951e',
  backgroundColor: '#252525',
  boxShadow: '0!important',
  textAlign: 'left',
  width: '360px',
  overflowY: 'auto',
  overflowX: 'hidden',
  margin: 0,
}));
export const Card = styled('div')(() => ({
  display: 'flex',
  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))',
  backgroundColor: '#212B36',
  padding: 0,
  margin: '15px 0',
  position: 'relative',
  height: '200px',
  borderBottom: 0,
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow:
    'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px',
}));

export const CardImage = styled(Image)(() => ({
  borderRadius: '16px',
  float: 'left',
}));

export const CardDetails = styled('div')(() => ({
  float: 'left',
  height: '135px',
  fontSize: '13px',
  color: '#888',
}));

export const Name = styled('div')(() => ({
  height: '36px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  fontSize: '14px',
  color: '#fff',
  fontWeight: '600',
  margin: '15px 0',
  padding: '0 15px',
}));

export const Difficulty = styled('div')(() => ({
  padding: '0 15px',
  marginBottom: '5px',
}));

export const Goal = styled('div')(() => ({
  padding: '0 15px',
  marginBottom: '5px',
  '& span': {
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
}));

export const Weeks = styled('div')(() => ({
  padding: '0 15px',
  marginBottom: '5px',
  '& span': {
    paddingTop: '1px',
  },
}));

export const Actions = styled('div')(() => ({
  padding: '0 4px',
  transform: 'scale(.9)',
  float: 'left',
  width: '155px',
  height: '55px',
  display: 'flex',
  justifyContent: 'space-around',
  gap: '10px',
}));

export const ActionButton = styled('div')(() => ({
  minWidth: '45px',
  margin: 0,
  padding: '10px 0',
  borderRadius: '6px',
  background: 'transparent',
  fontWeight: '200',
  color: '#252525',
  textTransform: 'uppercase',
  boxSizing: 'border-box',
  position: 'relative',
  userSelect: 'none',
  cursor: 'pointer',
  outline: 'none',
  border: 'none',
  WebkitTapHighlightColor: 'transparent',
  display: 'inlineBlock',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  verticalAlign: 'baseline',
  textAlign: 'center',
  lineHeight: '36px',
}));

export const Wrapper = styled('div')(() => ({
  userSelect: 'none',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  lineHeight: '36px',
}));

export const ButtonLabel = styled('div')(({ theme }) => ({
  color: '#888',
  fontSize: '10px',
  position: 'absolute',
  width: '45px',
  height: '10px',
  lineHeight: '10px',
  top: '40px',
  left: 0,
  fontFamily: theme.typography.fontFamily,
  fontWeight: 800,
}));
