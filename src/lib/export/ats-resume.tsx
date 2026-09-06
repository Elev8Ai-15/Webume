import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { ProfileData } from "@/lib/types/profile";

// ATS rules: one column, Helvetica, plain section headings, no graphics.
const s = StyleSheet.create({
  page: { paddingTop: 44, paddingBottom: 44, paddingHorizontal: 52, fontFamily: "Helvetica", fontSize: 10.5, lineHeight: 1.35, color: "#111" },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 11.5, marginTop: 2 },
  contact: { fontSize: 9.5, marginTop: 4, color: "#333" },
  h2: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 14, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6, borderBottomWidth: 0.8, borderBottomColor: "#111", paddingBottom: 2 },
  role: { fontFamily: "Helvetica-Bold", marginTop: 6 },
  meta: { color: "#333" },
  bullet: { flexDirection: "row", marginTop: 1.5 },
  dot: { width: 10 },
  text: { flex: 1 },
});

function Bullet({ children }: { children: string }) {
  return (
    <View style={s.bullet}>
      <Text style={s.dot}>\u2022</Text>
      <Text style={s.text}>{children}</Text>
    </View>
  );
}

export function AtsResume({ data }: { data: ProfileData }) {
  const b = data.basics;
  const contact = [b.location, b.phone, b.email, b.linkedin, b.website].filter(Boolean).join("  |  ");
  return (
    <Document title={`${b.name} resume`} author={b.name}>
      <Page size="LETTER" style={s.page}>
        <Text style={s.name}>{b.name}</Text>
        {b.title ? <Text style={s.title}>{b.title}</Text> : null}
        {contact ? <Text style={s.contact}>{contact}</Text> : null}

        {b.summary ? (
          <>
            <Text style={s.h2}>Summary</Text>
            <Text>{b.summary}</Text>
          </>
        ) : null}

        {data.experience.length > 0 ? (
          <>
            <Text style={s.h2}>Experience</Text>
            {data.experience.map((e, i) => (
              <View key={i} wrap={false}>
                <Text style={s.role}>{e.role}</Text>
                <Text style={s.meta}>
                  {[e.company, e.companyInfo?.location].filter(Boolean).join(", ")}  |  {e.startDate} \u2013 {e.endDate}
                </Text>
                {e.description ? <Text>{e.description}</Text> : null}
                {e.responsibilities.map((r, j) => (
                  <Bullet key={j}>{r}</Bullet>
                ))}
                {e.metrics.map((m, j) => (
                  <Bullet key={`m${j}`}>{`${m.label}: ${m.value}`}</Bullet>
                ))}
              </View>
            ))}
          </>
        ) : null}

        {data.skills.length > 0 ? (
          <>
            <Text style={s.h2}>Skills</Text>
            <Text>{data.skills.join(", ")}</Text>
          </>
        ) : null}

        {data.education.length > 0 ? (
          <>
            <Text style={s.h2}>Education</Text>
            {data.education.map((ed, i) => (
              <View key={i}>
                <Text style={s.role}>{ed.degree}</Text>
                <Text style={s.meta}>{[ed.school, ed.year].filter(Boolean).join("  |  ")}</Text>
                {ed.details ? <Text>{ed.details}</Text> : null}
              </View>
            ))}
          </>
        ) : null}

        {data.certifications.length > 0 ? (
          <>
            <Text style={s.h2}>Certifications</Text>
            {data.certifications.map((c, i) => (
              <Bullet key={i}>{c}</Bullet>
            ))}
          </>
        ) : null}

        {data.achievements.length > 0 ? (
          <>
            <Text style={s.h2}>Achievements</Text>
            {data.achievements.map((a, i) => (
              <Bullet key={i}>{[a.title, a.description].filter(Boolean).join(": ")}</Bullet>
            ))}
          </>
        ) : null}
      </Page>
    </Document>
  );
}

export async function renderAtsResume(data: ProfileData): Promise<Buffer> {
  return renderToBuffer(<AtsResume data={data} />);
}
