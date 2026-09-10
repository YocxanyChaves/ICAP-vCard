import { Home, Compass, Sparkles, Users, LayoutGrid, MapPinned, Phone } from 'lucide-react';

// Única fuente de verdad para las secciones del brochure — id, nombre e
// ícono. La usan tanto el menú inferior (Propuesta1.jsx) como el nuevo
// panel de accesos rápidos del Hero, para que ambos siempre muestren
// exactamente las mismas secciones, en el mismo orden, sin tener que
// mantener dos listas iguales por separado.
export const PAGES = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'mision', label: 'Misión', icon: Compass },
  { id: 'valores', label: 'Valores', icon: Sparkles },
  { id: 'autoridades', label: 'Autoridades', icon: Users },
  { id: 'areas', label: 'Áreas', icon: LayoutGrid },
  { id: 'presencia', label: 'Presencia', icon: MapPinned },
  { id: 'contacto', label: 'Contacto', icon: Phone }
];
