import NearMeIcon from '@mui/icons-material/NearMe';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { ButtonIcon } from 'src/components/button-icon/button-icon';
import Iconify from 'src/components/iconify/iconify';

import {
  Content,
  ItemBox,
  ItemText,
  Name,
  ProgramsList,
  ProgramsListBox,
  ProgramsListCell,
  ProgramsListHeader,
  SearchBox,
  Slide,
} from './styles';

export function CloneExport() {
  return (
    <Content>
      <ProgramsListBox>
        <ProgramsListHeader>
          <h4>Enviar para qual programa?</h4>
        </ProgramsListHeader>
        <ProgramsList>
          <SearchBox>
            <TextField
              variant="standard"
              placeholder="Buscar"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: 1, md: 260 },
              }}
            />
          </SearchBox>
          <ProgramsListCell disabled>
            <ItemBox>
              <ItemText>
                <Name>Programa Joana</Name>
                <Name>Aluno: Joana</Name>
                <Name>PV: 13 km/h</Name>
              </ItemText>
            </ItemBox>
          </ProgramsListCell>
          <ProgramsListCell>
            <ItemBox>
              <ItemText>
                <Name>Programa Maria</Name>
                <Name>Aluno: Maria</Name>
                <Name>PV: 8 km/h</Name>
              </ItemText>
              <Slide>
                <ButtonIcon>
                  <NearMeIcon sx={{ fontSize: '28px', width: '28px', height: '30px' }} />
                </ButtonIcon>
              </Slide>
            </ItemBox>
          </ProgramsListCell>
        </ProgramsList>
      </ProgramsListBox>
    </Content>
  );
}
