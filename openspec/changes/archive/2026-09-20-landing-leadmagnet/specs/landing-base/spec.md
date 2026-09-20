# Spec Delta

## REMOVED Requirements

### Requirement: Build estático sin JavaScript de islas

**Reason**: Superado por la primera isla del sitio (M09): el loader de islas forma parte de la carga inicial, por lo que el enunciado literal ("no incluye JavaScript de islas") deja de ser cierto.

**Migration**: Sustituido por "Build estático con presupuesto de JavaScript" (misma capability), que fija el presupuesto de la carga inicial (< 10 KB: navbar + loader) y el diferido de runtimes de islas hasta el viewport.

## ADDED Requirements

### Requirement: Build estático con presupuesto de JavaScript

`pnpm build` SHALL completar y producir HTML estático cuya carga inicial SHALL mantenerse por debajo de 10 KB de JavaScript — el script inline del navbar (245 B) más el loader de islas de Astro cuando existan islas — difiriendo cualquier runtime de framework hasta que su isla entre en el viewport (`client:visible`); el CSS construido SHALL incluir los tokens y utilidades generados desde el tema.

#### Scenario: Carga inicial bajo presupuesto

- **WHEN** se inspecciona el HTML construido con islas diferidas
- **THEN** la carga inicial incluye únicamente el script inline del navbar y el loader de islas, sumando menos de 10 KB

#### Scenario: Runtimes de islas diferidos

- **WHEN** una isla hidratada con `client:visible` está fuera del viewport inicial
- **THEN** el runtime del framework no forma parte de la carga inicial y se descarga solo al acercarse al viewport
