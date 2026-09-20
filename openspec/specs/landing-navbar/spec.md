# landing-navbar Specification

## Purpose

Define la navegación principal del sitio: navbar sticky con CTA persistente, anclas de sección y menú móvil nativo operable sin frameworks, integrado al shell con accesibilidad y presupuesto de JS controlados.

## Requirements

### Requirement: Integración en el shell sin romper la base

El navbar SHALL integrarse mediante el slot `header` de `BaseLayout`, renderizando un elemento `<header>` fuera de `<main id="contenido">`. El skip-link SHALL seguir siendo el primer elemento enfocable y apuntar a `#contenido`, y los metadatos SEO/OG del layout SHALL permanecer intactos.

#### Scenario: Orden estructural correcto

- **WHEN** una página usa `BaseLayout` y pasa el navbar al slot `header`
- **THEN** el HTML resultante ordena skip-link, luego el `<header>` del navbar, luego `<main id="contenido">` con el contenido de la página

#### Scenario: Base intacta

- **WHEN** se inspecciona el HTML construido
- **THEN** el skip-link "Saltar al contenido" apunta a `#contenido` y las etiquetas de título, description y Open Graph del layout siguen presentes

### Requirement: Navbar sticky con CTA siempre visible

El navbar SHALL permanecer fijo en el borde superior al hacer scroll (sticky). SHALL mostrar el wordmark de marca enlazando al inicio y un CTA primario que enlaza a `#contacto`, visible tanto en desktop como en móvil; en pantallas pequeñas el CTA SHALL usar una etiqueta corta y en pantallas mayores la etiqueta completa.

#### Scenario: Persistencia al scrollear

- **WHEN** el usuario desplaza la página hacia abajo
- **THEN** el navbar permanece visible en el borde superior y por encima del contenido

#### Scenario: CTA visible en ambos tamaños

- **WHEN** se renderiza la página en viewport móvil y en desktop
- **THEN** el CTA aparece en ambos casos con destino `#contacto` (etiqueta corta "Agendar" en móvil, "Agendar diagnóstico" en desktop)

#### Scenario: Wordmark navega al inicio

- **WHEN** el usuario activa el wordmark
- **THEN** la navegación va al inicio del sitio

### Requirement: Navegación desktop por anclas

En desktop, el navbar SHALL mostrar los 4 enlaces de ancla con los destinos exactos `#servicios`, `#casos`, `#proceso` y `#faq`, en ese orden (narrativa de conversión). Los saltos de ancla SHALL compensar la altura del header sticky para que el destino no quede oculto.

#### Scenario: Enlaces con contrato de anclas

- **WHEN** se renderiza la vista desktop
- **THEN** los 4 enlaces están presentes, visibles y con esos `href` exactos

#### Scenario: El header no oculta el destino

- **WHEN** se activa un enlace de ancla
- **THEN** la sección destino queda visible por debajo del header sticky (offset de scroll aplicado)

### Requirement: Menú móvil nativo sin frameworks

En viewports pequeños, el navbar SHALL ofrecer un menú operable con la Popover API nativa (`popover` + invocador), sin islas ni librerías: abre y cierra con el botón, se cierra con Escape y con clic fuera del panel (light dismiss), y bloquea el scroll del documento mientras está abierto. Al activar un enlace del panel, el menú SHALL cerrarse y navegar al ancla (único micro-script inline del sitio). El icono del botón SHALL reflejar el estado abierto/cerrado.

#### Scenario: Apertura y cierre por botón

- **WHEN** se pulsa el botón de menú en móvil y luego el mismo botón en estado abierto
- **THEN** el panel aparece anclado bajo el header y luego se cierra, con el icono alternando entre menú y cierre

#### Scenario: Cierre con Escape y foco de retorno

- **WHEN** el panel está abierto y el usuario pulsa Escape
- **THEN** el panel se cierra y el foco vuelve al botón que lo abrió

#### Scenario: Cierre al navegar

- **WHEN** el usuario activa uno de los enlaces dentro del panel abierto
- **THEN** el panel se cierra y la página navega al ancla correspondiente

#### Scenario: Scroll bloqueado con panel abierto

- **WHEN** el panel móvil está abierto
- **THEN** el desplazamiento del documento queda bloqueado hasta cerrarlo

### Requirement: Accesibilidad y marca

El navbar SHALL exponer landmarks de navegación con nombres accesibles distintos para desktop y móvil (excluyentes por breakpoint), un botón de menú con nombre accesible cuyo estado expandido/colapsado se anuncie de forma nativa, áreas táctiles de al menos 44×44 px y foco visible en todos los elementos interactivos. SHALL reutilizar los tokens y primitivos existentes (incluido `Button` y los iconos `lucide-astro`), sin colores fuera de los 6 tokens ni dependencias nuevas.

#### Scenario: Landmarks y estado del botón

- **WHEN** un lector de pantalla recorre la página
- **THEN** encuentra una navegación principal en desktop y una navegación de menú móvil cuando el panel está disponible, y el botón de menú anuncia su estado expandido/colapsado

#### Scenario: Área táctil y foco visible

- **WHEN** se mide el botón de menú y se navega con teclado
- **THEN** el área táctil es al menos 44×44 px y cada elemento interactivo del navbar muestra indicador de foco visible

#### Scenario: Solo tokens y sin dependencias nuevas

- **WHEN** se inspecciona el CSS construido y `package.json`
- **THEN** no aparecen colores fuera de los 6 tokens y no se añaden dependencias

### Requirement: Presupuesto de JS y build limpio

El navbar SHALL añadir 0 islas hidratadas; el único JavaScript del navbar SHALL ser el micro-script inline de cierre del menú móvil, muy por debajo del presupuesto de 10 KB de JS inicial. `pnpm build` SHALL completar y `pnpm astro check` SHALL terminar con 0 errores.

#### Scenario: HTML sin islas

- **WHEN** se inspecciona el HTML construido
- **THEN** no hay `client:*` ni scripts de islas y el único script presente es el inline de cierre del menú

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores

### Requirement: Degradación sin Popover API

En navegadores sin soporte de la Popover API, la navegación SHALL seguir siendo completa: los enlaces del navbar SHALL permanecer visibles y navegables (presentación inline) y el CTA SHALL conservarse, sin paneles ni botones rotos.

#### Scenario: Navegación garantizada sin popover

- **WHEN** el navegador no soporta `:popover-open`
- **THEN** los 4 enlaces de ancla y el CTA siguen visibles y operables, y no aparece un panel roto ni un botón sin función
