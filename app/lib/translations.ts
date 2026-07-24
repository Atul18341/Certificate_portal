export interface TranslationText {
  attestation: string;
  heading: string;
  subheading: string;
  body: string;
}

export const CERT_TEXTS: Record<'en' | 'hi' | 'es' | 'fr' | 'de' | 'ta' | 'te', TranslationText> = {
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
  es: {attestation: "ATESTACIÓN OFICIAL DE LOGRO",
    heading: "Certificado de Finalización",
    subheading: "Este credencial se presenta con orgullo a",
    body: "por demostrar excelencia académica y dominio exitoso de competencias en"
  },
  fr: {
    attestation: "ATTESTATION OFFICIELLE DE RÉUSSITE",
    heading: "Certificat de Réussite",
    subheading: "Ce certificat est décerné avec fierté à",
    body: "pour avoir fait preuve d'excellence académique et de maîtrise des compétences en"
  },
  de: {
    attestation: "OFFIZIELLE LEISTUNGSBESTÄTIGUNG",
    heading: "Abschlusszertifikat",
    subheading: "Diese Urkunde wird stolz verliehen an",
    body: "für hervorragende akademische Leistungen und den erfolgreichen Abschluss von"
  },
  ta: {
    attestation: "அதிகாரப்பூர்வ சாதனைச் சான்றிதழ்",
    heading: "நிறைவுச் சான்றிதழ்",
    subheading: "இச்சான்றிதழ் பெருமையுடன் வழங்கப்படுகிறது",
    body: "கீழ்க்கண்ட பாடப்பிரிவில் சிறப்பான திறமையை வெளிப்படுத்தியமைக்காக"
  },
  te: {
    attestation: "అధికారిక సాధన ధృవీకరణ పత్రం",
    heading: "పూర్తయిన ధృవీకరణ పత్రం",
    subheading: "ఈ ధృవీకరణ పత్రాన్ని గర్వంగా అందజేస్తున్నాము",
    body: "కింది కోర్సులో అత్యుత్తమ ప్రతిభ కనబరిచి విజయవంతంగా పూర్తి చేసినందుకు"
  }
};