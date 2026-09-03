import React, { useState } from 'react';
import Propuesta1 from './proposals/propuesta-1/Propuesta1';
import Propuesta2 from './proposals/propuesta-2/Propuesta2';
import Propuesta3 from './proposals/propuesta-3/Propuesta3';
import ProposalSwitcher from './components/ProposalSwitcher';
import DeviceFrame from './components/DeviceFrame';
import { defaultContact } from './components/VCardDownload';
import './styles/global.css';

function App() {
  const [currentProposal, setCurrentProposal] = useState(1);
  const [viewMode, setViewMode] = useState('full'); // 'full' | 'mobile'
  const [contact, setContact] = useState(defaultContact);

  const renderActiveProposal = () => {
    switch (currentProposal) {
      case 1:
        return <Propuesta1 contact={contact} />;
      case 2:
        return <Propuesta2 contact={contact} />;
      case 3:
        return <Propuesta3 contact={contact} />;
      default:
        return <Propuesta1 contact={contact} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#001F3D] text-slate-800 flex flex-col items-center">
      {/* View Container */}
      {viewMode === 'mobile' ? (
        <div className="py-8 sm:py-12 px-4 flex flex-col items-center w-full min-h-screen justify-center">
          {/* Phone Shell Frame — 390px de pantalla real + 12px de marco a cada lado */}
          <div
            className="relative bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/60 ring-1 ring-white/20 flex flex-col"
            style={{ width: 414, height: 'min(844px, 90vh)' }}
          >
            {/* Dynamic Island / Speaker notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 mr-2" />
              <div className="w-2 h-2 rounded-full bg-blue-950" />
            </div>

            {/* Screen Content: iframe real de 390px, no un div comprimido */}
            <div className="bg-white rounded-[38px] overflow-hidden shadow-inner relative flex-1 min-h-0">
              <DeviceFrame width={390} height="100%">
                {renderActiveProposal()}
              </DeviceFrame>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          {renderActiveProposal()}
        </div>
      )}

      {/* Floating Proposal Switcher */}
      <ProposalSwitcher
        currentProposal={currentProposal}
        setCurrentProposal={setCurrentProposal}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </div>
  );
}

export default App;
