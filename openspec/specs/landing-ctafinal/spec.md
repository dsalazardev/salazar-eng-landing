# landing-ctafinal Specification

## Purpose

Sección de cierre de conversión en banda navy-900 full-bleed con agendamiento Cal.com bajo demanda (fachada → iframe, sin terceros en la carga inicial), alternativa email/WhatsApp, footer con firma de marca montado tras `</main>` y ancla `#contacto` del contrato del navbar.

## Requirements

### Requirement: Sección de cierre tras el FAQ

La sección SHALL ser la inmediatamente posterior a la del FAQ y SHALL mostrar, en este orden: la etiqueta "11/ CTA", un `<h2>` "¿Construimos algo juntos?", el párrafo "Agenda un diagnóstico técnico de 20 minutos — sin costo y sin compromiso. Salimos con un plan claro, lo trabajemos o no.", el CTA primario "Agendar en Cal.com →" (o su fallback), la alternativa "o escribe a daneralejandro03@gmail.com" y la microcopy "Respuesta en menos de 24 h · Remoto LATAM · Internacional". La sección SHALL presentarse como banda navy-900 full-bleed (`bg-navy-900 text-white`, sin `border-y`) y NO SHALL incluir texturas, corner marks ni CTA propio adicional. La etiqueta de sección SHALL ser legible sobre navy (color claro provisto por el consumidor; `steel-500` NO SHALL usarse sobre navy).

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la del FAQ y muestra la etiqueta "11/ CTA", el h2, el párrafo, el CTA primario, la alternativa por email y la microcopy, en ese orden

#### Scenario: Copy verbatim del brief

- **WHEN** se inspecciona la sección construida
- **THEN** el h2 y el párrafo coinciden verbatim con el brief §4.8

#### Scenario: Banda navy legible

- **WHEN** se inspecciona el HTML/CSS construido
- **THEN** la sección usa `bg-navy-900` con texto en blanco y la etiqueta de sección no usa `text-steel-500`

### Requirement: Ancla viva del contrato

La sección SHALL exponer `id="contacto"` exactamente una vez, de modo que los 2 enlaces existentes hacia `#contacto` (CTA del navbar y CTA del hero) tengan destino dentro de la página, quedando los 5 destinos del navbar vivos. Los demás destinos (`#servicios`, `#casos`, `#proceso`, `#faq`) NO SHALL alterarse.

#### Scenario: Ancla resuelta

- **WHEN** se inspecciona el HTML construido
- **THEN** existe exactamente un `id="contacto"` y los 2 `href="#contacto"` apuntan a un destino existente

#### Scenario: Contrato completo e intacto

- **WHEN** se revisan los destinos del navbar
- **THEN** `#servicios`, `#casos`, `#proceso` y `#faq` conservan sus anclas vivas y `#contacto` queda viva

### Requirement: Agendamiento Cal.com bajo demanda (LazyEmbed)

Cuando `PUBLIC_BOOKING_URL` esté configurada, la sección SHALL renderizar la isla `LazyEmbed` (React, `client:visible`) cuya fachada SHALL ser un `<button type="button">` operable con teclado y foco visible. Al activarlo, la isla SHALL montar un `<iframe>` cuyo `src` se construye desde la URL configurada con el patrón de embed de Cal.com (`/embed`), con `title` accesible, `allow="payment"`, `loading="lazy"` y altura reservada para evitar CLS. La carga inicial NO SHALL realizar ninguna petición a `cal.com` ni incluir scripts de terceros. La isla SHALL exponer props tipadas (`src`, `title`, `ctaLabel`, `height`) que permitan reutilizarla para otros embeds.

#### Scenario: Fachada sin terceros

- **WHEN** se inspecciona el HTML inicial construido
- **THEN** no aparece `cal.com` ni ningún iframe del embed, y no hay scripts de terceros

#### Scenario: Click carga el iframe

- **WHEN** el usuario activa la fachada
- **THEN** la isla monta el iframe con `src` derivado de `PUBLIC_BOOKING_URL`, `title`, `allow="payment"` y `loading="lazy"`

#### Scenario: Operación por teclado y anuncio

- **WHEN** el usuario navega con Tab hasta la fachada y la activa con Enter o Espacio
- **THEN** el botón es operable, el foco es visible, la carga se anuncia en una región `aria-live="polite"` y al terminar el foco pasa al iframe

#### Scenario: Altura reservada sin CLS

- **WHEN** la fachada pasa a estado de carga y luego a cargado
- **THEN** el contenedor mantiene una altura reservada (~640–720 px) y el layout no salta

#### Scenario: Alternativa siempre disponible

- **WHEN** el iframe tarda o no llega a cargar
- **THEN** la alternativa por email/WhatsApp permanece visible y usable fuera de la isla

### Requirement: Fallback sin URL de agendamiento

Si `PUBLIC_BOOKING_URL` está vacía o no definida, la sección NO SHALL montar la isla ni el iframe; el CTA primario SHALL ser un enlace directo (`mailto:` con subject de diagnóstico o WhatsApp) y la sección NO SHALL añadir JavaScript.

#### Scenario: Sin isla ni iframe

- **WHEN** se construye sin `PUBLIC_BOOKING_URL`
- **THEN** no existe isla `LazyEmbed` ni iframe y el CTA primario es un enlace directo de contacto

#### Scenario: Cero JS nuevo sin URL

- **WHEN** se inspecciona el HTML construido sin la variable
- **THEN** la carga inicial conserva únicamente las islas/scripts previos (sin JavaScript añadido por esta sección)

### Requirement: Footer con firma tras el main

El footer SHALL renderizarse como landmark `<footer>` **después de `</main>`** (fuera de `<main id="contenido">`), sobre la banda navy continua y separado del CTA por una línea fina (`white/10`). SHALL mostrar: la firma "— SALAZAR Eng. · Software & Applied AI", el contacto (email `daneralejandro03@gmail.com` y WhatsApp `https://wa.me/573145919465`), los enlaces de navegación (`#servicios`, `#casos`, `#proceso`, `#faq`) y `© <año> SALAZAR Eng.` con el año calculado en build (0 JS). El footer SHALL mostrar el isotipo blanco cuando el asset verificado exista; en su defecto SHALL omitirlo y conservar la firma textual, dejando el TODO del logo documentado.

#### Scenario: Landmark fuera de main

- **WHEN** se inspecciona el HTML construido
- **THEN** existe un `<footer>` de página después de `</main>` y la firma "SALAZAR Eng. · Software & Applied AI" está presente

#### Scenario: Contenido del footer

- **WHEN** se revisa el footer construido
- **THEN** muestra firma, contacto (email y WhatsApp), los 4 enlaces de navegación y el copyright con el año de build

#### Scenario: Logo condicional verificado

- **WHEN** el asset `src/assets/isotipo-white.png` está disponible y su trazo claro supera 3:1 contra navy-900 (muestreo de píxeles)
- **THEN** el footer muestra el isotipo con dimensiones explícitas y `alt` de marca

#### Scenario: Footer sin logo (respaldo)

- **WHEN** el asset verificado no está disponible al aplicar
- **THEN** el footer muestra solo la firma textual y el TODO del logo queda documentado

### Requirement: Presupuesto de JavaScript y build

La carga inicial SHALL mantener exactamente los 3 scripts inline existentes (4,997 B) y la isla nueva SHALL diferirse (`client:visible`), compartiendo el runtime React ya presente. NO SHALL añadirse dependencias y `global.css` NO SHALL modificarse. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Carga inicial intacta con URL

- **WHEN** se construye con `PUBLIC_BOOKING_URL` configurada
- **THEN** la carga inicial conserva 3 scripts inline que suman 4,997 B y existe un chunk hasheado de `LazyEmbed` en `dist/_astro/`

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores, el build completa y `global.css` no tiene cambios

### Requirement: Integración y verificación por inspección

`index.astro` SHALL montar `<CtaFinal />` inmediatamente después de `<Faq />` y `<Footer slot="footer" />` en el slot nuevo de `BaseLayout`. El change SHALL verificarse por inspección directa del build (sin levantar preview): `id="contacto"` ×1, `href="#contacto"` ×2, firma presente, `cal.com` ausente del HTML inicial, chunk de `LazyEmbed` hasheado (con URL), `astro-island` = 2 con URL y = 1 sin URL, 3 scripts inline (4,997 B) y `global.css` sin cambios. El landmark del footer SHALL contarse por posición (tras `</main>` + firma), no por etiqueta (existe un `<footer>` previo dentro de un blockquote). Las comprobaciones visuales (banda navy y contraste, footer, click-to-load real con la URL del dueño) SHALL registrarse como verificaciones humanas pendientes.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el ancla única, los 2 enlaces resueltos, el footer tras `</main>`, la firma, la ausencia de `cal.com` inicial y los scripts sin cambios

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma la banda navy y sus contrastes, el footer, y con la URL de Cal.com configurada, que el embed carga solo al click y agenda correctamente
