import { styled } from '@mui/material/styles';

export const SubTitle = styled('p')(() => ({
  display: 'block',
  marginBlockStart: '1em',
  marginBlockEnd: '1em',
  marginInlineStart: '0px',
  marginInlineEnd: '0px',
  font: '400 14px/20px Roboto,Helvetica Neue,sans-serif',
  letterSpacing: 'normal',
}));

export const StyledDialogActions = styled('div')(() => ({
  margin: '0',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  padding: '8px 0',
  display: 'flex',
  minHeight: '52px',
  alignItems: 'center',
  '& h3': {
    margin: '0',
    textAlign: 'left',
    width: '100%',
    fontSize: '15px',
    fontWeight: '400',
  },
}));
