export const SITE = {
  name: "Mama Sparsh School",
  shortName: "MamaSparsh",
  domain: "https://www.mamasparshschool.in",
  tagline: "A Mother's Touch for Every Little Dream",
  email: "umakrishnakanthchokkapu15@gmail.com",
  phone: "+91-1234567890",
  address: {
    street: "MamaSparsh Preschool & Early Learning Centre",
    locality: "Kakinada",
    region: "Andhra Pradesh",
    country: "IN",
  },
  social: {
    twitter: "https://x.com/MamaSparsh",
    instagram: "https://instagram.com/mamasparsh",
    facebook: "https://facebook.com/mamasparsh",
    youtube: "https://youtube.com/@mamasparsh",
  },
  foundingDate: "2018",
  areaServed: ["Kakinada", "Andhra Pradesh", "India"],
  knowsLanguage: ["Telugu", "English", "Hindi"],
} as const;

export const OG_IMAGE = `${SITE.domain}/og-image.png`;

export const OG_IMAGE_ALT = "MamaSparsh Preschool — A Mother's Touch for Every Little Dream";

export const ROUTES = [
  { path: "/", title: "MamaSparsh Preschool — A Mother's Touch for Every Little Dream", desc: "Step into the MamaSparsh Panda World — a premium, nurturing preschool where children read, write, paint, dance, explore and grow through nature-inspired, child-centric learning in Kakinada.", keywords: "MamaSparsh, preschool, Kakinada, early childhood education, daycare, nursery, kindergarten, Waldorf, Reggio Emilia, best preschool in Kakinada" },
  { path: "/programs", title: "Programs — MamaSparsh Preschool", desc: "Explore MamaSparsh's Early Years programs (ages 2-5) in Kakinada. Reggio Emilia inspired curriculum with a focus on holistic development, creative exploration, and school readiness.", keywords: "MamaSparsh programs, preschool programs Kakinada, Early Years, Reggio Emilia, nursery, kindergarten, daycare Kakinada" },
  { path: "/curriculum", title: "Curriculum — MamaSparsh Preschool", desc: "Discover MamaSparsh's Waldorf-inspired curriculum in Kakinada — 3F Nutrition, Banana Leaf Dining, Life Skills, and holistic early learning that nurtures Head, Heart & Hands.", keywords: "MamaSparsh curriculum, Waldorf-inspired preschool, 3F nutrition, banana leaf dining, life skills, holistic education Kakinada" },
  { path: "/gallery", title: "Photo Gallery — MamaSparsh Preschool", desc: "Browse photos from MamaSparsh Preschool in Kakinada — precious moments of play, learning, creative exploration, and growth captured every day.", keywords: "MamaSparsh gallery, preschool photos Kakinada, daycare pictures, early learning moments" },
  { path: "/adventures", title: "Adventures — MamaSparsh Preschool", desc: "Watch video reels from MamaSparsh Preschool in Kakinada — a day in the life of our little pandas, filled with learning, play, and discovery.", keywords: "MamaSparsh adventures, preschool videos Kakinada, daycare activities, early learning reels" },
] as const;

export function canonical(path: string) {
  return `${SITE.domain}${path}`;
}

function orgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization", "School", "Preschool"],
    "@id": `${SITE.domain}#organization`,
    name: SITE.name,
    alternateName: SITE.shortName,
    description: SITE.tagline,
    url: SITE.domain,
    logo: `${SITE.domain}/favicon.png`,
    email: SITE.email,
    telephone: SITE.phone,
    foundingDate: SITE.foundingDate,
    areaServed: SITE.areaServed.map((a) => a),
    knowsLanguage: SITE.knowsLanguage,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    sameAs: Object.values(SITE.social),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Early Years Programs",
      description: "Age-appropriate early childhood programs for children ages 2 to 5.",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "EducationalOccupationalProgram", name: "Early Years 1", educationalCredentialAwarded: "Play Group" } },
        { "@type": "Offer", itemOffered: { "@type": "EducationalOccupationalProgram", name: "Early Years 2", educationalCredentialAwarded: "Nursery" } },
        { "@type": "Offer", itemOffered: { "@type": "EducationalOccupationalProgram", name: "Early Years 3", educationalCredentialAwarded: "Lower Kindergarten" } },
        { "@type": "Offer", itemOffered: { "@type": "EducationalOccupationalProgram", name: "Early Years 4", educationalCredentialAwarded: "Upper Kindergarten" } },
      ],
    },
  };
}

function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.domain}#website`,
    name: SITE.name,
    url: SITE.domain,
    description: SITE.tagline,
    publisher: { "@id": `${SITE.domain}#organization` },
    inLanguage: SITE.knowsLanguage,
  };
}

function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.domain}#localbusiness`,
    name: SITE.name,
    url: SITE.domain,
    telephone: SITE.phone,
    email: SITE.email,
    foundingDate: SITE.foundingDate,
    areaServed: SITE.areaServed.map((a) => a),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "15:00",
      },
    ],
    sameAs: Object.values(SITE.social),
    parentOrganization: { "@id": `${SITE.domain}#organization` },
  };
}

function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE.domain}${items[items.length - 1]?.path}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.domain}${item.path}`,
    })),
  };
}

export function jsonLdScripts(path: string) {
  const schemas = [orgSchema(), webSiteSchema(), localBusinessSchema()];
  if (path !== "/") {
    const route = ROUTES.find((r) => r.path === path);
    schemas.push(
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: route?.title.replace(" — MamaSparsh Preschool", "") ?? "", path },
      ]),
    );
  }
  return schemas.map((schema) => JSON.stringify(schema));
}
