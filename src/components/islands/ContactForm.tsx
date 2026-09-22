import { useEffect, useRef, useState } from 'react';
import type { SubmitEvent } from 'react';

interface Props {
  endpoint: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const WARMUP_NOTICE_MS = 9000;
const TIMEOUT_MS = 120000;

const GENERIC_ERROR = 'No pudimos enviar tu solicitud. Intenta de nuevo.';
const RATE_LIMIT_ERROR = 'Demasiados intentos seguidos. Espera un minuto e intenta de nuevo.';
const TIMEOUT_ERROR = 'El servicio tardó demasiado en responder. Intenta de nuevo.';
const WARMUP_NOTICE = 'El servicio está despertando; puede tardar hasta un minuto.';

const options = [
  'El sistema va lento y cada cambio rompe algo',
  'El equipo pierde horas en tareas manuales',
  'Nuestros datos están, pero no sirven para decidir',
  'Otro / aún no lo sé',
];

export default function ContactForm({ endpoint }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [invalid, setInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      messageRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status !== 'submitting') {
      return;
    }
    const timer = window.setTimeout(() => setSlow(true), WARMUP_NOTICE_MS);
    return () => {
      window.clearTimeout(timer);
      setSlow(false);
    };
  }, [status]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      setInvalid(true);
      return;
    }
    setInvalid(false);

    // La captación la ejecuta ms-notifier-webhook (Render); PUBLIC_LEAD_ENDPOINT se define en build (ver .env.example).
    if (!endpoint) {
      setErrorMessage(null);
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const data = new FormData(form);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(data.get('email') ?? ''),
          need: String(data.get('need') ?? ''),
        }),
        signal: controller.signal,
      });

      if (response.status === 429) {
        setErrorMessage(RATE_LIMIT_ERROR);
        setStatus('error');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setErrorMessage(null);
      setStatus('success');
    } catch {
      setErrorMessage(controller.signal.aborted ? TIMEOUT_ERROR : null);
      setStatus('error');
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  if (status === 'success') {
    return (
      <p
        ref={messageRef}
        role="status"
        tabIndex={-1}
        className="text-navy-900"
      >
        Listo. Revisa tu correo en unos minutos.
      </p>
    );
  }

  return (
    <form
      action={endpoint || undefined}
      method="post"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div>
        <label htmlFor="lead-email" className="block text-sm font-semibold text-navy-900">
          Email
        </label>
        <input
          id="lead-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@empresa.com"
          aria-invalid={invalid || undefined}
          className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-navy-900 placeholder:text-steel-500"
        />
      </div>

      <div>
        <label htmlFor="lead-need" className="block text-sm font-semibold text-navy-900">
          ¿Qué te quita el sueño?
        </label>
        <select
          id="lead-need"
          name="need"
          required
          defaultValue=""
          aria-invalid={invalid || undefined}
          className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-navy-900"
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Enviando…' : 'Recibir checklist →'}
      </button>

      {status === 'submitting' && slow && (
        <p role="status" className="text-sm text-steel-500">
          {WARMUP_NOTICE}
        </p>
      )}

      {status === 'error' && (
        <p
          ref={messageRef}
          role="alert"
          tabIndex={-1}
          className="text-sm font-semibold text-navy-900"
        >
          {errorMessage ?? GENERIC_ERROR}
        </p>
      )}

      <p className="font-mono text-xs tracking-wider text-steel-500 uppercase">
        Sin spam. Solo el checklist.
      </p>
    </form>
  );
}
