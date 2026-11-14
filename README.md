# MyStyle · Probador virtual (versión 1)

Web app para el celular: guardas tu foto de cuerpo entero, subes la foto de una prenda (polo, blusa, pantalón, vestido, casaca) y la IA te muestra con esa prenda puesta. Incluye comparador antes/después, historial de pruebas y borrado de datos.

## Cómo funciona

- **index.html**: la app. Guarda tu foto y tu historial solo en el celular (IndexedDB).
- **netlify/functions/**: tres funciones pequeñas que corren en Netlify y hablan con la IA de **FASHN** (modelo *Try-On Max*). Tu clave de FASHN vive solo en Netlify, nunca en el celular.
  - `/api/tryon` inicia la prueba.
  - `/api/status` consulta si ya terminó.
  - `/api/health` le dice a la app si la IA está conectada.
- Si abres `index.html` sin servidor, la app entra en **modo demo** (simulación, sin IA).

## Publicarla (15 minutos)

1. **Crea tu cuenta en FASHN**: https://app.fashn.ai → *API* → crea una **API key**. Compra unos créditos para probar.
   - Calidad *Rápida*: 1 crédito por prueba. *Equilibrada*: 2 créditos.
2. **Sube el proyecto a Netlify con funciones.** Las funciones no corren con "arrastrar y soltar"; usa una de estas dos vías:
   - **GitHub (recomendado):** sube esta carpeta a un repositorio nuevo → en Netlify: *Add new site → Import an existing project → GitHub* → elige el repo → *Deploy*. No hace falta comando de build.
   - **Netlify CLI:** instala Node.js, luego en esta carpeta: `npm i -g netlify-cli`, `netlify login`, `netlify deploy --prod`.
3. **Agrega la clave**: en Netlify → tu sitio → *Site configuration → Environment variables → Add variable*:
   - Key: `FASHN_API_KEY`  ·  Value: tu clave de FASHN
   - Vuelve a desplegar (*Deploys → Trigger deploy*).
4. Abre la URL en tu celular. Arriba debe decir **"IA conectada"**. En el menú del navegador elige **"Agregar a pantalla de inicio"** para tenerla como app.

## Consejos para buenos resultados

- Foto base: de pie, de frente, cuerpo entero, buena luz, fondo simple, ropa ajustada.
- Foto de la prenda: una sola prenda, completa, sin cortes. Sirven capturas de tiendas online, fotos de maniquí o la prenda extendida.
- Usa "Detalle opcional" para indicaciones: "blusa por dentro", "mangas recogidas".

## Costos de referencia

Cada prueba cuesta créditos de FASHN (revisa precios vigentes en fashn.ai). Netlify tiene un plan gratuito que alcanza para pruebas con pocas usuarias.

## Privacidad

La foto se guarda en el celular de la usuaria. Para cada prueba se envía al servidor de Netlify y a FASHN solo para generar la imagen; la app no guarda copias en ningún servidor. Antes de abrirla al público, publica una política de privacidad y términos de uso (Ley N.° 29733 de Protección de Datos Personales en Perú).

## Siguientes versiones

- v2: maquillaje (base, rubor, gloss, labial, pestañas) y color de cabello sobre una selfie.
- Recomendación de talla con tus medidas.
- Cuentas de usuario y catálogo de tiendas aliadas.
