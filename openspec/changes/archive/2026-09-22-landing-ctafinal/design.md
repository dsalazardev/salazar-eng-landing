# Design: CtaFinal + Footer — Cierre navy con Cal.com lazy y ancla #contacto

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- M00–M10 completados y archivados. `index.astro` = Navbar + Hero + StackStrip + ProblemSolution + Services + ProofOfWork + Process + Founder + LeadMagnet + Faq. Esta sección se monta tras `<Faq />`.
- Contrato de anclas: `href="#contacto"` ×2 (`Navbar.astro:50`, `Hero.astro:29`) con `id="contacto"` **inexistente** → este change resuelve el último ancla y completa los 5 destinos del navbar.
- `BaseLayout` no tiene slot de footer (`BaseLayout.astro:41-44`: header slot + `<main id="contenido">`). Un `<footer>` dentro del slot por defecto quedaría **dentro de `<main>`**.
- `SectionLabel` hardcodea `text-steel-500` y no acepta `class` (`SectionLabel.astro:2-11`), aunque `landing-base` ya exige que cada primitivo fusione clases externas (`openspec/specs/landing-base/spec.md:63`) → corrección de conformidad, sin delta.
- `Button.primary` = `bg-accent text-white hover:bg-navy-900` y `outline` = borde/texto navy (`Button.astro:18-19`): sobre navy el hover del primary se funde y el outline desaparece → ajustes por clases del consumidor (`twMerge`), sin tocar el primitivo.
- Presupuesto vigente: 3 scripts inline (245 + 372 + 4,380 = 4,997 B). Isla M09 con chunks diferidos: `client.CLhIxG29.js` (212,922 B) + `ContactForm.DLepmpfH.js` (3,644 B) + `react.DJY1zw8Z.js` (7,899 B). React ya está instalado (`astro.config.mjs:5,13`).
- `PUBLIC_LEAD_ENDPOINT` marca el patrón de env build-time (`LeadMagnet.astro:6`, `.env.example`); `.gitignore` ya cubre `.env`/`.env.*` con `!.env.example`.
- El embed oficial de Cal.com construye un iframe directo `app.cal.com/<calLink>/embed?embed=<namespace>` con `allow="payment"` y `title` (código de `calcom/cal.com`, `packages/embeds/embed-core/src/embed.ts`) → click-to-load **sin scripts de terceros**.
- Isotipo: el asset `src/assets/isotipo-white.png` **no existe aún** (prerequisito del apply); el `tools/pdf/isotipo-white.png` versionado contiene la variante oscura (0 px claros, verificado por píxeles) y NO sirve para navy.
- §06 rige la verificación: inspección directa del build, sin levantar dev/preview.

## Goals / Non-Goals

**Goals:**

- Cerrar el embudo con el copy del brief §4.8 sobre banda navy full-bleed y resolver `#contacto`.
- Agendar con Cal.com **solo al click** (sin terceros en la carga inicial) y con fallback a email/WhatsApp.
- Footer con firma de marca fuera de `<main>` (slot nuevo en el shell).
- 0 JS en la carga inicial; sin dependencias; `global.css` intacto.

**Non-Goals:**

- Crear la cuenta/URL de Cal.com (prerequisito del dueño).
- Copy nuevo no derivado del brief (email/WhatsApp/microcopy/footer van marcados "a confirmar").
- Links sociales, QA/DEP (og-image, sitemap, robots, schema, favicon, deploy) y el embed de Loom (el wrapper queda reutilizable).

## Decisions

### D1. Sección: banda navy full-bleed + estructura canónica

```astro
<section id="contacto" class="bg-navy-900 text-white">
  <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
    <SectionLabel index="11" text="CTA" class="[&>span:first-child]:text-white/70" />
    <h2 class="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">¿Construimos algo juntos?</h2>
    <p class="mt-3 max-w-2xl text-white/70">Agenda un diagnóstico técnico de 20 minutos — …</p>

    <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
      {bookingUrl ? <LazyEmbed client:visible src={bookingUrl} … /> : <Button … href={fallbackHref}>…</Button>}
      <p class="text-white/70">o escribe a <a href="mailto:…">daneralejandro03@gmail.com</a></p>
    </div>

    <p class="mt-6 font-mono text-xs tracking-wider text-white/60 uppercase">
      Respuesta en menos de 24 h · Remoto LATAM · Internacional
    </p>
  </div>
</section>
```

- Banda completa (primera navy del sitio) sin `border-y`: el contraste con la banda blanca de FAQ separa solo. *Alternativa descartada:* card navy dentro del contenedor surface (rompe la fuerza del cierre y repite el patrón de cards de M05/M06).
- El label usa clase del consumidor (ver D3); la hairline de `SectionLabel` (`bg-line`) se mantiene, con opacidad si hace falta.

### D2. Paleta y contrastes sobre navy (verificados)

| Uso | Token/clase | Ratio vs navy-900 |
|---|---|---|
| Texto principal | `white` | ≈15.4:1 (AAA) |
| Texto secundario | `white/70` | ≈8.2:1 (AAA) |
| Microcopy | `white/60` | ≈6.4:1 (AA) |
| Hairlines | `white/15`–`white/10` | superficie |
| Botón primario | `bg-accent text-white` | 6.7:1 |
| **Prohibido como texto** | `steel-500` (3.2:1) · `accent` (2.3:1) | ✗ AA |

*Alternativa descartada:* `text-line` (#CBD5E1, 10.4:1) para secundarios — correcto pero demasiado claro/duro para jerarquía; se reserva para hairlines.

### D3. `SectionLabel` (class prop) y `Button` (clases del consumidor)

- `SectionLabel`: añadir `class?: string` y fusionar con `twMerge` (`clsx` + `tailwind-merge`, ya en el repo). Esto **cumple** el requisito existente de `landing-base` ("cada primitivo fusiona clases externas"), no lo modifica → sin delta.
- `Button`: primary con `hover:bg-white hover:text-navy-900`; outline con `border-white/20 text-white hover:border-white hover:text-white`. `twMerge` garantiza que la clase del consumidor prevalezca. *Alternativa descartada:* nuevo `variant="inverted"` (obligaría a delta de `landing-base` y no aporta más que las clases).

### D4. LazyEmbed: fachada → iframe, sin terceros en la carga inicial

```tsx
interface Props {
  src: string;        // URL base de agenda (owner); se normaliza a /embed
  title: string;      // "Agenda tu diagnóstico de 20 minutos"
  ctaLabel: string;   // "Agendar en Cal.com →"
  height?: number;    // reserva de altura (default ~680)
}
type Status = 'idle' | 'loading' | 'loaded';
```

- **Fachada**: `<button type="button">` real con las clases del Button primario (replicadas en TSX; el primitivo Astro no aplica en islas). Estados:
  - `idle`: botón activo.
  - `loading`: botón deshabilitado + "Cargando agenda…", contenedor con altura reservada, `aria-live="polite"`.
  - `loaded`: iframe visible; foco al iframe.
- **Iframe**: `src` **solo tras el click** (normalizado al patrón oficial `/embed`; si la URL ya contiene `/embed`, se usa tal cual); `title`; `allow="payment"`; `loading="lazy"`; `ref` + `focus()` en `onLoad`.
- **Sin estado de error**: los iframes no exponen errores de red de forma fiable; la alternativa email/WhatsApp queda **siempre visible fuera de la isla** (degradación honesta).
- **`client:visible`**: hidrata al acercarse al viewport; `client:idle/load` descartadas (adelantarían el runtime de React y romperían el presupuesto).
- **Reutilizable**: props tipadas permiten envolver Loom (brief §6) sin cambios.
- *Alternativa registrada:* `<details><summary>` + iframe (0 JS, cero islas) — descartada a favor del diseño AGENTS (`LazyEmbed.tsx` es explícito en §03 y habilita estados/anuncio/foco); queda documentada por si el dueño prioriza austeridad extrema.

### D5. Fallback sin URL de agendamiento

- `const bookingUrl = import.meta.env.PUBLIC_BOOKING_URL ?? ''`.
- Sin URL: **no se importa/monta la isla** (render condicional); el CTA primario es un enlace directo `mailto:daneralejandro03@gmail.com?subject=Diagnóstico gratuito de 20 minutos` (mismo subject que el PDF) y el sitio queda con **0 JS nuevo**. *Alternativa descartada:* placeholder o URL inventada (prohibido).

### D6. Env `PUBLIC_BOOKING_URL` (build-time)

- Misma naturaleza que `PUBLIC_LEAD_ENDPOINT`: se inlinea en build; cambiarla exige rebuild/re-deploy.
- `.env.example`: añadir `PUBLIC_BOOKING_URL=` **sin valor inventado**, con comentario de build-time y nota de que la URL/link de Cal.com es del dueño.

### D7. Footer: componente + slot en BaseLayout

- **`src/components/sections/Footer.astro`** (espejo de `Navbar.astro`; no existe carpeta `layout/` en el mapa AGENTS).
- **`BaseLayout`**: `<slot name="footer" />` tras `</main>`; `index.astro` monta `<Footer slot="footer" />`.
- Estructura:

```
<footer class="border-t border-white/10 bg-navy-900 text-white">
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    [isotipo blanco opcional]   — SALAZAR Eng. · Software & Applied AI
    nav: Servicios · Casos · Proceso · FAQ
    contacto: daneralejandro03@gmail.com · WhatsApp
    © 2026 SALAZAR Eng.
  </div>
</footer>
```

- © con `new Date().getFullYear()` en build (0 JS; se actualiza por rebuild). *Alternativa descartada:* año fijo (envejece).
- Nav links reutilizan los 4 anchors del navbar (sin copy nuevo); su inclusión queda **a confirmar** (D9).

### D8. Isotipo del footer: prerequisito verificado por píxeles

- **Asset requerido**: `src/assets/isotipo-white.png` (trazo claro real sobre transparencia). **No está en el repo hoy** (verificado: `Test-Path` false).
- **Verificación obligatoria por muestreo de píxeles** (sharp, script .cjs: conteo de píxeles claros del trazo), **nunca por visión** — precedente del proyecto de falsos positivos. Criterio: trazo claro con contraste ≥ 3:1 contra `#0B2545` (AA para elementos gráficos).
- **Hecho verificado**: el `tools/pdf/isotipo-white.png` versionado es la **variante oscura** (0 px claros) → no sirve para navy; no copiarlo.
- **Respaldo**: si el asset no está al aplicar → footer solo con firma textual + TODO documentado (diferido a QA/DEP). *Alternativa descartada:* forzar el isotipo actual sobre navy (invisible / contraste insuficiente).

### D9. Copy (verbatim + propuestas **a confirmar por el dueño**)

| Elemento | Texto | Origen | Estado |
|---|---|---|---|
| h2 | `¿Construimos algo juntos?` | Brief §4.8 L200 | Fijado |
| Párrafo | `Agenda un diagnóstico técnico de 20 minutos — sin costo y sin compromiso. Salimos con un plan claro, lo trabajemos o no.` | Brief §4.8 L201 | Fijado |
| Botón | `Agendar en Cal.com →` | Brief §4.8 L203 | Fijado |
| Alternativa | `o escribe a daneralejandro03@gmail.com` | Email ★ consistente con PDF/commits | **A confirmar** |
| WhatsApp | `https://wa.me/573145919465` (canal secundario) | PDF `checklist-27-puntos.html:405` | **A confirmar** |
| Microcopy | `Respuesta en menos de 24 h · Remoto LATAM · Internacional` | Copy existente del Hero (`Hero.astro:39`) | **A confirmar** |
| Firma | `— SALAZAR Eng. · Software & Applied AI` | Brief L299 / PDF L408 | **A confirmar** |
| Copyright | `© <año build> SALAZAR Eng.` | Propuesta (año dinámico) | **A confirmar** |
| Nav footer | `Servicios · Casos · Proceso · FAQ` | Reuso de anchors del navbar | **A confirmar** |

- Cero invención: lo no fijado por el brief queda marcado; cualquier ajuste del dueño se refleja en design/spec antes o durante el apply.

### D10. Integración

- `index.astro`: import + `<CtaFinal />` tras `<Faq />`; `<Footer slot="footer" />` tras el cierre del layout.
- `BaseLayout.astro`: `<slot name="footer" />` después de `</main>` (D7) + delta `landing-base`.
- `id="contacto"` ×1 resuelve `Navbar.astro:50` y `Hero.astro:29`; `scroll-padding-top: 5rem` (`global.css:17`) ya compensa el navbar sticky.
- `.env.example`: `PUBLIC_BOOKING_URL`.

### D11. Verificación §06 y presupuesto

Sin servidor: `pnpm astro check` → `pnpm build` → inspección de `dist/index.html` y `dist/_astro/*`:

| Comprobación | Criterio |
|---|---|
| Ancla | `id="contacto"` = 1; `href="#contacto"` = 2 |
| Footer | `<footer>` tras `</main>` + firma presente (contar por posición; hay un `<footer>` previo en un blockquote de Founder) |
| Sin terceros | `cal.com` ausente del HTML inicial; iframe del embed ausente |
| Isla | `astro-island` = 2 con `PUBLIC_BOOKING_URL`; = 1 sin ella |
| Chunks | `LazyEmbed.*.js` hasheado en `dist/_astro/` (con URL) |
| Presupuesto | 3 scripts inline = 4,997 B |
| CSS global | `git diff` de `global.css` vacío |

Verificación humana: banda navy y contrastes, footer (con/sin logo), teclado de la fachada, y con URL real de Cal.com: carga solo al click y agenda correctamente (QA §8).

### D12. Rollback

Revertir el commit del apply: componentes nuevos + montajes + slot + env; sin datos ni infraestructura. Si se revierte con `PUBLIC_BOOKING_URL` configurada, el fallback email/WhatsApp ya cubre la sección.

## Wireframes

**Cierre de página:**

```
+--------------------------------------------------------------------------+
| [FAQ · banda blanca border-y]                                            |
+==========================================================================+
| section#contacto · bg-navy-900 text-white (full-bleed)                   |
|  11/ CTA - - - - - - - - - - - - - - - - - - - - - - -                   |
|  ¿Construimos algo juntos?                                               |
|  Agenda un diagnóstico técnico de 20 minutos — sin costo y sin           |
|  compromiso. Salimos con un plan claro, lo trabajemos o no.              |
|                                                                          |
|  [ Agendar en Cal.com -> ]   o escribe a daneralejandro03@gmail.com      |
|  RESPUESTA EN MENOS DE 24 H · REMOTO LATAM · INTERNACIONAL               |
+==========================================================================+
| footer · navy + hairline white/10                                        |
|  [isotipo]  — SALAZAR Eng. · Software & Applied AI                       |
|  Servicios · Casos · Proceso · FAQ                                       |
|  daneralejandro03@gmail.com · WhatsApp            © 2026 SALAZAR Eng.    |
+--------------------------------------------------------------------------+
```

**LazyEmbed (estados):**

```
idle                          loading                        loaded
+----------------------+      +----------------------+      +--------------------+
| [Agendar en Cal.com] | -->  | [Cargando agenda...] | -->  | <iframe title=...  |
|  (button, SSR)       |      |  aria-live=polite    |      |  allow="payment"   |
+----------------------+      |  altura reservada    |      |  focus() al cargar |
                              +----------------------+      +--------------------+
   alternativa email/WhatsApp SIEMPRE visible debajo (fuera de la isla)
```

**Footer (variante sin logo, respaldo):**

```
+--------------------------------------------------------------------------+
| — SALAZAR Eng. · Software & Applied AI                                   |
| Servicios · Casos · Proceso · FAQ                                        |
| daneralejandro03@gmail.com · WhatsApp            © 2026 SALAZAR Eng.     |
+--------------------------------------------------------------------------+
```

## Risks / Trade-offs

- [URL de Cal.com inexistente hoy] → env var + fallback; el QA §8 queda pendiente hasta que el dueño cree la cuenta (documentado).
- [Iframe de terceros] → peticiones/cookies solo tras click; sin `sandbox` (rompería Cal.com); CSP futura a revisar en DEP.
- [CLS del embed] → altura reservada + `loading="lazy"`.
- [Segunda isla] → runtime compartido; chunk marginal (~1–3 KB); la carga inicial no cambia.
- [Shell tocado (`BaseLayout`)] → slot aditivo + delta `landing-base`; una sola página, riesgo bajo.
- [Asset del isotipo no disponible] → respaldo sin logo; verificación por píxeles obligatoria si llega.
- [Año estático en ©] → se actualiza por rebuild (aceptable).
- [Foco al iframe cross-origin] → se enfoca el elemento iframe (el navegador traslada el foco); verificación humana.

## Migration Plan

1. `SectionLabel`: prop `class` + `twMerge`; `BaseLayout`: slot `footer`; `.env.example`: `PUBLIC_BOOKING_URL`.
2. `LazyEmbed.tsx` (props/estados/a11y/CLS) y `CtaFinal.astro` (banda navy, copy, fallback condicional).
3. `Footer.astro` (firma/contacto/©/nav + logo condicional verificado por píxeles o respaldo textual).
4. `index.astro`: montajes (`<CtaFinal />` tras `<Faq />`; `<Footer slot="footer" />`).
5. Verificación §06 + verificaciones humanas; commits `feat(ctafinal): …` + `docs(openspec): add landing-ctafinal change artifacts` (sin push).

Rollback: revertir el commit (D12).

## Open Questions

- **Confirmaciones de copy (D9)**: email (`daneralejandro03@gmail.com` ★), WhatsApp ★, microcopy ★, firma/© ★ y nav links del footer ★.
- **URL de Cal.com**: el dueño la crea y la define en el entorno de build (`PUBLIC_BOOKING_URL`); sin ella aplica el fallback.
- **Isotipo blanco**: prerequisito `src/assets/isotipo-white.png` verificado por píxeles; si no llega, footer sin logo (TODO diferido).
