// src/styles/theme.ts

export const theme = {
    colors: {
      primary: {
        light: '#4C51BF', // indigo-600
        main: '#3730A3',  // indigo-700
        dark: '#312E81',  // indigo-900
      },
      secondary: {
        light: '#9CA3AF', // gray-400
        main: '#6B7280',  // gray-500
        dark: '#4B5563',  // gray-600
      },
      background: {
        default: '#F3F4F6', // gray-100
        paper: '#FFFFFF',   // white
      },
      text: {
        primary: '#1F2937',   // gray-800
        secondary: '#4B5563', // gray-600
      },
      error: {
        main: '#DC2626', // red-600
      },
      warning: {
        main: '#D97706', // yellow-600
      },
      info: {
        main: '#2563EB', // blue-600
      },
      success: {
        main: '#059669', // green-600
      },
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem',// 30px
        '4xl': '2.25rem', // 36px
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.25rem',  // 4px
      sm: '0.5rem',   // 8px
      md: '1rem',     // 16px
      lg: '1.5rem',   // 24px
      xl: '2rem',     // 32px
      '2xl': '2.5rem',// 40px
      '3xl': '3rem',  // 48px
    },
    borderRadius: {
      sm: '0.125rem', // 2px
      md: '0.25rem',  // 4px
      lg: '0.5rem',   // 8px
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  };
  
  // Utility type for accessing theme values with TypeScript support
  export type Theme = typeof theme;