# Design

## Context

Ver `proposal.md` para la motivación. Estado relevante:

- `StackStrip.astro` tiene un WIP sin commitear: el div de la cuadrícula carga contención + padding + bordes (`mx-auto max-w-6xl px-4 sm:px-6 grid border-t border-line sm:grid-cols-2`), con la llave `{` del mapeo fusionada en la misma línea.
- Mecánica del defecto: `border-t` se dibuja sobre el border-box (incluye padding) mientras las celdas viven en el content-box → la línea sobresale el padding por ambos lados; ninguna pieza tiene `border-l` → costado izquierdo abierto.
- La spec `landing-stackstrip` describe la cuadrícula como "full-bleed... cruza la banda de borde a borde".
- `data-motion="stack-power"` vive en el div de la cuadrícula; `motion.ts` pre-oculta `:scope li` y observa ese elemento.

## Goals / Non-Goals

**Goals:**

- Cerrar la tabla por sus cuatro lados con el doble contenedor (wrapper + retícula).
- Formalizar la cuadrícula contenida y enmarcada en la spec (retirar full-bleed).
- Absorber el WIP y dejar el componente limpio (comentario + formato).

**Non-Goals:**

- No tocar celdas, bandas, iconos, enlaces ni el hook de animación.
- No sincronizar la deriva de "16 tecnologías" (fuera de alcance, ya anotada).
- No tocar el header, el mensaje final ni otras secciones.

## Decisions

### 1. Bordes en la retícula interna, no en el wrapper

El wrapper solo posiciona y da padding; los bordes (`border-t`, `border-l`) viven en la retícula interna (post-padding). Ponerlos en el wrapper reproduciría el defecto (línea flotando en el padding, desalineada). Alternativa descartada.

### 2. Wrapper sin `w-full`

Un div block ya llena el ancho disponible; `max-w-6xl` lo limita y `mx-auto` lo centra. `w-full` es redundante (decisión del dueño: omitirla).

### 3. Alineación con el header

El wrapper replica `px-4 sm:px-6` del contenedor del header → el borde izquierdo de la tabla queda alineado con el inicio del texto del header; el texto de celdas queda +16 px dentro de la tabla (padding propio de celdas, se conserva).

### 4. Inventario de bordes (tabla cerrada, sin dobles)

Arriba: `border-t` de la retícula · Izquierda: `border-l` de la retícula · Derecha: `border-r` de bandas y celdas · Abajo: `border-b` de la última fila · Divisor central: `border-r` de los grupos impares. Móvil (1 columna) y `sm+` (2 columnas) quedan cerrados.

### 5. Motion intacto

`data-motion="stack-power"` permanece en la retícula interna → el observer y el pre-hide no cambian; el wrapper no participa.

### 6. Mecanismo del renombre de scenario (restricción del validador)

El validador de deltas exige que un bloque MODIFIED conserve todos los scenarios existentes por nombre, y rechaza REMOVED+ADDED con el mismo nombre de requisito. Para retirar el scenario "Cinta full-bleed" (obsoleto con la cuadrícula contenida) se aplica REMOVED del requisito completo + ADDED bajo el nombre "Franja de validación tras el hero con cuadrícula contenida", conservando el contenido íntegro y sin inventar nada. Alternativas descartadas: conservar el nombre obsoleto (contradice la directiva) o dejar el requisito sin tocar (deja el full-bleed vigente).

## Risks / Trade-offs

- [La contención cambia el lenguaje visual (full-bleed → contenida)] → Decisión explícita del dueño; la spec se actualiza en el mismo cambio.
- [El renombre del requisito deja historial REMOVED+ADDED] → Documentado aquí y en la Migration del delta; el nombre nuevo es descriptivo y el contenido es el mismo.
- [Deriva "16 tecnologías" no resuelta] → Non-goal anotado en el proposal.

## Migration Plan

1. Aplicar el refactor del componente (wrapper + retícula + comentario + formato) absorbiendo el WIP.
2. Verificación por inspección directa del build: wrapper presente, retícula con `border-t border-l`, hook `data-motion` ×1, 12 celdas, 4 etiquetas, 12 símbolos, 0 regresiones de copy.
3. `pnpm build` y `pnpm astro check` limpios.
4. Commit selectivo (sin push sin confirmación).
5. Rollback: revertir el commit (cambio de estructura aislado, sin migraciones).
