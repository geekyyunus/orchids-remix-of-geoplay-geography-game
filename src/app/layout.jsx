"use client";

import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { GameProvider } from "../context/GameContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>GeoPlay - Learn Geography by Playing</title>
        <meta name="description" content="An interactive map-based geography learning game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
