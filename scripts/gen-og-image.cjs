const sharp = require('sharp');
const fs = require('fs');
const w = 1200, h = 630;

const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fdf2f8"/>
      <stop offset="50%" stop-color="#fce7f3"/>
      <stop offset="100%" stop-color="#ffe4e6"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#db2777"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="1050" cy="100" r="200" fill="#fbcfe8" opacity="0.5"/>
  <circle cx="150" cy="530" r="150" fill="#fbcfe8" opacity="0.4"/>
  <circle cx="600" cy="630" r="250" fill="#fce7f3" opacity="0.3"/>
  <circle cx="100" cy="120" r="8" fill="#f472b6" opacity="0.7"/>
  <circle cx="130" cy="105" r="6" fill="#f9a8d4" opacity="0.6"/>
  <circle cx="1100" cy="500" r="10" fill="#f472b6" opacity="0.7"/>
  <circle cx="1070" cy="520" r="6" fill="#f9a8d4" opacity="0.6"/>
  <circle cx="950" cy="150" r="7" fill="#f472b6" opacity="0.5"/>
  <circle cx="300" cy="450" r="9" fill="#f9a8d4" opacity="0.5"/>
  <path d="M40 200 L40 130 L90 170 Z" fill="url(#accent)" opacity="0.3"/>
  <path d="M1160 200 L1160 130 L1110 170 Z" fill="url(#accent)" opacity="0.3"/>
  <text x="600" y="280" text-anchor="middle" font-family="sans-serif" font-size="72" font-weight="700" fill="#be185d">Hoeurb Vuthi</text>
  <text x="600" y="360" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="400" fill="#831843">Software Engineer &amp; CS Student</text>
  <line x1="420" y1="400" x2="780" y2="400" stroke="#f472b6" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
  <text x="600" y="450" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#a1507a" opacity="0.8">hoeurbvuthi.site</text>
  <rect x="0" y="590" width="${w}" height="40" fill="#ec4899" opacity="0.15"/>
  <text x="600" y="616" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#831843" opacity="0.6">Light Sakura Neko — Built with Astro</text>
</svg>`;

sharp(Buffer.from(svg)).png().toFile('public/og-image.png').then(() => {
  const size = fs.statSync('public/og-image.png').size;
  console.log(`og-image.png generated (${(size/1024).toFixed(1)} KiB)`);
}).catch(err => { console.error(err); process.exit(1); });