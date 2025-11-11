//src/app/layout.js
import { Host_Grotesk } from "next/font/google"; // Import Host Grotesk
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Initialize the font
const hostGrotesk = Host_Grotesk({
  weight: "500",           // Set the desired weight
  subsets: ["latin"],      // Required subsets
  variable: "--font-host", // CSS variable for global use
});

export const metadata = {
  title: "BookMark Dashboard",
  description: "Dashboard built with Next.js and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${hostGrotesk.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {children}
        <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#111010',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '16px',
                },
                success: {
                  iconTheme: {
                    primary: '#EEFF00',
                    secondary: '#111010',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff3333',
                    secondary: '#111010',
                  },
                },
              }}
            />
      </body>
    </html>
  );
}
