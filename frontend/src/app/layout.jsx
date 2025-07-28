"use client";

import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo';
import Navbar from "../components/layouts/Navbar";
import "./globals.css";

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          {/* Layout UI */}
          <Navbar />
          <main>{children}</main>
        </ApolloProvider>
      </body>
    </html>
  )
}