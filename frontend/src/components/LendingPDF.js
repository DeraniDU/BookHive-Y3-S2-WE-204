import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f5f5f5',
    padding: 5
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5
  },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  bodyText: {
    fontSize: 9
  },
  bookCover: {
    width: 40,
    height: 60
  },
  borrowerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  borrowerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5
  }
});

// Create Document Component
const ApprovedBooksReport = ({ books }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Approved Books Report</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Book Cover</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Title & Author</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Borrower Info</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Days Left</Text>
          </View>
        </View>
        
        {/* Table Rows */}
        {books.map((book, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Image 
                src={book.cover} 
                style={styles.bookCover} 
              />
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bodyText}>{book.title}</Text>
              <Text style={[styles.bodyText, { color: '#666' }]}>By {book.author}</Text>
            </View>
            <View style={styles.tableCol}>
              <View style={styles.borrowerInfo}>
                <Image 
                  src={book.borrower.avatar} 
                  style={styles.borrowerAvatar} 
                />
                <Text style={styles.bodyText}>{book.borrower.name}</Text>
              </View>
              <Text style={[styles.bodyText, { fontSize: 8 }]}>{book.borrower.address}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[
                styles.bodyText, 
                { 
                  color: book.daysLeft <= 2 ? 'red' : book.daysLeft <= 5 ? 'orange' : 'green',
                  fontWeight: 'bold'
                }
              ]}>
                {book.daysLeft} day{book.daysLeft !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ApprovedBooksReport;