import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import useAnamnese from 'src/hooks/use-anamnese';
import { fDate } from 'src/utils/format-time';

export default function Anamnese({ id }) {
  const { onGetAnamnese, anamnese } = useAnamnese();

  const getGender = (gender) => {
    if (gender === 'Men') return 'Masculino';
    if (gender === 'Women') return 'Feminino';
    return 'Outro';
  };

  useEffect(() => {
    if (id) {
      onGetAnamnese(id);
    }
  }, [id]);
  return (
    <Box>
      <>
        <Card sx={{ p: 3 }}>
          <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold' }} pb={3}>
            Anamnese
          </Typography>
          {anamnese && (
            <Box>
              <Typography variant="h4">Identificação</Typography>
              <Divider sx={{ borderBottomWidth: 5 }} />
              <Box
                p={3}
                rowGap={3}
                columnGap={2}
                display="grid"
                flexDirection="column"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>Nome completo</Box>
                  {anamnese.customer.name}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>Telefone celular</Box>
                  {anamnese.customer.phone}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>E-mail</Box>
                  {anamnese.customer.email}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>Data de nascimento</Box>
                  {fDate(anamnese.customer.birthDate, 'dd/MM/yyyy')}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>Sexo</Box>
                  {getGender(anamnese.customer.gender)}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>Estado civil</Box>
                  {anamnese.customer.maritalStatus}
                </Stack>
              </Box>
              <Typography variant="h4">Endereço</Typography>
              <Divider sx={{ borderBottomWidth: 5 }} />
              <Box
                p={3}
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>Rua</Box>
                  {anamnese.customer.street}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>CEP</Box>
                  {anamnese.customer.zipCode}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>Número</Box>
                  {anamnese.customer.streetNumber}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>Complemento</Box>
                  {anamnese.customer.complement}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>Bairro</Box>
                  {anamnese.customer.district}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>Cidade</Box>
                  {anamnese.customer.city}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.state' }}>UF</Box>
                  {anamnese.customer.state}
                </Stack>
              </Box>
              <Divider sx={{ borderBottomWidth: 5 }} />
              <Box
                p={3}
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>1 - Massa corporal</Box>
                  {anamnese.customer.weight}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>2 - Altura</Box>
                  {anamnese.customer.height}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>3 - Percentual de gordura</Box>
                  {anamnese.customer.fatPercentage === 'false' || !anamnese.customer.fatPercentage
                    ? 'Não sei informar'
                    : anamnese.customer.fatPercentage}
                </Stack>
              </Box>
              <Box
                p={3}
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>
                    4 - Você possui diabetes ou problemas de pressão arterial? Se sim, qual (is)?
                  </Box>
                  {anamnese.hasDiabetesOrHypertension}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>
                    5 - Você possui dores ou lesões? Se sim, qual (is)?
                  </Box>
                  {anamnese.painOrInjuries}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>
                    6 - Você já realizou ou vai realizar alguma cirurgia? Se sim, qual (is)??
                  </Box>
                  {anamnese.youSurgery}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>
                    7 - Você ou alguém da sua família possui alguma cardiopatia? Se sim, quem e
                    qual(is)?
                  </Box>
                  {anamnese.heartDisease}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>
                    8 - Você manifesta ou já manifestou qualquer outro tipo de doença? Se sim, qual
                    (is)?
                  </Box>
                  {anamnese.disease}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}> 9 - Você está grávida?</Box>
                  {anamnese.isPregnant ? 'Sim' : 'Não'}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>
                    10 - Usa medicamentos e/ou suplementos alimentares? Se sim, qual (is)?
                  </Box>
                  {anamnese.medicationsOrSupplements}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>11 - Etilismo</Box>
                  {anamnese.etilismo}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>12 - Tabagismo</Box>
                  {anamnese.smoking}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>13 - Alimentação</Box>
                  {anamnese.food}
                </Stack>

                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>14 - Vegetariano?</Box>

                  {anamnese.isVegetarian ? 'Sim' : 'Não'}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>15 - Vegano?</Box>

                  {anamnese.isVegan ? 'Sim' : 'Não'}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>
                    16 - Você pratica alguma atividade física regularmente? Se sim, qual (is)?
                  </Box>
                  {anamnese.physicalActivity}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>
                    17 - Qual sua intenção em começar uma assessoria esportiva?
                  </Box>
                  {anamnese.intentionsStartingSportsConsultancy}
                </Stack>
                <Stack spacing={0.5}>
                  <Box sx={{ color: 'text.disabled' }}>
                    18 - Está buscando assessoria de corrida?
                  </Box>
                  {anamnese.lookingForRacingAdvice ? 'Sim' : 'Não'}
                </Stack>
                {anamnese.lookingForRacingAdvice === 'true' && (
                  <>
                    <Stack spacing={0.5}>
                      <Box sx={{ color: 'text.disabled' }}>
                        19 - Sobre sua experiência com a prática de corrida:
                      </Box>
                      {anamnese.runningExperience}
                    </Stack>
                    <Stack spacing={0.5}>
                      <Box sx={{ color: 'text.disabled' }}>
                        20 - Se você corre, qual foi sua maior distância percorrida?
                      </Box>
                      {anamnese.longestRunningDistance}
                    </Stack>
                    <Stack spacing={0.5}>
                      <Box sx={{ color: 'text.disabled' }}>
                        21 - Se você corre, qual foi sua melhor marca e em qual distância ela
                        aconteceu?
                      </Box>
                      {anamnese.bestRunningTime}
                    </Stack>
                    <Stack spacing={0.5}>
                      <Box sx={{ color: 'text.disabled' }}>
                        22 - Sobre seu treino de fortalecimento:
                      </Box>
                      {anamnese.strengtheningTraining}
                    </Stack>
                    <Stack spacing={0.5}>
                      <Box sx={{ color: 'text.disabled' }}>
                        23 - Sobre sua experiência com competições de corrida:
                      </Box>
                      {anamnese.runningCompetitionExperience}
                    </Stack>
                    <Stack spacing={0.5}>
                      <Box sx={{ color: 'text.disabled' }}>
                        24 - Por que você está procurando uma assessoria de corrida?
                      </Box>
                      {anamnese.youLookingForRaceConsultancy}
                    </Stack>
                    <Stack spacing={0.5}>
                      <Box sx={{ color: 'text.disabled' }}>
                        25 - Você pretende participar de provas de corrida no futuro?
                      </Box>
                      {anamnese.runningEventsFuture ? 'Sim' : 'Não'}
                    </Stack>
                    <Stack spacing={0.5}>
                      <Box sx={{ color: 'text.disabled' }}>
                        26 - Você já tem alguma prova de corrida em seu calendário futuro? Se sim,
                        qual distância pretende correr? E qual a data do(s) evento(s)?
                      </Box>
                      {anamnese.raceOnYourFutureCalendar}
                    </Stack>
                    <Stack spacing={0.5}>
                      <Box sx={{ color: 'text.disabled' }}>
                        27 - Quantos dias da semana você pretende e pode correr? E quanto tempo você
                        tem para as sessões?
                      </Box>
                      {anamnese.daysOfTheWeekRun}
                    </Stack>
                    <Stack spacing={0.5}>
                      <Box sx={{ color: 'text.disabled' }}>
                        28 - Você possui relógio de corrida? Se sim, qual?
                      </Box>
                      {anamnese.hasRunningClock}
                    </Stack>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Card>
      </>
    </Box>
  );
}
