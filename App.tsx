
import React, { useState, useEffect } from 'react';
import { PAGES } from './contentData';
import { SERVICES, RESIDENTIAL_SERVICES, COMMERCIAL_SERVICES, LOCATIONS, BUSINESS_DETAILS } from './constants';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.hash || '#home');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quoteStep, setQuoteStep] = useState(1);
  const [quoteData, setQuoteData] = useState({ name: '', phone: '', email: '', service: '', location: '' });

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#home');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": BUSINESS_DETAILS.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "15607 Brenda St",
        "addressLocality": "Austin",
        "addressRegion": "TX",
        "postalCode": "78728",
        "addressCountry": "US"
      },
      "telephone": BUSINESS_DETAILS.phone,
      "url": BUSINESS_DETAILS.website,
      "email": BUSINESS_DETAILS.email,
      "areaServed": ["Austin TX", "Round Rock TX", "Cedar Park TX", "Georgetown TX", "Florence TX", "Belton TX", "Central Texas"]
    };
    const scriptElement = document.getElementById('schema-data');
    if (scriptElement) {
      scriptElement.innerHTML = '';
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      scriptElement.appendChild(script);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteStep === 1) {
      setQuoteStep(2);
    } else {
      alert("Thank you! Our estimators will review your request and provide a pricing range shortly.");
      setIsQuoteOpen(false);
      setQuoteStep(1);
    }
  };

  const QuoteModal = () => {
    if (!isQuoteOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-scaleIn">
          <div className="bg-orange-600 p-8 text-white relative">
            <button onClick={() => setIsQuoteOpen(false)} className="absolute top-4 right-4 hover:rotate-90 transition-transform">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-black uppercase">Get Your Free Estimate</h2>
            <p className="text-orange-100 text-sm mt-2">Step {quoteStep} of 2</p>
          </div>
          <form onSubmit={handleQuoteSubmit} className="p-8 space-y-6">
            {quoteStep === 1 ? (
              <>
                <div className="space-y-4">
                  <input required placeholder="Full Name" className="w-full p-4 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-orange-600" onChange={e => setQuoteData({...quoteData, name: e.target.value})} value={quoteData.name} />
                  <input required type="tel" placeholder="Phone Number" className="w-full p-4 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-orange-600" onChange={e => setQuoteData({...quoteData, phone: e.target.value})} value={quoteData.phone} />
                  <input required type="email" placeholder="Email Address" className="w-full p-4 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-orange-600" onChange={e => setQuoteData({...quoteData, email: e.target.value})} value={quoteData.email} />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest">Next Step</button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <select required className="w-full p-4 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-orange-600" onChange={e => setQuoteData({...quoteData, service: e.target.value})}>
                    <option value="">Select Service Needed</option>
                    {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <input required placeholder="Project Location (City/Zip)" className="w-full p-4 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-orange-600" onChange={e => setQuoteData({...quoteData, location: e.target.value})} value={quoteData.location} />
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-xl font-black uppercase tracking-widest">Submit Request</button>
              </>
            )}
          </form>
        </div>
      </div>
    );
  };

  const MobileMenu = () => {
    return (
      <div className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => { navigate('#home'); setIsMenuOpen(false); }}>
                <span className="material-symbols-outlined text-orange-600 text-3xl font-black">foundation</span>
                <span className="text-xl font-black tracking-tighter uppercase">EP Concrete</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-900" aria-label="Close Menu">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <nav className="flex flex-col gap-6 mb-12">
              <button onClick={() => { navigate('#services'); setIsMenuOpen(false); }} className="text-left text-sm font-black uppercase tracking-widest text-slate-900 hover:text-orange-600 transition-colors">Services Hub</button>
              <button onClick={() => { navigate('#about'); setIsMenuOpen(false); }} className="text-left text-sm font-black uppercase tracking-widest text-slate-900 hover:text-orange-600 transition-colors">About Us</button>
              <button onClick={() => { navigate('#contact'); setIsMenuOpen(false); }} className="text-left text-sm font-black uppercase tracking-widest text-slate-900 hover:text-orange-600 transition-colors">Contact</button>
              <button onClick={() => { navigate('#service-areas/austin-tx-concrete-contractor'); setIsMenuOpen(false); }} className="text-left text-sm font-black uppercase tracking-widest text-slate-900 hover:text-orange-600 transition-colors">Austin Area</button>
              <button onClick={() => { setIsQuoteOpen(true); setIsMenuOpen(false); }} className="bg-orange-600 text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-orange-600/20 text-center">Get a Quote</button>
            </nav>

            <div className="mt-auto pt-8 border-t border-slate-100 overflow-y-auto">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-6 px-1">Regional Service Areas</p>
              <div className="grid grid-cols-1 gap-4">
                {LOCATIONS.map(loc => (
                  <button 
                    key={loc.id} 
                    onClick={() => { navigate(`#service-areas/${loc.slug}`); setIsMenuOpen(false); }}
                    className="text-left text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-orange-600 flex items-center gap-2 px-1"
                  >
                    <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                    {loc.city} TX
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <a href={`tel:${BUSINESS_DETAILS.phone}`} className="flex items-center gap-3 text-slate-900 px-1">
                <span className="material-symbols-outlined text-orange-600 text-sm">call</span>
                <span className="font-black text-sm">{BUSINESS_DETAILS.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAbout = () => {
    const data = PAGES['about'];
    return (
      <div className="animate-fadeIn bg-white">
        {/* Founder Section */}
        <div className="max-w-7xl mx-auto py-16 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="flex justify-center">
              <div className="w-full max-w-sm aspect-[4/5] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-orange-500">
                 <img src="https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=800" alt="Enrique Founder" className="w-full h-full object-cover" />
                 <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 backdrop-blur-md p-6 text-white text-center">
                    <p className="font-black uppercase tracking-widest text-lg">{data.founderName}</p>
                    <p className="text-xs uppercase font-bold text-orange-500">{data.founderTitle}</p>
                 </div>
              </div>
            </div>
            <div className="space-y-6">
               <p className="text-lg text-slate-700 leading-relaxed font-medium">{data.intro}</p>
               <p className="text-lg text-slate-700 leading-relaxed font-medium">{data.successStory}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center py-12">
            <div className="w-48 h-[2px] bg-slate-300 mx-auto opacity-50"></div>
        </div>

        {/* Vision, Stats & Pillars Section */}
        <div className="max-w-7xl mx-auto py-16 px-6 text-center">
           <h2 className="text-3xl font-black uppercase mb-20 text-orange-500 tracking-tight">Your Vision, Our Mission</h2>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-24 gap-x-12 relative">
             {/* Column 1: Stats and Pillars Left */}
             <div className="space-y-24">
                <div className="space-y-4">
                   <span className="material-symbols-outlined text-5xl text-orange-500 font-black">star</span>
                   <h3 className="text-xl font-black uppercase">Expert Craftsmanship</h3>
                   <p className="text-slate-500 text-sm max-w-xs mx-auto">{data.values[0].desc}</p>
                </div>
                <div className="pt-8">
                  <span className="text-6xl font-black text-orange-500">{data.stats[0].value}</span>
                  <p className="uppercase font-black text-xs tracking-widest text-slate-400 mt-2">{data.stats[0].label}</p>
                </div>
                <div className="space-y-4">
                   <span className="material-symbols-outlined text-5xl text-orange-500 font-black">edit</span>
                   <h3 className="text-xl font-black uppercase">Tailored Solutions</h3>
                   <p className="text-slate-500 text-sm max-w-xs mx-auto">{data.values[2].desc}</p>
                </div>
             </div>

             {/* Column 2: Central Branding and Large Stats */}
             <div className="flex flex-col justify-center items-center gap-16">
                <div className="space-y-12">
                   <div className="w-full max-w-xs aspect-video bg-white rounded-2xl overflow-hidden border-2 border-slate-200 flex items-center justify-center relative shadow-sm">
                      <div className="flex flex-col items-center justify-center p-8">
                         <div className="border-[3px] border-slate-900 p-4 font-black uppercase text-center leading-none">
                           <span className="text-5xl block tracking-tighter">EP</span>
                           <span className="text-[7px] tracking-[0.4em] block mt-1">Concrete Construction</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="pt-8">
                     <span className="text-7xl font-black text-orange-500">{data.stats[1].value}</span>
                     <p className="uppercase font-black text-xs tracking-widest text-slate-400 mt-2">{data.stats[1].label}</p>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex gap-1 text-orange-500 text-3xl justify-center">
                        {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined fill-1">star</span>)}
                      </div>
                      <p className="uppercase font-black text-sm tracking-widest text-slate-900">4.9 Stars On Google</p>
                   </div>
                </div>
             </div>

             {/* Column 3: Stats and Pillars Right */}
             <div className="space-y-24">
                <div className="space-y-4">
                   <span className="material-symbols-outlined text-5xl text-orange-500 font-black">handshake</span>
                   <h3 className="text-xl font-black uppercase">Reliable Partnership</h3>
                   <p className="text-slate-500 text-sm max-w-xs mx-auto">{data.values[1].desc}</p>
                </div>
                <div className="pt-8">
                  <span className="text-6xl font-black text-orange-500">{data.stats[2].value}</span>
                  <p className="uppercase font-black text-xs tracking-widest text-slate-400 mt-2">{data.stats[2].label}</p>
                </div>
                <div className="space-y-4">
                   <span className="material-symbols-outlined text-5xl text-orange-500 font-black">verified</span>
                   <h3 className="text-xl font-black uppercase">Lasting Quality</h3>
                   <p className="text-slate-500 text-sm max-w-xs mx-auto">{data.values[3].desc}</p>
                </div>
             </div>
           </div>
        </div>

        {/* Service Areas Section */}
        <div className="bg-slate-50 py-24 px-6 border-t border-slate-200">
           <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black uppercase mb-16 text-center text-slate-900 tracking-tighter">We Serve The Following Areas</h2>
              <div className="w-full h-[500px] rounded-3xl overflow-hidden border border-slate-300 shadow-xl mb-16">
                 <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d440813.1205315801!2d-97.7431!3d30.2672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1715880000000" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-12 max-w-6xl mx-auto">
                 {data.serviceAreaList.map((city: string) => (
                   <div key={city} className="flex items-center gap-3 text-slate-600 group hover:text-orange-500 transition-colors cursor-default">
                     <span className="material-symbols-outlined text-sm text-orange-500">handyman</span>
                     <span className="font-bold text-sm tracking-tight">{city}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderContact = () => {
    const data = PAGES['contact'];
    return (
      <div className="animate-fadeIn bg-white">
        {/* Banner with Number */}
        <div className="bg-slate-900 relative h-72 flex items-center justify-center overflow-hidden border-b-8 border-orange-500">
          <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale blur-sm" />
          <div className="relative z-10 text-center text-white px-6">
             <p className="font-black uppercase text-2xl tracking-[0.2em] mb-4 drop-shadow-lg">Ep Concrete</p>
             <a href={`tel:${data.phone}`} className="text-6xl md:text-8xl font-black tracking-tighter text-yellow-500 hover:text-white transition-colors drop-shadow-2xl">1-{data.phone}</a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-24 px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              {/* Left Column: Info boxes */}
              <div className="space-y-12">
                 <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-xl">{data.intro}</p>
                 
                 <div className="space-y-10">
                    <div className="flex items-center gap-8 group">
                       <div className="bg-yellow-500 text-slate-900 w-28 h-16 rounded-[40px] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
                          <span className="material-symbols-outlined text-4xl font-black fill-1">call</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-2xl font-black tracking-tight">{data.phone}</p>
                          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{data.email}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-8 group">
                       <div className="bg-yellow-500 text-slate-900 w-28 h-16 rounded-[40px] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
                          <span className="material-symbols-outlined text-4xl font-black fill-1">home</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-2xl font-black tracking-tight">{BUSINESS_DETAILS.address}</p>
                          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Austin, TX 78728</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-8 group">
                       <div className="bg-yellow-500 text-slate-900 w-28 h-16 rounded-[40px] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
                          <span className="material-symbols-outlined text-4xl font-black fill-1">schedule</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-2xl font-black tracking-tight">Monday - Saturday</p>
                          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">8:00AM - 6:00PM</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="bg-white rounded-[40px] p-10 lg:p-14 border border-slate-100 shadow-2xl relative">
                 <h2 className="text-3xl font-black uppercase text-center mb-10 text-slate-900 leading-tight tracking-tight">{data.formTitle}</h2>
                 
                 <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Request sent successfully!"); }}>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-900 ml-1">First Name</label>
                       <input required className="w-full bg-white border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 font-medium text-slate-900" placeholder="First Name" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-900 ml-1">Last Name</label>
                       <input required className="w-full bg-white border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 font-medium text-slate-900" placeholder="Last Name" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-900 ml-1">Email *</label>
                       <input required type="email" className="w-full bg-white border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 font-medium text-slate-900" placeholder="Email" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-900 ml-1">Phone *</label>
                       <input required type="tel" className="w-full bg-white border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 font-medium text-slate-900" placeholder="Phone" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-900 ml-1">What Service Are You Interested In?</label>
                       <div className="relative">
                          <select required className="w-full bg-white border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 font-medium text-slate-900 appearance-none">
                             <option value=""></option>
                             {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                       </div>
                    </div>

                    <div className="flex items-start gap-4 px-1 pt-4">
                       <input required type="checkbox" id="terms" className="mt-1 w-6 h-6 accent-yellow-500 rounded cursor-pointer border-slate-300" />
                       <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer select-none font-medium">
                          I agree to <span className="text-blue-600 underline">terms & conditions</span> provided by EP Concrete. By providing my phone number, I agree to receive text messages from the business.
                       </label>
                    </div>

                    <button type="submit" className="w-full bg-yellow-500 text-slate-900 py-6 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-slate-900 hover:text-white transition-all transform active:scale-95 mt-8">
                       Get Started With EP Concrete
                    </button>
                 </form>
              </div>
           </div>
        </div>

        {/* Large Google Map */}
        <div className="w-full h-[650px] border-t-8 border-yellow-500 relative">
           <iframe src={data.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
           {/* Directions card overlay (approximation) */}
           <div className="absolute top-10 left-10 bg-white p-6 shadow-2xl rounded-xl border border-slate-200 hidden md:block w-72">
              <h3 className="font-black text-slate-900 leading-tight">30°31'12.4"N 97°44'01.8"W</h3>
              <p className="text-slate-500 text-[10px] mt-1 uppercase font-bold tracking-widest">Brushy Creek, Texas</p>
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                 <button className="flex flex-col items-center gap-1 group">
                    <span className="material-symbols-outlined text-blue-500 font-black">directions</span>
                    <span className="text-[10px] font-black uppercase text-blue-500">Directions</span>
                 </button>
                 <button className="text-[10px] font-black uppercase text-blue-500 hover:underline">View larger map</button>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderHome = () => {
    const data = PAGES['home'];
    return (
      <div className="animate-fadeIn">
        <header className="relative bg-slate-950 text-white min-h-[70vh] flex items-center px-6 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600" alt="Central Texas Concrete Services" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto py-20 text-center">
            <div className="inline-block bg-orange-600 text-[10px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-6">Established 2009</div>
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-8">{data.h1}</h1>
            <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">{data.subheadline}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('#contact')} className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-2xl transition-all">
                {data.cta}
              </button>
              <button onClick={() => navigate('#services')} className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all">
                Our Concrete Services
              </button>
            </div>
          </div>
        </header>

        <section className="bg-white py-24 px-6">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div>
                   <h2 className="text-3xl font-black uppercase mb-8">Central Texas' Preferred Concrete Paving Experts</h2>
                   <p className="text-slate-600 text-lg leading-relaxed mb-8">{data.valueProp}</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.trustIndicators.map((ti: string) => (
                        <div key={ti} className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-orange-600 font-bold">verified</span>
                          <span className="font-bold text-xs uppercase tracking-tight">{ti}</span>
                        </div>
                      ))}
                   </div>
                   <button onClick={() => navigate('#contact')} className="mt-10 bg-orange-600 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-600/20">Get a Free Estimate</button>
                </div>
                <div className="bg-slate-100 p-10 rounded-3xl border border-slate-200 shadow-inner">
                   <h3 className="text-2xl font-black uppercase mb-6">Fast Estimate Request</h3>
                   <p className="text-slate-500 mb-8 text-sm">Serving the greater Austin area. Request your detailed project walkthrough today.</p>
                   <button onClick={() => navigate('#contact')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm">Get Pricing Now</button>
                </div>
             </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24 px-6 border-y border-slate-200">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-4xl font-black uppercase mb-4">Our Professional Paving Solutions</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Full Range of Explicitly Listed Residential & Commercial Services</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div>
                    <h3 className="text-xl font-black uppercase mb-8 border-b-4 border-orange-600 inline-block pb-2">Residential Concrete Services</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {RESIDENTIAL_SERVICES.map(s => (
                         <div key={s.id} onClick={() => navigate(`#services/${s.id}`)} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-600 transition-all cursor-pointer group shadow-sm">
                           <h4 className="font-bold uppercase text-sm mb-2 group-hover:text-orange-600">{s.name}</h4>
                           <p className="text-slate-500 text-[10px] leading-relaxed mb-4">{s.summary}</p>
                           <span className="text-orange-600 text-[9px] font-black uppercase tracking-widest">View Page &rarr;</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div>
                    <h3 className="text-xl font-black uppercase mb-8 border-b-2 border-slate-900 inline-block pb-2">Commercial Concrete Services</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {COMMERCIAL_SERVICES.map(s => (
                         <div key={s.id} onClick={() => navigate(`#services/${s.id}`)} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-600 transition-all cursor-pointer group shadow-sm">
                           <h4 className="font-bold uppercase text-sm mb-2 group-hover:text-orange-600">{s.name}</h4>
                           <p className="text-slate-500 text-[10px] leading-relaxed mb-4">{s.summary}</p>
                           <span className="text-orange-600 text-[9px] font-black uppercase tracking-widest">View Page &rarr;</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="mt-16 text-center">
                 <button onClick={() => navigate('#services')} className="bg-slate-900 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                    View Full Services Hub
                 </button>
              </div>
           </div>
        </section>

        <section className="bg-white py-24 px-6 border-b border-slate-200 text-center">
            <h2 className="text-3xl font-black uppercase mb-6">Ready to Start Your Project?</h2>
            <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-12 py-5 rounded-full font-black uppercase text-sm tracking-widest shadow-2xl">Get a Free Estimate</button>
        </section>
      </div>
    );
  };

  const renderServiceArea = (id: string) => {
    const pageKey = `${id}-location`;
    const data = PAGES[pageKey]; 
    if (!data) return renderHome();
    
    return (
      <div className="animate-fadeIn">
        <header className="bg-slate-950 py-32 px-6 relative overflow-hidden text-white border-b border-white/5">
           <div className="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1510253687831-0f982d7862fc?auto=format&fit=crop&q=80&w=1600" alt={`${data.h1} Skyline`} className="w-full h-full object-cover" />
           </div>
           <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
             <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-none">{data.h1}</h1>
             <p className="text-xl text-slate-300 font-medium tracking-tight">Expert Paving Solutions in {data.h1.split(' in ')[1]}</p>
           </div>
        </header>
        <div className="max-w-7xl mx-auto py-24 px-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 prose max-w-none">
                 <div className="mb-10 text-center lg:text-left not-prose">
                    <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-xl">Get a Free Estimate</button>
                 </div>

                 <h2>Trusted Local Service in {data.h1.split(' in ')[1]}</h2>
                 <p className="text-lg">{data.localizedIntro}</p>
                 
                 <h2>Services Offered in {data.h1.split(' in ')[1]}</h2>
                 <div className="bg-slate-100 p-10 rounded-3xl not-prose my-12 border border-slate-200">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {SERVICES.map(s => (
                         <button key={s.id} onClick={() => navigate(`#services/${s.id}`)} className="flex items-center gap-2 text-[10px] font-black text-slate-600 hover:text-orange-600 uppercase tracking-tighter transition-colors text-left">
                           <span className="material-symbols-outlined text-orange-600 text-sm">check_circle</span>
                           {s.name}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="my-16 not-prose">
                    <h2 className="text-2xl font-black uppercase mb-6 text-center">Serving {data.h1.split(' in ')[1]} and Surrounding Areas</h2>
                    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
                      <iframe 
                        src={data.mapEmbed}
                        width="100%" 
                        height="450" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade">
                      </iframe>
                    </div>
                    <p className="mt-6 text-slate-500 italic text-sm text-center px-4 leading-relaxed">EP Concrete provides full concrete demolition, installation, and repair throughout the greater {data.h1.split(' in ')[1]} area, ensuring consistent structural quality across the region.</p>
                 </div>

                 <h2>Engineering for Local Soil & Climate</h2>
                 <p>{data.serviceExplanation}</p>
                 
                 <h2>Why Local Experience Matters</h2>
                 <p>{data.trustSection}</p>

                 <h2>Project FAQs</h2>
                 <div className="not-prose space-y-4">
                    {data.faq.map((f: any) => (
                      <div key={f.q} className="bg-white p-8 rounded-2xl border border-slate-200">
                        <h4 className="font-black text-sm uppercase tracking-tight mb-2 text-slate-900">{f.q}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{f.a}</p>
                      </div>
                    ))}
                 </div>

                 <div className="mt-16 text-center not-prose">
                    <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-12 py-5 rounded-full font-black uppercase text-sm tracking-widest shadow-2xl">Get a Free Estimate</button>
                 </div>
              </div>
              <div className="lg:col-span-1 space-y-8">
                 <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl sticky top-28 border border-white/5">
                    <h3 className="text-2xl font-black uppercase mb-6">Local Quote</h3>
                    <p className="text-slate-400 mb-8 text-sm">Our estimators are ready to provide a detailed site evaluation for your project. Submit your request below.</p>
                    <button onClick={() => navigate('#contact')} className="w-full bg-orange-600 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/20">
                      Request Quote
                    </button>
                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                       <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">Direct Phone</p>
                       <a href={`tel:${BUSINESS_DETAILS.phone}`} className="text-2xl font-black text-white">{BUSINESS_DETAILS.phone}</a>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderServiceDetail = (id: string) => {
    const data = PAGES[id];
    if (!data) return renderHome();
    return (
      <div className="animate-fadeIn">
        <header className="bg-slate-900 text-white py-24 px-6 border-b border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-4">{data.h1}</h1>
            <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px]">Serving Austin TX & Central Texas</p>
          </div>
        </header>
        <div className="max-w-4xl mx-auto py-24 px-6 prose max-w-none">
          <div className="mb-10 text-center lg:text-left not-prose">
              <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-xl">Get a Free Estimate</button>
          </div>

          <h2>Service Overview</h2>
          <p className="text-xl leading-relaxed text-slate-600">{data.overview}</p>
          
          <div className="bg-slate-100 p-8 rounded-2xl not-prose my-12 border border-slate-200">
             <p className="text-sm font-bold text-slate-500 italic uppercase tracking-widest mb-0">Service available in Austin TX and surrounding municipalities.</p>
          </div>

          <h2>When This Service Is Needed</h2>
          <p className="text-slate-600 leading-relaxed">{data.whenNeeded}</p>

          <h2>Residential or Commercial Use</h2>
          <p className="text-slate-600 leading-relaxed">{data.useCase}</p>

          <h2>EP Concrete Step-by-Step Process</h2>
          <p className="text-slate-600 leading-relaxed">{data.process}</p>

          <h2>Materials, Durability, and Performance for Austin Conditions</h2>
          <p className="text-slate-600 leading-relaxed">{data.materials}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-12">
            {data.benefits.map((b: string) => (
              <div key={b} className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="material-symbols-outlined text-orange-600">task_alt</span>
                <span className="font-bold text-[10px] uppercase tracking-tight">{b}</span>
              </div>
            ))}
          </div>

          <h2>Common Project Examples</h2>
          <p className="text-slate-600 leading-relaxed">{data.examples}</p>

          <div className="bg-slate-900 text-white p-12 rounded-3xl not-prose text-center my-16 shadow-2xl border border-white/5">
             <h2 className="text-2xl font-black uppercase mb-4">Request a Free Estimate</h2>
             <p className="text-slate-400 mb-10 max-w-md mx-auto text-sm leading-relaxed">Get professional pricing for your project in Austin. Our experts provide detailed site evaluations.</p>
             <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-transform">
                    Get a Quote
                </button>
                <button onClick={() => navigate('#service-areas/austin-tx-concrete-contractor')} className="bg-white/10 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] border border-white/10">
                    Austin TX Service Area
                </button>
             </div>
          </div>

          <h2>Why Local Austin Experience Matters</h2>
          <p className="text-slate-600 leading-relaxed">{data.localExpertise}</p>

          <h2>Pricing Factors</h2>
          <p className="text-slate-600 leading-relaxed">{data.pricingFactors}</p>

          <h2>Related Resources</h2>
          <p className="text-slate-600 mb-12">Explore our full <button onClick={() => navigate('#services')} className="text-orange-600 font-bold underline">Concrete Services Hub</button> or learn more about our specific <button onClick={() => navigate('#service-areas/austin-tx-concrete-contractor')} className="text-orange-600 font-bold underline">Austin TX Area Coverage</button>.</p>

          <h2>Frequently Asked Questions</h2>
          <div className="not-prose space-y-4">
             {data.faq.map((f: any) => (
               <div key={f.q} className="bg-white p-8 rounded-2xl border border-slate-200">
                 <h4 className="font-black text-sm mb-4 text-slate-900 uppercase tracking-tight">{f.q}</h4>
                 <p className="text-slate-600 leading-relaxed text-sm">{f.a}</p>
               </div>
             ))}
          </div>

          <div className="mt-16 text-center not-prose">
              <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-12 py-5 rounded-full font-black uppercase text-sm tracking-widest shadow-2xl">Get a Free Estimate</button>
          </div>
        </div>
      </div>
    );
  };

  const renderServiceCityPage = (id: string) => {
    const data = PAGES[id];
    if (!data) return renderHome();
    return (
      <div className="animate-fadeIn">
        <header className="bg-slate-900 text-white py-24 px-6 border-b border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-4">{data.h1}</h1>
            <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px]">Serving {data.h1.split(' in ')[1]} & Central Texas</p>
          </div>
        </header>
        <div className="max-w-4xl mx-auto py-24 px-6 prose max-w-none">
          <div className="mb-10 text-center lg:text-left not-prose">
              <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-xl">Get a Free Estimate</button>
          </div>

          <p className="text-xl leading-relaxed text-slate-900 font-semibold">{data.intro}</p>

          <h2>Driveway Service Overview</h2>
          <p className="text-slate-600 leading-relaxed">{data.overview}</p>

          <h2>Why Concrete Driveways Work Well in {data.h1.split(' in ')[1]}</h2>
          <p className="text-slate-600 leading-relaxed">{data.localContext}</p>

          <h2>EP Concrete Driveway Process</h2>
          <p className="text-slate-600 leading-relaxed">{data.process}</p>

          <h2>Common Driveway Projects in {data.h1.split(' in ')[1].replace(' TX', '')}</h2>
          <p className="text-slate-600 leading-relaxed">{data.examples}</p>

          <div className="bg-slate-900 text-white p-12 rounded-3xl not-prose text-center my-16 shadow-2xl border border-white/5">
             <h2 className="text-2xl font-black uppercase mb-4">Request Your {data.h1.split(' in ')[1].replace(' TX', '')} Estimate</h2>
             <p className="text-slate-400 mb-10 max-w-md mx-auto text-sm leading-relaxed">Professional concrete driveway paving services. Get your custom quote today.</p>
             <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-transform">
                    Get a Quote
                </button>
                <button onClick={() => navigate(`#service-areas/${data.locationSlug}`)} className="bg-white/10 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] border border-white/10">
                    {data.h1.split(' in ')[1].replace(' TX', '')} Area Info
                </button>
             </div>
          </div>

          <h2>Why Choose EP Concrete</h2>
          <p className="text-slate-600 leading-relaxed">{data.whyEP}</p>

          <h2>Pricing Factors</h2>
          <p className="text-slate-600 leading-relaxed">{data.pricingFactors}</p>

          <h2>Related Resources</h2>
          <p className="text-slate-600 mb-12">Learn more about our core <button onClick={() => navigate(`#services/${data.serviceLink}`)} className="text-orange-600 font-bold underline">Concrete Driveway Services</button> or explore our full <button onClick={() => navigate('#services')} className="text-orange-600 font-bold underline">Services Hub</button>.</p>

          <h2>Frequently Asked Questions</h2>
          <div className="not-prose space-y-4">
             {data.faq.map((f: any) => (
               <div key={f.q} className="bg-white p-8 rounded-2xl border border-slate-200">
                 <h4 className="font-black text-sm mb-4 text-slate-900 uppercase tracking-tight">{f.q}</h4>
                 <p className="text-slate-600 leading-relaxed text-sm">{f.a}</p>
               </div>
             ))}
          </div>

          <div className="mt-16 text-center not-prose">
              <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-12 py-5 rounded-full font-black uppercase text-sm tracking-widest shadow-2xl">Get a Free Estimate</button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (currentPath === '#home') return renderHome();
    if (currentPath === '#about') return renderAbout();
    if (currentPath === '#contact') return renderContact();
    if (currentPath === '#services') return (
      <div className="animate-fadeIn py-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-5xl font-black uppercase mb-6 text-center">{PAGES['services-hub'].h1}</h1>
        <p className="text-slate-500 text-center text-xl max-w-3xl mx-auto mb-20">{PAGES['services-hub'].intro}</p>
        
        <div className="mb-20 text-center">
            <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg shadow-orange-600/20">Get a Free Estimate</button>
        </div>

        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-black uppercase border-b-4 border-orange-600 pb-2">Residential Concrete Services</h2>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESIDENTIAL_SERVICES.map(s => (
              <div key={s.id} onClick={() => navigate(`#services/${s.id}`)} className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-orange-600 hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-3xl text-orange-600 mb-4">{s.icon}</span>
                <h3 className="font-black uppercase text-[10px] mb-3">{s.name}</h3>
                <p className="text-slate-500 text-[10px] leading-relaxed mb-6">{s.summary}</p>
                <span className="text-orange-600 text-[9px] font-black uppercase tracking-widest mt-auto">View Service Page &rarr;</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-black uppercase border-b-4 border-slate-900 pb-2">Commercial Concrete Services</h2>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMERCIAL_SERVICES.map(s => (
              <div key={s.id} onClick={() => navigate(`#services/${s.id}`)} className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-orange-600 hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-3xl text-slate-900 mb-4">{s.icon}</span>
                <h3 className="font-black uppercase text-[10px] mb-3">{s.name}</h3>
                <p className="text-slate-500 text-[10px] leading-relaxed mb-6">{s.summary}</p>
                <span className="text-orange-600 text-[9px] font-black uppercase tracking-widest mt-auto">View Service Page &rarr;</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-100 p-12 rounded-3xl text-center border border-slate-200">
           <h3 className="text-2xl font-black uppercase mb-4">Master Quote Request</h3>
           <p className="text-slate-600 mb-8 max-w-md mx-auto text-sm leading-relaxed">EP Concrete provides professional residential and commercial paving across the entire Central Texas region. We explicitly list all services for absolute transparency.</p>
           <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg shadow-orange-600/20">Get a Free Estimate</button>
        </div>
      </div>
    );

    if (currentPath === '#concrete-driveways-round-rock-tx') return renderServiceCityPage('concrete-driveways-round-rock-tx');
    if (currentPath === '#concrete-driveways-cedar-park-tx') return renderServiceCityPage('concrete-driveways-cedar-park-tx');

    const locMatch = LOCATIONS.find(l => `#service-areas/${l.slug}` === currentPath);
    if (locMatch) return renderServiceArea(locMatch.id);
    
    if (currentPath.startsWith('#services/')) return renderServiceDetail(currentPath.replace('#services/', ''));
    
    return renderHome();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('#home')}>
            <span className="material-symbols-outlined text-orange-600 text-4xl font-black">foundation</span>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tighter uppercase shrink-0">EP Concrete</span>
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Central Texas Concrete Specialists</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center justify-center flex-grow">
            <a href={`tel:${BUSINESS_DETAILS.phone}`} className="flex items-center gap-2 text-slate-900 group">
              <span className="material-symbols-outlined text-orange-600 text-2xl group-hover:scale-110 transition-transform">call</span>
              <span className="text-2xl font-black tracking-tighter">{BUSINESS_DETAILS.phone}</span>
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <button onClick={() => navigate('#services')} className="text-[10px] font-black uppercase tracking-widest hover:text-orange-600 transition-colors">Services</button>
            <button onClick={() => navigate('#about')} className="text-[10px] font-black uppercase tracking-widest hover:text-orange-600 transition-colors">About Us</button>
            <button onClick={() => navigate('#contact')} className="text-[10px] font-black uppercase tracking-widest hover:text-orange-600 transition-colors">Contact</button>
            <button onClick={() => navigate('#contact')} className="bg-orange-600 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-orange-600/20">Get a Quote</button>
          </div>
          
          <button 
            className="lg:hidden text-slate-900 p-2"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>

      <main className="flex-grow">{renderContent()}</main>

      <footer className="bg-slate-950 text-white py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <span className="material-symbols-outlined text-orange-600 text-4xl font-black">foundation</span>
                <span className="text-3xl font-black tracking-tighter uppercase">EP Concrete</span>
              </div>
              <p className="text-slate-400 max-w-md text-[11px] leading-relaxed mb-8 font-medium">Professional concrete contractor in Austin TX. We specialize in high-standard engineering for residential driveways, decorative patios, and industrial commercial flatwork across Central Texas.</p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-slate-300">
                  <span className="material-symbols-outlined text-orange-600 text-sm mt-1">location_on</span>
                  <div className="flex flex-col leading-none">
                    <span className="text-[9px] uppercase font-black text-white tracking-widest mb-2">Office Location</span>
                    <span className="font-bold text-[10px]">{BUSINESS_DETAILS.address}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <span className="material-symbols-outlined text-orange-600 text-sm mt-1">call</span>
                  <div className="flex flex-col leading-none">
                    <span className="text-[9px] uppercase font-black text-white tracking-widest mb-2">Call Estimates</span>
                    <span className="font-bold text-sm tracking-tight">{BUSINESS_DETAILS.phone}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <span className="material-symbols-outlined text-orange-600 text-sm mt-1">email</span>
                  <div className="flex flex-col leading-none">
                    <span className="text-[9px] uppercase font-black text-white tracking-widest mb-2">Email Us</span>
                    <span className="font-bold text-sm tracking-tight">{BUSINESS_DETAILS.email}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-black uppercase mb-8 tracking-widest text-[10px] text-orange-600">Company</h4>
              <ul className="space-y-4 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                <li><button onClick={() => navigate('#services')}>Services Hub</button></li>
                <li><button onClick={() => navigate('#about')}>About Us</button></li>
                <li><button onClick={() => navigate('#contact')}>Contact</button></li>
                <li><button onClick={() => navigate('#contact')}>Get a Quote</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase mb-8 tracking-widest text-[10px] text-orange-600">Service Area</h4>
              <ul className="space-y-4 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                <li><button onClick={() => navigate(`#service-areas/austin-tx-concrete-contractor`)}>Austin TX</button></li>
                <li><button onClick={() => navigate(`#service-areas/round-rock-tx-concrete-contractor`)}>Round Rock TX</button></li>
                <li><button onClick={() => navigate(`#service-areas/cedar-park-tx-concrete-contractor`)}>Cedar Park TX</button></li>
                <li><button onClick={() => navigate(`#service-areas/georgetown-tx-concrete-contractor`)}>Georgetown TX</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="text-slate-500 text-[9px] font-black uppercase tracking-widest">
               &copy; 2024 EP Concrete. Structural Paving Excellence in Central Texas.
             </div>
             <div className="flex gap-8">
                <button onClick={() => navigate('#contact')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Privacy Policy</button>
                <button onClick={() => navigate('#contact')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Terms & Pricing</button>
             </div>
          </div>
        </div>
      </footer>
      <QuoteModal />
      <MobileMenu />
    </div>
  );
};

export default App;
