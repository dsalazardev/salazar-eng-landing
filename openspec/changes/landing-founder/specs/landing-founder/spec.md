# Spec Delta

## Purpose

Sección de confianza con retrato tratado (grayscale y marco blueprint), bio ejecutiva, cita, cierre y credenciales verificables, inmediatamente posterior al método, con el hook `id="fundador"`.

## ADDED Requirements

### Requirement: Sección del fundador tras el método

La sección SHALL ser la inmediatamente posterior a la de proceso y SHALL mostrar un encabezado con la etiqueta "08/ FUNDADOR" y un `<h2>` "Ingeniería primero. Marketing después.", seguido del retrato, la bio, la cita, el cierre y las credenciales.

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la de proceso y muestra la etiqueta "08/ FUNDADOR" y el h2 "Ingeniería primero. Marketing después."

### Requirement: Hook `id="fundador"`

La sección SHALL exponer `id="fundador"` exactamente una vez como hook interno, sin alterar los destinos del contrato de anclas del navbar.

#### Scenario: Hook presente

- **WHEN** se inspecciona el HTML construido
- **THEN** existe exactamente un `id="fundador"` y los destinos del navbar (`#servicios`, `#casos`, `#proceso`, `#faq`, `#contacto`) conservan sus valores

### Requirement: Título verificable del fundador

La bio SHALL identificar a Daner Salazar como "desarrollador de software y estudiante de último año de Ingeniería de Sistemas y Computación" (carrera completa, sin omitir "Computación") con experiencia comercial en equipos internacionales; la sección NO SHALL usar el título "ingeniero" ni atribuir titulación alguna. La credencial académica SHALL declarar "Ingeniería de Sistemas y Computación — Universidad de Caldas (en curso)".

#### Scenario: Título sin claim de titulación

- **WHEN** se inspecciona el texto construido
- **THEN** aparece "desarrollador de software y estudiante de último año de Ingeniería de Sistemas y Computación" y no aparece "ingeniero de software" ni "ingeniero senior"

#### Scenario: Credencial académica en curso

- **WHEN** se revisan las credenciales
- **THEN** la universidad aparece con la carrera completa y la marca "(en curso)"

### Requirement: Retrato tratado con marco blueprint

La sección SHALL mostrar el retrato del fundador con escala de grises, en un slot `aspect-[4/5]` con recorte `object-cover object-top`, dentro de un marco `border-line` con cruces `+` en las esquinas (patrón del panel del Hero); la imagen SHALL renderizarse vía `astro:assets` en formato WebP con dimensiones explícitas, `densities={[1, 2]}` y `loading="lazy"`.

#### Scenario: Tratamiento del retrato

- **WHEN** se inspecciona la sección construida
- **THEN** el retrato aparece en grayscale dentro del marco con cruces y recortado a 4:5 protegiendo el rostro

#### Scenario: Imagen optimizada

- **WHEN** se inspecciona el HTML construido
- **THEN** la imagen usa un asset WebP hasheado con `width`/`height` explícitos, `srcset` de 2 densidades y `loading="lazy"`

### Requirement: Jerarquía del copy

La sección SHALL presentar en este orden: `<h2>` lema; bio con `<strong>Daner Salazar</strong>`; cita en `<blockquote>` con `<cite>Daner Salazar</cite>`; cierre "Sin intermediarios, sin juniors rotando."; label mono "CREDENCIALES" con la lista de 3 ítems.

#### Scenario: Orden de los elementos

- **WHEN** se inspecciona la sección construida
- **THEN** h2, bio, blockquote con cite, cierre y credenciales aparecen en ese orden

#### Scenario: Cita semántica

- **WHEN** se revisa la cita
- **THEN** es un `<blockquote>` con la frase fijada y un `<cite>` con "Daner Salazar"

### Requirement: Credenciales verificables

Las credenciales SHALL ser exactamente 3 y verificables: "Ingeniería de Sistemas y Computación — Universidad de Caldas (en curso)", "Experiencia comercial en equipos internacionales" y "Portafolio de proyectos públicos verificables". La sección NO SHALL incluir certificaciones, empresas ni credenciales no listadas.

#### Scenario: Set mínimo de credenciales

- **WHEN** se revisan las credenciales
- **THEN** aparecen exactamente los 3 ítems fijados en una lista con marcador `·`

#### Scenario: Sin credenciales inventadas

- **WHEN** se inspecciona la sección construida
- **THEN** no hay certificaciones, empresas ni claims fuera del set fijado

### Requirement: Sin enlaces sociales ni CTA

La sección NO SHALL incluir enlaces sociales (GitHub/LinkedIn quedan para el footer de M11) ni CTA propio (M09/M11 cubren la conversión).

#### Scenario: Cero enlaces y CTA

- **WHEN** se revisa la sección construida
- **THEN** no hay enlaces sociales ni botones/CTA

### Requirement: Sin JavaScript nuevo

La sección SHALL añadir 0 JavaScript (sin islas ni scripts); el único script del sitio SHALL seguir siendo el inline del navbar. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar. `global.css` NO SHALL modificarse y NO SHALL añadirse dependencias.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** no hay scripts ni islas asociados a la sección

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores

### Requirement: Accesibilidad y responsive

La foto SHALL tener alt descriptivo (es contenido); la sección SHALL exponer un `<h2>`; el layout SHALL ser de 2 columnas en `lg` (foto izquierda, contenido derecha) y de una columna en móvil (foto arriba), sin desbordamiento horizontal entre 320 y 1440 px.

#### Scenario: Alt descriptivo y semántica

- **WHEN** se inspecciona el HTML construido
- **THEN** la imagen tiene alt descriptivo y la sección un `<h2>`

#### Scenario: Disposición responsive

- **WHEN** el viewport es `lg` o mayor
- **THEN** foto y contenido se distribuyen en 2 columnas; en móvil la foto aparece arriba, sin scroll lateral

### Requirement: Verificación por inspección

El change SHALL verificarse por inspección directa del build (sin levantar preview): `id="fundador"` ×1, lema h2, frase del título, "Sistemas y Computación" (×2: bio y credencial), credenciales, asset WebP hasheado de la foto, único script inline del navbar y `global.css` sin cambios; las comprobaciones visuales (encuadre 4:5, grayscale, marco con cruces, responsive 320→1440) SHALL registrarse como verificaciones humanas pendientes del dueño.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el hook único, los textos fijados, el asset WebP, el único script inline y la ausencia de cambios en `global.css`

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma el encuadre del retrato (rostro protegido), el grayscale, el marco con cruces y la ausencia de desbordamientos entre 320 y 1440 px
