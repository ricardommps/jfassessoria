import { styled } from '@mui/material/styles';

export const Content = styled('div')(() => ({
  overflow: 'hidden',
  padding: '6px 10px',
}));

export const ProgramsListBox = styled('div')(() => ({
  color: '#ddd',
}));

export const ProgramsListHeader = styled('div')(() => ({
  textAlign: 'center',
  margin: '30px 0',
  '& h4': {
    fontSize: '14px',
    fontWeight: 400,
    margin: '2px 0 25px',
    display: 'block',
    marginBlockStart: '1.33em',
    marginBlockEnd: '1.33em',
    marginInlineStart: '0px',
    marginInlineEnd: '0px',
  },
}));

export const ProgramsList = styled('div')(() => ({
  margin: '0 -10px',
}));

export const SearchBox = styled('div')(() => ({
  padding: '10px',
}));

export const ProgramsListCell = styled('div')(({ disabled }) => ({
  clear: 'both',
  fontSize: '14px',
  padding: '8px 10px',
  borderBottom: '1px solid #555',
  display: 'flex',
  ...(disabled && {
    opacity: '.5',
    background: '#333',
  }),
}));

export const Cover = styled('div')(() => ({
  display: 'inline-block',
  '& img': {
    height: '48px',
    width: '36px',
    borderRadius: '4px',
    border: '1px solid #333',
    overflowClipMargin: 'content-box',
    overflow: 'clip',
  },
}));

export const Name = styled('div')(() => ({
  color: '#aaa',
  display: 'inline-block',
  width: '185px',
  marginLeft: '10px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  lineHeight: '15px',
}));

export const Slide = styled('div')(() => ({
  cursor: 'pointer',
}));

export const ItemBox = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
