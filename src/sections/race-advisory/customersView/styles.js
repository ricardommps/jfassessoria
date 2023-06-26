import { styled } from '@mui/material/styles';

export const CustomersDiv = styled('div')(({ moveLeft }) => ({
  maxWidth: '133%!important',
  transition: 'all .5s',
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginLeft: '-33%',
  width: '133%',
  ...(moveLeft && {
    marginLeft: '-33%',
    width: '133%',
    maxWidth: '133%!important',
  }),
}));
