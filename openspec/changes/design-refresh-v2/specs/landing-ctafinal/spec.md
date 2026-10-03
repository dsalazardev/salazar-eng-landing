# Spec Delta: landing-ctafinal — Design Refresh v2

## ADDED Requirements

### Requirement: Rediseño Precision Instrument del cierre

La sección SHALL adoptar el tratamiento de "consola oscura de cierre" del diseño aprobado: banda navy-900 full-bleed con retícula técnica sutil, jerarquía reforzada del h2 y del CTA, y motion de cierre sutil (entrada y transición del CTA) aportado por la capa global. El copy, el fallback de agendamiento, la alternativa por email/WhatsApp, el footer y el contrato del ancla NO SHALL alterarse.

#### Scenario: Consola de cierre aplicada

- **WHEN** se inspecciona la sección construida
- **THEN** la banda navy conserva su full-bleed con retícula técnica sutil y el CTA mantiene su contrato (Cal.com o fallback)

#### Scenario: Copy y footer intactos

- **WHEN** se revisa la sección y el footer
- **THEN** h2, párrafo, microcopy, contacto y firma coinciden verbatim con el contenido existente

## MODIFIED Requirements

### Requirement: Presupuesto de JavaScript y build

La carga inicial SHALL mantener exactamente los 3 scripts inline existentes y la isla de agendamiento (cuando exista) SHALL seguir difiriéndose (`client:visible`), compartiendo el runtime React ya presente. La capa global de animación SHALL cargarse como chunk externo diferido (fuera de la carga inicial crítica). NO SHALL añadirse dependencias nuevas y `global.css` PUEDE ganar utilidades del sistema Precision Instrument manteniendo los 6 tokens. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Carga inicial intacta con URL

- **WHEN** se construye con `PUBLIC_BOOKING_URL` configurada
- **THEN** la carga inicial conserva los 3 scripts inline y existe un chunk hasheado de `LazyEmbed` en `dist/_astro/`, sin el módulo de animación en la carga inicial

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores, el build completa y los 6 tokens conservan sus valores

### Requirement: Integración y verificación por inspección

`index.astro` SHALL montar `<CtaFinal />` inmediatamente después de `<Faq />` y `<Footer slot="footer" />` en el slot nuevo de `BaseLayout`. El change SHALL verificarse por inspección directa del build (sin levantar preview): `id="contacto"` ×1, `href="#contacto"` ×2, firma presente, `cal.com` ausente del HTML inicial, chunk de `LazyEmbed` hasheado (con URL), `astro-island` = 2 con URL y = 1 sin URL, 3 scripts inline y las utilidades del rediseño presentes con los 6 tokens intactos. El landmark del footer SHALL contarse por posición (tras `</main>` + firma), no por etiqueta (existe un `<footer>` previo dentro de un blockquote). Las comprobaciones visuales (banda navy y contraste, footer, click-to-load real con la URL del dueño) SHALL registrarse como verificaciones humanas pendientes.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el ancla única, los 2 enlaces resueltos, el footer tras `</main>`, la firma, la ausencia de `cal.com` inicial y los scripts sin cambios

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma la banda navy y sus contrastes, el footer, y con la URL de Cal.com configurada, que el embed carga solo al click y agenda correctamente
