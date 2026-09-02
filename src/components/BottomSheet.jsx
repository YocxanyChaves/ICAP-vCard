import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Mobile Bottom Sheet & Desktop Modal component
 */
export default function BottomSheet({ isOpen, onClose, title, subtitle, icon, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet / Modal Container */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[88vh] sm:max-h-[90vh] overflow-hidden animate-slide-up`}
      >
        {/* Mobile Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 sm:pt-6 flex items-start justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div>
              {subtitle && (
                <span className="text-[10px] sm:text-xs font-mono-code font-bold uppercase tracking-wider text-[#E8791E] block">
                  {subtitle}
                </span>
              )}
              {title && (
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#0B2A4A] leading-tight">
                  {title}
                </h3>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 -mr-2 -mt-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto overscroll-contain flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
