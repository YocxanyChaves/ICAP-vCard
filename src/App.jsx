import { useState } from 'react';
import Brochure from './Brochure';
import DeviceFrame from './components/DeviceFrame';
import { defaultContact } from './components/VCardDownload';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './theme/ThemeContext';
import './styles/global.css';

function App() {
  // 'full' = responsive normal (ocupa toda la ventana)
  // 'mobile' = la app se renderiza dentro de un <iframe> con ancho de celular,
  // así los breakpoints "sm:" de Tailwind se evalúan de verdad contra 390px.
  const [viewMode, setViewMode] = useState('full');

  const app = (
    <Brochure contact={defaultContact} viewMode={viewMode} onSetViewMode={setViewMode} />
  );

  // Un solo par de Providers alcanza para ambos modos de vista: el contexto
  // llega al iframe de "Vista Móvil" a través del createPortal de
  // DeviceFrame. La clase `dark` se aplica dentro de Brochure.jsx para que
  // también quede dentro del iframe.
  if (viewMode === 'mobile') {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-[#001F3D] flex items-center justify-center py-8 px-4">
            <div className="rounded-[2.5rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden" style={{ width: 402, height: 844 }}>
              <div className="rounded-[2rem] overflow-hidden w-full h-full">
                <DeviceFrame width={390} height={844}>
                  {app}
                </DeviceFrame>
              </div>
            </div>
          </div>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-[#001F3D] text-slate-800">
          {app}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
