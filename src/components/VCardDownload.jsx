import React from 'react';
import { UserPlus, Download } from 'lucide-react';

/**
 * Default contact data for ICAP
 */
export const defaultContact = {
  firstName: 'Nombre',
  lastName: 'del Contacto',
  fullName: 'Nombre del Contacto',
  title: 'Cargo Institucional',
  org: 'Instituto Centroamericano de Administración Pública (ICAP)',
  phone: '+506 2234-8400',
  cellPhone: '+506 8888-8888',
  email: 'contacto@icap.ac.cr',
  url: 'https://icap.ac.cr',
  linkedin: 'https://linkedin.com/company/icap-sica',
  address: 'San Pedro, Montes de Oca, San José, Costa Rica',
  notes: 'Organismo internacional del Sistema de la Integración Centroamericana (SICA) especializado en administración pública.',
  // Marca este contacto como dato de ejemplo. Ponelo en false (o quitá el campo)
  // en cuanto cargues los datos reales de la persona de contacto.
  isSample: true
};

/**
 * Deja solo los dígitos de un teléfono, listo para armar un link wa.me
 * (ej. "+506 8888-8888" -> "50688888888"). Si no hay número, devuelve ''.
 */
export function whatsappDigits(phone) {
  return (phone || '').replace(/\D/g, '');
}

/**
 * Helper to generate and download a .vcf file
 */
export function downloadVCard(contact = defaultContact) {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${contact.lastName || ''};${contact.firstName || ''};;;`,
    `FN:${contact.fullName || `${contact.firstName} ${contact.lastName}`.trim()}`,
    `ORG:${contact.org || 'ICAP'}`,
    `TITLE:${contact.title || ''}`,
    `TEL;TYPE=CELL,VOICE:${contact.cellPhone || contact.phone || ''}`,
    `TEL;TYPE=WORK,VOICE:${contact.phone || ''}`,
    `EMAIL;TYPE=PREF,INTERNET:${contact.email || ''}`,
    `URL:${contact.url || 'https://icap.ac.cr'}`,
    `ADR;TYPE=WORK:;;${contact.address || 'San José, Costa Rica'};;;;`,
    `NOTE:${contact.notes || 'Contacto oficial ICAP'}`,
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${contact.fullName.replace(/\s+/g, '_')}_ICAP.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Reusable button for vCard download
 */
export default function VCardDownload({
  contact = defaultContact,
  className = '',
  variant = 'primary',
  children
}) {
  const handleDownload = (e) => {
    e.preventDefault();
    downloadVCard(contact);
  };

  if (variant === 'pill') {
    return (
      <button
        onClick={handleDownload}
        className={`flex items-center gap-3 h-14 rounded-full px-5 font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${className}`}
      >
        {children || (
          <>
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-black/10">VCF</span>
            <span className="flex-1 text-left">Guardar contacto</span>
            <Download className="w-4 h-4 opacity-70" />
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center justify-center gap-2 h-12 rounded-xl font-heading font-bold text-sm tracking-wide transition-all duration-200 shadow-md active:scale-[0.98] ${
        className || 'w-full bg-[#0077C8] hover:bg-[#005A96] text-white'
      }`}
    >
      {children || (
        <>
          <UserPlus className="w-4 h-4" />
          <span>GUARDAR CONTACTO</span>
        </>
      )}
    </button>
  );
}
