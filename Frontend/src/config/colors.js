// Professional E-commerce Color Theme Configuration
// Modern, aesthetic color palette for NeedCart

export const colors = {
  // Primary Brand Colors - Deep Teal/Emerald (Trust & Sophistication)
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',  // Main primary
    600: '#059669',  // Hover state
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  
  // Secondary Colors - Coral/Rose (Warmth & Engagement)
  secondary: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',  // Main secondary
    600: '#e11d48',  // Hover state
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  
  // Accent Colors - Amber (Call-to-Action & Highlights)
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Main accent
    600: '#d97706',  // Hover state
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Neutral Colors - Sophisticated Grays
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Success, Warning, Error States
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    secondary: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    accent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    hero: 'linear-gradient(135deg, #047857 0%, #10b981 50%, #34d399 100%)',
    card: 'linear-gradient(to bottom right, #f9fafb 0%, #ffffff 100%)',
  }
};

// Tailwind-compatible class names (for easy reference)
export const tailwindColors = {
  primary: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    text: 'text-emerald-500',
    textHover: 'hover:text-emerald-600',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500',
  },
  secondary: {
    bg: 'bg-rose-500',
    bgHover: 'hover:bg-rose-600',
    text: 'text-rose-500',
    textHover: 'hover:text-rose-600',
    border: 'border-rose-500',
    ring: 'ring-rose-500',
  },
  accent: {
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-600',
    text: 'text-amber-500',
    textHover: 'hover:text-amber-600',
    border: 'border-amber-500',
    ring: 'ring-amber-500',
  }
};

export default colors;
