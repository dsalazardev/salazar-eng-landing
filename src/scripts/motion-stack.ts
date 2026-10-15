/**
 * Precision Instrument — animación de listas y de la cuadrícula de Stack
 * (chunk perezoso).
 *
 * Se importa dinámicamente desde `motion.ts` cuando una lista
 * (`stagger-list`) o la cuadrícula (`stack-power`) entra al viewport:
 * `waapi` + `stagger` solo se descargan a demanda, manteniendo la carga
 * base del módulo dentro del presupuesto (objetivo ≤ 15 KB gzip).
 *
 * Política (openspec landing-base): entrada asentada, 520 ms, ease 'out(4)',
 * stagger 90 ms por elemento, solo `transform`/`opacity`, sin bucles, una sola
 * pasada y `prefers-reduced-motion: reduce` desactiva todo dejando el contenido
 * visible.
 */
import { stagger, waapi } from 'animejs';

const LIST_DURATION = 520;
const LIST_STAGGER = 90;

export function initListMotion(
  items: NodeListOf<HTMLElement> | HTMLElement[],
  staggerMs: number = LIST_STAGGER,
): void {
  const targets = Array.from(items);
  if (targets.length === 0) {
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  waapi.animate(targets, {
    opacity: [0, 1],
    y: [20, 0],
    duration: LIST_DURATION,
    ease: 'out(4)',
    delay: stagger(staggerMs),
  });
}
