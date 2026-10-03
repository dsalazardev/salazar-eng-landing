/**
 * Precision Instrument — animación de la sección Stack (chunk perezoso).
 *
 * Se importa dinámicamente desde `motion.ts` cuando la sección Stack entra
 * al viewport: `waapi` + `stagger` solo se descargan a demanda, manteniendo
 * `motion.js` (carga base) dentro del presupuesto ≤ 15 KB gzip.
 *
 * Política (AGENTS.md §04): fade-in por bloque (240 ms, 'out(3)', stagger 60),
 * fade simple del mensaje final (200 ms), solo `opacity`/`transform` (`y` con
 * la unidad px automática de WAAPI), una sola pasada y
 * `prefers-reduced-motion: reduce` desactiva todo dejando el contenido visible.
 */
import { stagger, utils, waapi } from 'animejs';

export function initStackMotion(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const grids = document.querySelectorAll<HTMLElement>('[data-motion~="stack-power"]');
  const messages = document.querySelectorAll<HTMLElement>('[data-motion~="stack-message"]');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        observer.unobserve(entry.target);
        const blocks = (entry.target as HTMLElement).querySelectorAll<HTMLElement>(':scope > div');
        // Pre-estado idempotente (motion.ts ya oculta los bloques al cargar).
        // Sin unidades: WAAPI añade px automáticamente para `y`.
        utils.set(blocks, { opacity: 0, y: 16 });
        waapi.animate(blocks, {
          opacity: [0, 1],
          y: [16, 0],
          duration: 240,
          ease: 'out(3)',
          delay: stagger(60),
        });
        // Mensaje final: fade simple después de los bloques.
        utils.set(messages, { opacity: 0 });
        waapi.animate(messages, {
          opacity: [0, 1],
          duration: 200,
          delay: 400,
        });
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  for (const grid of grids) {
    observer.observe(grid);
  }
}
