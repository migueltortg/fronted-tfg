import { Inter } from "next/font/google";
import "../assets/css/style.css";
import Providers from "./components/Providers";
import Nav from "./components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Las Fuentezuelas Erasmus",
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
      </head>
      <body className={inter.className}>
        <Providers children={children}></Providers>
      </body>
    </html>
  );
}
