# 🎓 CredVantage Pro - Enterprise Certificate Registry & Generator

An enterprise-grade B2B SaaS platform for bulk certificate generation, blockchain verification logging, and pay-as-you-go credit management. Built with Next.js, Tailwind CSS, html2canvas, and JSZip.

---

## ✨ Key Features

* **Spreadsheet Roster Import:** Upload `.xlsx`, `.xls`, or `.csv` files to parse recipient data instantly.
* **Bulk Export (ZIP) & Single PNG Download:** Highly optimized rendering pipeline with crash-safe canvas capturing.
* **Google Lens Scannable QR Codes:** Dynamic client-side QR generation mapping direct to verification endpoints.
* **Pay-As-You-Go Wallet & Razorpay Integration:** Seamless credit refills and subscription tier management (15-Day Free Trial, Weekly, Monthly Pro, Annual Suite).
* **Enterprise Dashboard:** Real-time statistics tracking total records loaded, minted certificates, and remaining queue items.
* **Modern MNC Dark Theme:** High-contrast executive layout designed for institutional attestation records.

---

## 🚀 Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Spreadsheet Parser:** [SheetJS (xlsx)](https://sheetjs.com/)
* **Canvas Export:** [html2canvas](https://html2canvas.hertzen.com/) & [JSZip](https://stuk.github.io/jszip/)
* **Payments:** [Razorpay Checkout SDK](https://razorpay.com/)

---

## 🛠️ Getting Started

### 1. Prerequisites

Ensure you have **Node.js 18+** and **npm** installed on your system.

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone [https://github.com/your-username/certificate-generator.git](https://github.com/your-username/certificate-generator.git)
cd certificate-generator
npm install