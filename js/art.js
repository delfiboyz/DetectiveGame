// Ilustrasi semua layar, potret, dan ikon — digambar sebagai SVG agar game tidak butuh file gambar.
const ART = (() => {
  const wrap = (inner, defs = '') =>
    `<svg viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg" class="scene-svg"><defs>${defs}</defs>${inner}</svg>`;

  const vignette = (id, strength = 0.6) =>
    `<radialGradient id="${id}" cx="50%" cy="45%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${strength}"/></radialGradient>`;

  function rng(seed) {
    return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  }

  // Taburan bintik acak tapi selalu sama (seed tetap) di dalam elips.
  function speckles(seed, cx, cy, rx, ry, n, colors, rMax = 2.2) {
    const r = rng(seed);
    let o = '';
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r());
      const x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
      o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.6 + r() * rMax).toFixed(1)}" fill="${colors[i % colors.length]}"/>`;
    }
    return o;
  }

  // ---------- Tokoh ----------
  // Titik asal di tengah kaki; tinggi tokoh ±430 unit sebelum diskalakan.
  function person(o) {
    const W = o.stout ? 64 : 44;
    const g = [];
    if (o.sarong) {
      g.push(`<path d="M${-W} -170 L${W} -170 L${W - 6} 0 L${-W + 6} 0Z" fill="${o.sarong}"/>`);
      g.push(`<path d="M${-W + 8} -150 L${W - 8} -150 M${-W + 6} -110 L${W - 6} -110 M${-W + 4} -60 L${W - 4} -60" stroke="${o.sarongLine || '#2a1a10'}" stroke-width="5" opacity=".5"/>`);
    } else {
      g.push(`<rect x="-28" y="-178" width="24" height="176" rx="6" fill="${o.pants}"/>`);
      g.push(`<rect x="4" y="-178" width="24" height="176" rx="6" fill="${o.pants}"/>`);
    }
    g.push(`<ellipse cx="-17" cy="-3" rx="19" ry="7" fill="#1c120c"/><ellipse cx="17" cy="-3" rx="19" ry="7" fill="#1c120c"/>`);
    // badan
    g.push(`<path d="M${-W + 12} -332 Q0 -348 ${W - 12} -332 L${W} -168 Q0 -152 ${-W} -168 Z" fill="${o.coat}"/>`);
    if (o.buttons) for (let y = -320; y < -180; y += 28) g.push(`<circle cx="0" cy="${y}" r="3.5" fill="${o.buttons}"/>`);
    if (o.collar) g.push(`<path d="M-16 -340 L0 -318 L16 -340" stroke="${o.collar}" stroke-width="6" fill="none"/>`);
    if (o.lace) g.push(`<path d="M${-W + 14} -330 Q-8 -260 -4 -170 M${W - 14} -330 Q8 -260 4 -170" stroke="${o.lace}" stroke-width="5" fill="none" stroke-dasharray="4 4"/>`);
    // lengan
    g.push(`<path d="M${-W + 10} -326 Q${-W - 22} -262 ${-W - 10} -186" stroke="${o.coat}" stroke-width="24" stroke-linecap="round" fill="none"/>`);
    g.push(`<path d="M${W - 10} -326 Q${W + 22} -262 ${W + 10} -186" stroke="${o.coat}" stroke-width="24" stroke-linecap="round" fill="none"/>`);
    g.push(`<circle cx="${-W - 10}" cy="-178" r="12" fill="${o.skin}"/><circle cx="${W + 10}" cy="-178" r="12" fill="${o.skin}"/>`);
    // kepala
    g.push(`<rect x="-11" y="-356" width="22" height="28" fill="${o.skin}"/>`);
    const hr = o.stout ? 37 : 31;
    if (o.hair === 'bun') {
      g.push(`<circle cx="0" cy="-430" r="20" fill="${o.hairColor}"/>`);
      g.push(`<ellipse cx="0" cy="-392" rx="${hr + 4}" ry="42" fill="${o.hairColor}"/>`);
    }
    g.push(`<ellipse cx="${-hr}" cy="-384" rx="6" ry="9" fill="${o.skin}"/><ellipse cx="${hr}" cy="-384" rx="6" ry="9" fill="${o.skin}"/>`);
    g.push(`<ellipse cx="0" cy="-385" rx="${hr}" ry="38" fill="${o.skin}"/>`);
    if (o.hair === 'bun') g.push(`<path d="M${-hr} -392 Q0 -440 ${hr} -392 Q${hr - 6} -414 0 -418 Q${-hr + 6} -414 ${-hr} -392Z" fill="${o.hairColor}"/>`);
    if (o.cheeks) g.push(`<ellipse cx="-20" cy="-372" rx="9" ry="6" fill="#000" opacity=".08"/><ellipse cx="20" cy="-372" rx="9" ry="6" fill="#000" opacity=".08"/>`);
    g.push(`<path d="M-20 -398 Q-12 -403 -5 -399 M5 -399 Q12 -403 20 -398" stroke="#2a1a10" stroke-width="3" fill="none"/>`);
    g.push(`<circle cx="-12" cy="-388" r="3.2" fill="#1b110b"/><circle cx="12" cy="-388" r="3.2" fill="#1b110b"/>`);
    g.push(`<path d="M0 -386 L-3 -372 L3 -372" stroke="#00000033" stroke-width="2" fill="none"/>`);
    if (o.glasses) g.push(`<circle cx="-12" cy="-388" r="10" fill="#ffffff22" stroke="#3a2a1a" stroke-width="2"/><circle cx="12" cy="-388" r="10" fill="#ffffff22" stroke="#3a2a1a" stroke-width="2"/><line x1="-2" y1="-389" x2="2" y2="-389" stroke="#3a2a1a" stroke-width="2"/>`);
    if (o.mustache) g.push(`<path d="M-18 -366 Q0 -376 18 -366 Q8 -360 0 -364 Q-8 -360 -18 -366Z" fill="#2a1a10"/>`);
    g.push(`<path d="M-8 -358 Q0 -${o.frown ? 360 : 354} 8 -358" stroke="#5a2e1f" stroke-width="2.2" fill="none"/>`);
    if (o.hat === 'peci') g.push(`<path d="M-32 -404 L-29 -434 Q0 -442 29 -434 L32 -404 Q0 -410 -32 -404Z" fill="#141010"/><path d="M-30 -410 Q0 -416 30 -410" stroke="#2d2622" stroke-width="2" fill="none"/>`);
    return `<g transform="translate(${o.x} ${o.y}) scale(${o.s || 1})">${g.join('')}</g>`;
  }

  const LOOK = {
    darmawan: { skin: '#b9845a', coat: '#e9e2cf', pants: '#2e2a26', hat: 'peci', stout: true, mustache: true, buttons: '#b08d3a', cheeks: true },
    slamet: { skin: '#a8734c', coat: '#8c9aa1', pants: '#3b3a36', hat: 'peci', collar: '#6c7a80' },
    lim: { skin: '#e2b98f', coat: '#f1ebdc', sarong: '#7a4a2a', sarongLine: '#d9b26a', hair: 'bun', hairColor: '#cfcac4', glasses: true, lace: '#c9b99a' },
  };

  function portrait(id) {
    const bg = { darmawan: '#5a3c28', slamet: '#3d4a4c', lim: '#5b5240' }[id];
    const p = { ...LOOK[id], x: 160, y: 700, s: 1.45 };
    if (id === 'lim') p.y = 730;
    return `<svg viewBox="0 0 320 380" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="pg-${id}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs><rect width="320" height="380" fill="${bg}"/>${person(p)}<rect width="320" height="380" fill="url(#pg-${id})"/></svg>`;
  }

  // ---------- Toko jam ----------
  function toko(S) {
    const after = !!S.flags.tokoAfter;
    const defs = `
      <pattern id="tk-wp" width="48" height="64" patternUnits="userSpaceOnUse"><rect width="48" height="64" fill="#5f4130"/><rect width="24" height="64" fill="#664735"/><path d="M36 18 q7 14 0 28 q-7 -14 0 -28z" fill="#71503c"/></pattern>
      <linearGradient id="tk-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe3bf"/><stop offset="1" stop-color="#d2c39c"/></linearGradient>
      <linearGradient id="tk-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3f1ec" stop-opacity=".38"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#e3f1ec" stop-opacity=".28"/></linearGradient>
      <radialGradient id="tk-lamp" cx="50%" cy="5%" r="70%"><stop offset="0" stop-color="#ffd890" stop-opacity=".28"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></radialGradient>
      ${vignette('tk-vig')}`;
    let o = '';
    o += `<rect width="1280" height="470" fill="url(#tk-wp)"/>`;
    o += `<rect width="1280" height="24" fill="#3a2416"/><rect y="24" width="1280" height="6" fill="#8a6a3a"/>`;
    o += `<rect y="380" width="1280" height="92" fill="#3e2718"/><rect y="378" width="1280" height="6" fill="#6b4426"/>`;
    for (let x = 12; x < 1280; x += 120) o += `<rect x="${x}" y="394" width="100" height="64" fill="none" stroke="#2c1a0f" stroke-width="3"/>`;
    // lantai papan
    o += `<rect y="470" width="1280" height="250" fill="#5b3b25"/>`;
    for (let i = -10; i <= 26; i++) {
      const x = i * 80;
      o += `<line x1="${x}" y1="470" x2="${(640 + (x - 640) * 1.9).toFixed(0)}" y2="720" stroke="#45291a" stroke-width="2"/>`;
    }
    for (const y of [498, 534, 580, 640, 710]) o += `<line x1="0" y1="${y}" x2="1280" y2="${y}" stroke="#4a2d1b" stroke-width="1.5" opacity=".55"/>`;

    // jendela depan dengan jalan Pasar Baroe
    o += `<rect x="34" y="74" width="272" height="312" fill="#2e1c11"/>
      <rect x="46" y="86" width="248" height="288" fill="url(#tk-sky)"/>
      <path d="M46 250 L46 196 L92 196 L92 176 L150 176 L150 206 L210 206 L210 166 L294 166 L294 250Z" fill="#b9a37a"/>
      <rect x="60" y="210" width="20" height="26" fill="#8d7752"/><rect x="230" y="186" width="18" height="24" fill="#8d7752"/><rect x="260" y="186" width="18" height="24" fill="#8d7752"/>
      <rect x="46" y="250" width="248" height="124" fill="#a99268"/>
      <g stroke="#6d5638" fill="#6d5638"><circle cx="196" cy="334" r="22" fill="none" stroke-width="4"/><path d="M180 334 L212 334 M196 318 L196 350" stroke-width="2"/><rect x="166" y="292" width="62" height="30" stroke="none"/><path d="M226 300 L268 296 L274 316 L264 346 L259 320 L242 320 L238 346 L233 316Z" stroke="none"/><line x1="228" y1="306" x2="254" y2="300" stroke-width="3"/></g>
      <rect x="166" y="86" width="8" height="288" fill="#2e1c11"/><rect x="46" y="226" width="248" height="8" fill="#2e1c11"/>
      <text x="170" y="142" text-anchor="middle" transform="translate(340 0) scale(-1 1)" font-family="Georgia,serif" font-size="21" fill="#c9a24a" opacity=".85" letter-spacing="3">WAKTOE EMAS</text>
      <rect x="46" y="86" width="248" height="288" fill="url(#tk-glass)"/>
      <rect x="28" y="380" width="284" height="10" fill="#3a2416"/>`;

    // sapu (dan pengki setelah lantai disapu)
    o += `<line x1="326" y1="410" x2="346" y2="626" stroke="#8a6a3a" stroke-width="6" stroke-linecap="round"/>
      <path d="M332 610 L362 612 L374 672 L326 672Z" fill="#b89a5a"/><path d="M336 624 L340 670 M346 622 L350 670 M356 622 L362 670" stroke="#8c7442" stroke-width="2"/>`;
    if (after) {
      o += `<path d="M370 690 L438 676 L446 700 L374 704Z" fill="#6e6a5a"/><rect x="430" y="652" width="6" height="34" fill="#5a4a32" transform="rotate(20 433 669)"/>
        <ellipse cx="400" cy="690" rx="24" ry="7" fill="#b48a52"/>${speckles(31, 400, 688, 22, 6, 30, ['#c9a066', '#8f6a3a'], 1.4)}`;
    }

    // tempat sampah
    o += `<path d="M236 600 L286 600 L280 670 L242 670Z" fill="#6d5a3a"/><path d="M240 616 L283 616 M240 634 L282 634 M241 652 L281 652" stroke="#4e3f28" stroke-width="2"/><path d="M246 600 Q256 586 268 598 Q274 590 282 600" fill="#d6c9a8"/>`;

    // jam dinding berbandul
    o += `<g><rect x="358" y="56" width="84" height="282" rx="6" fill="#3b2213"/><path d="M350 62 Q400 18 450 62Z" fill="#3b2213"/>
      <circle cx="400" cy="108" r="32" fill="#c9a24a"/><circle cx="400" cy="108" r="27" fill="#efe6cc"/>
      ${[...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<line x1="${(400 + Math.sin(a) * 22).toFixed(1)}" y1="${(108 - Math.cos(a) * 22).toFixed(1)}" x2="${(400 + Math.sin(a) * 25).toFixed(1)}" y2="${(108 - Math.cos(a) * 25).toFixed(1)}" stroke="#3a2a1a" stroke-width="2"/>`; }).join('')}
      <line x1="400" y1="108" x2="389" y2="96" stroke="#222" stroke-width="3"/><line x1="400" y1="108" x2="414" y2="92" stroke="#222" stroke-width="2"/>
      <rect x="372" y="150" width="56" height="172" fill="#1e120a"/>
      <g><animateTransform attributeName="transform" type="rotate" values="-7 400 152;7 400 152;-7 400 152" dur="2s" repeatCount="indefinite"/><line x1="400" y1="152" x2="400" y2="284" stroke="#c9a24a" stroke-width="3"/><circle cx="400" cy="290" r="14" fill="#d8b25a"/></g></g>`;

    // kalender dinding
    o += `<g><circle cx="528" cy="94" r="3" fill="#222"/><rect x="482" y="100" width="92" height="132" fill="#efe6d0" stroke="#b9a885"/>
      <rect x="486" y="104" width="84" height="40" fill="#8aa383"/><path d="M486 144 L512 116 L528 128 L546 108 L570 144Z" fill="#5d7a5a"/>
      <text x="528" y="160" font-size="11" text-anchor="middle" fill="#9b2a1f" font-family="Georgia,serif" font-weight="bold">${after ? 'NOVEMBER' : 'OKTOBER'}</text>
      ${[...Array(35)].map((_, i) => `<rect x="${489 + (i % 7) * 12}" y="${168 + Math.floor(i / 7) * 12}" width="8" height="7" fill="#cfc3a6"/>`).join('')}
      ${after ? '' : '<circle cx="541" cy="219.5" r="7" fill="none" stroke="#c0392b" stroke-width="1.6"/>'}</g>`;

    // rak jam
    o += `<rect x="620" y="70" width="300" height="232" fill="#3a2315"/>`;
    for (const y of [142, 218, 294]) o += `<rect x="612" y="${y}" width="316" height="10" fill="#5c3a22"/>`;
    const shelfClocks = [[650, 118, 18], [700, 122, 14], [748, 112, 22], [806, 120, 16], [860, 116, 20], [660, 196, 16], [720, 190, 22], [790, 198, 14], [850, 192, 18], [890, 200, 12], [655, 272, 18], [712, 276, 14], [770, 266, 22], [835, 274, 16], [888, 270, 18]];
    for (const [x, y, r] of shelfClocks) o += `<circle cx="${x}" cy="${y}" r="${r + 3}" fill="#8b6a36"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ede3c8"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.7}" stroke="#333" stroke-width="1.5"/><line x1="${x}" y1="${y}" x2="${x + r * 0.5}" y2="${y}" stroke="#333" stroke-width="1.5"/>`;
    o += `<path d="M868 86 L896 66 L924 86Z" fill="#4e2e18"/>`;

    // poster dinding
    o += `<rect x="940" y="48" width="110" height="112" fill="#d9c79a" stroke="#7a5a2a" stroke-width="3"/><text x="995" y="78" font-family="Georgia,serif" font-size="15" text-anchor="middle" fill="#7a2a1a" font-weight="bold">PASAR</text><text x="995" y="98" font-family="Georgia,serif" font-size="15" text-anchor="middle" fill="#7a2a1a" font-weight="bold">GAMBIR</text><text x="995" y="122" font-family="Georgia,serif" font-size="13" text-anchor="middle" fill="#3a2a1a">1926</text><path d="M960 140 L1030 140" stroke="#7a2a1a" stroke-width="2"/>`;

    // pintu belakang
    o += `<rect x="1112" y="132" width="146" height="342" fill="#2c1a0f"/><rect x="1122" y="142" width="126" height="330" fill="#4d2f1c"/>
      <rect x="1140" y="160" width="90" height="120" fill="#cfc8a8" opacity=".55"/><rect x="1140" y="300" width="90" height="150" fill="none" stroke="#3a2315" stroke-width="4"/>
      <circle cx="1232" cy="322" r="7" fill="#c9a24a"/><rect x="1226" y="300" width="14" height="6" fill="#8a7040"/>`;

    // etalase
    o += `<rect x="378" y="430" width="334" height="132" fill="#4a2c18"/><rect x="392" y="446" width="142" height="100" fill="none" stroke="#2f1b0e" stroke-width="4"/><rect x="556" y="446" width="142" height="100" fill="none" stroke="#2f1b0e" stroke-width="4"/>
      <rect x="372" y="424" width="346" height="10" fill="#6b4426"/>
      <rect x="384" y="326" width="322" height="100" fill="#2a1a10" opacity=".35"/>
      <polygon points="388,424 702,424 692,398 398,398" fill="#6e1f24"/>
      ${[420, 452, 484, 612, 644, 676].map(x => `<circle cx="${x}" cy="410" r="7" fill="#d4b25a"/><circle cx="${x}" cy="410" r="4.5" fill="#f2ead2"/>`).join('')}
      <ellipse cx="545" cy="411" rx="34" ry="7" fill="#88353a"/>
      <rect x="384" y="326" width="322" height="100" fill="url(#tk-glass)" stroke="#c9a24a" stroke-width="3"/>
      <line x1="410" y1="332" x2="450" y2="420" stroke="#fff" stroke-width="2" opacity=".25"/><line x1="610" y1="332" x2="650" y2="420" stroke="#fff" stroke-width="2" opacity=".2"/>
      <rect x="540" y="388" width="10" height="8" fill="#c9a24a"/>
      <path d="M714 438 q7 0 7 7" stroke="#9a7a3a" stroke-width="2" fill="none"/>
      ${S.items.includes('kunci_etalase') ? '' : `<g transform="translate(720 446)"><circle cx="0" cy="4" r="4" fill="none" stroke="#d4b25a" stroke-width="2"/><rect x="-1.2" y="8" width="2.4" height="16" fill="#d4b25a"/><rect x="0" y="18" width="4" height="2" fill="#d4b25a"/><rect x="0" y="22" width="3" height="2" fill="#d4b25a"/></g>`}`;

    // debu dan jejak samar — hilang setelah lantai disapu
    if (!after) {
      o += `<ellipse cx="530" cy="602" rx="74" ry="13" fill="#9a7444" opacity=".22"/>${speckles(7, 530, 602, 74, 13, 90, ['#a88052', '#8a6236', '#b8925e'])}`;
      const r = rng(11);
      const pts = [[640, 606], [690, 600], [740, 608], [790, 600], [880, 604], [930, 598], [980, 604], [1030, 596], [1080, 590], [1120, 572], [1150, 548], [1170, 522], [1186, 498]];
      pts.forEach(([x, y], i) => {
        o += `<ellipse cx="${x}" cy="${y + (i % 2 ? -5 : 5)}" rx="${9 - i * 0.3}" ry="4" fill="#a88052" opacity="${(0.2 - i * 0.012 + r() * 0.03).toFixed(3)}" transform="rotate(${-8 - i * 3} ${x} ${y})"/>`;
      });
    }

    // Darmawan di balik meja kasir
    o += person({ ...LOOK.darmawan, x: 958, y: 494, s: 0.75 });
    o += `<rect x="872" y="372" width="236" height="16" fill="#6b4426"/><rect x="884" y="388" width="212" height="172" fill="#4a2c18"/>
      <rect x="900" y="402" width="180" height="40" fill="none" stroke="#2f1b0e" stroke-width="3"/><rect x="980" y="418" width="20" height="6" rx="2" fill="#c9a24a"/>
      <rect x="900" y="454" width="180" height="92" fill="none" stroke="#2f1b0e" stroke-width="3"/>
      <rect x="900" y="356" width="70" height="16" fill="#6a2a20"/><rect x="902" y="358" width="66" height="3" fill="#e6dcc0"/>
      <rect x="982" y="366" width="36" height="3.5" fill="#d9b44a"/><polygon points="1018,366 1024,368 1018,369.5" fill="#333"/>
      <path d="M1030 372 L1036 312 L1100 312 L1106 372Z" fill="#b08d3a"/><rect x="1040" y="296" width="56" height="20" fill="#c9a24a"/><rect x="1046" y="300" width="44" height="12" fill="#efe6cc"/>
      ${[0, 1, 2, 3].map(i => `<circle cx="${1046 + i * 14}" cy="332" r="4" fill="#3a2a1a"/><circle cx="${1046 + i * 14}" cy="348" r="4" fill="#3a2a1a"/>`).join('')}`;

    // Slamet
    o += person({ ...LOOK.slamet, x: 800, y: 640, s: 0.92 });

    // lampu gantung & pencahayaan
    o += `<line x1="640" y1="0" x2="640" y2="34" stroke="#222" stroke-width="2"/><path d="M608 34 L672 34 L658 60 L622 60Z" fill="#c9a24a"/><ellipse cx="640" cy="60" rx="18" ry="4" fill="#ffe7a8"/>`;
    o += `<rect width="1280" height="720" fill="url(#tk-lamp)"/><rect width="1280" height="720" fill="url(#tk-vig)"/>`;
    return wrap(o, defs);
  }

  // ---------- Close-up etalase ----------
  function etalase(S) {
    const after = !!S.flags.tokoAfter;
    const defs = `<linearGradient id="et-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3f1ec" stop-opacity=".3"/><stop offset=".5" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#e3f1ec" stop-opacity=".22"/></linearGradient>
      <linearGradient id="et-vel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a161b"/><stop offset="1" stop-color="#7a242a"/></linearGradient>${vignette('et-vig', .55)}`;
    let o = `<rect width="1280" height="720" fill="#4a3324"/><rect width="1280" height="80" fill="#5f4130"/>`;
    o += `<rect x="0" y="640" width="1280" height="80" fill="#5b3b25"/>`;
    for (let x = -40; x < 1300; x += 110) o += `<line x1="${x}" y1="640" x2="${x - 30}" y2="720" stroke="#45291a" stroke-width="3"/>`;
    // dasar kabinet
    o += `<rect x="140" y="430" width="1000" height="212" fill="#4a2c18"/><rect x="128" y="420" width="1024" height="20" fill="#6b4426"/>
      <rect x="170" y="470" width="440" height="150" fill="none" stroke="#2f1b0e" stroke-width="6"/><rect x="670" y="470" width="440" height="150" fill="none" stroke="#2f1b0e" stroke-width="6"/>
      <rect x="370" y="540" width="40" height="10" rx="3" fill="#c9a24a"/><rect x="870" y="540" width="40" height="10" rx="3" fill="#c9a24a"/>`;
    // ruang kaca
    o += `<rect x="170" y="90" width="940" height="332" fill="#1d120b"/>
      <polygon points="176,420 1104,420 1060,300 220,300" fill="url(#et-vel)"/>`;
    // jam-jam saku yang tidak diambil
    for (const [x, y] of [[270, 360], [340, 372], [410, 356], [870, 360], [940, 372], [1010, 356]]) {
      o += `<path d="M${x} ${y - 30} q0 -10 0 -12" stroke="#c9a24a" stroke-width="3"/><circle cx="${x}" cy="${y}" r="26" fill="#c9a24a"/><circle cx="${x}" cy="${y}" r="20" fill="#f2ead2"/><line x1="${x}" y1="${y}" x2="${x + 6}" y2="${y - 12}" stroke="#333" stroke-width="2"/><line x1="${x}" y1="${y}" x2="${x + 12}" y2="${y + 3}" stroke="#333" stroke-width="2"/>`;
    }
    // bekas bulat tempat De Zwaan berdiri
    o += `<ellipse cx="640" cy="378" rx="118" ry="28" fill="#93393f"/><ellipse cx="640" cy="378" rx="118" ry="28" fill="none" stroke="#a9484e" stroke-width="2" stroke-dasharray="3 5"/>`;
    o += speckles(3, 640, 340, 440, 60, 120, ['#ffffff22', '#ffffff18']);
    // kaca dan bingkai
    o += `<rect x="170" y="90" width="940" height="332" fill="url(#et-glass)" stroke="#c9a24a" stroke-width="6"/>
      <line x1="640" y1="90" x2="640" y2="422" stroke="#c9a24a" stroke-width="5"/>
      <line x1="230" y1="100" x2="330" y2="410" stroke="#fff" stroke-width="5" opacity=".14"/><line x1="760" y1="100" x2="860" y2="410" stroke="#fff" stroke-width="7" opacity=".1"/>
      <rect x="618" y="276" width="44" height="40" rx="4" fill="#b08d3a"/><circle cx="640" cy="292" r="6" fill="#2a1a0a"/><rect x="637" y="294" width="6" height="12" fill="#2a1a0a"/>`;
    // plakat kuningan
    o += `<rect x="540" y="438" width="200" height="34" rx="3" fill="#c9a24a" stroke="#8a6a2a" stroke-width="2"/><text x="640" y="460" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="#3a2a10" letter-spacing="2">DE ZWAAN · 1789</text>
      <path d="M552 462 q4 -10 10 -6 q-2 -6 4 -6 q-2 6 -6 8 q4 2 6 4 q-8 2 -14 0z" fill="#5a4214"/>`;
    // kait dan kunci
    o += `<path d="M1152 446 q16 0 16 16" stroke="#9a7a3a" stroke-width="5" fill="none"/>
      ${S.items.includes('kunci_etalase') ? '' : `<g transform="translate(1168 470)"><circle cx="0" cy="10" r="11" fill="none" stroke="#d4b25a" stroke-width="5"/><rect x="-3" y="20" width="6" height="58" fill="#d4b25a"/><rect x="1" y="58" width="12" height="5" fill="#d4b25a"/><rect x="1" y="68" width="9" height="5" fill="#d4b25a"/></g>`}`;
    // debu di lantai
    if (!after) o += `<ellipse cx="500" cy="684" rx="230" ry="26" fill="#9a7444" opacity=".2"/>${speckles(5, 500, 684, 230, 26, 220, ['#b08a58', '#8a6236', '#c49a62'], 3)}`;
    o += `<rect width="1280" height="720" fill="url(#et-vig)"/>`;
    return wrap(o, defs);
  }

  // ---------- Close-up kalender ----------
  function kalender(S) {
    const after = !!S.flags.tokoAfter;
    const month = after ? 'NOVEMBER 1926' : 'OKTOBER 1926';
    const first = after ? 1 : 5; // 1 Nov 1926 = Senin, 1 Okt 1926 = Jumat
    const days = after ? 30 : 31;
    let o = `<rect width="1280" height="720" fill="#5f4130"/><rect width="1280" height="720" fill="url(#kl-wp)"/>`;
    o += `<rect x="408" y="48" width="480" height="640" fill="#00000040" transform="translate(10 10)"/>`;
    o += `<rect x="400" y="40" width="480" height="640" fill="#efe6d0" stroke="#b9a885" stroke-width="2"/>`;
    if (after) o += `<path d="M400 40 l20 8 l18 -6 l22 7 l16 -6 l24 8 l20 -7 l18 6 l26 -8 l20 7 l22 -6 l18 6 l24 -7 l20 8 l18 -6 l22 7 l26 -8 l20 6 l22 -6 l20 7 l24 -6 l22 8 L880 40Z" fill="#d6cbb0"/>`;
    o += `<circle cx="640" cy="34" r="7" fill="#333"/>`;
    // gambar pemandangan
    o += `<rect x="430" y="70" width="420" height="190" fill="#9cb7c0"/><path d="M430 260 L540 130 L600 186 L680 96 L850 260Z" fill="#5d7a5a"/><path d="M660 116 L680 96 L700 116 Q680 110 660 116Z" fill="#eee"/>
      <path d="M430 232 Q520 214 610 236 T850 228 L850 260 L430 260Z" fill="#7d9a5a"/><path d="M450 250 h380 M470 240 h340" stroke="#5a7a3a" stroke-width="2"/>
      <text x="640" y="282" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#6a5a3a" font-style="italic">Hadiah Toko Obat "Panjang Oemoer"</text>`;
    o += `<text x="640" y="320" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#9b2a1f" font-weight="bold" letter-spacing="3">${month}</text>`;
    const hdr = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    hdr.forEach((h, c) => (o += `<text x="${460 + c * 60}" y="350" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="${c === 0 ? '#9b2a1f' : '#4a3a2a'}">${h}</text>`));
    for (let d = 1; d <= days; d++) {
      const idx = first + d - 1, c = idx % 7, r = Math.floor(idx / 7);
      const x = 430 + c * 60, y = 360 + r * 48;
      o += `<rect x="${x + 2}" y="${y + 2}" width="56" height="44" fill="none" stroke="#d8ccb0"/>`;
      o += `<text x="${x + 30}" y="${y + 31}" text-anchor="middle" font-family="Georgia,serif" font-size="20" fill="${c === 0 ? '#9b2a1f' : '#3a2a1a'}">${d}</text>`;
    }
    if (!after) {
      o += `<ellipse cx="700" cy="578" rx="25" ry="20" fill="none" stroke="#c0392b" stroke-width="2.5" transform="rotate(-6 700 578)"/><text x="716" y="604" font-family="'Special Elite',monospace" font-size="10" fill="#c0392b">J.T.</text>`;
    } else {
      // bekas tekanan pena dari lembar Oktober yang disobek
      o += `<ellipse cx="700" cy="578" rx="25" ry="20" fill="none" stroke="#a89878" stroke-width="1.4" opacity=".28" transform="rotate(-6 700 578)"/>`;
    }
    const defs = `<pattern id="kl-wp" width="48" height="64" patternUnits="userSpaceOnUse"><rect width="24" height="64" fill="#664735"/></pattern>`;
    return wrap(o, defs);
  }

  // ---------- Close-up meja kasir ----------
  function meja() {
    let o = `<rect width="1280" height="720" fill="#4a3324"/>`;
    o += `<polygon points="60,250 1220,250 1280,560 0,560" fill="#6b4426"/><polygon points="0,560 1280,560 1280,720 0,720" fill="#4a2c18"/>`;
    for (let i = 0; i < 9; i++) o += `<line x1="${100 + i * 130}" y1="250" x2="${40 + i * 150}" y2="560" stroke="#5a381f" stroke-width="2"/>`;
    // laci
    o += `<rect x="300" y="582" width="680" height="110" fill="#5a3820" stroke="#2f1b0e" stroke-width="5"/><rect x="600" y="626" width="80" height="16" rx="5" fill="#c9a24a"/>`;
    // mesin kasir
    o += `<path d="M820 430 L850 160 L1110 160 L1140 430Z" fill="#b08d3a"/><rect x="870" y="100" width="220" height="70" fill="#c9a24a"/><rect x="890" y="114" width="180" height="42" fill="#efe6cc"/>
      <text x="980" y="144" text-anchor="middle" font-family="'Special Elite',monospace" font-size="24" fill="#3a2a1a">f 0,00</text>
      ${[0, 1, 2, 3, 4].map(c => [0, 1, 2].map(r => `<circle cx="${890 + c * 45}" cy="${230 + r * 56}" r="15" fill="#3a2a1a"/><circle cx="${890 + c * 45}" cy="${226 + r * 56}" r="12" fill="#efe6cc"/>`).join('')).join('')}
      <rect x="1120" y="250" width="40" height="14" fill="#8a6a2a"/><circle cx="1170" cy="257" r="16" fill="#3a2a1a"/>`;
    // buku servis
    o += `<g transform="rotate(-6 330 410)"><rect x="200" y="340" width="270" height="170" rx="4" fill="#6a2a20"/><rect x="212" y="350" width="246" height="150" fill="none" stroke="#c9a24a" stroke-width="2"/>
      <text x="335" y="420" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#c9a24a" letter-spacing="2">BOEKOE</text><text x="335" y="450" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#c9a24a" letter-spacing="2">SERVIS</text>
      <rect x="470" y="346" width="10" height="160" fill="#e6dcc0"/></g>`;
    // pensil
    o += `<g transform="rotate(4 630 470)"><rect x="520" y="462" width="210" height="16" fill="#d9b44a"/><rect x="520" y="462" width="210" height="5" fill="#e8c860"/><polygon points="730,462 760,470 730,478" fill="#e8cfa0"/><polygon points="752,468 760,470 752,472" fill="#333"/><rect x="508" y="462" width="14" height="16" fill="#c06a6a"/></g>`;
    // bel dan nota
    o += `<ellipse cx="640" cy="372" rx="50" ry="12" fill="#5a4214"/><path d="M600 370 Q600 320 640 316 Q680 320 680 370Z" fill="#d4b25a"/><circle cx="640" cy="312" r="7" fill="#d4b25a"/>`;
    o += `<g transform="rotate(10 120 330)"><rect x="70" y="290" width="110" height="140" fill="#eadfc4"/><rect x="76" y="296" width="110" height="140" fill="#f3ead2"/>${[0, 1, 2, 3, 4, 5].map(i => `<line x1="86" y1="${316 + i * 18}" x2="${170 - (i % 3) * 14}" y2="${316 + i * 18}" stroke="#8a7a5a" stroke-width="2"/>`).join('')}<rect x="120" y="282" width="6" height="40" fill="#777"/></g>`;
    o += `<rect width="1280" height="720" fill="url(#mj-vig)"/>`;
    return wrap(o, vignette('mj-vig', .5));
  }

  // ---------- Isi laci meja kasir ----------
  function laciKasir(S) {
    let o = `<rect width="1280" height="720" fill="#2a1a10"/>`;
    o += `<polygon points="120,120 1160,120 1240,640 40,640" fill="#5a3820"/><polygon points="160,150 1120,150 1190,610 90,610" fill="#3a2414"/>`;
    o += `<polygon points="40,640 1240,640 1240,720 40,720" fill="#6b4426"/><rect x="600" y="664" width="80" height="16" rx="5" fill="#c9a24a"/>`;
    if (!S.items.includes('surat_bank')) {
      o += `<g transform="rotate(-5 540 345)"><rect x="380" y="250" width="320" height="190" fill="#e6dab8"/><path d="M380 250 L540 350 L700 250" stroke="#b8aa86" stroke-width="3" fill="none"/>
        <circle cx="620" cy="400" r="22" fill="none" stroke="#a03024" stroke-width="3"/><text x="620" y="405" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#a03024">BANK</text>
        <text x="420" y="410" font-family="'Special Elite',monospace" font-size="15" fill="#3a2a1a">Toean D. Soerjo</text></g>`;
    }
    // uang receh
    o += `${[[830, 380], [860, 400], [845, 352], [880, 370]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="13" fill="#b9a26a" stroke="#7a6a3a" stroke-width="2"/>`).join('')}`;
    // stempel dan tinta
    o += `<rect x="190" y="300" width="40" height="70" rx="6" fill="#4a2a1a"/><rect x="176" y="368" width="68" height="20" fill="#222"/><ellipse cx="260" cy="470" rx="50" ry="22" fill="#283040"/><ellipse cx="260" cy="466" rx="40" ry="14" fill="#1a1f2a"/>`;
    // benang dan obeng kecil
    o += `<path d="M900 520 q40 -20 80 0 q40 20 80 0" stroke="#c9b99a" stroke-width="4" fill="none"/><rect x="720" y="520" width="120" height="8" fill="#888" transform="rotate(-10 780 524)"/><rect x="690" y="514" width="40" height="18" rx="4" fill="#7a2a1a" transform="rotate(-10 710 523)"/>`;
    o += `<rect width="1280" height="720" fill="url(#lk-vig)"/>`;
    return wrap(o, vignette('lk-vig', .6));
  }

  // ---------- Bengkel di Gang Kenari ----------
  function bengkel() {
    const defs = `<pattern id="bk-brick" width="80" height="40" patternUnits="userSpaceOnUse"><rect width="80" height="40" fill="#3d2b20"/><rect x="2" y="2" width="76" height="16" fill="#4a3426"/><rect x="-38" y="22" width="76" height="16" fill="#4a3426"/><rect x="42" y="22" width="76" height="16" fill="#4a3426"/></pattern>
      <radialGradient id="bk-glow" cx="50%" cy="22%" r="55%"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".22"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>${vignette('bk-vig', .6)}`;
    let o = `<rect width="1280" height="480" fill="url(#bk-brick)"/><rect y="480" width="1280" height="240" fill="#4a3526"/>`;
    for (let i = 0; i < 14; i++) o += `<line x1="0" y1="${490 + i * 18}" x2="1280" y2="${490 + i * 18}" stroke="#3e2c1f" stroke-width="1" opacity=".5"/>`;
    // jendela berjeruji
    o += `<rect x="70" y="80" width="220" height="170" fill="#2a1d14"/><rect x="82" y="92" width="196" height="146" fill="#8d958c"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${100 + i * 40}" y="92" width="6" height="146" fill="#2a1d14"/>`).join('')}<rect x="64" y="248" width="232" height="10" fill="#2a1d14"/>`;
    // papan jati bersandar
    o += `${[[262, 0], [300, 4], [338, -3]].map(([x, r]) => `<rect x="${x}" y="170" width="34" height="440" fill="#9a6a3a" stroke="#6a4422" stroke-width="2" transform="rotate(${r + 6} ${x} 610)"/>`).join('')}`;
    // rak kotak jam setengah jadi
    o += `<rect x="940" y="110" width="290" height="10" fill="#5c3a22"/><rect x="940" y="210" width="290" height="10" fill="#5c3a22"/>
      ${[[955, 50, 60, 60], [1030, 60, 50, 50], [1095, 40, 70, 70], [1180, 66, 40, 44], [960, 150, 70, 60], [1050, 160, 50, 50], [1120, 140, 60, 70]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#a87642" stroke="#6a4422" stroke-width="3"/><circle cx="${x + w / 2}" cy="${y + h / 2}" r="${Math.min(w, h) / 3}" fill="#3a2414"/>`).join('')}`;
    // meja kerja
    o += `<rect x="360" y="356" width="560" height="26" fill="#7a5532"/><rect x="380" y="382" width="520" height="74" fill="#5e3f24"/>
      <rect x="560" y="396" width="160" height="46" fill="#4e331c" stroke="#2f1b0e" stroke-width="3"/><circle cx="640" cy="419" r="7" fill="#9a7a3a"/>
      <rect x="388" y="456" width="22" height="160" fill="#5e3f24"/><rect x="870" y="456" width="22" height="160" fill="#5e3f24"/>`;
    // gergaji, ragum, serutan kayu di atas meja
    o += `<path d="M430 350 L640 330 L644 348 L432 356Z" fill="#b8b8b0"/>${[...Array(20)].map((_, i) => `<path d="M${438 + i * 10} ${355 - i * 0.9} l5 5 l5 -5" fill="#9a9a90"/>`).join('')}<path d="M640 322 L700 318 Q712 340 696 356 L640 352Z" fill="#7a4a24"/><ellipse cx="672" cy="337" rx="10" ry="7" fill="#5e3f24"/>
      <rect x="820" y="318" width="60" height="40" fill="#3a3a3a"/><rect x="800" y="326" width="24" height="12" fill="#555"/><rect x="760" y="352" width="40" height="6" fill="#c8a066"/><path d="M740 352 q8 -10 16 0 q8 -10 16 0" stroke="#d8b076" stroke-width="3" fill="none"/>`;
    // tumpukan serbuk segar di bawah meja
    o += `<path d="M430 650 Q470 600 560 596 Q650 594 700 650Z" fill="#c8a066"/>${speckles(17, 565, 630, 130, 22, 160, ['#d8b076', '#b48a52', '#e2c08a'], 2.5)}`;
    // peti berterpal dengan gembok baru
    o += `<rect x="960" y="430" width="250" height="200" fill="#7a5532"/>${[0, 1, 2, 3].map(i => `<line x1="960" y1="${470 + i * 44}" x2="1210" y2="${470 + i * 44}" stroke="#5a3a1f" stroke-width="3"/>`).join('')}
      <path d="M950 440 Q1000 410 1085 420 Q1170 410 1220 440 L1214 500 Q1180 486 1150 506 Q1110 486 1070 504 Q1020 486 990 506 Q964 490 952 500Z" fill="#5f6a52"/>
      <rect x="1070" y="530" width="30" height="26" rx="4" fill="#e3e3dc" stroke="#9a9a90" stroke-width="2"/><path d="M1076 530 v-12 a9 9 0 0 1 18 0 v12" stroke="#d8d8d0" stroke-width="5" fill="none"/><circle cx="1085" cy="542" r="3" fill="#333"/>
      <path d="M1073 534 l8 -2" stroke="#fff" stroke-width="2" opacity=".8"/>`;
    // linggis berkarat
    o += `<path d="M1236 370 L1252 640 Q1256 654 1244 656" stroke="#6a4a36" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M1236 370 q-10 -6 -14 6" stroke="#6a4a36" stroke-width="8" fill="none"/>`;
    // lampu minyak gantung
    o += `<line x1="640" y1="0" x2="640" y2="112" stroke="#222" stroke-width="2"/><path d="M620 112 L660 112 L654 124 L626 124Z" fill="#8a7a5a"/><path d="M628 124 Q614 156 632 178 L648 178 Q666 156 652 124Z" fill="#e8e0c8" opacity=".55"/>
      <path d="M640 150 q-6 10 0 18 q6 -8 0 -18" fill="#ffb84a"/><rect x="622" y="178" width="36" height="22" rx="4" fill="#8a7a5a"/><rect x="624" y="190" width="32" height="6" fill="#3a2a1a" opacity=".6"/>`;
    o += `<rect width="1280" height="720" fill="url(#bk-glow)"/><rect width="1280" height="720" fill="url(#bk-vig)"/>`;
    return wrap(o, defs);
  }

  // ---------- Isi laci meja kerja bengkel ----------
  function laciBengkel(S) {
    let o = `<rect width="1280" height="720" fill="#1e140d"/><polygon points="100,110 1180,110 1250,640 30,640" fill="#4e331c"/><polygon points="140,140 1140,140 1200,610 80,610" fill="#2e1e12"/>`;
    o += `<polygon points="30,640 1250,640 1250,720 30,720" fill="#5e3f24"/><circle cx="640" cy="680" r="12" fill="#9a7a3a"/>`;
    if (!S.items.includes('polis')) {
      o += `<g transform="rotate(-4 370 330)"><rect x="200" y="200" width="340" height="260" fill="#ece2c6"/><rect x="200" y="200" width="340" height="44" fill="#2f4a5a"/><text x="370" y="228" text-anchor="middle" font-family="Georgia,serif" font-size="17" fill="#ece2c6" letter-spacing="2">JAVA WAARBORG</text>
        ${[0, 1, 2, 3, 4, 5, 6].map(i => `<line x1="224" y1="${272 + i * 24}" x2="${510 - (i % 3) * 30}" y2="${272 + i * 24}" stroke="#8a7a5a" stroke-width="2"/>`).join('')}<path d="M470 440 l20 30 l6 -24 l20 18 l-6 -34z" fill="#a03024"/><circle cx="480" cy="430" r="20" fill="#c0392b"/></g>`;
    }
    if (!S.items.includes('buku_kas')) {
      o += `<g transform="rotate(5 740 330)"><rect x="600" y="220" width="280" height="220" fill="#2f3a2a"/><rect x="612" y="230" width="256" height="200" fill="none" stroke="#c9a24a" stroke-width="2"/><text x="740" y="340" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#c9a24a">KAS</text></g>`;
    }
    if (!S.items.includes('surat_gagak')) {
      o += `<g transform="rotate(-8 1030 330)"><rect x="930" y="260" width="200" height="140" fill="#d8ccb0"/><path d="M930 260 L1030 330 L1130 260" stroke="#a89a7a" stroke-width="2" fill="none"/><circle cx="1030" cy="334" r="20" fill="#1a1a1a"/><path d="M1020 336 q6 -10 14 -8 l8 -4 l-4 6 q2 8 -8 10 z" fill="#4a4a4a"/></g>`;
    }
    o += `<rect x="250" y="520" width="150" height="10" fill="#888" transform="rotate(8 320 525)"/><rect x="200" y="510" width="54" height="24" rx="6" fill="#6a3a1a" transform="rotate(8 230 522)"/>`;
    o += `${[...Array(12)].map((_, i) => `<rect x="${760 + (i * 37) % 200}" y="${520 + (i * 23) % 60}" width="4" height="22" fill="#9a9a90" transform="rotate(${i * 31} ${762 + (i * 37) % 200} ${531 + (i * 23) % 60})"/>`).join('')}`;
    o += `<rect width="1280" height="720" fill="url(#lb-vig)"/>`;
    return wrap(o, vignette('lb-vig', .65));
  }

  // ---------- Teras rumah Nyonya Lim ----------
  function rumahLim() {
    const defs = `<pattern id="rl-tile" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="#c9bfa8"/><rect width="40" height="40" fill="#a8463a"/><rect x="40" y="40" width="40" height="40" fill="#a8463a"/></pattern>${vignette('rl-vig', .45)}`;
    let o = `<rect width="1280" height="500" fill="#ece4d0"/><rect y="0" width="1280" height="40" fill="#5a6a4a"/>`;
    o += `<polygon points="0,500 1280,500 1280,720 0,720" fill="url(#rl-tile)"/><rect y="496" width="1280" height="8" fill="#8a7a5a"/>`;
    // jendela berdaun hijau
    for (const x of [120, 900]) o += `<rect x="${x}" y="130" width="200" height="260" fill="#3a3024"/><rect x="${x - 60}" y="130" width="60" height="260" fill="#4a7a4a"/><rect x="${x + 200}" y="130" width="60" height="260" fill="#4a7a4a"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${x - 56}" y1="${146 + i * 30}" x2="${x - 4}" y2="${146 + i * 30}" stroke="#3a5a3a" stroke-width="3"/><line x1="${x + 204}" y1="${146 + i * 30}" x2="${x + 256}" y2="${146 + i * 30}" stroke="#3a5a3a" stroke-width="3"/>`).join('')}`;
    // pintu tengah dan bingkai foto
    o += `<rect x="520" y="110" width="240" height="390" fill="#6a4a2a"/><rect x="536" y="126" width="100" height="360" fill="#7a5a36"/><rect x="644" y="126" width="100" height="360" fill="#7a5a36"/>`;
    o += `<rect x="410" y="170" width="80" height="100" fill="#8a6a3a"/><rect x="418" y="178" width="64" height="84" fill="#d8ccb0"/>${[0, 1, 2].map(i => `<circle cx="${432 + i * 18}" cy="214" r="6" fill="#6a5a4a"/><rect x="${427 + i * 18}" y="222" width="10" height="20" fill="#6a5a4a"/>`).join('')}`;
    // pilar
    o += `<rect x="20" y="40" width="40" height="460" fill="#f6f1e4"/><rect x="1220" y="40" width="40" height="460" fill="#f6f1e4"/>`;
    // sangkar burung perkutut
    o += `<line x1="380" y1="40" x2="380" y2="80" stroke="#555" stroke-width="2"/><path d="M340 160 Q340 80 380 80 Q420 80 420 160Z" fill="none" stroke="#8a6a3a" stroke-width="3"/>${[-30, -15, 0, 15, 30].map(d => `<path d="M${380 + d} 160 Q${380 + d * 0.8} 100 380 80" stroke="#8a6a3a" stroke-width="1.5" fill="none"/>`).join('')}<rect x="336" y="158" width="88" height="8" fill="#6a4a2a"/><ellipse cx="380" cy="138" rx="13" ry="9" fill="#9a8a7a"/><circle cx="390" cy="132" r="6" fill="#9a8a7a"/><path d="M395 132 l6 1 l-6 2z" fill="#333"/>`;
    // pot palem
    for (const x of [100, 1160]) o += `<path d="M${x - 40} 600 L${x + 40} 600 L${x + 30} 680 L${x - 30} 680Z" fill="#a85a3a"/>${[-60, -30, 0, 30, 60].map(a => `<path d="M${x} 600 Q${x + a} ${520 - Math.abs(a) / 2} ${x + a * 1.6} ${560 + Math.abs(a) / 3}" stroke="#4a6a3a" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}`;
    // kursi rotan dan Nyonya Lim
    o += `<ellipse cx="640" cy="330" rx="120" ry="160" fill="#c8a46a"/><ellipse cx="640" cy="330" rx="100" ry="140" fill="#b8945a"/>${[...Array(8)].map((_, i) => `<ellipse cx="640" cy="330" rx="${100 - i * 12}" ry="${140 - i * 16}" fill="none" stroke="#a07c44" stroke-width="2"/>`).join('')}
      <rect x="540" y="470" width="200" height="40" fill="#c8a46a"/><rect x="550" y="510" width="14" height="110" fill="#a07c44"/><rect x="716" y="510" width="14" height="110" fill="#a07c44"/>`;
    o += person({ ...LOOK.lim, x: 640, y: 610, s: 0.8 });
    o += `<rect x="560" y="470" width="160" height="40" fill="#7a4a2a" opacity=".9"/>`;
    // meja kecil: teh dan jam saku
    o += `<ellipse cx="880" cy="500" rx="100" ry="24" fill="#6a4a2a"/><rect x="872" y="500" width="16" height="140" fill="#5a3a1f"/><ellipse cx="880" cy="640" rx="50" ry="10" fill="#5a3a1f"/>
      <path d="M820 470 L850 470 L846 494 L824 494Z" fill="#f2f0ea"/><ellipse cx="835" cy="496" rx="22" ry="5" fill="#e8e4da"/><path d="M850 476 q12 4 0 12" stroke="#f2f0ea" stroke-width="3" fill="none"/>
      <circle cx="910" cy="492" r="16" fill="#c0c0c0"/><circle cx="910" cy="492" r="12" fill="#f2ead2"/><path d="M910 476 v-6" stroke="#c0c0c0" stroke-width="3"/><path d="M910 470 q30 -6 40 14" stroke="#c0c0c0" stroke-width="1.5" fill="none"/>`;
    o += `<rect width="1280" height="720" fill="url(#rl-vig)"/>`;
    return wrap(o, defs);
  }

  // ---------- Peta ----------
  function peta() {
    let o = `<rect width="1280" height="720" fill="#d9c9a0"/>`;
    o += speckles(23, 640, 360, 700, 420, 400, ['#c9b88c', '#e4d6b0'], 3);
    o += `<path d="M180 0 Q240 160 210 300 Q180 440 260 560 Q320 650 300 720" stroke="#7d9ab0" stroke-width="26" fill="none" opacity=".8"/>
      <path d="M0 260 Q300 280 520 250 Q760 220 1280 260" stroke="#7d9ab0" stroke-width="12" fill="none" opacity=".7"/>
      <path d="M760 0 L790 720" stroke="#7d9ab0" stroke-width="10" fill="none" opacity=".6"/>`;
    o += `<g stroke="#a8956a" stroke-width="6" fill="none" opacity=".9"><path d="M0 420 L1280 440"/><path d="M420 0 L460 720"/><path d="M620 300 L1280 600"/><path d="M0 600 L640 560"/><path d="M1000 0 L960 720"/></g>`;
    o += `<g font-family="Georgia,serif" fill="#5a4a2a" font-style="italic" font-size="20" opacity=".8">
      <text x="230" y="120" transform="rotate(70 230 120)">Kali Tjiliwoeng</text><text x="980" y="246">Molenvliet</text>
      <text x="1110" y="690" font-size="18">→ Meester Cornelis</text><text x="40" y="60" font-size="34" font-style="normal" letter-spacing="6" fill="#4a3a1a">BATAVIA · 1926</text></g>`;
    o += `<g transform="translate(1160 110)"><circle r="44" fill="none" stroke="#6a5a3a" stroke-width="2"/><path d="M0 -40 L8 0 L0 40 L-8 0Z" fill="#6a5a3a"/><text y="-50" text-anchor="middle" font-family="Georgia" font-size="16" fill="#4a3a1a">U</text></g>`;
    o += `<rect x="12" y="12" width="1256" height="696" fill="none" stroke="#6a5a3a" stroke-width="4"/><rect x="22" y="22" width="1236" height="676" fill="none" stroke="#6a5a3a" stroke-width="1.5"/>`;
    return wrap(o);
  }

  // ---------- Ikon barang (64×64) ----------
  const icon = (inner) => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const paper = (fill = '#efe6d0') => `<rect x="14" y="8" width="36" height="48" fill="${fill}" stroke="#8a7a5a" stroke-width="1.5"/>`;
  const lines = (n, y0 = 18, x2 = 44) => [...Array(n)].map((_, i) => `<line x1="20" y1="${y0 + i * 7}" x2="${x2 - (i % 2) * 6}" y2="${y0 + i * 7}" stroke="#8a7a5a" stroke-width="1.5"/>`).join('');
  const ICONS = {
    lup: icon(`<circle cx="26" cy="26" r="15" fill="#cfe3e0" fill-opacity=".5" stroke="#c9a24a" stroke-width="5"/><line x1="37" y1="37" x2="54" y2="54" stroke="#5a3a1f" stroke-width="8" stroke-linecap="round"/><path d="M19 20 q4 -5 10 -4" stroke="#fff" stroke-width="2" fill="none"/>`),
    bedak: icon(`<rect x="10" y="30" width="26" height="24" rx="3" fill="#b8b8b0"/><rect x="8" y="26" width="30" height="7" rx="2" fill="#6a6a62"/><rect x="40" y="10" width="6" height="30" fill="#7a4a24" transform="rotate(20 43 25)"/><path d="M44 38 q-4 12 4 16 q8 -4 4 -16z" fill="#2a2a2a" transform="rotate(20 48 46)"/>`),
    pensil: icon(`<g transform="rotate(-40 32 32)"><rect x="8" y="28" width="40" height="8" fill="#d9b44a"/><polygon points="48,28 58,32 48,36" fill="#e8cfa0"/><polygon points="55,31 58,32 55,33" fill="#333"/><rect x="4" y="28" width="5" height="8" fill="#c06a6a"/></g>`),
    sampel_debu: icon(`<path d="M10 22 L54 22 L50 50 L14 50Z" fill="#efe6d0" stroke="#8a7a5a" stroke-width="1.5"/>${speckles(41, 32, 38, 14, 7, 40, ['#9a7444', '#7a5a34'], 1.4)}`),
    serbuk_jati: icon(`<path d="M10 22 L54 22 L50 50 L14 50Z" fill="#efe6d0" stroke="#8a7a5a" stroke-width="1.5"/><path d="M18 46 Q32 28 46 46Z" fill="#c8a066"/>${speckles(43, 32, 40, 12, 6, 30, ['#e2c08a', '#b48a52'], 1.3)}`),
    kunci_etalase: icon(`<circle cx="20" cy="22" r="10" fill="none" stroke="#d4b25a" stroke-width="5"/><rect x="18" y="30" width="5" height="26" fill="#d4b25a"/><rect x="22" y="44" width="10" height="4" fill="#d4b25a"/><rect x="22" y="51" width="7" height="4" fill="#d4b25a"/>`),
    surat_bank: icon(`<rect x="6" y="16" width="52" height="34" fill="#e6dab8" stroke="#8a7a5a"/><path d="M6 16 L32 36 L58 16" stroke="#8a7a5a" stroke-width="1.5" fill="none"/><circle cx="46" cy="42" r="6" fill="none" stroke="#a03024" stroke-width="2"/>`),
    surat_glodok: icon(`${paper()}${lines(4)}<circle cx="40" cy="46" r="7" fill="none" stroke="#3a5a8a" stroke-width="2"/>`),
    struk_apotek: icon(`<path d="M20 6 L44 6 L44 58 L40 54 L36 58 L32 54 L28 58 L24 54 L20 58Z" fill="#f4f0e4" stroke="#8a7a5a" stroke-width="1.5"/>${lines(5, 14, 40).replace(/x1="20"/g, 'x1="24"')}<rect x="25" y="46" width="14" height="3" fill="#a03024"/>`),
    polis: icon(`${paper('#ece2c6')}<rect x="14" y="8" width="36" height="8" fill="#2f4a5a"/>${lines(4, 22)}<circle cx="42" cy="48" r="6" fill="#c0392b"/>`),
    buku_kas: icon(`<rect x="12" y="8" width="40" height="48" rx="2" fill="#2f3a2a"/><rect x="16" y="12" width="32" height="40" fill="none" stroke="#c9a24a" stroke-width="1.5"/><text x="32" y="38" font-size="10" text-anchor="middle" fill="#c9a24a" font-family="Georgia">KAS</text>`),
    surat_gagak: icon(`<rect x="6" y="16" width="52" height="34" fill="#d8ccb0" stroke="#8a7a5a"/><path d="M6 16 L32 36 L58 16" stroke="#8a7a5a" stroke-width="1.5" fill="none"/><circle cx="32" cy="38" r="8" fill="#1a1a1a"/><path d="M27 39 q3 -5 7 -4 l4 -2 l-2 3 q1 4 -4 5z" fill="#555"/>`),
    lembar_november: icon(`${paper()}<text x="32" y="22" font-size="7" text-anchor="middle" fill="#9b2a1f" font-family="Georgia" font-weight="bold">NOV</text>${[...Array(20)].map((_, i) => `<rect x="${18 + (i % 5) * 6}" y="${27 + Math.floor(i / 5) * 6}" width="4" height="4" fill="#cfc3a6"/>`).join('')}`),
    gosokan_kalender: icon(`${paper('#9a9890')}<ellipse cx="34" cy="32" rx="10" ry="8" fill="none" stroke="#efe6d0" stroke-width="2"/><text x="34" y="35" font-size="8" text-anchor="middle" fill="#efe6d0" font-family="Georgia">28</text><text x="32" y="50" font-size="6" text-anchor="middle" fill="#efe6d0" font-family="monospace">J.T. polis</text>`),
    note_fakta: icon(`<rect x="12" y="10" width="40" height="44" fill="#f2e8c8" stroke="#8a7a5a" stroke-width="1.5" transform="rotate(-4 32 32)"/><circle cx="32" cy="12" r="4" fill="#c0392b"/>${lines(4, 24)}`),
    note_kesaksian: icon(`<path d="M10 14 h44 v28 h-24 l-10 10 v-10 h-10z" fill="#e8eef0" stroke="#5a6a7a" stroke-width="1.5"/>${lines(3, 22, 46)}`),
  };

  return { toko, etalase, kalender, meja, laciKasir, bengkel, laciBengkel, rumahLim, peta, portrait, ICONS };
})();
