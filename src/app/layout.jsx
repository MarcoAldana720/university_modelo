import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "PROMESA",
  description: "Centro De Investigaciones Silvio Savala",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
      <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css"
    />
      </head>
      <body className={outfit.className}>
        <Toaster richColors closeButton={true} />
        {children}
      </body>
    </html>
  );
}
