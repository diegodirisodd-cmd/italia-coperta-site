// Server-only: renders a branded PDF summary of a configuratore request.
// Imported exclusively from the submit route handler (Node runtime).

import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { RiepilogoSection } from "./riepilogo";

const NAVY = "#0E1633";
const RED = "#E31919";
const INK = "#151A24";
const MUTED = "#5B6472";
const LINE = "#E3E6EC";

const styles = StyleSheet.create({
  page: { paddingTop: 0, paddingBottom: 44, paddingHorizontal: 0, fontSize: 10, color: INK, fontFamily: "Helvetica" },
  header: { backgroundColor: NAVY, paddingVertical: 22, paddingHorizontal: 40 },
  brand: { color: "#FFFFFF", fontSize: 16, fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  brandSub: { color: "#B9C0CE", fontSize: 8, marginTop: 3, letterSpacing: 1 },
  redBar: { height: 4, backgroundColor: RED },
  body: { paddingHorizontal: 40, paddingTop: 24 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  metaLabel: { color: MUTED, fontSize: 8, letterSpacing: 1, textTransform: "uppercase" },
  metaValue: { color: INK, fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 2 },
  h1: { fontSize: 15, fontFamily: "Helvetica-Bold", color: INK, marginBottom: 2 },
  sub: { fontSize: 9, color: MUTED, marginBottom: 16 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: RED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LINE, paddingVertical: 4 },
  rowLabel: { width: "40%", color: MUTED, fontSize: 9 },
  rowValue: { width: "60%", color: INK, fontSize: 9 },
  footer: { position: "absolute", bottom: 20, left: 40, right: 40, fontSize: 7.5, color: MUTED, textAlign: "center", borderTopWidth: 1, borderTopColor: LINE, paddingTop: 8 },
});

function RequestDoc({
  reference,
  createdAt,
  sections,
}: {
  reference: string;
  createdAt: string;
  sections: RiepilogoSection[];
}) {
  return (
    <Document title={`Richiesta ${reference}`} author="Di Riso Teloni — Italia Coperta">
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.brand}>DI RISO TELONI</Text>
          <Text style={styles.brandSub}>ITALIA COPERTA · DAL 1950</Text>
        </View>
        <View style={styles.redBar} fixed />

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaLabel}>Riferimento</Text>
              <Text style={styles.metaValue}>{reference}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Data</Text>
              <Text style={styles.metaValue}>{createdAt}</Text>
            </View>
          </View>

          <Text style={styles.h1}>Richiesta configuratore telone</Text>
          <Text style={styles.sub}>Riepilogo della richiesta inviata dal configuratore online.</Text>

          {sections.map((sec) => (
            <View key={sec.title} style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.rows.map((r, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.rowLabel}>{r.label}</Text>
                  <Text style={styles.rowValue}>{r.value}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.footer} fixed>
          Di Riso Teloni · Italia Coperta — dirisoteloniitalia@dodiitalia.it · Preventivo indicativo, non vincolante.
        </Text>
      </Page>
    </Document>
  );
}

export async function renderRichiestaPdf(args: {
  reference: string;
  createdAt: string;
  sections: RiepilogoSection[];
}): Promise<Buffer> {
  return renderToBuffer(<RequestDoc {...args} />);
}
