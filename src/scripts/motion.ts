/**
 * Precision Instrument — capa única de animación (Anime.js v4).
 *
 * Política (AGENTS.md §04 / design.md D3):
 * - Módulo externo diferido; nunca inline ni bloqueante.
 * - Hooks declarativos `data-motion="fade|draw|count|stack-power"`.
 * - `stack-power` delega en un chunk perezoso (`motion-stack.ts`).
 * - Duraciones 150–250 ms, easing de salida suave.
 * - Solo `transform` y `opacity`.
 * - Sin bucles; entradas de una sola pasada (IntersectionObserver).
 * - `prefers-reduced-motion: reduce` desactiva toda animación y deja el
 *   contenido visible en su estado final.
 * - El titular del hero (LCP) no lleva hooks y nunca se anima.
 */
import { animate, utils } from 'animejs';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const runCount = (el: HTMLElement): void => {
  const to = Number(el.dataset.countTo ?? '0');
  const decimals = Number(el.dataset.countDecimals ?? '0');
  const prefix = el.dataset.countPrefix ?? '';
  const suffix = el.dataset.countSuffix ?? '';
  const state = { value: 0 };

  animate(state, {
    value: to,
    duration: 250,
    ease: 'outQuad',
    onUpdate: () => {
      el.textContent = `${prefix}${state.value.toFixed(decimals)}${suffix}`;
    },
    onComplete: () => {
      el.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`;
    },
  });
};

if (!reduceMotion.matches) {
  const fadeEls = document.querySelectorAll<HTMLElement>('[data-motion~="fade"]');
  const drawEls = document.querySelectorAll<HTMLElement>('[data-motion~="draw"]');
  const countEls = document.querySelectorAll<HTMLElement>('[data-motion~="count"]');
  const stackEls = document.querySelectorAll<HTMLElement>('[data-motion~="stack-power"]');

  // Estado inicial solo cuando JS está activo: si el módulo no corre,
  // el contenido permanece visible (progressive enhancement).
  utils.set(fadeEls, { opacity: 0, translateY: 12 });
  utils.set(drawEls, { scaleX: 0, transformOrigin: 'left center' });
  for (const grid of stackEls) {
    utils.set(grid.querySelectorAll<HTMLElement>(':scope > li'), { opacity: 0, scale: 0.96 });
  }

  const observer = new IntersectionObserver(
    async (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        const kind = el.dataset.motion ?? '';

        if (kind.includes('fade')) {
          animate(el, { opacity: 1, translateY: 0, duration: 220, ease: 'outQuad' });
        } else if (kind.includes('draw')) {
          animate(el, { scaleX: 1, duration: 240, ease: 'outQuad' });
        } else if (kind.includes('count')) {
          runCount(el);
        } else if (kind.includes('stack-power')) {
          // El pulso de la cuadrícula vive en un chunk perezoso (waapi + spring + stagger).
          try {
            const { initStackMotion } = await import('./motion-stack');
            initStackMotion();
          } catch {
            // Fallback: si el chunk no carga, mostrar las celdas en su estado final.
            utils.set(el.querySelectorAll<HTMLElement>(':scope > li'), { opacity: 1, scale: 1 });
          }
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  for (const el of [...fadeEls, ...drawEls, ...countEls, ...stackEls]) {
    observer.observe(el);
  }
}
