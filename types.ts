
export interface PageContent {
  id: string;
  type: string;
  title: string;
  h1: string;
  content?: string;
  overview?: string;
  whenNeeded?: string;
  useCase?: string;
  process?: string;
  materials?: string;
  examples?: string;
  localExpertise?: string;
  pricingFactors?: string;
  benefits?: string[];
  faq?: { q: string; a: string }[];
  cta?: string;
  metaTitle?: string;
  metaDescription?: string;
  mapEmbed?: string;
  localizedIntro?: string;
  serviceExplanation?: string;
  trustSection?: string;
}

export interface Service {
  id: string;
  name: string;
  summary: string;
  icon: string;
  category: 'residential' | 'commercial';
}

export interface Location {
  id: string;
  city: string;
  state: string;
  slug: string;
  lat: number;
  lng: number;
}
