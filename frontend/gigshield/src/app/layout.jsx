import "./globals.css";

export const metadata = {
  title: "GigShield AI",
  description: "Gig income protection platform for delivery workers"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}