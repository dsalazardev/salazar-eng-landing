import { useRef, useState } from 'react';

interface Props {
  src: string;
  title: string;
  ctaLabel: string;
  height?: number;
}

type Status = 'idle' | 'loading' | 'loaded';

const DEFAULT_HEIGHT = 680;

const buildEmbedSrc = (src: string): string => {
  const [base, query = ''] = src.split('?');
  const path = base.replace(/\/+$/, '');
  const embedPath = path.endsWith('/embed') ? path : `${path}/embed`;
  const params = new URLSearchParams(query);
  params.set('embed', 'landing');
  return `${embedPath}?${params.toString()}`;
};

export default function LazyEmbed({ src, title, ctaLabel, height = DEFAULT_HEIGHT }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    setStatus('loaded');
    iframeRef.current?.focus();
  };

  return (
    <div className="w-full">
      <p role="status" aria-live="polite" className="sr-only">
        {status === 'idle'
          ? ''
          : status === 'loading'
            ? 'Cargando agenda…'
            : 'Agenda cargada. El calendario está listo.'}
      </p>

      {status === 'idle' ? (
        <button
          type="button"
          onClick={() => setStatus('loading')}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white hover:text-navy-900 focus-visible:outline-2"
        >
          {ctaLabel}
        </button>
      ) : (
        <div className={status === 'loading' ? 'mt-4 w-full' : 'w-full'} style={{ minHeight: height }}>
          <iframe
            ref={iframeRef}
            src={buildEmbedSrc(src)}
            title={title}
            allow="payment"
            loading="lazy"
            onLoad={handleLoad}
            className="w-full rounded-md border-0"
            style={{ height }}
          />
        </div>
      )}
    </div>
  );
}
