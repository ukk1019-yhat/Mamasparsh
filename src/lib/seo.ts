export const SITE = {
  name: "Mama Sparsh School",
  shortName: "MamaSparsh",
  domain: "https://mamasparshschool.in",
  tagline: "A Mother's Touch for Every Little Dream",
  email: "umakrishnakanthchokkapu15@gmail.com",
  phone: "+91-1234567890",
  address: {
    street: "MamaSparsh Preschool & Early Learning Centre",
    locality: "Kakinada",
    region: "Andhra Pradesh",
    country: "IN",
  },
  twitter: "@MamaSparsh",
} as const;

export const OG_IMAGE = `${SITE.domain}/og-image.png`;

export const ROUTES = [
  { path: "/", title: "MamaSparsh Preschool — A Mother's Touch for Every Little Dream", desc: "Step into the MamaSparsh Panda World — a premium, nurturing preschool where children read, write, paint, dance, explore and grow through nature-inspired, child-centric learning in Kakinada." },
  { path: "/programs", title: "Programs — MamaSparsh Preschool", desc: "Explore MamaSparsh's Early Years programs (ages 2-5) in Kakinada. Reggio Emilia inspired curriculum with a focus on holistic development, creative exploration, and school readiness." },
  { path: "/curriculum", title: "Curriculum — MamaSparsh Preschool", desc: "Discover MamaSparsh's Waldorf-inspired curriculum in Kakinada — 3F Nutrition, Banana Leaf Dining, Life Skills, and holistic early learning that nurtures Head, Heart & Hands." },
  { path: "/gallery", title: "Photo Gallery — MamaSparsh Preschool", desc: "Browse photos from MamaSparsh Preschool in Kakinada — precious moments of play, learning, creative exploration, and growth captured every day." },
  { path: "/adventures", title: "Adventures — MamaSparsh Preschool", desc: "Watch video reels from MamaSparsh Preschool in Kakinada — a day in the life of our little pandas, filled with learning, play, and discovery." },
] as const;

export function canonical(path: string) {
  return `${SITE.domain}${path}`;
}

function orgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization", "Preschool"],
    name: SITE.name,
    alternateName: SITE.shortName,
    description: SITE.tagline,
    url: SITE.domain,
    logo: `${SITE.domain}/favicon.png`,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    sameAs: [`https://twitter.com/${SITE.twitter.replace("@", "")}`],
  };
}

function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.domain,
    description: SITE.tagline,
  };
}

function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    url: SITE.domain,
    telephone: SITE.phone,
    email: SITE.email,
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
  };
}

function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
