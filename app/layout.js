import "./globals.css";
import AiTriageRobot from "../components/AiTriageRobot";

export const metadata = {
  title: "Sanketika | Women's Healthcare & Maternal Support",
  description: "Evidence-based knowledge, clinical care and triage support for women across Maharashtra.",
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AiTriageRobot />
      </body>
    </html>
  );
}
