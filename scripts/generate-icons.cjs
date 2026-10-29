const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const svgPath = path.join(__dirname, '../public/icon.svg');
const svg = fs.readFileSync(svgPath, 'utf8');

// 1. Render standard 512x512
const resvg512 = new Resvg(svg, {
  fitTo: { mode: 'width', value: 512 },
});
const png512 = resvg512.render().asPng();
fs.writeFileSync(path.join(__dirname, '../public/pwa-512x512.png'), png512);

// 2. Render standard 192x192
const resvg192 = new Resvg(svg, {
  fitTo: { mode: 'width', value: 192 },
});
const png192 = resvg192.render().asPng();
fs.writeFileSync(path.join(__dirname, '../public/pwa-192x192.png'), png192);

// 3. Render Apple Touch Icon (180x180)
const resvg180 = new Resvg(svg, {
  fitTo: { mode: 'width', value: 180 },
});
const png180 = resvg180.render().asPng();
fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), png180);

// 4. Render Maskable Icon 512x512 with safe zone padding (15% padding)
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#0c0d18"/>
  <g transform="translate(64, 64) scale(0.75)">
    ${svg.replace(/<\?xml.*?\?>/i, '').replace(/<svg[^>]*>/i, '').replace(/<\/svg>/i, '')}
  </g>
</svg>
`;
const resvgMaskable = new Resvg(maskableSvg, {
  fitTo: { mode: 'width', value: 512 },
});
const pngMaskable = resvgMaskable.render().asPng();
fs.writeFileSync(path.join(__dirname, '../public/pwa-maskable-512x512.png'), pngMaskable);

// 5. Render OpenGraph / Social Share Card (1200x630)
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#08080c"/>
      <stop offset="50%" stop-color="#120c24"/>
      <stop offset="100%" stop-color="#090912"/>
    </linearGradient>
    <linearGradient id="ogTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)"/>
  <rect width="1180" height="610" x="10" y="10" rx="30" fill="none" stroke="#8b5cf6" stroke-opacity="0.25" stroke-width="2"/>

  <!-- Glow circle -->
  <circle cx="200" cy="315" r="220" fill="#7c3aed" opacity="0.2"/>

  <!-- Embedded Icon on left -->
  <g transform="translate(80, 155) scale(0.6)">
    ${svg.replace(/<\?xml.*?\?>/i, '').replace(/<svg[^>]*>/i, '').replace(/<\/svg>/i, '')}
  </g>

  <!-- Right text content -->
  <g transform="translate(440, 190)">
    <rect x="0" y="0" width="220" height="34" rx="17" fill="#7c3aed" fill-opacity="0.3" stroke="#a855f7" stroke-width="1.5"/>
    <text x="110" y="22" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="14" letter-spacing="2" fill="#c084fc">CATÁLOGO OFICIAL</text>
    
    <text x="0" y="90" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" fill="url(#ogTextGrad)">RICH PRO</text>
    <text x="0" y="140" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="28" fill="#e2e8f0">Cuentas &amp; Suscripciones Pro</text>
    
    <text x="0" y="195" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="20" fill="#94a3b8">Canva Pro Universitario S/ 5.00 · Gemini Pro 18 Meses · Cuentas IA</text>
    <text x="0" y="230" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="20" fill="#94a3b8">Garantía total y activación en minutos por WhatsApp</text>

    <!-- Badges -->
    <g transform="translate(0, 270)">
      <rect x="0" y="0" width="160" height="40" rx="10" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
      <text x="80" y="25" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14" fill="#a5b4fc">⚡ Entrega &lt; 5 min</text>

      <rect x="175" y="0" width="170" height="40" rx="10" fill="#14532d" fill-opacity="0.4" stroke="#22c55e" stroke-width="1.5"/>
      <text x="260" y="25" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14" fill="#86efac">🛡️ Garantía Total</text>

      <rect x="360" y="0" width="180" height="40" rx="10" fill="#581c87" fill-opacity="0.4" stroke="#c084fc" stroke-width="1.5"/>
      <text x="450" y="25" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14" fill="#f0abfc">🟣 Yape · Plin · BCP</text>
    </g>
  </g>
</svg>
`;
const resvgOg = new Resvg(ogSvg, {
  fitTo: { mode: 'width', value: 1200 },
});
const pngOg = resvgOg.render().asPng();
fs.writeFileSync(path.join(__dirname, '../public/og-image.png'), pngOg);

console.log('PWA and OG icons successfully generated in /public!');
