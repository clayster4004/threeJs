// Layout Script for React Style Web App
// Created by Clay Beal

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header>
          <h1>Hello Next</h1>
        </header>
        {/* This is where my page.js stuff will go */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}