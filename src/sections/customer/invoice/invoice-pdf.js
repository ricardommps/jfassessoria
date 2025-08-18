import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
// utils
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

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
        mr8: { marginRight: 8 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        email: { fontSize: 9, textTransform: 'lowercase' },
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
          width: '5%',
        },
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '15%',
        },
      }),
    [],
  );

function getStatus(status) {
  switch (status) {
    case 'paid':
      return 'Pago';
    case 'pending':
      return 'Pendente';
    case 'overdue':
      return 'Atrasado';
    case 'draft':
      return 'Rascunho';
    default:
      '-';
  }
}

export default function InvoicePDF({ invoice, customer }) {
  const { invoiceNumber, createdAt, dueDate, description, totalAmount, status } = invoice;

  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source="/logo/logo.png" style={{ width: 80, height: 80 }} />

          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>{getStatus(status)}</Text>
            <Text> {invoiceNumber} </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>De</Text>
            <Text style={styles.body2}>Joana Foltz Müller</Text>
            <Text style={styles.body2}>(48)99805-8840</Text>
            <Text style={styles.email}>j.oomuller@hotmail.com</Text>
          </View>

          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Para</Text>
            <Text style={styles.body2}>{customer.name}</Text>
            <Text style={styles.email}>{customer.email || '-'}</Text>
            <Text style={styles.body2}>{customer.phone || '-'}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Date da fatura</Text>
            <Text style={styles.body2}>{fDate(createdAt)}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Data de vencimento</Text>
            <Text style={styles.body2}>{fDate(dueDate)}</Text>
          </View>
        </View>

        <Text style={[styles.subtitle1, styles.mb8]}>Detalhes da fatura</Text>

        <View style={styles.table}>
          <View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Descrição</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Quant.</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Preço unitário</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}>Total</Text>
              </View>
            </View>
          </View>

          <View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text>1</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>{description}</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text>1</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text>{totalAmount}</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{totalAmount}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text></Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text></Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text></Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text></Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text></Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text></Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text></Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text></Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h4}>Total</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h4}>{totalAmount}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]} fixed>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}></Text>
            <Text></Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Dúvidas?</Text>
            <Text>(48)99805-8840</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

InvoicePDF.propTypes = {
  currentStatus: PropTypes.string,
  invoice: PropTypes.object,
};
