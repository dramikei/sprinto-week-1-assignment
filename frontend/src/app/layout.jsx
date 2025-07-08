import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/layouts/Navbar";
import "./globals.css";

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}