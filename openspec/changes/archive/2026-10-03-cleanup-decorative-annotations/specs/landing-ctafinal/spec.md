# Spec Delta: landing-ctafinal — Cleanup de anotaciones decorativas

## MODIFIED Requirements

### Requirement: Footer con firma tras el main

El footer SHALL renderizarse como landmark `<footer>` **después de `</main>`** (fuera de `<main id="contenido">`), sobre la banda navy continua y separado del CTA por una línea fina (`white/10`). SHALL mostrar exclusivamente: la firma "— SALAZAR Eng. · Software & Applied AI", el contacto (email `daneralejandro03@gmail.com` y WhatsApp `https://wa.me/573145919465`), los enlaces de navegación (`#servicios`, `#casos`, `#proceso`, `#faq`) y `© <año> SALAZAR Eng.` con el año calculado en build (0 JS). El footer NO SHALL incluir metadatos de instrumento ni notas editoriales (la línea `COLOPHON // SOFTWARE & APPLIED AI` queda eliminada). El footer SHALL mostrar el isotipo blanco cuando el asset verificado exista; en su defecto SHALL omitirlo y conservar la firma textual, dejando el TODO del logo documentado.

#### Scenario: Landmark fuera de main

- **WHEN** se inspecciona el HTML construido
- **THEN** existe un `<footer>` de página después de `</main>` y la firma "SALAZAR Eng. · Software & Applied AI" está presente

#### Scenario: Contenido del footer

- **WHEN** se revisa el footer construido
- **THEN** muestra firma, contacto (email y WhatsApp), los 4 enlaces de navegación y el copyright con el año de build, sin `COLOPHON` ni otras anotaciones

#### Scenario: Sin metadatos de instrumento

- **WHEN** se busca en el HTML construido del footer
- **THEN** la cadena `COLOPHON` no aparece

#### Scenario: Logo condicional verificado

- **WHEN** el asset `src/assets/isotipo-white.png` está disponible y su trazo claro supera 3:1 contra navy-900 (muestreo de píxeles)
- **THEN** el footer muestra el isotipo con dimensiones explícitas y `alt` de marca

#### Scenario: Footer sin logo (respaldo)

- **WHEN** el asset verificado no está disponible al aplicar
- **THEN** el footer muestra solo la firma textual y el TODO del logo queda documentado
