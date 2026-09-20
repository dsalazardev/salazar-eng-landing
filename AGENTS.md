# AGENTS.md — SALAZAR Eng. Landing Page

> **Guía oficial de contexto para agentes de IA y colaboradores** (Claude Code, Codex, OpenCode, Hermes).
> Leer este archivo ANTES de cualquier cambio en el proyecto. Toda decisión de diseño, copy o arquitectura debe ser consistente con el Brief Técnico (ver §06).

---

## 01. Propósito e Identidad del Proyecto

- **Marca:** SALAZAR Eng. — estudio boutique de ingeniería de software, arquitectura cloud y soluciones de IA.
- **Visión B2B:** captar CTOs, VPs de Ingeniería y fundadores de PyMEs (LATAM / Internacional) y convertirlos en llamadas de diagnóstico (§ embudo en el brief).
- **Tono de comunicación:** industrial, técnico y directo. Cero marketing vacío, cero emojis decorativos en la UI, cero claims no verificables.
- **Estética blueprint:** monocromática sobre azul marino `#0B2545`, líneas finas de plano técnico, patrones de grid/puntos, numeración de secciones en mono (`01/ NAVBAR`).
- **Promesa central:** alto rendimiento demostrado — el propio sitio debe rendir Lighthouse 100/100. **El sitio es la primera prueba de la competencia que vende.**
- **Idioma del sitio:** español (con textos técnicos que pueden usar términos en inglés estándar de industria: deploy, stack, etc.).

---

## 02. Reglas del Stack y Convenciones de Código

| Capa | Regla |
|---|---|
| **Framework** | **Astro (SSG)** — proyecto en v7.x (`astro@^7.3.3`). Sin SSR salvo necesidad justificada. **0 KB de JavaScript por defecto.** |
| **Estilos** | **Tailwind CSS v4** vía `@tailwindcss/vite`. Design tokens como CSS variables en `src/styles/global.css`. |
| **Islas interactivas** | **React 19** (`@astrojs/react`) habilitado **ÚNICAMENTE** para componentes interactivos (formulario, modales, embeds lazy). Todo lo demás: **`.astro` puro**. |
| **Iconografía** | `lucide-astro` exclusivamente. Prohibidas librerías de iconos redundantes. |
| **Tipografía** | `Manrope` (textos principales) + `JetBrains Mono` (código, etiquetas `01/ HERO`, badges técnicos). |
| **TypeScript** | Modo estricto (`astro/tsconfigs/strict` + `jsx: react-jsx`). Sin `any` injustificados. |
| **Utilidades** | `clsx` + `tailwind-merge` para composición condicional de clases. |
| **Package manager** | **pnpm** (respetar `pnpm-lock.yaml`). |
| **Deploy** | Fase 1: Cloudflare Pages/Vercel · Fase 2: AWS S3 + CloudFront con Pulumi (ver brief §07). |

### Design tokens (paleta estricta — no inventar colores nuevos)

```
--navy-900:   #0B2545   /* Primario — textos, fondos oscuros */
--navy-700:   #16345E   /* Navy claro — gradientes, hover states */
--steel-500:  #64748B   /* Texto secundario */
--surface:    #F8FAFC   /* Fondo general */
--line:       #CBD5E1   /* Líneas blueprint, bordes */
--accent:     #1D4ED8   /* SOLO CTAs y hover — dosis mínima */
--white:      #FFFFFF
```

---

## 03. Arquitectura de Componentes & Hoja de Ruta de Desarrollo

### Mapa de carpetas objetivo

```
src/
├── layouts/
│   └── BaseLayout.astro          # <head> global: SEO, OG, fuentes, tokens
├── components/
│   ├── ui/                       # primitivos reutilizables
│   │   ├── Button.astro          # variantes: primary (accent), secondary (outline)
│   │   ├── Badge.astro           # tech badges / stat badges (mono)
│   │   ├── SectionLabel.astro    # etiqueta blueprint "01/ NAVBAR"
│   │   └── Card.astro            # contenedor base (bento cells)
│   ├── sections/                 # las 11 secciones — SIEMPRE .astro
│   │   ├── Navbar.astro
│   │   ├── Hero.astro
│   │   ├── StackStrip.astro
│   │   ├── ProblemSolution.astro
│   │   ├── Services.astro
│   │   ├── ProofOfWork.astro
│   │   ├── Process.astro
│   │   ├── Founder.astro
│   │   ├── LeadMagnet.astro
│   │   ├── Faq.astro
│   │   └── CtaFinal.astro
│   └── islands/                  # React SOLO aquí (interactividad real)
│       ├── ContactForm.tsx
│       └── LazyEmbed.tsx         # wrapper click-to-load (Cal.com, Loom)
├── content/                      # Content Collections (fase 2: casos/, blog/)
├── styles/
│   └── global.css                # tokens + base + utilidades blueprint
└── pages/
    └── index.astro               # composición secuencial de las 11 secciones
```

### Hoja de ruta de implementación (orden obligatorio de construcción)

| # | Sección | Notas de implementación |
|---|---|---|
| 01 | **Navbar** | Sticky, fondo surface con blur sutil; CTA "Agendar diagnóstico" en accent; mobile: menú mínimo |
| 02 | **Hero** | Titular grande (Manrope bold, navy-900), subtítulo steel, 2 CTAs; visual blueprint (grid + monograma SE); micro-prueba bajo CTA |
| 03 | **StackStrip** | Marquee CSS puro (sin JS); badges en mono; duplicar lista para loop infinito |
| 04 | **ProblemSolution** | Tabla/grid 3×2: dolor (cita en italic) → solución; fondo surface con grid sutil |
| 05 | **Services** | Bento Grid CSS (celdas 2x1 y 1x1); cada servicio: título, promesa, entregables, stack badges, CTA secundario |
| 06 | **ProofOfWork** | 3 tarjetas: mini-diagrama C4 (imagen), métrica antes→después, stack badges, links (repo/Loom/caso) |
| 07 | **Process** | 4 pasos numerados (01-04 en mono): Diagnóstico → Propuesta → Sprints con demos → Entrega + soporte |
| 08 | **Founder** | Foto + bio ejecutiva + credenciales verificables; tono directo, sin autocorona |
| 09 | **LeadMagnet** | Formulario (isla React): 2 campos (email + select necesidad); dispara workflow n8n (PDF 27 puntos) |
| 10 | **Faq** | `<details>/<summary>` nativo (0 JS); 5 preguntas del brief; estilos blueprint |
| 11 | **CtaFinal** | Cierre de fricción cero: agendar Cal.com (lazy) + email; fondo navy-900 invertido; footer con firma de marca |

**Regla de orden:** construir 02 → 05 → 06 → 11 primero (versión mínima viable), luego 01, 03, 04, 07-10.

---

## 04. Directivas de Rendimiento & Buenas Prácticas

- **Cero librerías de animación.** Solo CSS nativo: scroll-driven animations (`animation-timeline`) con fallback IntersectionObserver mínimo.
- **Cero librerías de iconos redundantes.** Solo `lucide-astro`.
- **Carga diferida obligatoria** para embeds de **Cal.com** y videos de **Loom** (click-to-load vía `LazyEmbed`).
- **Imágenes:** formatos modernos (WebP/AVIF), `width`/`height` explícitos, `loading="lazy"` excepto el visual del hero; exportar logos desde el vectorial (`ARCHIVOS/LOGO/AI/`).
- **JS inicial < 10 KB** (sin contar embeds lazy). Es un criterio de aceptación, no una aspiración.
- **SEO técnico:** meta tags + OG/Twitter cards por página, `sitemap.xml`, `robots.txt`, schema.org `Organization`.
- **Accesibilidad:** contraste AA mínimo, focus visible, `aria` correcto en accordion/formularios, navegación por teclado.
- **Sin dependencias nuevas** sin justificación explícita en el PR/commit que las introduce.

---

## 05. Tareas Inmediatas & Comandos de Trabajo

### Comandos (pnpm)

```bash
pnpm install                # Dependencias
pnpm dev                    # Dev server (o: astro dev --background para modo background)
astro dev stop|status|logs  # Gestión del servidor en background
pnpm build                  # Build de producción → ./dist/
pnpm preview                # Preview del build local
pnpm astro check            # Type-checking (TS strict)
```

> Al iniciar el dev server desde un agente, **usar `astro dev --background`** y gestionarlo con `stop`/`status`/`logs`.

### Checklist de avance (marcar al completar)

```
[ x ] 00  Setup: BaseLayout + tokens en global.css + fuentes (Manrope/JetBrains Mono)
[ x ] 01  Navbar (sticky + CTA)
[ x ] 02  Hero (titular + CTAs + visual blueprint)
[ x ] 03  StackStrip (marquee CSS)
[ x ] 04  ProblemSolution (3 dolores → 3 soluciones)
[ x ] 05  Services (Bento Grid ×3)
[ x ] 06  ProofOfWork (3 tarjetas con C4 + métricas + links)
[ ] 07  Process (4 pasos)
[ ] 08  Founder (bio ejecutiva)
[ ] 09  LeadMagnet (isla React + n8n)
[ ] 10  Faq (accordion nativo)
[ ] 11  CtaFinal + Footer (firma de marca)
[ ] QA   Lighthouse ≥98 / JS <10KB / formulario e2e / OG images / sitemap
[ ] DEP  Deploy Fase 1 (Cloudflare/Vercel)
[ ] DEP  Migración Fase 2 (AWS S3 + CloudFront + Pulumi)
```

---

## 06. Reglas para agentes ejecutores — verificación sin bloqueo

> **OBLIGATORIAS** para todo agente (OpenCode, Claude Code, Codex, Hermes) que implemente o verifique en este proyecto. Nacen de bloqueos reales: agentes que se quedan en ciclos de espera al levantar el preview para "verificar con el navegador".

1. **Verifica SIN servidor.** La verificación de artefactos se hace por inspección directa del build: `grep`/lectura de `dist/index.html` y `dist/_astro/*.css` (scripts, reglas, tokens, assets hasheados). **NO levantes `astro preview` ni `astro dev` para verificar.**
2. **Nunca esperes; nunca pares el flujo.** Si una tarea pide verificación "manual / visual / en preview": haz la parte automatizable (grep/inspección) y registra el resto como **"verificación humana pendiente del dueño"** en el reporte final. CONTINÚA hasta la última tarea.
3. **El preview es del humano.** Solo se levanta si el dueño lo pide, o para una medición puntual con herramienta automatizable disponible — y se **detiene en el mismo paso** (`astro preview stop`).
4. **Cero procesos en background al terminar.** Sin servidores ni watchers vivos al cerrar el turno.
5. **Las verificaciones humanas se listan, no se intentan:** sección explícita al final del reporte, con instrucciones breves para el dueño.

---

## 07. Referencias

- **Brief Técnico (fuente de verdad de copy y diseño):**
  `C:\Users\USUARIO\OneDrive\Escritorio\ARCHIVOS\ESCRITORIO\HV\AGENTE-HV-DANER-SALAZAR\OUTPUT\ANALISIS\BRIEF_LANDING_PAGE_SALAZAR_ENG.md`
- **Assets de marca:** banner `ARCHIVOS\191.png` · logos `ARCHIVOS\LOGO\` (AI/ vectoriales, FOTOS/ PNG-JPG)
- **Documentación Astro:** [Routing](https://docs.astro.build/en/guides/routing/) · [Componentes](https://docs.astro.build/en/basics/astro-components/) · [Framework components](https://docs.astro.build/en/guides/framework-components/) · [Content collections](https://docs.astro.build/en/guides/content-collections/) · [Styling/Tailwind](https://docs.astro.build/en/guides/styling/) · [i18n](https://docs.astro.build/en/guides/internationalization/)

---

*Documento de trabajo interno — SALAZAR Eng. · Confidencial*

— SALAZAR Eng. · Software & Applied AI
