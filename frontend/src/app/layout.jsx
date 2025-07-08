import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/layouts/Navbar";
import "./globals.css";

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}