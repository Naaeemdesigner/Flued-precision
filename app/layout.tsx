import type { Metadata, Viewport } from "next";
import { Inter, Syncopate } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-syncopate",
  display: "swap",
  preload: true,
});

const SITE = {
  name: "Fluid Precision",
  legalName: "Fluid Precision LLC",
  url: "https://fluidprecision.com",
  description:
    "Concours-grade mobile automotive detailing. Ceramic coatings, paint correction, and interior restoration delivered to your driveway by IDA-certified specialists.",
  ogImage: "/og.jpg",
  phone: "+1-305-000-0000",
  email: "precision@fluid.com",
  address: {
    street: "1200 Brickell Bay Dr",
    city: "Miami",
    region: "FL",
    postal: "33131",
    country: "US",
  },
  geo: { lat: 25.7617, lng: -80.1918 },
  serviceRadiusMiles: 20,
  founded: "2014",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · Surgical Mobile Detailing`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  generator: "Next.js",
  keywords: [
    "mobile detailing Miami",
    "ceramic coating",
    "paint correction",
    "luxury car detailing",
    "exotic car detailing",
    "Brickell auto detailing",
    "concours detailing",
    "Fluid Precision",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { email: false, address: false, telephone: false },
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} · Surgical Mobile Detailing`,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — concours-grade mobile detailing`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} · Surgical Mobile Detailing`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  alternates: { canonical: SITE.url },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
};

const FAQS = [
  {
    q: "Do I need to provide water or electricity?",
    a: "No. Our mobile units are fully self-sustained with professional-grade deionized water tanks and silent power generators.",
  },
  {
    q: "What is your policy for rainy weather?",
    a: "If rain is forecasted, we contact you 24 hours in advance to reschedule your session at no extra cost.",
  },
  {
    q: "How long does a typical session take?",
    a: "Depending on package and vehicle size, a session typically lasts 2 to 6 hours.",
  },
  {
    q: "Are you insured to work on luxury and exotic vehicles?",
    a: "Yes. Fully insured and specialized in handling high-value assets with surgical care.",
  },
  {
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes — up to 48 hours before your appointment via your confirmation email at no penalty.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["AutoDetailing", "LocalBusiness"],
      "@id": `${SITE.url}/#business`,
      name: SITE.name,
      legalName: SITE.legalName,
      url: SITE.url,
      image: `${SITE.url}${SITE.ogImage}`,
      logo: `${SITE.url}/logo.svg`,
      telephone: SITE.phone,
      email: SITE.email,
      priceRange: "$$$",
      foundingDate: SITE.founded,
      slogan: "Engineering Brilliance. Surgical Precision.",
      description: SITE.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.region,
        postalCode: SITE.address.postal,
        addressCountry: SITE.address.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: SITE.geo.lat,
        longitude: SITE.geo.lng,
      },
      areaServed: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: SITE.geo.lat,
          longitude: SITE.geo.lng,
        },
        geoRadius: `${Math.round(SITE.serviceRadiusMiles * 1609.34)}`,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "08:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "00:00",
          closes: "00:00",
          description: "By appointment only",
        },
      ],
      paymentAccepted: ["Cash", "Credit Card", "Apple Pay", "Bank Transfer"],
      currenciesAccepted: "USD",
      sameAs: [
        "https://www.instagram.com/fluidprecision",
        "https://www.facebook.com/fluidprecision",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Detailing Packages",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Silver — Essential Refresh",
            price: "149",
            priceCurrency: "USD",
            description: "pH-neutral hand wash, wheels & tires, interior vacuum, glass, spray wax.",
            itemOffered: { "@type": "Service", name: "Silver Detailing Package" },
          },
          {
            "@type": "Offer",
            name: "Gold — Signature Detail",
            price: "299",
            priceCurrency: "USD",
            description: "Clay bar, 6-month ceramic sealant, steam clean, leather conditioning.",
            itemOffered: { "@type": "Service", name: "Gold Detailing Package" },
          },
          {
            "@type": "Offer",
            name: "Platinum — Ultimate Protection",
            price: "599",
            priceCurrency: "USD",
            description: "Paint enhancement, ceramic coating, deep carpet shampoo, engine bay detail.",
            itemOffered: { "@type": "Service", name: "Platinum Detailing Package" },
          },
        ],
      },
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ceramic Coating" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Paint Correction" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interior Restoration" } },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "412",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      publisher: { "@id": `${SITE.url}/#business` },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE.url}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#org`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/logo.svg`,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: SITE.phone,
          email: SITE.email,
          contactType: "customer service",
          areaServed: "US",
          availableLanguage: ["en"],
        },
        {
          "@type": "ContactPoint",
          telephone: SITE.phone,
          contactType: "reservations",
          areaServed: "US",
          availableLanguage: ["en"],
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE.url}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Booking", item: `${SITE.url}/book` },
        { "@type": "ListItem", position: 3, name: "Services", item: `${SITE.url}/services` },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syncopate.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* LCP — Hero poster preloaded as critical image */}
        <link
          rel="preload"
          as="image"
          href="/media/hero/carhero.png"
          fetchPriority="high"
        />
        {/* Hero video — start fetching alongside HTML so first frame paints instantly */}
        <link
          rel="preload"
          as="video"
          href="/media/hero/herovideo.webm"
          type="video/webm"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-2xl focus:bg-red focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <div className="site-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
