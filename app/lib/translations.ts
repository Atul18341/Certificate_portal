export interface TranslationText {
  attestation: string;
  heading: string;
  subheading: string;
  body: string;
}

export const CERT_TEXTS: Record<'en' | 'hi', TranslationText> = {
  en: {
    attestation: "Official Attestation",
    heading: "Certificate of Achievement",
    subheading: "This is to certify that",
    body: "has successfully fulfilled all academic requirements and training parameters prescribed for the graduation course of study in",
  },
  hi: {
    attestation: "आधिकारिक सत्यापन",
    heading: "प्रमाण पत्र",
    subheading: "प्रमाणित किया जाता है कि",
    body: "ने सफलतापूर्वक पाठ्यक्रम की सभी शैक्षणिक आवश्यकताओं और प्रशिक्षण मापदंडों को पूरा किया है:",
  },
};