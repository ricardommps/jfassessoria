import { Document, Font, Image, Line, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { fDate } from 'src/utils/format-time';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col4: { width: '25%' },
        col8: { width: '75%' },
        col6: { width: '50%' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        alignRight: { textAlign: 'right' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          padding: '40px 24px 120px 24px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: {
          width: '15%',
        },
        tableCell_2: {
          width: '30%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '50%',
        },
      }),
    [],
  );

export default function ProgramPdf({ program, notificationPdf }) {
  const styles = useStyles();
  function sortFunction(a, b) {
    if (a.datePublished && b.datePublished) {
      var dateA = new Date(a.datePublished).getTime();
      var dateB = new Date(b.datePublished).getTime();
      return dateA > dateB ? 1 : -1;
    }
  }
  const trainings = [...program.trainings].sort(sortFunction);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]} fixed>
          <Image source="/logo/logo_preta.png" style={{ width: 48, height: 48 }} />
          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>Joana Foltz Muller</Text>
            <Text> 031842-G/SC </Text>
          </View>
        </View>
        <Line x1="0" y1="200" x2="200" y2="200" strokeWidth={2} stroke="rgb(0,0,0)" />

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Dados do Aluno</Text>
            <Text style={styles.body2}>Nome: {program.customer.name}</Text>
            <Text style={styles.body2}>Email: {program.customer.email}</Text>
            <Text style={styles.body2}>Telefone: {program.customer.phone}</Text>
            <Text style={styles.body2}>Objetivo: {program.customer.goal}</Text>
            <Text style={styles.body2}>
              Data Nasc.: {fDate(program.customer.birthDate, 'dd/MM/yyyy')}
            </Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Dados do Programa</Text>
            <Text style={styles.body2}>{program.name}</Text>
            <Text style={styles.body2}>Objetivo: {program.goal}</Text>
            <Text style={styles.body2}>Dificuldade: {program.difficultyLevel}</Text>
            <Text style={styles.body2}>
              Mês de referência: {fDate(program.referenceMonth, 'MM-yyyy')}
            </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Detalhes do Programa</Text>
            <Text style={styles.body2}>PV: {program.pv}</Text>
            <Text style={styles.body2}>Pace: {program.pace}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Vla / Vlan</Text>
            <Text style={styles.body2}>Vlan: {program.vlan}</Text>
            <Text style={styles.body2}>Pace Vlan: {program.paceVlan}</Text>
            <Text style={styles.body2}>Vla: {program.vla}</Text>
            <Text style={styles.body2}>Pace Vla: {program.paceVla}</Text>
          </View>
        </View>

        <Text style={[styles.subtitle1, styles.mb8]}>Treinos</Text>
        <View style={styles.table}>
          <View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>Dia</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Nome</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Descriçao</Text>
              </View>
            </View>
          </View>

          <View>
            {trainings.length > 0 &&
              trainings.map((item) => (
                <View style={styles.tableRow} key={item.id}>
                  <View style={styles.tableCell_1}>
                    <Text>{fDate(item.datePublished, 'dd/MM/yyyy')}</Text>
                  </View>
                  <View style={styles.tableCell_2}>
                    <Text>{item.name}</Text>
                  </View>
                  <View style={styles.tableCell_3}>
                    <Text>{item.description}</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
        <View style={[styles.gridContainer, styles.footer]} fixed>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>Avisos</Text>
            <Text>{notificationPdf}</Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Duvidas?</Text>
            <Text>(49 - 99805-8840)</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
