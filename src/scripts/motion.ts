/**
 * Precision Instrument — capa única de animación (Anime.js v4).
 *
 * Política (AGENTS.md §04 / openspec landing-base):
 * - Módulo externo; nunca inline ni bloqueante, sin scripts inline nuevos.
 * - Hooks declarativos: `fade | fade-up-lg | fade-scale | draw | draw-v | count | stagger-list | stack-power`.
 * - Modificadores leídos del DOM: `data-motion-delay`, `data-motion-stagger`.
 * - `stagger-list` y `stack-power` delegan en un chunk perezoso (`motion-stack.ts`).
 * - Escala "Slow & Elegant": reveals 560/640 ms, trazos 720/820 ms, conteo 1100 ms,
 *   stagger 90 ms; easings de salida suave (`outQuart`, `outExpo`, bezier).
 * - Solo `transform` y `opacity`; nunca `filter`/`blur`.
 * - Sin bucles; entradas de una sola pasada (IntersectionObserver).
 * - `prefers-reduced-motion: reduce` desactiva toda animación (incluido el pulse
 *   de anclas) y deja el contenido visible en su estado final.
 * - El titular del hero (LCP) y el contenido del hero sobre el pliegue no se animan.
 */
import { animate, utils } from 'animejs';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Escala temporal única del sistema (sustituye la banda 150–250 ms). */
const DUR = {
  reveal: 560,
  revealLg: 640,
  draw: 720,
  drawV: 820,
  count: 1100,
} as const;

const EASE = {
  settle: 'outQuart',
  dramatic: 'outExpo',
  refined: 'cubicBezier(0.22, 1, 0.36, 1)',
} as const;

const byToken = (token: string): NodeListOf<HTMLElement> =>
  document.querySelectorAll<HTMLElement>(`[data-motion~="${token}"]`);

/** Hijos directos de una lista que no son, a su vez, un target de animación. */
const LIST_CHILD_SELECTOR = ':scope > *:not([data-motion])';

const delayOf = (el: HTMLElement): number => Number(el.dataset.motionDelay ?? 0);

const runCount = (el: HTMLElement): void => {
  const to = Number(el.dataset.countTo ?? '0');
  const decimals = Number(el.dataset.countDecimals ?? '0');
  const prefix = el.dataset.countPrefix ?? '';
  const suffix = el.dataset.countSuffix ?? '';
  const state = { value: 0 };

  animate(state, {
    value: to,
    duration: DUR.count,
    ease: EASE.dramatic,
    onUpdate: () => {
      el.textContent = `${prefix}${state.value.toFixed(decimals)}${suffix}`;
    },
    onComplete: () => {
      el.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`;
    },
  });
};

if (!reduceMotion.matches) {
  const fadeEls = byToken('fade');
  const fadeLgEls = byToken('fade-up-lg');
  const scaleEls = byToken('fade-scale');
  const drawEls = byToken('draw');
  const drawVEls = byToken('draw-v');
  const countEls = byToken('count');
  const listEls = byToken('stagger-list');
  const stackEls = byToken('stack-power');

  // Estado inicial solo cuando JS está activo: si el módulo no corre,
  // el contenido permanece visible (progressive enhancement).
  utils.set(fadeEls, { opacity: 0, translateY: 16 });
  utils.set(fadeLgEls, { opacity: 0, translateY: 32 });
  utils.set(scaleEls, { opacity: 0, translateY: 20, scale: 0.985 });
  utils.set(drawEls, { scaleX: 0, transformOrigin: 'left center' });
  utils.set(drawVEls, { scaleY: 0, transformOrigin: 'top center' });
  for (const list of listEls) {
    utils.set(list.querySelectorAll<HTMLElement>(LIST_CHILD_SELECTOR), { opacity: 0, y: 20 });
  }
  for (const grid of stackEls) {
    utils.set(grid.querySelectorAll<HTMLElement>(':scope li'), { opacity: 0, y: 20 });
  }

  /** Carga el chunk perezoso y escalona los items; si falla, los deja visibles. */
  const runList = async (el: HTMLElement, selector: string): Promise<void> => {
    const items = el.querySelectorAll<HTMLElement>(selector);
    const step = Number(el.dataset.motionStagger ?? 90);
    try {
      const { initListMotion } = await import('./motion-stack');
      initListMotion(items, step);
    } catch {
      utils.set(items, { opacity: 1, y: 0 });
    }
  };

  const observer = new IntersectionObserver(
    async (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        const kind = el.dataset.motion ?? '';

        // Los tokens que contienen "fade"/"draw" se evalúan antes que sus bases.
        if (kind.includes('fade-up-lg')) {
          animate(el, {
            opacity: 1,
            translateY: 0,
            duration: DUR.revealLg,
            delay: delayOf(el),
            ease: EASE.refined,
          });
        } else if (kind.includes('fade-scale')) {
          animate(el, {
            opacity: 1,
            translateY: 0,
            scale: 1,
            duration: DUR.revealLg,
            delay: delayOf(el),
            ease: EASE.refined,
          });
        } else if (kind.includes('fade')) {
          animate(el, {
            opacity: 1,
            translateY: 0,
            duration: DUR.reveal,
            delay: delayOf(el),
            ease: EASE.settle,
          });
        } else if (kind.includes('draw-v')) {
          animate(el, { scaleY: 1, duration: DUR.drawV, delay: delayOf(el), ease: EASE.settle });
        } else if (kind.includes('draw')) {
          animate(el, { scaleX: 1, duration: DUR.draw, delay: delayOf(el), ease: EASE.settle });
        } else if (kind.includes('count')) {
          runCount(el);
        } else if (kind.includes('stagger-list')) {
          await runList(el, LIST_CHILD_SELECTOR);
        } else if (kind.includes('stack-power')) {
          await runList(el, ':scope li');
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
  );

  const observed: HTMLElement[] = [
    ...fadeEls,
    ...fadeLgEls,
    ...scaleEls,
    ...drawEls,
    ...drawVEls,
    ...countEls,
    ...listEls,
    ...stackEls,
  ];
  for (const el of observed) {
    observer.observe(el);
  }

  // ---------------------------------------------------------------------------
  // Target pulse — al aterrizar en un ancla del navbar, re-traza el hairline y
  // re-hace el fade de la etiqueta de la sección destino. Nunca re-anima el
  // contenido. Vive en este módulo: no añade scripts inline.
  // ---------------------------------------------------------------------------
  const pulseSection = (section: HTMLElement): void => {
    const line = section.querySelector<HTMLElement>('[data-pulse="line"]');
    const label = section.querySelector<HTMLElement>('[data-pulse="label"]');

    if (line) {
      utils.set(line, { scaleX: 0, transformOrigin: 'left center' });
      animate(line, { scaleX: 1, duration: DUR.draw, ease: EASE.settle });
    }
    if (label) {
      animate(label, { opacity: [0.2, 1], duration: DUR.reveal, ease: EASE.settle });
    }
  };

  let pendingPulse: HTMLElement | null = null;
  const pulseObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        pulseObserver.unobserve(entry.target);
        pulseSection(entry.target as HTMLElement);
        pendingPulse = null;
      }
    },
    { rootMargin: '0px 0px -20% 0px', threshold: 0.1 },
  );

  document.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) {
      return;
    }
    const id = anchor.hash.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (!section || section === pendingPulse) {
      return;
    }
    pendingPulse = section;
    pulseObserver.observe(section);
  });
}
