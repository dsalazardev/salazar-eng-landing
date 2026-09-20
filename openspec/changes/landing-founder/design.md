# Design: Founder — Retrato, bio ejecutiva y credenciales verificables

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- M00–M07 completados y archivados. `index.astro` = `Navbar` + `Hero` + `StackStrip` + `ProblemSolution` + `Services` + `ProofOfWork` + `Process`. La sección se monta inmediatamente después de `Process`.
- Primitivos y patrones vigentes: `SectionLabel {index, text}`; **blockquote de M04** (`border-l-2 border-line pl-4 text-lg italic text-steel-500` + `<cite>`); lista `·` mono (M04/M05); **patrón de imagen de M02** (`Hero.astro:2-3,62-70`: `import { Image } from 'astro:assets'`, asset en `src/assets/`, `densities={[1, 2]}`, `format="webp"`, `width`/`height`); cruces `+` en esquinas del panel del Hero (`Hero.astro:48-51`). `Card` no se usa (el marco de la foto es un `div` con borde).
- Assets verificados: ⭐ `C:\Users\USUARIO\Downloads\15_jun_2026_10_19_36.png` (1023×1537, retrato business-casual, PNG 1.64 MB) es la única candidata real; `ARCHIVOS\Fotos\` (10 JPG 4096×3072) es material de clase (pizarras/laboratorio, 6/10 verificadas visualmente) y el banner `191.png` es una composición con datos de contacto (**privacidad**: no usar; solo fallback de foto).
- El sitio no menciona aún a ninguna persona: **M08 fija el precedente del título** (el brief §4.6 decía "ingeniero de software" — no sostenible hoy). **FLAG M10**: la FAQ del brief dice "un solo ingeniero senior" (§4.7 L194); resolver al construir la FAQ (no se toca aquí).
- Ritmo de secciones: …casos (banda `bg-white`) → proceso (plano) → **fundador (banda `bg-white` + `border-y`)** — alternancia bandas/planos.
- Contratos vigentes: 0 islas; 0 JS nuevo (solo el inline del navbar, 245 B); paleta estricta; §06 rige la verificación (inspección del build, sin preview).

## Goals / Non-Goals

**Goals:**

- Retrato tratado (grayscale + marco blueprint con cruces) con `astro:assets` optimizado.
- Bio verificable con el título honesto (D1), cita semántica y 3 credenciales.
- Hook `id="fundador"` sin tocar el contrato de anclas.
- 0 JS, sin dependencias, sin CLS (dimensiones explícitas).

**Non-Goals:**

- CTA, enlaces sociales, footer, ajustes a la FAQ (solo flag), animaciones, cambios en `global.css`/navbar/otras secciones.

## Decisions

### D1. Título del fundador (decisión crítica — fijada por el dueño)

- **Frase exacta en la bio**: "desarrollador de software y estudiante de último año de Ingeniería de Sistemas y Computación" (**carrera completa; no omitir "Computación"**).
- **Credencial académica**: "Ingeniería de Sistemas y Computación — Universidad de Caldas (en curso)".
- **Prohibido**: "ingeniero de software", "ingeniero senior" o cualquier atribución de titulación (cero claims no verificables).
- **FLAG M10**: la FAQ (§4.7 L194) repite el problema ("un solo ingeniero senior") → se resolverá al construir la FAQ; M08 sienta el precedente.
- *Alternativas registradas:* "desarrollador de software" a secas (menos transparente); ocultar el estudio (menos honesto) — descartadas por el dueño.

### D2. Foto: fuente y pipeline

- **Elegida**: ⭐ `C:\Users\USUARIO\Downloads\15_jun_2026_10_19_36.png` → en el apply se copia a **`src/assets/retrato-daner.png`**.
- **Render**: `astro:assets` — `format="webp"`, `densities={[1, 2]}`, `width`/`height` explícitos (1023×1537 o el slot), `loading="lazy"` (below the fold).
- **Descartadas**: `ARCHIVOS\Fotos\` (material de clase) y banner `191.png` (composición con datos de contacto — privacidad).

### D3. Tratamiento del retrato

- Slot **`aspect-[4/5]`** + **`object-cover object-top`** (el recorte 16.8% cae por abajo; el rostro queda protegido).
- **Escala de grises** (`grayscale`, decisión del dueño: on-brand con el sitio monocromático).
- **Marco**: `overflow-hidden rounded-md border border-line` + **cruces `+`** en las 4 esquinas (patrón Hero, `font-mono text-xs text-steel-500`, `aria-hidden`).
- *Alternativas registradas:* color natural; ratio nativo 2:3.

### D4. Layout

```
lg (>=1024):                            movil (<lg):
+------------------+  +--------------+  +---------------------------+
| [RETRATO 4:5]    |  | h2 lema      |  | 08/ FUNDADOR ----------   |
| grayscale +      |  | bio          |  | h2 lema                   |
| marco + cruces   |  | > cita       |  | [RETRATO 4:5]             |
| (lg:col-span-5)  |  | cierre       |  | bio · cita · cierre       |
+------------------+  | CREDENCIALES |  | CREDENCIALES              |
                      +--------------+  +---------------------------+
```

- Contenedor `mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24`; grid `gap-10 lg:grid-cols-12 lg:items-center`; foto `lg:col-span-5`, contenido `lg:col-span-7`.
- **Móvil: foto arriba** (conexión humana primero), tras el h2.

### D5. Jerarquía del copy

| Orden | Elemento | Estilo |
|---|---|---|
| 1 | `SectionLabel index="08" text="FUNDADOR"` | mono xs steel (patrón vigente) |
| 2 | `<h2>` lema | `mt-6 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl` |
| 3 | Bio (`<p>`, `<strong>Daner Salazar</strong>`) | `mt-6 text-navy-900` |
| 4 | Cita `<blockquote>` + `<cite>` | patrón M04 (`border-l-2 border-line pl-4 text-lg italic text-steel-500`); `cite` en mono xs steel |
| 5 | Cierre | `mt-6 font-semibold text-navy-900` |
| 6 | Label `CREDENCIALES` + lista `·` (3 ítems) | label mono xs steel; ítems `text-sm text-steel-500` con marcador `·` mono `text-line` (`aria-hidden`) |

### D6. Credenciales (set mínimo confirmado)

1. `Ingeniería de Sistemas y Computación — Universidad de Caldas (en curso)`
2. `Experiencia comercial en equipos internacionales`
3. `Portafolio de proyectos públicos verificables`

### D7. Sin enlaces sociales

GitHub/LinkedIn quedan para el footer (M11); M06 ya expone los repositorios. *Alternativa registrada:* un solo "GitHub →".

### D8. Estética: banda `bg-white` + `border-y`

`<section id="fundador" class="border-y border-line bg-white">`; **sin** corner marks de sección (ese device queda de M06; las cruces van solo en el marco de la foto).

### D9. Sin CTA

El LeadMagnet (M09) sigue inmediatamente y el navbar sticky ya ofrece "Agendar diagnóstico".

### D10. Accesibilidad

- **Alt descriptivo** (la foto es contenido): `"Daner Salazar, fundador de SALAZAR Eng."` (corto; no repetir la bio).
- `blockquote` + `cite` semánticos; `<h2>` de sección; sin interactivos (foco no aplica); contraste AA ✓.
- `loading="lazy"` + dimensiones explícitas (sin CLS).

### D11. Integración y verificación

- `<Founder />` en `index.astro` inmediatamente después de `<Process />`.
- **`id="fundador"` ×1** (hook interno; no está en el contrato de anclas).
- Verificación §06 en dist: `id="fundador"`=1, lema, "desarrollador de software y estudiante de último año de Ingeniería de Sistemas y Computación", "Sistemas y Computación" (×2: bio + credencial), 3 credenciales, asset WebP hasheado de la foto + `srcset` de 2 densidades + `loading="lazy"`, `scripts`=1, `astro-island`=0, `global.css` intacto, orden proceso → fundador.

### Datos y copy final (exacto)

```ts
const credentials: string[] = [
  'Ingeniería de Sistemas y Computación — Universidad de Caldas (en curso)',
  'Experiencia comercial en equipos internacionales',
  'Portafolio de proyectos públicos verificables',
];
```

| Elemento | Texto exacto |
|---|---|
| h2 | `Ingeniería primero. Marketing después.` |
| Bio | `SALAZAR Eng. fue fundada por Daner Salazar, desarrollador de software y estudiante de último año de Ingeniería de Sistemas y Computación, con experiencia comercial en equipos internacionales. Especializado en arquitectura limpia, cloud (AWS) e IA aplicada, Daner trabaja con una premisa:` |
| Cita | `el software es una inversión, no un gasto — cada proyecto se mide por el resultado de negocio que produce.` |
| Cite | `Daner Salazar` |
| Cierre | `Sin intermediarios, sin juniors rotando.` |

## Wireframes

**Desktop (≥lg):**

```
+--------------------------------------------------------------------------+
| [PROCESS · plano]                                                        |
+--------------------------------------------------------------------------+
| section#fundador (banda bg-white + border-y)                             |
|  container max-w-6xl px-6 py-16 lg:py-24                                 |
|   08/ FUNDADOR --------------------------------------------------        |
|   Ingenieria primero. Marketing despues.  (h2)                           |
|                                                                          |
|   +----------------------+   SALAZAR Eng. fue fundada por Daner          |
|   | +---+          +---+ |   Salazar, desarrollador de software y        |
|   | |   |  RETRATO |   | |   estudiante de ultimo ano de Ingenieria     |
|   | |   | grayscale|   | |   de Sistemas y Computacion, con...          |
|   | |   |  4:5      |   | |                                              |
|   | |   |  marco    |   | |   | "el software es una inversion, no un   |
|   | |   | border    |   | |   | gasto — cada proyecto se mide por el   |
|   | +---+          +---+ |   | resultado de negocio que produce."     |
|   +----------------------+                                              |
|                              Sin intermediarios, sin juniors rotando.    |
|                                                                          |
|                              CREDENCIALES                                |
|                               · Ingenieria de Sistemas y Computacion —   |
|                                 Universidad de Caldas (en curso)         |
|                               · Experiencia comercial en equipos         |
|                                 internacionales                          |
|                               · Portafolio de proyectos publicos         |
+--------------------------------------------------------------------------+
```

**Móvil (<lg):**

```
+-----------------------------------+
| [PROCESS]                         |
+-----------------------------------+
| 08/ FUNDADOR ----------------     |
| Ingenieria primero. Marketing     |
| despues.                          |
| +-------------------------------+ |
| | [RETRATO 4:5 grayscale]       | |
| | marco + cruces                | |
| +-------------------------------+ |
| SALAZAR Eng. fue fundada por...   |
| | "el software es una...        | |
| Sin intermediarios, sin juniors   |
| rotando.                          |
| CREDENCIALES                      |
|  · Ingenieria de Sistemas...      |
|  · Experiencia internacional...   |
|  · Portafolio publico...          |
+-----------------------------------+
```

**Jerarquía del copy:**

```
08/ FUNDADOR                        (mono xs steel)
Ingenieria primero. Marketing despues.    (h2 2xl/3xl bold navy)
  bio con <strong>Daner Salazar</strong>  (navy)
  > cita italic + cite                    (blockquote borde-l line)
  Sin intermediarios, sin juniors rotando. (semibold navy)
CREDENCIALES (label mono)  · 3 items      (text-sm steel, lista ·)
```

## Risks / Trade-offs

- [Recorte 4:5 puede cortar composición] → `object-top` protege el rostro; verificación humana del encuadre.
- [Resolución 1023 px] → cubre 2× hasta ~511 px CSS (columna 5/12 ≈ 420–460 px) ✓; si el slot creciera, `densities={[1]}` o pedir el original.
- [Grayscale es decisión estética] → revertir a color es 1 clase; alternativa registrada.
- [Datos de contacto del banner] → **no usar** (privacidad); solo la foto como fallback si la ⭐ faltara.
- [Alt redundante con la bio] → alt corto descriptivo ("Daner Salazar, fundador de SALAZAR Eng.").
- [Título "ingeniero" reaparece en M10 (FAQ)] → FLAG documentado; resolver en la FAQ.
- [Hook `#fundador` fuera del contrato] → no tocar ningún `href`; verificación de contrato intacto.

## Migration Plan

1. Copiar `C:\Users\USUARIO\Downloads\15_jun_2026_10_19_36.png` → `src/assets/retrato-daner.png` (apply; sin modificar el original).
2. Crear `src/components/sections/Founder.astro` (foto + bio + cita + cierre + credenciales).
3. Montar `<Founder />` en `index.astro` tras `<Process />`.
4. Verificar: `pnpm astro check` (0 errores), `pnpm build` + inspección del HTML/CSS (hook, textos, asset WebP + srcset + lazy, `scripts`=1, `global.css` intacto) y registrar verificaciones humanas.
5. Commit `feat(founder): retrato, bio ejecutiva y credenciales verificables` + commit aparte `docs(openspec): add landing-founder change artifacts`.

Rollback: revertir el commit y eliminar `src/assets/retrato-daner.png` si no se reintenta.

## Open Questions

- Ninguna bloqueante. Alternativas registradas (color natural, 2:3 nativo, link GitHub) quedan como variantes futuras si el dueño las pide.
