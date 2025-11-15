import "./globals.css";
import AuthProvider from "../context/AuthContext";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Feedback App",
  description: "Feedback System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster position="top-right" />
          <Header />
          <main className="app-container">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
