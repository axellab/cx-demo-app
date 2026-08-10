# Primax ID · Demo de experiencia unificada

Prototipo mobile-first para la sesión con **Primax (Perú)**. Muestra cómo se vería una única
experiencia para el cliente final: **una identidad, una billetera, un QR**.

Continúa el trabajo de [edeortuzar/CX-app](https://github.com/edeortuzar/CX-app) — se conservan el
concepto "ID Primax", los assets de marca y el módulo de realidad aumentada; se reconstruyó sobre
React para poder crecer.

---

## El problema que ataca la demo

Hoy los beneficios de Primax para el cliente final viven en silos:

| Programa | Dónde vive hoy | ¿Registro propio? |
| --- | --- | --- |
| **Bonus** (puntos, BonusPaga) | app *Bonus Perú* + `bonus.primax.com` | sí |
| **Sellos LiSTO!** | `selloslisto.primax.com` | sí |
| **Primax GO** (pago desde el celular) | app `primaxgo.com.pe` | sí |
| **Convenio / Primax Card** | `convenios.primax.com.pe` | sí |
| **Primax Gas** (GLP) | call center / distribuidor | sin canal digital |
| **Lubricantes Shell** | mostrador de la estación | sin canal digital |

Son **2 apps + 3 portales + una tarjeta**. El cliente no sabe cuánto tiene acumulado, ni qué le
conviene usar, ni que una sola compra puede impactar tres programas a la vez.

---

## Guion sugerido para la demo (5 minutos)

1. **Ingreso** — una huella. *"Una sola cuenta en lugar de cuatro registros."*
2. **Onboarding "antes y después"** — la pantalla lista los seis programas con el canal en el que
   viven hoy. Tocá **Unificar mis programas** y se vinculan a la identidad única.
   *Este es el momento en que el cliente ve su propio problema dibujado.*
3. **Home** — la billetera muestra **un solo valor en soles** (S/ 17.90) con el desglose por
   programa, y la tarjeta contextual dice el precio que **paga esta persona**, con el convenio ya
   aplicado.
4. **Pagar → el QR único** — el mismo código sirve en playa, tienda LiSTO! y Primax Gas. Fijate en
   los chips: el código lleva Bonus, sellos, convenio y pago juntos.
5. **Resumen de pago — el momento clave.** Carga de G-Premium + café + sándwich, S/ 138.50:

   | Beneficio | Programa | Descuento |
   | --- | --- | --- |
   | Convenio, S/ 1.00 × 5 gal | Primax Card | −S/ 5.00 |
   | Cupón de 5 sellos | Sellos LiSTO! | −S/ 5.50 |
   | BonusPaga, 1.240 pts | Bonus | −S/ 12.40 |
   | **Total** | | **S/ 115.60 · ahorro S/ 22.90** |

   Movés el slider de puntos o apagás un beneficio y **todo recalcula en vivo** — incluidos los
   sellos, que se duplican solo si se paga con Bonus. No es una maqueta pintada.
6. **Pago exitoso** — una transacción, tres programas actualizados al instante.
7. **Actividad** — historial unificado; cada línea muestra qué programas se movieron.
8. **Beneficios → “Descontá tus puntos de tu próxima compra”** — canje sin mínimo: cualquier saldo,
   por chico que sea, se convierte en saldo a favor y se aplica solo en el próximo pago. Resuelve al
   cliente que nunca llega al premio más barato del catálogo.
9. **Retos y misiones** — el **Memotest Primax** (juego para los chicos, +5 pts una vez por día) y
   **Caza el logo Primax**, el reto de realidad aumentada (necesita celular, HTTPS y el marcador
   impreso, ver abajo).

Para repetir la demo: **Perfil → Reiniciar la demo** (vuelve a 1.240 pts, 5 sellos e historial
original) o **Ver la unificación otra vez** (repite solo el onboarding).

---

## Qué números son reales y cuáles son supuestos

Conviene tenerlo claro antes de presentar.

**Datos públicos de Primax** (verificados en agosto de 2026):

- Convenio Primax Card: **S/ 1.00 por galón** en premium, S/ 0.50 en regular, S/ 0.20 en diésel,
  en más de 250 estaciones.
- Bonus: **1 punto por cada S/ 7.50** de consumo en tiendas LiSTO!. BonusPaga permite pagar total o
  parcialmente combustible, LiSTO!, Primax Gas y lubricantes Shell.
- Sellos LiSTO!: compras de **S/ 10 o más** suman sello; **pagando con Bonus se duplican**; al
  juntar **5** se habilita un cupón.

**Supuestos de la demo** (no son datos oficiales — están en `src/lib/benefits.ts`):

- **100 puntos = S/ 1.00** (heredado del prototipo original: 1.240 pts ≈ S/ 12.40). Es el número
  del que dependen todos los demás: con esta relación, la compra de ejemplo ahorra un 17 %, que es
  creíble. Subirla a 1 pt = S/ 0.05 haría que 1.240 pts valgan S/ 62 y el ahorro pasaría a más del
  50 % de la boleta, que ya no se sostiene frente a un cliente. Si igual se quiere cambiar, es una
  sola constante: `RULES.solesPorPunto` en `src/lib/benefits.ts`.
- Combustible: 1 punto por galón.
- El cupón de sellos vale S/ 5.50.
- El Memotest da 5 puntos, una vez por día.
- Precios de combustible, promos, retos, estaciones, perfil e historial son de ejemplo. La empresa
  del convenio ("Constructora Andina S.A.C.") es ficticia.

---

## Correr el proyecto

```bash
npm install
```

```bash
npm run dev
```

Queda en `http://localhost:5173`. El server escucha en la red local, así que podés abrirlo desde el
celular con la IP de tu compu (`http://192.168.x.x:5173`) — útil para probar en un teléfono real.

```bash
npm run build
```

Genera `dist/`, listo para cualquier hosting estático (Netlify, Vercel, GitHub Pages). Las rutas son
relativas, así que funciona también en un subdirectorio.

---

## Arquitectura

```text
src/
├── App.tsx              # máquina de estados de pantallas + pila de navegación
├── types.ts
├── data/                # todo el contenido mock, separado de la lógica
│   ├── programs.ts      # los 6 programas y dónde viven hoy
│   ├── purchases.ts     # las 3 compras precargadas (playa, LiSTO!, gas)
│   ├── stations.ts · catalog.ts · history.ts · user.ts
├── lib/
│   ├── benefits.ts      # ⭐ motor de beneficios: reglas, combinación óptima, acumulación
│   ├── store.ts         # estado global (useSyncExternalStore + localStorage)
│   ├── nav.tsx · format.ts
├── components/          # Icon, WalletCard, ProgramBadge, StampsRow, BottomNav, Sheet
├── screens/             # una por pantalla del recorrido
└── styles/              # tokens.css (marca) · global.css · components.css · screens.css
```

> El orden de los `import` de CSS en `src/main.tsx` **es significativo**: define la cascada. Tienen
> que ir antes de `import App`, porque si no las hojas que App arrastra se inyectan primero y las
> reglas base terminan pisando a las de pantalla.

**`src/lib/benefits.ts` es el corazón.** `computeBreakdown(compra, billetera, selección)` es una
función pura que devuelve qué beneficios aplican, cuánto descuenta cada uno, el total y lo que el
cliente acumula. La pantalla la vuelve a llamar con cada cambio de los controles, así que la
aritmética siempre cierra. Cambiar una regla de negocio es tocar un solo archivo.

El estado se guarda en `localStorage` bajo `primax-id-demo/v1`.

---

## Módulo AR — por qué no detectaba, y cómo dejarlo andando

Port del módulo del prototipo original: **MindAR 1.2.5 + A-Frame 1.4.2**. Las librerías se cargan
**bajo demanda** al entrar al reto, así que no pesan en el arranque de la app.

Al portarlo aparecieron **dos defectos reales**, los dos verificados en el navegador:

**1. Uno de los scripts nunca se cargaba.** El prototipo incluía
`mind-ar@1.2.5/dist/mindar-image.prod.js` con un `<script>` clásico, pero ese archivo son 266 bytes
de **ES module** (`import { C as o } from "./controller-…js"`). En un script clásico eso es un error
de sintaxis: el navegador dispara igual el evento `load`, así que el fallo pasa desapercibido, y
`window.MINDAR` nunca queda definido. El archivo que hace falta es
`mindar-image-aframe.prod.js` — un bundle autocontenido de 1,7 MB que ya trae el Controller y el
Compiler y registra los componentes de A-Frame. Hoy se cargan solo ese y A-Frame, en ese orden.

**2. El marcador era casi imposible de reconocer.** El `targets.mind` heredado es válido y carga
bien, pero al inspeccionarlo tiene **25 puntos de seguimiento** sobre una imagen de 611 × 343 —
proporción y aspecto del wordmark de Primax. Un logo plano, de colores lisos y sin textura, casi no
genera puntos de interés; un marcador utilizable tiene cientos. Con 25, MindAR necesita condiciones
casi perfectas y en la práctica no engancha nunca. **Este es el motivo de fondo por el que “apuntar
al logo” no funcionaba** — no era el código.

Agravante: la imagen original desde la que se compiló ese `.mind` (`logo.jpg`) **no está en el
repositorio**, así que ni siquiera se podía saber a qué apuntar exactamente.

### Cómo generar un marcador que sí funcione

Hay una herramienta incluida en el proyecto:

```text
http://localhost:5173/herramientas/marcador.html
```

Dibuja un marcador con identidad Primax pero con mucha textura (bordes, formas y contraste
repartidos), lo compila con MindAR y te deja descargar las dos piezas. El flujo es:

1. Abrí la página y descargá **`marcador-primax.png`**.
2. Tocá **Compilar** y esperá. Fijate en el número de puntos que informa: tiene que ser bastante
   mayor a 25.
3. Descargá **`targets.mind`** y reemplazá `public/targets.mind`.
4. Guardá el PNG en `public/herramientas/` para que quede versionado junto al `.mind` que le
   corresponde — que fue justo lo que faltó la vez pasada.
5. Imprimí el marcador en A5 o más grande, o mostralo en la pantalla de otro dispositivo.

### Requisitos y diagnóstico

**HTTPS** (o `localhost`) y permiso de cámara; Chrome Android y Safari iOS son los targets. Abrir la
app desde el celular por IP local (`http://192.168.x.x:5173`) **no alcanza**: sin HTTPS el navegador
bloquea la cámara.

Si algo falla, la pantalla de error muestra el log paso a paso en vivo — no hace falta recargar con
`?debug=1` — y tiene botón de reintentar. Si la cámara no responde en 12 segundos, corta sola en vez
de quedarse colgada. Sin un `targets.mind` válido el resto de la app funciona igual.

---

## Fuera de alcance

Backend, autenticación real, integración con las APIs de Bonus / Convenios, y el mundo B2B de flotas
(Primax Card empresas). Todos los datos son mock.
