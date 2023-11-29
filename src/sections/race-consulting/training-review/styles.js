import { alpha, styled } from '@mui/material/styles';

export const ListItem = styled('div')(() => ({
  borderLeft: '5px solid !important',
  backgroundColor: alpha('#333', 0.3),
  padding: 0,
  position: 'relative',
  height: 'auto',
  border: '1px solid #212121',
  borderRadius: '4px',
  overflow: 'hidden',
  boxShadow:
    '0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'flex-start',
  '& img': {
    float: 'left',
    width: '106px',
    height: '60px',
    borderRadius: '4px',
  },
}));

export const BasecInfoColumn1 = styled('div')(() => ({
  float: 'left',
  width: '140px',
  height: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  flexGrow: 1,
}));

export const BasecInfoTitle = styled('div')(() => ({
  height: '16px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  fontSize: '11px',
  fontWeight: '600',
  color: '#ddd',
  padding: '2px 2px 0 8px',
}));

export const BasecInfoSubTitle = styled('div')(({ bold }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  fontSize: '11px',
  fontStyle: 'italic',
  color: '#888',
  padding: '5px 36px 0 8px',
  height: 'auto',
  ...(bold && {
    fontWeight: 'bold',
  }),
}));
