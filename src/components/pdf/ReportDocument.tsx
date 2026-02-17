'use client'

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

// Styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  logo: {
    width: 120,
    height: 30,
  },
  headerRight: {
    textAlign: 'right',
  },
  date: {
    fontSize: 9,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultBox: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  primaryResult: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
  },
  primaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  table: {
    width: '100%',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
  },
  tableCellRight: {
    flex: 1,
    paddingHorizontal: 8,
    textAlign: 'right',
  },
  methodologyText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
    marginBottom: 10,
  },
  formula: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 4,
    marginVertical: 10,
    fontFamily: 'Courier',
    fontSize: 10,
  },
  source: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  disclaimer: {
    fontSize: 8,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
  },
})

export interface ReportData {
  calculatorName: string
  calculatorType: string
  category: string
  result: {
    primary: { value: string | number; label: string; unit?: string }
    secondary?: { label: string; value: string | number; unit?: string }[]
    breakdown?: { label: string; value: string | number }[]
    advice?: string
  }
  inputs: { label: string; value: string | number }[]
  methodology?: {
    title: string
    overview: string
    methodName: string
    formula?: { name: string; expression: string }
    sources: { name: string; year?: number }[]
  }
  aiExplanation?: string
  generatedAt: string
}

interface ReportDocumentProps {
  data: ReportData
}

export default function ReportDocument({ data }: ReportDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#6366f1' }}>
              CalcMaster
            </Text>
            <Text style={{ fontSize: 9, color: '#666' }}>Professional Calculator Suite</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.date}>Generated: {data.generatedAt}</Text>
            <Text style={{ fontSize: 9, color: '#666' }}>{data.category} / {data.calculatorType}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{data.calculatorName} Report</Text>

        {/* Primary Result */}
        <View style={styles.resultBox}>
          <Text style={styles.primaryResult}>
            {data.result.primary.value}
            {data.result.primary.unit && ` ${data.result.primary.unit}`}
          </Text>
          <Text style={styles.primaryLabel}>{data.result.primary.label}</Text>
        </View>

        {/* Input Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input Values</Text>
          <View style={styles.table}>
            {data.inputs.map((input, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{input.label}</Text>
                <Text style={styles.tableCellRight}>{input.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Secondary Results */}
        {data.result.secondary && data.result.secondary.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detailed Results</Text>
            <View style={styles.table}>
              {data.result.secondary.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.label}</Text>
                  <Text style={styles.tableCellRight}>
                    {item.value}{item.unit && ` ${item.unit}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Breakdown */}
        {data.result.breakdown && data.result.breakdown.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Breakdown</Text>
            <View style={styles.table}>
              {data.result.breakdown.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.label}</Text>
                  <Text style={styles.tableCellRight}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Advice */}
        {data.result.advice && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendation</Text>
            <Text style={styles.methodologyText}>{data.result.advice}</Text>
          </View>
        )}

        {/* Methodology */}
        {data.methodology && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Methodology: {data.methodology.methodName}</Text>
            <Text style={styles.methodologyText}>{data.methodology.overview}</Text>

            {data.methodology.formula && (
              <View style={styles.formula}>
                <Text>{data.methodology.formula.name}: {data.methodology.formula.expression}</Text>
              </View>
            )}

            {data.methodology.sources.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>Sources:</Text>
                {data.methodology.sources.map((source, index) => (
                  <Text key={index} style={styles.source}>
                    • {source.name}{source.year && ` (${source.year})`}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* AI Analysis */}
        {data.aiExplanation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Analysis</Text>
            {data.aiExplanation.split('\n').filter(line => line.trim()).map((line, index) => {
              const clean = line.replace(/\*\*/g, '')
              const isHeader = /^\*\*(.+)\*\*$/.test(line.trim())
              return (
                <Text
                  key={index}
                  style={isHeader
                    ? { fontSize: 11, fontWeight: 'bold', color: '#6366f1', marginTop: 8, marginBottom: 4 }
                    : styles.methodologyText
                  }
                >
                  {clean}
                </Text>
              )
            })}
          </View>
        )}

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          This report is for informational purposes only and should not replace professional advice.
          Always consult qualified professionals for important decisions.
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>calcmaster.io</Text>
          <Text style={styles.footerText}>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  )
}
