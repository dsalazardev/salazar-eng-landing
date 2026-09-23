# Spec Delta: landing-base

## ADDED Requirements

### Requirement: Slot de footer en BaseLayout

`BaseLayout` SHALL exponer un slot `footer` renderizado después de `</main>`, de modo que las páginas puedan montar el chrome global de cierre (landmark `<footer>`) fuera de `<main id="contenido">`. El slot `header`, el `<main>` y el skip-link existentes NO SHALL alterarse.

#### Scenario: Footer fuera de main

- **WHEN** una página monta contenido en el slot `footer`
- **THEN** ese contenido se renderiza después de `</main>` y no dentro de `<main id="contenido">`

#### Scenario: Shell existente intacto

- **WHEN** se inspecciona el HTML construido
- **THEN** el skip-link sigue siendo el primer elemento enfocable y el contenido por defecto sigue dentro de `<main id="contenido">`
