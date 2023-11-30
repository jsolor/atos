/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '300px',
      // => @media (min-width: 300px) { ... }

      'sm': '460px',
      // => @media (min-width: 460px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  daisyui: {
    themes: [
      {
        mytheme: {
        
        "primary": "#000000",
                
        "secondary": "#424651",
                
        "accent": "#051014",
                
        "neutral": "#A4BEF3",
                
        "base-100": "#051014",
                
        "info": "#BCE7FD",
                
        "success": "#B0FF92",
                
        "warning": "#E09F3E",
                
        "error": "#540B0E",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}
