import React, { useState } from 'react';
import Propuesta1 from './proposals/propuesta-1/Propuesta1';
import Propuesta2 from './proposals/propuesta-2/Propuesta2';
import Propuesta3 from './proposals/propuesta-3/Propuesta3';
import ProposalSwitcher from './components/ProposalSwitcher';
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
    <div className="min-h-screen bg-[#07192C] text-slate-800 flex flex-col items-center">
      {/* View Container */}
      {viewMode === 'mobile' ? (
        <div className="py-8 sm:py-12 px-4 flex flex-col items-center w-full min-h-screen justify-center">
          {/* Phone Shell Frame */}
          <div className="relative w-full max-w-[390px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/60 ring-1 ring-white/20">
            {/* Dynamic Island / Speaker notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 mr-2" />
              <div className="w-2 h-2 rounded-full bg-blue-950" />
            </div>

            {/* Screen Content */}
            <div className="w-full bg-white rounded-[38px] overflow-hidden overflow-y-auto max-h-[820px] shadow-inner relative">
              {renderActiveProposal()}
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
