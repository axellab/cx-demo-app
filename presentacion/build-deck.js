/* Deck: Primax ID — 5 casos de uso. Paleta tomada de la marca real.
 *
 * Regenera Primax-ID-5-casos-de-uso.pptx. Las dependencias son de este script,
 * no de la app, así que van aparte para no ensuciar el package.json del proyecto:
 *
 *   npm i pptxgenjs sharp react-icons react react-dom
 *   node presentacion/build-deck.js
 *
 * Para cambiar textos o números, editá los arrays de cada slide más abajo.
 */
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const fa = require('react-icons/fa6');

const OUT = 'C:/Users/Axel/Documents/Axel/Repos Claude/cx-demo-app/Primax-ID-5-casos-de-uso.pptx';
const LOGO = 'C:/Users/Axel/Documents/Axel/Repos Claude/cx-demo-app/public/logo-wordmark.jpg';

const C = {
  card: '18215C',
  cardHoy: '241A4E',
  white: 'FFFFFF',
  muted: 'A9B2DC',
  dim: '7F8AC0',
  orange: 'F4610C',
  amber: 'FBA919',
  green: '3BD97A',
  warn: 'FF8A78',
};
const F = { body: 'Calibri', head: 'Calibri' };
const W = 13.333;
const M = 0.7;

/* ── helpers ─────────────────────────────────────────────── */
const shadow = () => ({ type: 'outer', color: '000000', blur: 14, offset: 4, angle: 90, opacity: 0.3 });

async function iconPng(Comp, color, px = 256) {
  let svg = renderToStaticMarkup(React.createElement(Comp, { size: px }));
  svg = svg.replace(/currentColor/g, '#' + color).replace(/ style="[^"]*"/g, '');
  const buf = await sharp(Buffer.from(svg)).resize(px, px).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

async function bgPng(glowX, glowY) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="1125">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0.75" y2="1">
        <stop offset="0%" stop-color="#131E76"/>
        <stop offset="52%" stop-color="#0B1350"/>
        <stop offset="100%" stop-color="#070B32"/>
      </linearGradient>
      <radialGradient id="glow" cx="${glowX}" cy="${glowY}" r="0.55">
        <stop offset="0%" stop-color="#F4610C" stop-opacity="0.40"/>
        <stop offset="60%" stop-color="#F4610C" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="#F4610C" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="2000" height="1125" fill="url(#g)"/>
    <rect width="2000" height="1125" fill="url(#glow)"/>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

function card(slide, { x, y, w, h, fill = C.card }) {
  slide.addShape('roundRect', {
    x, y, w, h,
    rectRadius: 0.14,
    fill: { color: fill },
    line: { color: 'FFFFFF', width: 0.6, transparency: 88 },
    shadow: shadow(),
  });
}

/** Ícono blanco dentro de un círculo de color — el motivo que se repite en todo el deck. */
function iconDot(slide, { x, y, d = 0.62, color, img }) {
  slide.addShape('ellipse', { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 } });
  slide.addImage({ data: img, x: x + d * 0.235, y: y + d * 0.235, w: d * 0.53, h: d * 0.53 });
}

function header(slide, n, title, sub) {
  slide.addText(`CASO DE USO ${n}`, {
    x: M, y: 0.5, w: 6, h: 0.3, fontFace: F.body, fontSize: 11.5, bold: true,
    color: C.amber, charSpacing: 2.4, margin: 0,
  });
  slide.addText(title, {
    x: M, y: 0.85, w: 10.2, h: 1.0, fontFace: F.head, fontSize: 33, bold: true,
    color: C.white, margin: 0, valign: 'top', lineSpacing: 38,
  });
  slide.addText(sub, {
    x: M, y: 1.87, w: 10.6, h: 0.34, fontFace: F.body, fontSize: 13.5,
    color: C.muted, margin: 0,
  });
  // Logo sobre tarjeta blanca, igual que en la pantalla de ingreso de la app.
  slide.addShape('roundRect', { x: 11.5, y: 0.5, w: 1.45, h: 0.72, rectRadius: 0.1, fill: { color: 'FFFFFF' } });
  slide.addImage({ path: LOGO, x: 11.61, y: 0.63, w: 1.23, h: 0.46 });
}

function footNote(slide, text) {
  slide.addText(text, {
    x: M, y: 6.73, w: W - M * 2, h: 0.45, fontFace: F.body, fontSize: 12, italic: true,
    color: C.dim, margin: 0,
  });
}

/* ── build ───────────────────────────────────────────────── */
(async () => {
  const ic = {
    fingerprint: await iconPng(fa.FaFingerprint, 'FFFFFF'),
    wallet: await iconPng(fa.FaWallet, 'FFFFFF'),
    qr: await iconPng(fa.FaQrcode, 'FFFFFF'),
    clock: await iconPng(fa.FaClockRotateLeft, 'FFFFFF'),
    gift: await iconPng(fa.FaGift, 'FFFFFF'),
    gamepad: await iconPng(fa.FaPuzzlePiece, 'FFFFFF'),
    camera: await iconPng(fa.FaCamera, 'FFFFFF'),
    route: await iconPng(fa.FaRoute, 'FFFFFF'),
    trophy: await iconPng(fa.FaTrophy, 'FFFFFF'),
    warn: await iconPng(fa.FaTriangleExclamation, C.warn),
    star: await iconPng(fa.FaStar, 'FFFFFF'),
    pump: await iconPng(fa.FaGasPump, 'FFFFFF'),
  };
  const bgA = await bgPng(0.88, 0.08);
  const bgB = await bgPng(0.1, 0.95);

  const p = new pptxgen();
  p.layout = 'LAYOUT_WIDE';
  p.author = 'Primax ID';
  p.title = 'Primax ID · 5 casos de uso';

  /* ══════════ 1 · Identidad única ══════════ */
  {
    const s = p.addSlide();
    s.background = { data: bgA };
    header(s, '01', 'Una sola identidad para todos sus programas',
      'Hoy el cliente hace malabares entre dos apps, tres portales y una tarjeta.');

    card(s, { x: M, y: 2.35, w: 6.0, h: 4.15, fill: C.cardHoy });
    iconDot(s, { x: M + 0.35, y: 2.68, d: 0.56, color: '3A2550', img: ic.warn });
    s.addText('HOY', {
      x: M + 1.05, y: 2.72, w: 2, h: 0.3, fontFace: F.body, fontSize: 12, bold: true,
      color: C.warn, charSpacing: 2, margin: 0,
    });
    s.addText('Cada programa en su propio canal', {
      x: M + 1.05, y: 3.0, w: 4.5, h: 0.28, fontFace: F.body, fontSize: 11.5, color: C.muted, margin: 0,
    });

    const hoy = [
      ['Bonus', 'app Bonus Perú'],
      ['Sellos LiSTO!', 'portal web propio'],
      ['Primax GO', 'app propia'],
      ['Convenio Primax Card', 'portal web propio'],
      ['Primax Gas', 'call center'],
      ['Lubricantes Shell', 'mostrador de la estación'],
    ];
    hoy.forEach(([a, b], i) => {
      const y = 3.62 + i * 0.42;
      s.addText(a, { x: M + 0.38, y, w: 3.1, h: 0.32, fontFace: F.body, fontSize: 12.5, bold: true, color: C.white, margin: 0 });
      s.addText(b, { x: M + 3.3, y, w: 2.4, h: 0.32, fontFace: F.body, fontSize: 11.5, color: C.dim, margin: 0, align: 'right' });
    });

    card(s, { x: 7.03, y: 2.35, w: 5.6, h: 4.15 });
    iconDot(s, { x: 7.38, y: 2.68, d: 0.56, color: C.orange, img: ic.fingerprint });
    s.addText('CON PRIMAX ID', {
      x: 8.08, y: 2.72, w: 3, h: 0.3, fontFace: F.body, fontSize: 12, bold: true,
      color: C.amber, charSpacing: 2, margin: 0,
    });
    s.addText('Un solo registro', {
      x: 8.08, y: 3.0, w: 4, h: 0.28, fontFace: F.body, fontSize: 11.5, color: C.muted, margin: 0,
    });
    s.addText('6', {
      x: 7.38, y: 3.55, w: 1.5, h: 1.0, fontFace: F.head, fontSize: 66, bold: true, color: C.white, margin: 0,
    });
    s.addText('programas vinculados\na una sola cuenta', {
      x: 8.75, y: 3.72, w: 3.5, h: 0.8, fontFace: F.body, fontSize: 13, color: C.muted, margin: 0, lineSpacing: 19,
    });
    s.addText(
      [
        { text: 'Ingreso con huella o Face ID, una sola vez.', options: { bullet: true, breakLine: true } },
        { text: 'El onboarding descubre lo que el cliente ya tiene y lo vincula.', options: { bullet: true, breakLine: true } },
        { text: 'No pierde nada de lo acumulado.', options: { bullet: true } },
      ],
      { x: 7.38, y: 4.75, w: 4.9, h: 1.5, fontFace: F.body, fontSize: 12.5, color: C.white, margin: 0, paraSpaceAfter: 8 },
    );

    footNote(s, 'El cliente ve su propio problema dibujado en pantalla — y resuelto en el mismo paso.');
    s.addNotes('Abrir la demo por acá. Mostrar la pantalla de onboarding: lista los seis programas con el canal donde viven hoy, y el botón "Unificar mis programas" los vincula en vivo.');
  }

  /* ══════════ 2 · Billetera unificada ══════════ */
  {
    const s = p.addSlide();
    s.background = { data: bgB };
    header(s, '02', 'Todo lo que tiene, en una sola cifra',
      'Por primera vez el cliente sabe cuánto vale lo que acumuló, sumando todos los programas.');

    card(s, { x: M, y: 2.35, w: 5.3, h: 4.15 });
    iconDot(s, { x: M + 0.4, y: 2.7, d: 0.62, color: C.orange, img: ic.wallet });
    s.addText('BILLETERA UNIFICADA', {
      x: M + 1.15, y: 2.82, w: 3.6, h: 0.3, fontFace: F.body, fontSize: 12, bold: true,
      color: C.amber, charSpacing: 2, margin: 0,
    });
    s.addText('S/ 17.90', {
      x: M + 0.4, y: 3.72, w: 4.6, h: 1.1, fontFace: F.head, fontSize: 62, bold: true, color: C.white, margin: 0,
    });
    s.addText('disponible ahora, entre tres programas distintos', {
      x: M + 0.4, y: 4.9, w: 4.4, h: 0.6, fontFace: F.body, fontSize: 13.5, color: C.muted, margin: 0, lineSpacing: 19,
    });
    s.addText('+ S/ 168.40 ahorrados en lo que va del año', {
      x: M + 0.4, y: 5.72, w: 4.5, h: 0.4, fontFace: F.body, fontSize: 13, bold: true, color: C.green, margin: 0,
    });

    const desglose = [
      ['1,240 pts Bonus', 'S/ 12.40', 'Canjeables o para pagar con BonusPaga'],
      ['5 de 5 sellos LiSTO!', 'S/ 5.50', 'Cupón desbloqueado, listo para usar'],
      ['Convenio activo', 'S/ 1.00 / gal', 'Descuento automático en cada carga'],
    ];
    desglose.forEach(([t, v, d], i) => {
      const y = 2.35 + i * 1.43;
      card(s, { x: 6.4, y, w: 6.23, h: 1.29 });
      s.addText(t, { x: 6.78, y: y + 0.2, w: 3.4, h: 0.34, fontFace: F.body, fontSize: 15, bold: true, color: C.white, margin: 0 });
      s.addText(v, { x: 10.1, y: y + 0.17, w: 2.2, h: 0.4, fontFace: F.head, fontSize: 20, bold: true, color: C.amber, margin: 0, align: 'right' });
      s.addText(d, { x: 6.78, y: y + 0.66, w: 5.5, h: 0.36, fontFace: F.body, fontSize: 12, color: C.dim, margin: 0 });
    });

    footNote(s, 'Hoy, para llegar a este mismo número, el cliente tendría que entrar a tres sitios con tres claves distintas.');
    s.addNotes('El número grande es la suma real: 1.240 puntos a S/0.01 más el cupón de sellos de S/5.50.');
  }

  /* ══════════ 3 · Un QR + motor de beneficios ══════════ */
  {
    const s = p.addSlide();
    s.background = { data: bgA };
    header(s, '03', 'Un solo código, y la mejor combinación calculada sola',
      'El mismo QR sirve en playa, tienda LiSTO! y Primax Gas. La app arma el mejor precio antes de pagar.');

    card(s, { x: M, y: 2.35, w: 6.55, h: 4.15 });
    iconDot(s, { x: M + 0.38, y: 2.68, d: 0.56, color: C.orange, img: ic.qr });
    s.addText('CARGA DE G-PREMIUM + CAFÉ Y SÁNDWICH EN LiSTO!', {
      x: M + 1.08, y: 2.78, w: 5.2, h: 0.36, fontFace: F.body, fontSize: 10.5, bold: true,
      color: C.amber, charSpacing: 1.2, margin: 0,
    });

    const filas = [
      ['Subtotal', 'S/ 138.50', C.white, false],
      ['Convenio Primax Card · S/ 1.00 × 5 gal', '− S/ 5.00', C.green, false],
      ['Cupón Sellos LiSTO!', '− S/ 5.50', C.green, false],
      ['BonusPaga · 1,240 puntos', '− S/ 12.40', C.green, false],
      ['Total a pagar', 'S/ 115.60', C.white, true],
    ];
    filas.forEach(([t, v, col, big], i) => {
      const y = 3.42 + i * 0.6;
      s.addText(t, {
        x: M + 0.4, y, w: 4.3, h: 0.4, fontFace: F.body, fontSize: big ? 15 : 13,
        bold: big, color: big ? C.white : C.muted, margin: 0,
      });
      s.addText(v, {
        x: 4.9, y: y - (big ? 0.06 : 0), w: 2.2, h: 0.44, fontFace: F.head,
        fontSize: big ? 21 : 14.5, bold: true, color: col, margin: 0, align: 'right',
      });
    });

    card(s, { x: 7.58, y: 2.35, w: 5.05, h: 2.35, fill: '113D2E' });
    s.addText('AHORRO EN UNA SOLA COMPRA', {
      x: 7.95, y: 2.62, w: 4.3, h: 0.3, fontFace: F.body, fontSize: 11, bold: true,
      color: C.green, charSpacing: 1.6, margin: 0,
    });
    s.addText('S/ 22.90', {
      x: 7.95, y: 3.0, w: 4.3, h: 0.95, fontFace: F.head, fontSize: 54, bold: true, color: C.white, margin: 0,
    });
    s.addText('17 % menos sobre S/ 138.50', {
      x: 7.95, y: 4.02, w: 4.3, h: 0.35, fontFace: F.body, fontSize: 13.5, color: 'A8E6C0', margin: 0,
    });

    card(s, { x: 7.58, y: 4.92, w: 5.05, h: 1.58 });
    iconDot(s, { x: 7.95, y: 5.2, d: 0.5, color: C.orange, img: ic.star });
    s.addText('Y con la misma compra suma', {
      x: 8.58, y: 5.28, w: 3.7, h: 0.3, fontFace: F.body, fontSize: 12.5, color: C.muted, margin: 0,
    });
    s.addText('+7 pts Bonus     +2 sellos LiSTO!', {
      x: 7.95, y: 5.85, w: 4.3, h: 0.4, fontFace: F.head, fontSize: 17, bold: true, color: C.amber, margin: 0,
    });

    footNote(s, 'Una transacción, tres programas actualizados al instante. Hoy son tres credenciales y tres canales separados.');
    s.addNotes('Momento clave de la demo. Mover el slider de puntos o apagar un beneficio recalcula todo en vivo, incluidos los sellos, que se duplican solo si se paga con Bonus.');
  }

  /* ══════════ 4 · Historial + canje sin mínimo ══════════ */
  {
    const s = p.addSlide();
    s.background = { data: bgB };
    header(s, '04', 'Una sola historia, y puntos que siempre sirven',
      'Todo lo que pasó con Primax en una línea de tiempo, y ningún saldo que quede inservible.');

    card(s, { x: M, y: 2.35, w: 5.95, h: 4.15 });
    iconDot(s, { x: M + 0.4, y: 2.7, d: 0.62, color: C.orange, img: ic.clock });
    s.addText('ACTIVIDAD UNIFICADA', {
      x: M + 1.15, y: 2.82, w: 4, h: 0.3, fontFace: F.body, fontSize: 12, bold: true,
      color: C.amber, charSpacing: 2, margin: 0,
    });
    s.addText('5', {
      x: M + 0.4, y: 3.45, w: 1.2, h: 0.95, fontFace: F.head, fontSize: 58, bold: true, color: C.white, margin: 0,
    });
    s.addText('programas en una\nsola vista', {
      x: M + 1.55, y: 3.62, w: 3.6, h: 0.7, fontFace: F.body, fontSize: 13, color: C.muted, margin: 0, lineSpacing: 19,
    });
    s.addText(
      [
        { text: 'Cada compra muestra qué programas se movieron y cuánto se ahorró.', options: { bullet: true, breakLine: true } },
        { text: 'Se filtra por programa sin salir de la pantalla.', options: { bullet: true, breakLine: true } },
        { text: 'Reemplaza tres consultas separadas a tres sistemas.', options: { bullet: true } },
      ],
      { x: M + 0.4, y: 4.62, w: 5.15, h: 1.7, fontFace: F.body, fontSize: 12.5, color: C.white, margin: 0, paraSpaceAfter: 9 },
    );

    card(s, { x: 6.98, y: 2.35, w: 5.65, h: 4.15 });
    iconDot(s, { x: 7.36, y: 2.7, d: 0.62, color: C.orange, img: ic.gift });
    s.addText('CANJE SIN MÍNIMO', {
      x: 8.11, y: 2.82, w: 4, h: 0.3, fontFace: F.body, fontSize: 12, bold: true,
      color: C.amber, charSpacing: 2, margin: 0,
    });
    s.addText('Desde 1 punto', {
      x: 7.36, y: 3.45, w: 4.9, h: 0.8, fontFace: F.head, fontSize: 40, bold: true, color: C.white, margin: 0,
    });
    s.addText('Cualquier saldo se convierte en descuento para la próxima compra.', {
      x: 7.36, y: 4.28, w: 4.9, h: 0.6, fontFace: F.body, fontSize: 13, color: C.muted, margin: 0, lineSpacing: 19,
    });
    s.addText(
      [
        { text: 'Se aplica solo al pagar, sin que el cliente haga nada.', options: { bullet: true, breakLine: true } },
        { text: 'Convive con el catálogo de premios de siempre.', options: { bullet: true } },
      ],
      { x: 7.36, y: 5.1, w: 4.9, h: 1.2, fontFace: F.body, fontSize: 12.5, color: C.white, margin: 0, paraSpaceAfter: 9 },
    );

    footNote(s, 'Resuelve al cliente que nunca llega al premio más barato del catálogo y termina sintiendo que sus puntos no sirven para nada.');
    s.addNotes('El canje sin mínimo se ve en Beneficios. Convierte el saldo en "saldo a favor" y aparece como una fila más en la pantalla de pago.');
  }

  /* ══════════ 5 · Gamificación ══════════ */
  {
    const s = p.addSlide();
    s.background = { data: bgA };
    header(s, '05', 'Mecánicas que hacen volver a la estación',
      'Premios chicos, límites diarios y retos de visita: más frecuencia sin comprometer el programa de puntos.');

    const items = [
      ['Memotest Primax', '+5 pts por día', 'Un juego de parejas para los más chicos, mientras la familia carga combustible. Límite de un premio diario.', ic.gamepad],
      ['Caza el logo Primax', '+100 pts', 'Realidad aumentada: apuntar la cámara al marcador en la estación desbloquea un bono.', ic.camera],
      ['Retos de visita', '+150 pts', 'Tres cargas antes del domingo, café antes de las 9 de la mañana, probar Primax Gas.', ic.route],
      ['Progresión de nivel', 'Oro → Platino', 'El nivel mejora con el consumo y desbloquea descuentos propios en Gas y lubricantes.', ic.trophy],
    ];
    items.forEach(([t, r, d, img], i) => {
      const x = i % 2 === 0 ? M : 6.98;
      const y = i < 2 ? 2.35 : 4.5;
      card(s, { x, y, w: 5.65, h: 1.95 });
      iconDot(s, { x: x + 0.38, y: y + 0.36, d: 0.6, color: C.orange, img });
      s.addText(t, { x: x + 1.12, y: y + 0.32, w: 2.3, h: 0.34, fontFace: F.body, fontSize: 15, bold: true, color: C.white, margin: 0 });
      s.addText(r, { x: x + 3.45, y: y + 0.32, w: 1.85, h: 0.34, fontFace: F.head, fontSize: 15, bold: true, color: C.amber, margin: 0, align: 'right' });
      s.addText(d, { x: x + 1.12, y: y + 0.78, w: 4.15, h: 0.95, fontFace: F.body, fontSize: 12, color: C.muted, margin: 0, lineSpacing: 17 });
    });

    footNote(s, 'El costo por punto entregado es bajo y está acotado por día — el retorno está en la visita, no en el premio.');
    s.addNotes('Cerrar la demo acá. El memotest se puede jugar en vivo en 30 segundos; el reto AR necesita el marcador impreso.');
  }

  await p.writeFile({ fileName: OUT });
  console.log('Escrito: ' + OUT);
})();
