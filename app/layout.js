import "./globals.css";

export const metadata = {
  title: "SheCare | Women's Healthcare",
  description: "Knowledge, care and support for every woman.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
