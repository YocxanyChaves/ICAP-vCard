import React, { useState } from 'react';
import Propuesta1 from './proposals/propuesta-1/Propuesta1';
import DeviceFrame from './components/DeviceFrame';
import { defaultContact } from './components/VCardDownload';
import './styles/global.css';

function App() {
  // 'full' = responsive normal (ocupa toda la ventana)
  // 'mobile' = la app se renderiza dentro de un <iframe> con ancho de celular,
  // así los breakpoints "sm:" de Tailwind se evalúan de verdad contra 390px.
  const [viewMode, setViewMode] = useState('full');

  const app = (
    <Propuesta1 contact={defaultContact} viewMode={viewMode} onSetViewMode={setViewMode} />
  );

  if (viewMode === 'mobile') {
    return (
      <div className="min-h-screen bg-[#001F3D] flex items-center justify-center py-8 px-4">
        <div className="rounded-[2.5rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden" style={{ width: 402, height: 844 }}>
          <div className="rounded-[2rem] overflow-hidden w-full h-full">
            <DeviceFrame width={390} height={844}>
              {app}
            </DeviceFrame>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001F3D] text-slate-800">
      {app}
    </div>
  );
}

export default App;
