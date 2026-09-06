// Makes a small sample resume PDF for testing the upload/parse path.
// Run from the Webume dir: node design/make-sample-resume.mjs
import React from "react";
import { Document, Page, Text, renderToFile } from "@react-pdf/renderer";

const lines = [
  "Sam Test",
  "Store Manager | Tampa, FL | sam.test@example.com | (813) 555-0100",
  "",
  "SUMMARY",
  "Retail store manager with 9 years of experience running high-volume grocery locations.",
  "",
  "EXPERIENCE",
  "Store Manager, Bayline Market, Tampa, FL, Mar 2018 - Present",
  "- Run daily operations for a 38-person team across two shifts",
  "- Grew annual sales from $3.1M to $4.2M over four years",
  "- Led the 2019 store remodel with zero lost trading days",
  "",
  "Assistant Manager, Bayline Market, Tampa, FL, Jun 2015 - Feb 2018",
  "- Managed scheduling, inventory, and customer service for the front end",
  "- Trained 12 new hires on POS and safety procedures",
  "",
  "SKILLS",
  "Team leadership, P&L management, inventory control, scheduling, customer service, ServSafe",
  "",
  "EDUCATION",
  "Associate of Arts, Hillsborough Community College, 2014",
  "",
  "CERTIFICATIONS",
  "ServSafe Food Protection Manager, 2021",
];

const doc = React.createElement(
  Document,
  null,
  React.createElement(
    Page,
    { size: "LETTER", style: { padding: 48, fontSize: 11, fontFamily: "Helvetica" } },
    ...lines.map((l, i) => React.createElement(Text, { key: i, style: { marginBottom: 3 } }, l || " ")),
  ),
);

await renderToFile(doc, "design/sample-resume.pdf");
console.log("wrote design/sample-resume.pdf");
