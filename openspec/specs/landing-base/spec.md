# landing-base Specification

## Purpose

Define la base técnica observable del sitio: identidad de marca (tokens y tipografías), shell de layout con SEO y accesibilidad, primitivos de UI reutilizables y garantías de build estático sin JavaScript, sobre las que se construyen las 11 secciones de la landing.

## Requirements

### Requirement: Tokens de marca expuestos como utilidades de Tailwind v4

El sistema SHALL definir los 6 tokens de la paleta estricta (`navy-900`, `navy-700`, `steel-500`, `surface`, `line`, `accent`) dentro del tema CSS-first de Tailwind v4 (sin archivo de configuración), de forma que existan las utilidades `bg-navy-900`, `bg-navy-700`, `text-steel-500`, `border-line`, `bg-surface` y `text-accent`, además de sus equivalentes de texto, fondo y borde. No SHALL introducirse ningún color fuera de esos 6 tokens.

#### Scenario: Utilidades de color generadas

- **WHEN** una página o componente usa `bg-navy-900`, `text-steel-500`, `border-line` o `bg-surface`
- **THEN** el CSS construido contiene esas utilidades con los valores #0B2545, #64748B, #CBD5E1 y #F8FAFC respectivamente

#### Scenario: Texturas blueprint conservadas

- **WHEN** se usa `.bg-blueprint-grid` o `.bg-dot-pattern`
- **THEN** el fondo renderiza el grid de líneas o el patrón de puntos con las mismas reglas CSS previas a este change

#### Scenario: Nombres de token antiguos eliminados

- **WHEN** se inspecciona el CSS construido en busca de `--color-navy-primary`, `--color-bg-light` o `--color-accent-blue`
- **THEN** no existe ninguna definición con esos nombres

### Requirement: Tipografías self-hosted

Manrope (texto principal) y JetBrains Mono (etiquetas técnicas) SHALL servirse desde el propio origen del sitio como fuentes variables, de modo que la carga inicial no realice ninguna request a `fonts.googleapis.com` ni `fonts.gstatic.com`. Manrope SHALL aplicarse por defecto al texto y JetBrains Mono SHALL estar disponible como familia mono del tema.

#### Scenario: Carga local de fuentes

- **WHEN** se carga la página en `pnpm preview` con la pestaña Network abierta
- **THEN** los archivos `woff2` provienen del origen local y no hay requests a dominios externos de fuentes

#### Scenario: Aplicación de familias

- **WHEN** se renderiza texto normal y texto con la familia mono
- **THEN** el texto normal usa Manrope y el mono usa JetBrains Mono

### Requirement: Shell de layout con SEO y accesibilidad

`BaseLayout` SHALL aceptar `title`, `description` y `ogImage` opcional, y SHALL renderizar `lang="es"`, charset UTF-8, viewport, `theme-color` #0B2545, `<title>`, meta description, Open Graph (`og:type=website`, `og:site_name="SALAZAR Eng."`, `og:title`, `og:description`, `og:locale=es_CO`, `og:image`) y Twitter card `summary_large_image`. El documento SHALL iniciar con un skip-link "Saltar al contenido" que apunta a `#contenido` y se hace visible al recibir foco, y el contenido de cada página SHALL renderizarse dentro de `<main id="contenido">`.

#### Scenario: Metadatos básicos presentes

- **WHEN** una página se construye usando `BaseLayout` con `title` y `description`
- **THEN** el HTML resultante contiene `<html lang="es">`, el título, la meta description, las etiquetas Open Graph y la Twitter card indicadas

#### Scenario: og:image por defecto

- **WHEN** una página usa `BaseLayout` sin la prop `ogImage`
- **THEN** el meta `og:image` apunta a `/og-default.png`

#### Scenario: Skip-link accesible

- **WHEN** un usuario navega con teclado y enfoca el primer elemento interactivo
- **THEN** aparece el enlace "Saltar al contenido" y al activarlo la navegación va a `#contenido`, el `<main>` que envuelve el slot

### Requirement: Primitivos de UI reutilizables

`Button`, `Badge`, `SectionLabel` y `Card` SHALL ser componentes estáticos (sin JavaScript de cliente) con props tipadas en modo estricto. Cada uno SHALL fusionar las clases externas recibidas con sus clases por defecto, de forma que una clase del consumidor prevalezca sobre un valor por defecto en conflicto. `Button` SHALL renderizar un `<a>` cuando recibe `href` y un `<button type="button">` cuando no, con variantes `primary`/`outline` y tamaños `md`/`lg`. `Badge` SHALL mostrar su slot en estilo mono/uppercase con borde. `SectionLabel` SHALL mostrar `{index}/ {text}` junto a una línea fina. `Card` SHALL ser un contenedor con borde y fondo blanco, con cambio de borde en hover cuando `interactive` es verdadero.

#### Scenario: Button como enlace o como botón

- **WHEN** se usa `<Button href="/x">` y `<Button>` sin href
- **THEN** el primero renderiza un ancla con ese destino y el segundo un `<button type="button">`

#### Scenario: Variantes y tamaños de Button

- **WHEN** se usa `variant="primary"`, `variant="outline"`, `size="md"` o `size="lg"`
- **THEN** cada combinación aplica su estilo (primary: fondo accent con hover navy-900; outline: borde sutil con hover accent) y su densidad de padding/texto correspondiente

#### Scenario: Fusión de clases externas

- **WHEN** el consumidor pasa una clase que entra en conflicto con una clase por defecto del componente
- **THEN** la clase del consumidor prevalece y no quedan ambas utilidades en conflicto en el atributo `class` resultante

#### Scenario: Card interactiva

- **WHEN** se usa `<Card interactive>`
- **THEN** el contenedor cambia el borde en hover; sin `interactive` no cambia

### Requirement: Build estático con presupuesto de JavaScript

`pnpm build` SHALL completar y producir HTML estático cuya carga inicial SHALL mantenerse por debajo de 10 KB de JavaScript — el script inline del navbar (245 B) más el loader de islas de Astro cuando existan islas — difiriendo cualquier runtime de framework hasta que su isla entre en el viewport (`client:visible`); el CSS construido SHALL incluir los tokens y utilidades generados desde el tema.

#### Scenario: Carga inicial bajo presupuesto

- **WHEN** se inspecciona el HTML construido con islas diferidas
- **THEN** la carga inicial incluye únicamente el script inline del navbar y el loader de islas, sumando menos de 10 KB

#### Scenario: Runtimes de islas diferidos

- **WHEN** una isla hidratada con `client:visible` está fuera del viewport inicial
- **THEN** el runtime del framework no forma parte de la carga inicial y se descarga solo al acercarse al viewport

### Requirement: Verificación de tipos limpia

`pnpm astro check` SHALL ejecutarse como parte de la aceptación del change.

#### Scenario: Type-check sin errores

- **WHEN** se ejecuta `pnpm astro check`
- **THEN** el comando termina con 0 errores
