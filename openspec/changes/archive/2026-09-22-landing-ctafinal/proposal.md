# Proposal: CtaFinal + Footer — Cierre navy con Cal.com lazy y ancla #contacto

## Why

La landing termina hoy en el FAQ (M10) sin cierre de conversión ni firma de marca, y el **último ancla del contrato sigue muerta**: `href="#contacto"` aparece ×2 (CTA del navbar y CTA del hero) sin destino. Esta sección cierra el embudo con el copy del brief §4.8, agendamiento Cal.com bajo demanda (click-to-load), alternativa email/WhatsApp, la **primera banda navy-900 full-bleed** del sitio y el footer con firma de marca.

## What Changes

- **Nuevo `src/components/sections/CtaFinal.astro`**: `<section id="contacto" class="bg-navy-900 text-white">` (banda navy full-bleed, sin `border-y`), `SectionLabel 11/ CTA`, h2 y párrafo verbatim del brief §4.8, CTA primario (LazyEmbed o fallback) + alternativa email/WhatsApp y microcopy.
- **Nuevo `src/components/islands/LazyEmbed.tsx`** (segunda isla React, `client:visible`): fachada `<button>` SSR → click → **iframe directo de Cal.com** (`https://app.cal.com/<link>/embed…` construido desde `PUBLIC_BOOKING_URL`), `title` accesible, `allow="payment"`, `loading="lazy"`, altura reservada (~640–720 px, CLS ≈ 0), `focus()` al iframe y `aria-live="polite"`. **Sin scripts de terceros en la carga inicial**: `cal.com` no aparece en el HTML inicial, solo dentro del chunk.
- **Fallback sin URL**: si `PUBLIC_BOOKING_URL` está vacía, **la isla no se monta**; el CTA primario cae a `mailto:`/WhatsApp y el sitio queda con **0 JS nuevo**.
- **Nueva env `PUBLIC_BOOKING_URL`** (build-time, mismo patrón que `PUBLIC_LEAD_ENDPOINT`): documentada en `.env.example` con su nota de build-time.
- **Nuevo `src/components/sections/Footer.astro`** + **slot `footer` en `BaseLayout`** (tras `</main>`, espejo del header slot): firma `— SALAZAR Eng. · Software & Applied AI`, contacto, `© <año>` (build-time, 0 JS) y logo según el prerequisito del isotipo.
- **`SectionLabel`**: añadir prop `class` + fusión `twMerge` (conformidad con el requisito existente de `landing-base`; sin delta).
- **`Button`**: los ajustes para navy se aplican como clases del consumidor (`hover:bg-white hover:text-navy-900` en primary; `border-white/20 text-white` en outline); el primitivo no se toca.
- **Isotipo del footer**: prerequisito `src/assets/isotipo-white.png` (trazo claro real, verificado por muestreo de píxeles ≥ 3:1 contra navy-900); si no está disponible al aplicar, el footer va solo con firma textual y el logo queda como TODO diferido a QA/DEP.
- **`src/pages/index.astro`**: monta `<CtaFinal />` tras `<Faq />` y `<Footer slot="footer" />` tras `</main>`.
- **`id="contacto"`** resuelve los 2 enlaces (Hero + navbar): el contrato de anclas queda **completo**; 0 JS en la carga inicial (4,997 B intactos); sin dependencias nuevas; `global.css` intacto.

## Capabilities

### New Capabilities

- `landing-ctafinal`: sección de cierre de conversión en banda navy con agendamiento Cal.com lazy (fachada → iframe, 0 terceros en carga inicial), fallback email/WhatsApp, footer con firma de marca tras `</main>` y ancla `#contacto` del contrato.

### Modified Capabilities

- `landing-base`: el shell añade un **slot `footer`** en `BaseLayout` (tras `</main>`) para montar el footer fuera de `<main>`, espejo del slot `header` existente.

## Fuera de Alcance

- Crear la cuenta/URL de Cal.com (decisión y prerequisito del dueño; la env var la recibe en build).
- Copy nuevo no derivado del brief: email/WhatsApp/microcopy/footer quedan **marcados "a confirmar por el dueño"**.
- Links sociales en el footer (el brief no los menciona).
- Exportar el logo vectorial SVG (TODO de marca) y el isotipo blanco definitivo (llega como prerequisito; ruta de respaldo documentada).
- QA/DEP posterior: `og-default.png`, `robots.txt`, `sitemap.xml`, schema.org, favicon definitivo, deploy.
- Embed lazy de Loom (el wrapper queda reutilizable, pero su integración es de otro change).

## Impact

- **Nuevos**: `src/components/sections/CtaFinal.astro`, `src/components/sections/Footer.astro`, `src/components/islands/LazyEmbed.tsx`; asset condicional `src/assets/isotipo-white.png`.
- **Modificados**: `src/pages/index.astro` (montaje), `src/layouts/BaseLayout.astro` (slot footer), `src/components/ui/SectionLabel.astro` (prop `class`), `.env.example` (nueva variable).
- **Sin cambios**: `global.css`, navbar, secciones 00–10, `Button`/`Badge`/`Card`, `astro.config.mjs`, `package.json`, backend.
- **Contrato de anclas**: `#contacto` pasa de muerta a viva (2 enlaces); `#servicios`, `#casos`, `#proceso` y `#faq` intactos → los 5 destinos del navbar quedan vivos.
- **Presupuesto**: carga inicial 4,997 B intacta (3 scripts inline); la isla nueva se difiere (`client:visible`) y comparte el runtime React ya existente; sin URL, 0 JS nuevo.
- **Assets**: 1 imagen condicional (isotipo blanco ~11 KB, optimizada por el pipeline de Astro).
