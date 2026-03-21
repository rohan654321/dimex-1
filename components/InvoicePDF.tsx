// components/InvoicePDF.tsx
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register font
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  invoiceTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: 1,
    borderBottomColor: '#ddd',
  },
  infoColumn: {
    flex: 1,
  },
  billTo: {
    marginBottom: 20,
  },
  billToTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 8,
  },
  colDescription: { flex: 4 },
  colQuantity: { flex: 1, textAlign: 'center' },
  colUnitPrice: { flex: 2, textAlign: 'right' },
  colTotal: { flex: 2, textAlign: 'right' },
  totalSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  totalValue: {
    width: 120,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  // Fixed status badge styles - removed 'display' property
  statusBadge: {
    padding: '3px 8px',
    borderRadius: 12,
    fontSize: 8,
    fontWeight: 'bold',
  },
  statusPaid: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusOverdue: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  // Additional styles for better layout
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  paymentDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d4edda',
    borderRadius: 5,
  },
  paymentTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

interface InvoicePDFProps {
  invoice: any;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusStyle = () => {
    switch (invoice.status) {
      case 'paid': return styles.statusPaid;
      case 'pending': return styles.statusPending;
      case 'overdue': return styles.statusOverdue;
      default: return {};
    }
  };

  // Calculate GST (assuming 18% of the amount)
  const calculateGST = (amount: number) => {
    // You might want to adjust this logic based on your actual GST calculation
    // For example, if the amount is inclusive of GST, you'd calculate differently
    return amount * 0.18;
  };

  // Calculate subtotal (amount minus GST)
  const calculateSubtotal = (amount: number) => {
    return amount - calculateGST(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>Maxx Business Media Pvt. Ltd.</Text>
          <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
        </View>

        {/* Invoice Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <Text>Invoice No: {invoice.invoiceNumber}</Text>
            <Text>Date: {format(new Date(invoice.issueDate), 'dd MMM yyyy')}</Text>
            <Text>Due Date: {format(new Date(invoice.dueDate), 'dd MMM yyyy')}</Text>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.statusContainer}>
              <Text>Status: </Text>
              <Text style={[styles.statusBadge, getStatusStyle()]}>
                {invoice.status.toUpperCase()}
              </Text>
            </View>
            <Text>Amount: {formatCurrency(invoice.amount)}</Text>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.billTo}>
          <Text style={styles.billToTitle}>Bill To:</Text>
          <Text>{invoice.exhibitorInfo.companyName}</Text>
          {invoice.exhibitorInfo.name && <Text>{invoice.exhibitorInfo.name}</Text>}
          {invoice.exhibitorInfo.address && <Text>{invoice.exhibitorInfo.address}</Text>}
          {invoice.exhibitorInfo.gstNumber && <Text>GST: {invoice.exhibitorInfo.gstNumber}</Text>}
          <Text>Email: {invoice.exhibitorInfo.email}</Text>
          {invoice.exhibitorInfo.phone && <Text>Phone: {invoice.exhibitorInfo.phone}</Text>}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>Description</Text>
            <Text style={styles.colQuantity}>Qty</Text>
            <Text style={styles.colUnitPrice}>Unit Price</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          
          {invoice.items && invoice.items.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQuantity}>{item.quantity}</Text>
              <Text style={styles.colUnitPrice}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.colTotal}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(calculateSubtotal(invoice.amount))}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>GST (18%):</Text>
            <Text style={styles.totalValue}>{formatCurrency(calculateGST(invoice.amount))}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontSize: 12, fontWeight: 'bold' }]}>Total:</Text>
            <Text style={[styles.totalValue, { fontSize: 12, fontWeight: 'bold' }]}>
              {formatCurrency(invoice.amount)}
            </Text>
          </View>
        </View>

        {/* Payment Details */}
        {invoice.paymentDetails && (
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentTitle}>Payment Details</Text>
            <Text>Transaction ID: {invoice.paymentDetails.transactionId}</Text>
            <Text>Payment Mode: {invoice.paymentDetails.paymentMode}</Text>
            <Text>Payment Date: {format(new Date(invoice.paymentDetails.paymentDate), 'dd MMM yyyy HH:mm')}</Text>
          </View>
        )}

        {/* Notes */}
        {invoice.notes && (
          <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f8f9fa', borderRadius: 5 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Notes:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is a computer-generated invoice. No signature required.</Text>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;