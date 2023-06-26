import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

export const StyledDialog = styled(Dialog)`
  & > .MuiDialog-container > .MuiPaper-root {
    background-color: #fff;
    color: #444;
    font-weight: 100;
    border-radius: 12px;
    display: block;
    padding: 24px;
    box-sizing: border-box;
    overflow: auto;
    outline: 0;
    min-height: inherit;
    max-height: inherit;
    max-width: 368px;
  }
`;

export const TitleImage = styled('div')(() => ({
  width: '255px',
  height: '72px',
  fontSize: '20px',
  lineHeight: '24px',
  margin: '15px 0',
  textAlign: 'left',
  '& img': {
    height: '64px',
    float: 'left',
    marginRight: '15px',
    filter:
      'invert(74%) sepia(16%) saturate(7048%) hue-rotate(344deg) brightness(98%) contrast(98%)',
  },
}));

export const StyledDialogTitle = styled('div')(() => ({
  color: '#555',
  fontWeight: '200',
  fontSize: '20px',
  textAlign: 'center',
  margin: '0 0 20px',
}));

export const StyledDialogContent = styled('div')(() => ({
  display: 'block',
  margin: '0 0 12px',
  padding: '0 0',
  maxHeight: '65vh',
  overflow: 'auto',
}));
