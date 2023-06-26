import { styled } from '@mui/material/styles';

export const Container = styled('div')(({ theme }) => ({
  overflow: 'hidden',
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

export const CheckboxAction = styled('div')(() => ({
  float: 'left',
}));

export const CardListContent = styled('div')(() => ({
  fontSize: '14px',
  textAlign: 'left',
}));

export const CardListItem = styled('div')(() => ({
  margin: '15px 0 0',
  position: 'relative',
  height: '40px',
  width: '100%',
  border: '1px solid #212121',
  borderRadius: '4px',
  overflow: 'hidden',
  boxShadow:
    '0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)',
  cursor: 'pointer',
}));

export const ImgBox = styled('div')(() => ({
  float: 'left',
  marginRight: '5px',
  height: '40px',
  width: '40px',
  border: '0',
  '& img': {
    height: '40px',
    width: 'auto',
    border: 0,
    borderRadius: '4px',
    overflowClipMargin: 'content-box',
    overflow: 'clip',
  },
}));

export const TxtBox = styled('div')(() => ({
  marginLeft: '35px',
  width: '330px',
  height: '100%',
}));

export const TxtBoxName = styled('div')(() => ({
  fontSize: '12px',
  color: '#fff',
  marginTop: '2px',
}));

export const TxtBoxRepetition = styled('div')(() => ({
  fontStyle: 'italic',
  color: '#777',
  fontSize: '12px',
  marginTop: '2px',
}));

export const TxtBoxInterval = styled('div')(() => ({
  fontSize: '12px',
  color: '#777',
  marginTop: '2px',
  top: '18px',
  position: 'absolute',
  right: '38px',
}));
