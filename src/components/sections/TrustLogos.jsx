import './TrustLogos.css';

const TrustLogos = () => {
  const logos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", alt: "Microsoft" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", alt: "Google" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg", alt: "Supabase" },
  ];

  return (
    <section className="trust-logos">
      <div className="trust-logos-wrapper">
        <div className="trust-logos-container">
          {/* Multiple sets for completely seamless infinite loop */}
          {logos.map((logo, index) => (
            <img 
              key={`logo-1-${index}`}
              src={logo.src} 
              alt={logo.alt} 
              className={logo.className ? `company-logo ${logo.className}` : "company-logo"} 
            />
          ))}
          {logos.map((logo, index) => (
            <img 
              key={`logo-2-${index}`}
              src={logo.src} 
              alt={logo.alt} 
              className={logo.className ? `company-logo ${logo.className}` : "company-logo"} 
            />
          ))}
          {logos.map((logo, index) => (
            <img 
              key={`logo-3-${index}`}
              src={logo.src} 
              alt={logo.alt} 
              className={logo.className ? `company-logo ${logo.className}` : "company-logo"} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;
