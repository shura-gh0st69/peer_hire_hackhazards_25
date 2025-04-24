import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		fontFamily: {
			'poppins': ['Poppins', 'sans-serif'],
			'lato': ['Lato', 'sans-serif'],
			'inter': ['Inter', 'sans-serif'],
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#0052FF', // Base-inspired blue
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#003087', // Dark blue
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#F97316', // Grok-inspired orange
					foreground: '#FFFFFF',
					soft: 'rgba(249, 115, 22, 0.1)', // 10% opacity
					muted: 'rgba(249, 115, 22, 0.2)', // 20% opacity
					subtle: 'rgba(249, 115, 22, 0.05)', // 5% opacity
					light: 'rgba(249, 115, 22, 0.15)', // 15% opacity
				},
				success: {
					DEFAULT: '#10B981', // Screenpipe-inspired green
					foreground: '#FFFFFF',
					soft: 'rgba(16, 185, 129, 0.1)', // 10% opacity
					muted: 'rgba(16, 185, 129, 0.2)', // 20% opacity
					subtle: 'rgba(16, 185, 129, 0.05)', // 5% opacity
					light: 'rgba(16, 185, 129, 0.15)', // 15% opacity
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#222222'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
		
			
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
