import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { addHours } from 'date-fns';
import { useMemo } from 'react';
import { fDate } from 'src/utils/format-time';
import { getModuleName } from 'src/utils/training-modules';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        ml5: { marginLeft: 5 },
        body1: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
        header: {
          borderTopWidth: 4,
          borderTopColor: '#0084B4',
          color: '#898989',
          padding: 20,
          display: 'flex',
          flexDirection: 'row',
        },
        headerLeft: {
          textAlign: 'left',
          flex: 1,
          alignSelf: 'center',
          fontSize: 32,
          fontWeight: 900,
          lineHeight: 1,
          color: '#0084B4',
          fontFamily: 'Roboto',
        },
        headerRight: {
          textAlign: 'right',
          fontSize: 12,
          flex: 1,
          fontFamily: 'Roboto',
        },
        ribbon: {
          backgroundColor: '#0084B4',
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          color: '#FFF',
          marginBottom: 10,
        },
        ribbonLabel: {
          fontSize: 14,
          fontFamily: 'Roboto',
          paddingLeft: 15,
          paddingTop: 2,
          paddingBottom: 2,
        },
        table: {
          paddingHorizontal: 20,
          display: 'flex',
          marginBottom: 20,
          flex: 1,
        },
        tableRowA: {
          backgroundColor: '#EDEDED',
          display: 'flex',
          flexDirection: 'row',
          padding: 10,
        },
        tableRowB: {
          padding: 10,
          display: 'flex',
          flexDirection: 'row',
        },
        tableHeadingA: {
          width: '20%',
          fontSize: 14,
          color: '#0084B4',
          fontFamily: 'Roboto',
        },
        tableHeadingB: {
          width: '30%',
          fontSize: 14,
          textAlign: 'right',
          color: '#0084B4',
          fontFamily: 'Roboto',
        },
        tableHeadingC: {
          width: '50%',
          textAlign: 'left',
          fontSize: 14,
          color: '#0084B4',
          fontFamily: 'Roboto',
        },
        serviceName: {
          fontSize: 10,
          width: '20%',
          fontFamily: 'Roboto',
        },
        serviceDescription: {
          fontSize: 10,
          textAlign: 'right',
          width: '50%',
          fontFamily: 'Roboto',
        },
        serviceAmount: {
          fontSize: 10,
          width: '30%',
          textAlign: 'left',
          fontFamily: 'Roboto',
        },
        tableExtrapolation: {
          display: 'table',
          width: 'auto',
        },
        tableRowExtrapolation: {
          flexDirection: 'row',
        },
        firstTableColHeaderExtrapolation: {
          width: '20%',
          borderStyle: 'solid',
          borderColor: '#000',
          borderBottomColor: '#000',
          borderWidth: 1,
        },
        tableCellHeaderExtrapolation: {
          textAlign: 'center',
          margin: 4,
          fontSize: 9,
          fontWeight: 'bold',
        },
        tableColHeaderExtrapolation: {
          width: '20%',
          borderStyle: 'solid',
          borderColor: '#000',
          borderBottomColor: '#000',
          borderWidth: 1,
          borderLeftWidth: 0,
        },
        tableColStyleExtrapolation: {
          width: '20%',
          borderStyle: 'solid',
          borderColor: '#000',
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        },
        tableCellExtrapolation: {
          textAlign: 'center',
          margin: 5,
          fontSize: 9,
        },
        alertMessage: {
          marginTop: 10,
          backgroundColor: 'rgb(255, 244, 229)',
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          color: 'rgb(102, 60, 0)',
        },
        alertMessagLabel: {
          fontSize: 14,
          fontFamily: 'Roboto',
          paddingLeft: 15,
          paddingTop: 2,
          paddingBottom: 2,
        },
        footer: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          borderTopColor: '#EDEDED',
          borderTopWidth: 1,
          textAlign: 'center',
          fontSize: 10,
          fontFamily: 'Roboto',
        },
        tableTop: {
          backgroundColor: '#0084B4',
          display: 'flex',
          flexDirection: 'row',
          marginTop: 5,
          padding: 5,
          marginBottom: 0,
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#FFF',
        },
        tableTopLabel: {
          fontSize: 14,
          fontFamily: 'Roboto',
        },
      }),
    [],
  );

export default function ProgramPdf({ program, notificationPdf, currentExtrapolation }) {
  const styles = useStyles();
  function isOdd(num) {
    return num % 2;
  }
  function sortFunction(a, b) {
    if (a.datePublished && b.datePublished) {
      var dateA = new Date(a.datePublished).getTime();
      var dateB = new Date(b.datePublished).getTime();
      return dateA > dateB ? 1 : -1;
    }
  }

  const getExtrapolationRender = (extrapolationItem) => {
    const item = Object.keys(extrapolationItem);
    delete item[0];
    return item;
  };

  function getAge(dateString) {
    const today = new Date();
    const birthDate = addHours(new Date(dateString), 3);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  const createTableHeaderExtrapolation = (key) => {
    return (
      <View style={styles.tableRowExtrapolation} fixed>
        <View style={styles.tableColHeaderExtrapolation}>
          <Text style={styles.tableCellHeaderExtrapolation}>Pv/VAM</Text>
        </View>

        {key.map((itemKey) => (
          <View style={styles.tableColHeaderExtrapolation} key={itemKey}>
            <Text style={styles.tableCellHeaderExtrapolation}>{itemKey}</Text>
          </View>
        ))}
      </View>
    );
  };
  const createTableRowExtrapolation = () => {
    return (
      <View style={styles.tableRowExtrapolation}>
        <View style={styles.tableColStyleExtrapolation}>
          <Text style={styles.tableCellExtrapolation}>{`${program.pv}km/h`}</Text>
        </View>
        {getExtrapolationRender(currentExtrapolation).map((item, index) => (
          <View style={styles.tableColStyleExtrapolation} key={index}>
            <Text style={styles.tableCellExtrapolation}>{currentExtrapolation[item]}</Text>
          </View>
        ))}
      </View>
    );
  };
  const trainings = [...program.trainings].sort(sortFunction);
  return (
    <Document>
      <Page size="A4" renderMode="svg">
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Image source="/logo/logo_preta.png" style={{ width: 60, height: 60 }} />
          </View>
          <View style={styles.headerRight}>
            <Text>Joana Foltz Muller</Text>
            <Text>031842-G/SC</Text>
            <Text>(49) 99805-8840</Text>
            <Text>@_joanaf</Text>
          </View>
        </View>

        <View style={styles.ribbon} fixed>
          <Text style={styles.ribbonLabel}>{program.customer.name}</Text>
        </View>
        {(!program.type || program.type === 1) && (
          <View style={styles.ml5}>
            <Text style={styles.body1}>Idade: {getAge(program.customer.birthDate)}</Text>
            <Text style={styles.body1}>FC máx estimada (200-idade) : {program.fcmValue}</Text>
            <Text style={styles.body1}>Pace: {program.pace}</Text>
            <Text style={styles.body1}>Vla: {program.vla}</Text>
            <Text style={styles.body1}>Pace - Vla: {program.paceVla}</Text>
            <Text style={styles.body1}>Vlan: {program.vlan}</Text>
            <Text style={styles.body1}>Pace - Vlan: {program.paceVlan}</Text>
          </View>
        )}

        {program.warningPdf && (
          <View style={styles.alertMessage}>
            <Text style={styles.alertMessagLabel}>{program.warningPdf}</Text>
          </View>
        )}
        {currentExtrapolation && (
          <View style={styles.tableExtrapolation}>
            {createTableHeaderExtrapolation(getExtrapolationRender(currentExtrapolation))}
            {createTableRowExtrapolation()}
          </View>
        )}

        <View style={styles.tableTop}>
          <Text style={styles.tableTopLabel}>Seus treinos</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRowB}>
            <Text style={styles.tableHeadingA}>Data</Text>
            <Text style={styles.tableHeadingC}>Módulo</Text>
            <Text style={styles.tableHeadingB}>Descriçao</Text>
          </View>

          {trainings.length > 0 &&
            trainings.map((item, index) => (
              <View style={isOdd(index) ? styles.tableRowA : styles.tableRowB} key={item.id}>
                <View style={styles.serviceName}>
                  <Text>
                    {item.datePublished ? fDate(item.datePublished, 'dd/MM/yyyy') : 'EXTRA'}
                  </Text>
                  {item.trainingDateOther && (
                    <>
                      <Text> ou </Text>
                      <Text>{fDate(item.trainingDateOther, 'dd/MM/yyyy')}</Text>
                    </>
                  )}
                </View>
                <View style={styles.serviceAmount}>
                  <Text>{getModuleName(item.name)}</Text>
                </View>
                <View style={styles.serviceDescription}>
                  <Text>{item.description}</Text>
                </View>
              </View>
            ))}
        </View>
        <View style={styles.footer}>
          {notificationPdf && <Text>{notificationPdf}</Text>}

          <Text>Dúvidas? &bull; (49)99805-8840</Text>
        </View>
      </Page>
    </Document>
  );
}
