
import { Service, Location } from './types';

export const BUSINESS_DETAILS = {
  name: "EP Concrete",
  phone: "512-998-3199",
  address: "15607 Brenda St, Austin, TX 78728",
  email: "perezconcreteconstruction@gmail.com",
  website: "https://epconcrete.com"
};

export const RESIDENTIAL_SERVICES: Service[] = [
  { id: 'concrete-driveways', name: 'Concrete Driveways', summary: 'Precision-engineered residential driveways built for durability and maximum curb appeal in Austin TX.', icon: 'directions_car', category: 'residential' },
  { id: 'concrete-patios', name: 'Concrete Patios', summary: 'Custom outdoor living foundations and decorative backyard patio designs for Central Texas homes.', icon: 'deck', category: 'residential' },
  { id: 'concrete-sidewalks', name: 'Concrete Sidewalks', summary: 'Safe, level, and code-compliant sidewalks for residential properties and neighborhood HOAs.', icon: 'add_road', category: 'residential' },
  { id: 'concrete-walkways-pathways', name: 'Concrete Walkways & Pathways', summary: 'Elegant concrete pathways designed to connect your outdoor features with permanent, mud-free transit.', icon: 'route', category: 'residential' },
  { id: 'garage-slabs', name: 'Garage Slabs', summary: 'Reinforced concrete slabs engineered specifically for heavy automotive loads and workshop use.', icon: 'garage', category: 'residential' },
  { id: 'concrete-slabs', name: 'Concrete Slabs', summary: 'Structural and utility pads for sheds, home additions, and auxiliary structures.', icon: 'layers', category: 'residential' },
  { id: 'decorative-concrete', name: 'Decorative Concrete', summary: 'Architectural concrete finishes that transform standard slabs into high-end design features.', icon: 'palette', category: 'residential' },
  { id: 'stamped-concrete', name: 'Stamped Concrete', summary: 'Monolithic concrete textured to mimic natural stone, brick, or wood planking.', icon: 'texture', category: 'residential' },
  { id: 'concrete-repair', name: 'Concrete Repair', summary: 'Structural patching, crack sealing, and leveling to restore existing residential concrete surfaces.', icon: 'build', category: 'residential' },
  { id: 'concrete-replacement', name: 'Concrete Replacement', summary: 'Full demolition and modern-standard replacement of failing residential concrete structures.', icon: 'published_with_changes', category: 'residential' },
  { id: 'concrete-resurfacing', name: 'Concrete Resurfacing', summary: 'High-strength overlays that provide a brand-new appearance to structurally sound existing slabs.', icon: 'auto_fix_high', category: 'residential' },
];

export const COMMERCIAL_SERVICES: Service[] = [
  { id: 'parking-lots', name: 'Parking Lots', summary: 'Industrial-grade concrete paving for commercial retail centers and office complexes.', icon: 'local_parking', category: 'commercial' },
  { id: 'concrete-flatwork', name: 'Concrete Flatwork', summary: 'Large-scale precision commercial flooring for warehouses and retail facilities.', icon: 'view_quilt', category: 'commercial' },
  { id: 'concrete-curbing', name: 'Concrete Curbing', summary: 'Professional curbing and gutter systems for site drainage and paving edge protection.', icon: 'width_full', category: 'commercial' },
  { id: 'commercial-slabs', name: 'Commercial Slabs', summary: 'Heavy-duty structural foundation slabs for industrial buildings and mechanical equipment.', icon: 'foundation', category: 'commercial' },
  { id: 'retaining-walls', name: 'Retaining Walls', summary: 'Engineered structural concrete walls for site grading, erosion control, and soil stabilization.', icon: 'wall_art', category: 'commercial' },
  { id: 'concrete-demolition', name: 'Concrete Demolition & Removal', summary: 'Safe, heavy-duty demolition and hauling of unwanted commercial concrete structures.', icon: 'delete_sweep', category: 'commercial' },
];

export const SERVICES = [...RESIDENTIAL_SERVICES, ...COMMERCIAL_SERVICES];

export const LOCATIONS: Location[] = [
  { id: 'austin', city: 'Austin', state: 'TX', slug: 'austin-tx-concrete-contractor', lat: 30.2672, lng: -97.7431 },
  { id: 'round-rock', city: 'Round Rock', state: 'TX', slug: 'round-rock-tx-concrete-contractor', lat: 30.5083, lng: -97.6789 },
  { id: 'cedar-park', city: 'Cedar Park', state: 'TX', slug: 'cedar-park-tx-concrete-contractor', lat: 30.5063, lng: -97.8303 },
  { id: 'georgetown', city: 'Georgetown', state: 'TX', slug: 'georgetown-tx-concrete-contractor', lat: 30.6333, lng: -97.6772 },
  { id: 'florence', city: 'Florence', state: 'TX', slug: 'florence-tx-concrete-contractor', lat: 30.8427, lng: -97.7942 },
  { id: 'belton', city: 'Belton', state: 'TX', slug: 'belton-tx-concrete-contractor', lat: 31.0560, lng: -97.4645 },
];
