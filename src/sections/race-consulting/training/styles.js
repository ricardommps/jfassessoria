import { alpha, styled } from '@mui/material/styles';

export const Container = styled('div')(({ theme }) => ({
  overflow: 'auto',
  display: 'block',
  height: 'calc(100vh - 380px)',
  padding: '0 10px 0 0',
  fontFamily: theme.typography.fontFamily,
}));
export const ActionsHeader = styled('div')(() => ({
  marginTop: '50px',
  display: 'block',
  fontSize: '14px',
  textAlign: 'lext',
  '& hr': {
    border: 0,
    borderBottom: '1px solid #555',
    display: 'block',
    unicodeBidi: 'isolate',
    marginBlockStart: '0.5em',
    marginBlockEnd: '0.5em',
    marginInlineStart: 'auto',
    marginInlineEnd: 'auto',
    overflow: 'hidden',
  },
}));

export const ListItem = styled('div')(({ statusColor }) => ({
  borderLeft: '5px solid !important',
  borderLeftColor: statusColor,
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
    borderRadius: '4px',
  },
}));

export const CheckboxAction = styled('div')(() => ({
  float: 'left',
  margin: '12px 10px',
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

export const BaseHeader = styled('div')(() => ({
  margin: '2px 10px',
  background: '#333',
  borderRadius: '0 0 8px 8px',
  fontSize: '.7rem',
  color: '#999',
  padding: '2px 10px 5px',
  '& span': {
    display: 'block',
    margin: '0 auto',
    textAlign: 'left',
    position: 'relative',
    fontStyle: 'normal',
    padding: '0 0 0 20px',
  },
}));

export const Advanced = styled('div')(() => ({
  color: '#f44336',
  fontWeight: 400,
}));

export const Beginner = styled('div')(() => ({
  color: '#00b826',
  fontWeight: 400,
}));

export const StyledDialogActions = styled('div')(() => ({
  justifyContent: 'center',
  margin: '20px 0 0',
  padding: '8px 0',
  display: 'flex',
  flexWrap: 'wrap',
  minHeight: '52px',
  alignItems: 'center',
}));

export const BasecColumnAction = styled('div')(() => ({
  float: 'left',
  width: 'auto',
  height: '60px',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
}));
