import { useEffect } from 'react';
import { WhatsAppFullscreen } from '../components/sections/WhatsAppDemo';

const WhatsAppDemoPage = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = 'OPTUS · Demo WhatsApp';
    return () => { document.title = prev; };
  }, []);

  return <WhatsAppFullscreen />;
};

export default WhatsAppDemoPage;
