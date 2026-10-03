/**
 * Precision Instrument — animación de la cuadrícula de Stack (chunk perezoso).
 *
 * Se importa dinámicamente desde `motion.ts` cuando la sección Stack entra
 * al viewport: `waapi` + `stagger` solo se descargan a demanda, manteniendo
 * `motion.js` (carga base) dentro del presupuesto ≤ 15 KB gzip.
 *
 * Política (AGENTS.md §04): entrada sutil, 240 ms, ease 'out(3)', stagger 50 ms,
 * solo `transform`/`opacity` (`y` → translateY con la unidad px automática de
 * WAAPI), sin bucles, una sola pasada y `prefers-reduced-motion: reduce`
 * desactiva todo dejando la cuadrícula visible.
 */
import { stagger, utils, waapi } from 'animejs';

export function initStackMotion(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const grids = document.querySelectorAll<HTMLElement>('[data-motion~="stack-power"]');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        observer.unobserve(entry.target);
        const cells = (entry.target as HTMLElement).querySelectorAll<HTMLElement>(':scope > li');
        // Pre-estado idempotente (motion.ts ya oculta las celdas al cargar).
        // Sin unidades: WAAPI añade px automáticamente para `y`.
        utils.set(cells, { opacity: 0, y: 20 });
        waapi.animate(cells, {
          opacity: [0, 1],
          y: [20, 0],
          duration: 240,
          ease: 'out(3)',
          delay: stagger(50),
        });
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  for (const grid of grids) {
    observer.observe(grid);
  }
}
