import type { Metadata } from "next";
import { Lora, Raleway } from "next/font/google";
import AuraCursor from "@/components/AuraCursor";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Amatista Beauty & Spa | Belleza que Transmuta | Playa del Carmen",
    template: "%s | Amatista Beauty & Spa",
  },
  description:
    "Spa y salón de belleza en Playa del Carmen. Masajes, faciales, uñas, pestañas, depilación y más. Belleza que transmuta tu ser. Reserva tu cita hoy.",
  keywords: [
    "spa playa del carmen",
    "salon de belleza playa del carmen",
    "masajes playa del carmen",
    "facial playa del carmen",
    "uñas gel playa del carmen",
    "pestañas playa del carmen",
    "amatista spa",
    "beauty salon playa del carmen",
    "massage playa del carmen",
  ],
  authors: [{ name: "Amatista Beauty & Spa" }],
  creator: "Amatista Beauty & Spa",
  metadataBase: new URL("https://amatistabeautyandspa.com"),
  openGraph: {
    type: "website",
    locale: "es_MX",
    alternateLocale: "en_US",
    siteName: "Amatista Beauty & Spa",
    title: "Amatista Beauty & Spa | Belleza que Transmuta",
    description:
      "Tu santuario de belleza y bienestar en Playa del Carmen. Spa, masajes, faciales, uñas, pestañas y más.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Amatista Beauty & Spa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amatista Beauty & Spa | Belleza que Transmuta",
    description: "Tu santuario de belleza y bienestar en Playa del Carmen.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://amatistabeautyandspa.com",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${lora.variable} ${raleway.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              name: "Amatista Beauty & Spa",
              description:
                "Spa y salón de belleza en Playa del Carmen. Masajes, faciales, uñas, pestañas, depilación y tratamientos corporales.",
              url: "https://amatistabeautyandspa.com",
              telephone: "+529844632344",
              image: "https://amatistabeautyandspa.com/og-image.jpg",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Entre calles 26 y 28 Nte, Col. Gonzalo Guerrero",
                addressLocality: "Playa del Carmen",
                addressRegion: "Quintana Roo",
                postalCode: "77710",
                addressCountry: "MX",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 20.6318,
                longitude: -87.0686,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "09:00",
                  closes: "19:00",
                },
              ],
              priceRange: "$$",
              sameAs: [
                "https://www.instagram.com/amatistabeautyandspa",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicios de Belleza y Spa",
                itemListElement: [
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Masajes Relajantes" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tratamientos Faciales" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Manicure y Pedicure" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Extensiones de Pestañas" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Depilación" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maquillaje Profesional" } },
                ],
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuraCursor size={200} coreSize={80} blur={60} coreBlur={30} opacity={0.08} coreOpacity={0.12} zIndex={1} />
        {children}
      </body>
    </html>
  );
}
