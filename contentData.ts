
import { BUSINESS_DETAILS } from './constants';

const SERVICE_TEMPLATE = (name: string) => ({
  h1: `${name} in Austin TX`,
  overview: `At EP Concrete, our commitment to excellence is reflected in our professional ${name} services in Austin TX. We specialize in providing structural foundations and aesthetic surface solutions that are engineered to meet the highest industry standards. A ${name} installation is a significant investment in your property’s longevity and functional value. Our team approaches every project with a detailed eye for site preparation, material selection, and precision execution. Whether we are serving residential homeowners looking to enhance curb appeal or commercial property managers requiring heavy-duty industrial paving, we ensure the finished product exceeds expectations for durability and performance. In the competitive Austin market, our ${name} work stands out for its structural integrity and refined finish.`,
  whenNeeded: `Identifying the right time for ${name} services is crucial for preventing more costly property damage down the road. Common signs that a ${name} is needed include extensive "alligator" cracking—deep, interconnected fractures that indicate base failure—and significant soil settlement. In Austin’s expansive clay soil, concrete often shifts or heaves, creating dangerous trip hazards and allowing water to pool near structural foundations. If your existing surface has reached the end of its lifecycle, or if you are beginning a new construction project, professional concrete work is essential to provide a stable, level base. Neglecting these issues can lead to secondary problems like erosion, water infiltration in basements or garages, and a substantial decrease in property value. Early intervention with a new pour or structural repair ensures your property remains safe and visually appealing.`,
  useCase: `The versatility of ${name} allows it to be utilized across a wide spectrum of residential and commercial environments. For residential clients, this service is most commonly seen in driveways, pool decks, and garden walkways, where it creates a durable, low-maintenance path for foot traffic and vehicles. Commercially, ${name} is a requirement for high-traffic zones such as warehouse flooring, loading docks, and expansive parking facilities. Because concrete is naturally resistant to the high compressive loads of heavy equipment and modern vehicles, it is the premier choice for any site that demands long-term reliability. EP Concrete tailors the reinforcement and mix design specifically for each use case, ensuring the slab is built exactly to handle the intended traffic volume and weight.`,
  process: `Our EP Concrete step-by-step process for ${name} is designed to be thorough and results-oriented. First, we perform an intensive site evaluation to locate utilities and determine optimal grading for water management. Second, we handle the demolition and hauling of any existing failing materials. Third, we focus on subgrade preparation; we use mechanical compaction and add stable road-base material to counteract Austin’s shifting soil. Fourth, we set precise formwork to ensure the finished slab follows your custom layout and facilitates proper drainage. Fifth, we install a high-strength rebar grid on chairs to provide internal tensile support. Sixth, we pour a 4000 PSI concrete mix tailored for the Texas climate. Seventh, our master finishers apply the specified texture—whether a standard broom finish for safety or a decorative stamp for beauty. Finally, we cut expansion joints at engineered intervals and apply a professional sealant to protect against UV damage and surface stains.`,
  materials: `When it comes to materials, durability, and performance for Austin conditions, EP Concrete makes no compromises. We utilize 4000 PSI concrete as our baseline standard, providing superior compressive strength compared to generic residential mixes. In Central Texas, the primary enemies of concrete are extreme heat and expansive clay soil. We address these by using grade-60 steel rebar and specialized curing compounds that prevent the concrete from drying too quickly during 100-degree summer days. Our sealants are specifically formulated to resist UV yellowing and to shield the surface from the salt and chemicals common in local maintenance. This engineering-first approach ensures that your ${name} remains monolithic and stable, resisting the heaving and cracking that often plagues lower-quality installations in the Travis County area.`,
  examples: `Our portfolio of ${name} include a vast array of project types across Austin and the surrounding Hill Country. We have successfully completed expansive commercial parking lots for retail centers, high-tolerance industrial flatwork for warehouses, and intricately detailed stamped patios for luxury estates. Common examples of our residential work include standard two-car driveways, side-yard walkways for utility access, and structural pads for detached home offices or workshops. Each of these projects serves as a testament to our ability to handle varying scales and complexities, always maintaining the same high level of structural precision and aesthetic quality.`,
  localExpertise: `Why local Austin experience matters: The geology of Central Texas is diverse and challenging, ranging from the hard limestone of Westlake to the deep, shifting clays of East Austin. A contractor without local knowledge may fail to account for the "black gumbo" soil that expands and contracts significantly with moisture changes. EP Concrete has spent over 15 years working in these exact conditions. We know the local municipal codes, we have established relationships with the region's best ready-mix plants, and we understand how to schedule pours to account for the unique humidity and heat cycles of our region. Our local expertise is your insurance policy against premature concrete failure.`,
  pricingFactors: `Several critical pricing factors determine the final investment for a ${name} project. Total square footage is the primary metric, but site accessibility also plays a major role; projects requiring manual labor or specialized concrete pumps will have higher labor costs. The complexity of the site grading—such as building up a sloped lot or dealing with excessive tree roots—will also affect the price. Material thickness (4, 5, or 6 inches) and the density of the steel reinforcement grid are structural choices that impact the bottom line. Lastly, decorative additions like integral color or custom stamps add aesthetic value and specialized labor to the project. We provide transparent, detailed estimates that break down these factors so you can make an informed decision for your property.`,
  benefits: [
    "Engineered specifically for Central Texas soil stability",
    "High-strength 4000 PSI concrete mix as a standard",
    "Precision-graded for optimal site drainage",
    "UV-resistant structural sealing included"
  ],
  faq: [
    { q: `How long until I can drive on my new ${name}?`, a: "We recommend waiting 7 to 10 days for standard passenger vehicles. For heavier trucks or machinery, a full 14-day cure is best to ensure the concrete has reached its designed compressive strength." },
    { q: "What is the best way to maintain my concrete?", a: "Routine cleaning with water and occasional mild soap is all that's needed. We recommend resealing your concrete every 2 to 3 years to maintain its moisture resistance and color depth." },
    { q: "Do you handle the city permits for my project?", a: "Yes, EP Concrete is fully familiar with Austin's permitting requirements for Right-of-Way and structural work. We can manage the application and inspection process on your behalf." }
  ],
  cta: `Get a Free ${name} Estimate`
});

const LOCATION_TEMPLATE = (city: string, mapEmbed: string, localFactors: string, faqs: any[]) => ({
  h1: `Concrete Contractor in ${city} TX`,
  metaTitle: `Concrete Contractor ${city} TX | EP Concrete #1 Local Paving`,
  metaDescription: `Looking for a reliable concrete contractor in ${city} TX? EP Concrete provides expert driveways, patios, and commercial slabs. Licensed & Insured. Call 512-998-3199.`,
  localizedIntro: `EP Concrete is the premier choice for professional concrete services in ${city} TX. From new residential construction to commercial developments, we provide structural solutions tailored to ${city}'s unique environment. Our team brings over 15 years of Central Texas experience to every project, ensuring your concrete investment is built to last in our local conditions.`,
  serviceExplanation: `In ${city} TX, concrete performance is directly tied to soil stability and heat management. Our residential division handles everything from decorative stamped patios to high-durability driveways, while our commercial crew manages large-scale industrial flatwork and retail parking lots throughout the ${city} area. We prioritize heavy-duty base preparation to mitigate the soil movement common in Central Texas.`,
  trustSection: `Why does local ${city} experience matter? ${localFactors} EP Concrete understands these local challenges and incorporates them into our mix designs and engineering standards. We are fully licensed, bonded, and insured, providing ${city} residents and business owners with reliable, high-performance paving.`,
  faq: faqs,
  mapEmbed: mapEmbed,
  cta: `Contact Our ${city} Team`
});

export const PAGES: Record<string, any> = {
  'home': {
    h1: "Professional Concrete Services Serving Central Texas",
    subheadline: "EP Concrete provides high-standard engineering for residential and commercial concrete paving solutions across the region.",
    valueProp: "Serving the greater Central Texas region for over 15 years, EP Concrete specializes in durable foundations, decorative stamped concrete, and heavy-duty commercial parking lots. Our expert team ensures every project is built to withstand the unique local soil conditions of the Texas Hill Country, offering a full range of structural and aesthetic concrete services with absolute precision and professional integrity.",
    cta: "Get a Free Estimate",
    trustIndicators: ["Licensed & Insured", "15+ Years Experience", "Residential & Commercial Specialists"]
  },

  'services-hub': {
    h1: "Concrete Services",
    intro: "As the definitive topical authority for concrete in Central Texas, EP Concrete provides an exhaustive catalog of structural and decorative solutions. We explicitly offer all 17 of our core residential and commercial concrete services, maintaining the highest levels of structural engineering and aesthetic quality in the industry. Whether you require a simple repair or a large-scale industrial pour, our teams are equipped to handle the project with precision and speed.",
  },

  // Residential Services (11)
  'concrete-driveways': SERVICE_TEMPLATE('Concrete Driveways'),
  'concrete-patios': SERVICE_TEMPLATE('Concrete Patios'),
  'concrete-sidewalks': SERVICE_TEMPLATE('Concrete Sidewalks'),
  'concrete-walkways-pathways': SERVICE_TEMPLATE('Concrete Walkways & Pathways'),
  'garage-slabs': SERVICE_TEMPLATE('Garage Slabs'),
  'concrete-slabs': SERVICE_TEMPLATE('Concrete Slabs'),
  'decorative-concrete': SERVICE_TEMPLATE('Decorative Concrete'),
  'stamped-concrete': SERVICE_TEMPLATE('Stamped Concrete'),
  'concrete-repair': SERVICE_TEMPLATE('Concrete Repair'),
  'concrete-replacement': SERVICE_TEMPLATE('Concrete Replacement'),
  'concrete-resurfacing': SERVICE_TEMPLATE('Concrete Resurfacing'),

  // Commercial Services (6)
  'parking-lots': SERVICE_TEMPLATE('Parking Lots'),
  'concrete-flatwork': SERVICE_TEMPLATE('Concrete Flatwork'),
  'concrete-curbing': SERVICE_TEMPLATE('Concrete Curbing'),
  'commercial-slabs': SERVICE_TEMPLATE('Commercial Slabs'),
  'retaining-walls': SERVICE_TEMPLATE('Retaining Walls'),
  'concrete-demolition': SERVICE_TEMPLATE('Concrete Demolition & Removal'),

  // Service + City Pages
  'concrete-driveways-round-rock-tx': {
    h1: "Concrete Driveways in Round Rock TX",
    intro: "Concrete driveways in Round Rock TX are a specialty of EP Concrete, where we provide elite residential installation and full replacement services. For over 15 years, our team has helped Round Rock homeowners upgrade their property's exterior with high-performance concrete surfaces built to withstand the specific geological challenges of Williamson County.",
    overview: "A professional concrete driveway is a premier investment for any Round Rock home. Unlike asphalt or gravel, a reinforced concrete driveway offers a monolithic, weed-free surface that requires minimal maintenance while significantly boosting curb appeal. At EP Concrete, we design our driveways to handle the dynamic loads of modern vehicles and heavy utility equipment, ensuring that your investment remains structural and beautiful for decades to come. Whether you are building a new custom home or replacing a failing asphalt drive, our solutions provide the stability and aesthetic finish your property deserves.",
    localContext: "Why concrete driveways work well in Round Rock TX: The soil in Round Rock is famously variable, often featuring shallow limestone mixed with pockets of expansive clay. These conditions require a contractor who understands how to stabilize the subgrade effectively. Additionally, Round Rock experiences intense summer heat that can soften asphalt, leading to rutting and deterioration. Our high-strength concrete mixes reflect heat more effectively and maintain their structural shape even during the hottest Texas summers, preventing the typical 'sinking' that occurs in lesser-paved surfaces.",
    process: "The EP Concrete driveway process in Round Rock follows a strict engineering standard. We start with a comprehensive consultation to determine your goals and drainage needs. We then perform precision site preparation, including the removal of organic material and the compaction of a stable road-base foundation. Our installation includes a custom-tied rebar grid and a high-strength 4000 PSI pour. Finally, we handle the finishing—typically a non-slip broom texture—and manage the curing process with professional-grade sealants.",
    examples: "Common driveway projects in Round Rock include total replacement of cracking old driveways, new construction paving for residential developments, and custom driveway extensions for RV or boat storage. We are experts at integrating your new driveway with existing city curbs and sidewalks, ensuring a seamless and compliant transition.",
    whyEP: "Choosing EP Concrete for your Round Rock project means choosing local residential expertise. We understand the specific municipal requirements of Williamson County and the nuances of working in thriving Round Rock neighborhoods. Our workmanship is backed by 15+ years of Central Texas knowledge, and we take pride in delivering a professional, clean job site from start to finish.",
    pricingFactors: "Several factors influence driveway pricing in Round Rock, including the total square footage, the depth of the slab (typically 4-6 inches), and the level of site preparation required. Accessibility for our heavy trucks and the choice of specialized finishes or decorative borders will also be considered in your custom estimate.",
    faq: [
      { q: "How thick will my Round Rock driveway be?", a: "Our standard residential driveways are 4 inches thick, but we can increase this to 6 inches for heavy-duty vehicle support if needed." },
      { q: "Will the Round Rock heat affect my concrete?", a: "We use specialized mix designs and curing agents that are formulated for the Texas heat, preventing the concrete from drying too quickly and ensuring maximum strength." },
      { q: "Do you offer removal of my old driveway?", a: "Yes, full demolition and eco-friendly hauling are integrated into our replacement service." }
    ],
    serviceLink: "concrete-driveways",
    locationSlug: "round-rock-tx-concrete-contractor",
    cta: "Get a Free Driveway Estimate"
  },

  'concrete-driveways-cedar-park-tx': {
    h1: "Concrete Driveways in Cedar Park TX",
    intro: "Concrete driveways in Cedar Park TX provided by EP Concrete offer the ultimate combination of structural strength and backyard-defining style. Our team provides expert concrete driveway installation and modern replacement services throughout the entire Cedar Park area, serving homeowners who demand a durable foundation for their property.",
    overview: "Your driveway is more than just a place to park your car; it is the entry point to your home. In Cedar Park, a professional concrete driveway provides a clean, permanent surface that adds tangible value to your property. EP Concrete specializes in heavy-duty residential slabs that resist the shifting ground and heavy rain cycles common in Central Texas. By utilizing monolithic pouring techniques and high-grade steel reinforcement, we create driveways that outlast and outperform traditional paving methods.",
    localContext: "Why concrete driveways work well in Cedar Park TX: Cedar Park’s terrain often involves sloped lots and unique drainage patterns. A professionally graded concrete driveway is essential for moving water safely away from your home’s foundation. Furthermore, Cedar Park's rapid growth means many homeowners are looking to upgrade from original builder-grade surfaces to high-performance, reinforced concrete that can handle the increased traffic of a growing family.",
    process: "The EP Concrete driveway process is designed for precision. We begin with a site walk-through to plan for drainage and slope. Site preparation involves clearing and compacting the ground to prevent future settlement. During installation, we place rebar on chairs for optimal placement within the slab. After the pour, we apply a non-slip finish and professional sealant, ensuring your driveway is ready to handle the elements.",
    examples: "Common driveway projects in Cedar Park include replacing cracked original driveways, adding side-slab extensions for additional parking, and installing elegant circular drives for large residential estates.",
    whyEP: "Why choose EP Concrete in Cedar Park? We bring 15+ years of local experience and a dedicated residential focus. We understand the specific growth and development standards in Cedar Park and provide the high-quality workmanship needed to satisfy the most demanding property owners.",
    pricingFactors: "Pricing factors include the total area to be paved, the complexity of the grading needed for slope management, and the thickness of the concrete. Site access and the addition of decorative textures or borders also play a role in the final quote.",
    faq: [
      { q: "How long does a Cedar Park driveway project take?", a: "Most residential driveway replacements are completed within 3 to 5 days, from demolition to final cleanup." },
      { q: "Do I need a permit for a driveway in Cedar Park?", a: "Yes, most driveway work in the city limits requires a permit, and we are happy to assist with that process." },
      { q: "Can you add a custom texture to my driveway?", a: "Absolutely. We offer various finishes, from standard broom to decorative stamped borders." }
    ],
    serviceLink: "concrete-driveways",
    locationSlug: "cedar-park-tx-concrete-contractor",
    cta: "Get a Free Driveway Estimate"
  },

  // Location Pages
  'austin-location': LOCATION_TEMPLATE(
    'Austin', 
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.74637223447!2d-97.83245464115582!3d30.30768632616429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a336636b%3A0x9951152062634d!2sAustin%2C%20TX!5e0!3m2!1sen!2s!4v1715880000000!5m2!1sen!2s',
    'The "black gumbo" soil in Austin expands and contracts significantly. We use enhanced rebar and road-base to prevent heaving.',
    [
      { q: "Do you serve all of Austin TX?", a: "Yes, we cover the entire metro area from North Austin to South Congress and Westlake." },
      { q: "Can you manage city permits?", a: "Yes, we handle the City of Austin permitting for Right-of-Way and structural work." }
    ]
  ),

  'round-rock-location': LOCATION_TEMPLATE(
    'Round Rock',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110022.02293818032!2d-97.75545464115582!3d30.51525432616429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644d03666f2814b%3A0xc312f5e3e2609095!2sRound%20Rock%2C%20TX!5e0!3m2!1sen!2s!4v1715880000001!5m2!1sen!2s',
    'Round Rock features rapid development and heavy limestone foundations. We engineer for high-traffic commercial lots and durable residential driveways.',
    [
      { q: "Do you offer residential services in Round Rock?", a: "Yes, we specialize in Round Rock driveways, patios, and replacement projects." },
      { q: "Are you familiar with Round Rock building codes?", a: "Absolutely, we ensure every project meets local municipal standards." }
    ]
  ),

  'cedar-park-location': LOCATION_TEMPLATE(
    'Cedar Park',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109968.21637223447!2d-97.91345464115582!3d30.52525432616429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644d4777d0e4c6b%3A0x7d2a58d3c58f0b00!2sCedar%20Park%2C%20TX!5e0!3m2!1sen!2s!4v1715880000002!5m2!1sen!2s',
    'Cedar Park properties often require specialized drainage solutions due to the local terrain. Our grading experts ensure water moves away from your home.',
    [
      { q: "What concrete finishes are popular in Cedar Park?", a: "Stamped and decorative concrete are highly requested for backyard patios in the area." },
      { q: "Do you handle small slab pours?", a: "Yes, we provide utility slabs for sheds and hot tubs throughout Cedar Park." }
    ]
  ),

  'georgetown-location': LOCATION_TEMPLATE(
    'Georgetown',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110123.74637223447!2d-97.75845464115582!3d30.64525432616429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644d059885e3479%3A0x609569269d95f4e!2sGeorgetown%2C%20TX!5e0!3m2!1sen!2s!4v1715880000003!5m2!1sen!2s',
    'Georgetown\'s historic and retirement communities require accessible, slip-resistant sidewalks and pathways. We specialize in safe, senior-friendly paving.',
    [
      { q: "Do you provide concrete repair in Sun City?", a: "Yes, we offer extensive repair and maintenance services throughout Georgetown communities." },
      { q: "Can you match existing historic textures?", a: "We excel at blending new concrete with existing structural aesthetics in Georgetown." }
    ]
  ),

  'florence-location': LOCATION_TEMPLATE(
    'Florence',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110056.74637223447!2d-97.87545464115582!3d30.84525432616429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644c10c4f87a059%3A0x5a1b32d5661a3f0!2sFlorence%2C%20TX!5e0!3m2!1sen!2s!4v1715880000004!5m2!1sen!2s',
    'Rural properties in Florence often need heavy-duty utility pads and long-access driveways. We specialize in large-scale rural concrete infrastructure.',
    [
      { q: "Do you pour agricultural slabs in Florence?", a: "Yes, we provide structural slabs for barns, sheds, and equipment storage." },
      { q: "How do you handle long rural driveways?", a: "We use high-capacity equipment to manage the significant site prep required for long drives." }
    ]
  ),

  'belton-location': LOCATION_TEMPLATE(
    'Belton',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110123.74637223447!2d-97.54545464115582!3d31.05525432616429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864573866c6b8c59%3A0x86b0b8d5a1b32d5!2sBelton%2C%20TX!5e0!3m2!1sen!2s!4v1715880000005!5m2!1sen!2s',
    'Belton\'s proximity to the lake area means moisture management is key. Our concrete is designed with specialized curing agents to handle the humidity.',
    [
      { q: "Do you build retaining walls in Belton?", a: "Yes, we specialize in structural retaining walls for sloped lake-area properties." },
      { q: "Is your concrete moisture resistant?", a: "We use high-quality sealants specifically designed for Central Texas humidity levels." }
    ]
  ),

  'about': {
    h1: "About Us",
    founderName: "Enrique",
    founderTitle: "Founder of EP Concrete",
    intro: "Enrique, the founder of EP Concrete, is a passionate and experienced concrete professional with over 15 years of industry expertise. As a family-owned business, EP Concrete is dedicated to providing high-quality concrete services to Austin and the surrounding areas. Our commitment to excellence is deeply rooted in Enrique's vision and values.",
    successStory: "We believe that your success is our success. For over 15 years, we've been turning our customers' visions into reality, one project at a time. Our team's dedication to quality and customer satisfaction has resulted in more than 2,000 successful projects across Austin TX and beyond. But what truly matters to us is the smile on your face when you see your dream come to life. That's why we're proud of our 95% customer satisfaction rate - it's not just a number, it's a testament to our commitment to you.",
    stats: [
      { label: "Years In Business", value: "15+" },
      { label: "Successful Projects", value: "2,000+" },
      { label: "Customer Satisfaction", value: "95%" }
    ],
    values: [
      { title: "Expert Craftsmanship", desc: "We bring your concrete dreams to life with precision and care, ensuring every project reflects your unique vision.", icon: "star" },
      { title: "Reliable Partnership", desc: "Count on us to be there every step of the way, from initial consultation to project completion and beyond.", icon: "handshake" },
      { title: "Tailored Solutions", desc: "Your property is one-of-a-kind, and so are our solutions. We customize our approach to meet your specific needs and preferences.", icon: "edit" },
      { title: "Lasting Quality", desc: "We don't just build structures; we create legacies. Our work stands the test of time, just like your dreams.", icon: "verified" }
    ],
    serviceAreaList: [
      "Bertram", "Burnet", "Cedar Park", "Florence", "Georgetown", "Hutto", "Jarrell", "Leander", "Liberty Hill", "Manor", "Pflugerville", "Round Rock", "Taylor", "Briggs", "Salado", "Harker Heights", "Belton", "Killeen", "Copperas Cove", "Kempner", "Travis County", "Williamson County"
    ]
  },

  'contact': {
    h1: "Contact Us",
    intro: "EP Concrete is a trusted provider of premium concrete services in Austin, Texas, known for exceptional craftsmanship and reliable solutions. From foundations to patios, our experienced team delivers durable, high-quality results tailored to your project's needs.",
    phone: "512-998-3199",
    email: "perezconcreteconstruction@gmail.com",
    address: "15607 Brenda St, Austin, TX 78728",
    hours: "Monday - Saturday: 8:00 AM - 6:00 PM",
    formTitle: "Contact us now for a free, no-obligation quote!",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110123.74637223447!2d-97.7431!3d30.2672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a336636b%3A0x9951152062634d!2sAustin%2C%20TX!5e0!3m2!1sen!2s!4v1715880000000!5m2!1sen!2s"
  }
};
