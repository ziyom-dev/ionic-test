import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: ['./app/**/*.{vue,js,ts}'],
  theme: { extend: {} },
  plugins: [],
}
