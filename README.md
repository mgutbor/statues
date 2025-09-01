# Statues - Red Light, Green Light (PWA)

Aplicación web progresiva (PWA) basada en el juego **Red Light, Green Light**. Desarrollada con **Lit 3**, Vaadin Router y Vite para demostrar buenas prácticas en arquitectura de componentes (MVVM), tests, PWA y persistencia.

---

## Características principales

- **Pantalla Home**: Registro de jugador por nombre (validación). Ruta por defecto y redirección de rutas desconocidas a `/`.
- **Pantalla Game**:
  - Muestra nombre del jugador, puntuación actual y máximo (récord).
  - Dos botones para "caminar" (izquierda/derecha).
  - Semáforo que alterna **rojo** / **verde**:
    - Rojo: **3 segundos** (fijo).
    - Verde: `greenLight = max(10000 - score * 100, 2000) + random(-1500, 1500)`.
  - Reglas de puntos:
    - Pulsos alternos en verde → **+1** por click.
    - Pulsar el mismo botón consecutivo en verde → **-1**.
    - Cualquier click en rojo → **reset a 0**.
  - Botón **Salir** vuelve a Home y persiste estado.
- **Persistencia**: `localStorage` por jugador. Reanudación automática tras cerrar/abrir la app.
- **PWA / Offline**: Configurado con `vite-plugin-pwa` (precaching + runtime caches). Funciona en modo avión tras haber sido visitada.
- **Ranking**: Vista con máximo por jugador, restringida a los 5 jugadores con mayor puntuación (bonus).
- **Audio y Vibración (bonus)**: Sonido durante verde con `playbackRate` adaptado y vibración en pérdidas (`solo en dispositivos Android`).
- **Tests unitarios**: Jest + jsdom para vistas y servicios (`PlayerService`, vistas y componentes).
- **Linter**: ESLint con plugin `lit` y configuración base.

---

## Tech stack

- **Framework**: [Lit 3](https://lit.dev/)
- **Router**: [Vaadin Router](https://github.com/vaadin/router)  
- **Bundler / Dev**: [Vite](https://vite.dev/) (+ [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) )  
- **Tests**: [Jest](https://jestjs.io/) + [jsdom](https://www.npmjs.com/package/jsdom)
- **Lint**: [ESLint](https://eslint.org/) + [(plugin `lit`)](https://www.npmjs.com/package/eslint-plugin-lit) + [(plugin `lit-a11y`)](https://www.npmjs.com/package/eslint-plugin-lit-a11y)
- **Formate de código**: [Prettier](https://prettier.io/)
- **Persistencia**: `localStorage`

---

## Reglas del juego (resumen)

1. Inserta tu nombre en Home y pulsa **Iniciar** (o la tecla INTRO). Si el nombre ya existe, se reanuda la partida con la ultima puntuación almacenada.
2. En **Game** pulsa sobre los dos botones **verdes** para simular pasos:
   - Alternar botones en **verde** suma punto por click.
   - Repetir botón de paso cuando el semáforo esta en **verde** resta un punto.
   - Clic en los botones de paso cuando el semáforo esta en en **rojo** borra todos los puntos.
3. Objetivo: maximizar `maxScore`.

---

## Instalación y ejecución local

```bash
# clonar
git clone https://github.com/mgutbor/statues.git
cd statues

# instalar dependencias
npm install

# desarrollo (Vite)
npm run dev
## abre http://localhost:5173 en el navegador

# build/preview
npm run build
npm run preview
## abre http://localhost:4173 en el navegador

# tests
npm run test

# lint
npm run lint
```

---

## Posibles mejoras / TODOs

- Aplicar granularidad de [Atomic web design](https://bradfrost.com/blog/post/atomic-web-design/) para componentes.
- Realizar test E2E con Playwright o Cypress.
- Instalación de la PWA en Android.
- Desactivar el botón de ranking si no hay jugadores registrados.
- No tener jugadores con el mismo nombre que solo se diferencien por mayúsculas/minúsculas.
