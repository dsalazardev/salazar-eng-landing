import { useEffect, useRef, useState } from 'react';
import type { SubmitEvent } from 'react';

interface Props {
  endpoint: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const options = [
  'El sistema va lento y cada cambio rompe algo',
  'El equipo pierde horas en tareas manuales',
  'Nuestros datos están, pero no sirven para decidir',
  'Otro / aún no lo sé',
];

export default function ContactForm({ endpoint }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [invalid, setInvalid] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      messageRef.current?.focus();
    }
  }, [status]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      setInvalid(true);
      return;
    }
    setInvalid(false);

    // TODO: configurar PUBLIC_LEAD_ENDPOINT en el deploy y crear el workflow n8n
    // (recibe -> envía el PDF -> notifica a Daner -> agenda seguimiento).
    if (!endpoint) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const data = new FormData(form);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(data.get('email') ?? ''),
          necesidad: String(data.get('necesidad') ?? ''),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setStatus('success');
    } catch {
      setStatus('error');
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
        <label htmlFor="lead-necesidad" className="block text-sm font-semibold text-navy-900">
          ¿Qué te quita el sueño?
        </label>
        <select
          id="lead-necesidad"
          name="necesidad"
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

      {status === 'error' && (
        <p
          ref={messageRef}
          role="alert"
          tabIndex={-1}
          className="text-sm font-semibold text-navy-900"
        >
          No pudimos enviar tu solicitud. Intenta de nuevo.
        </p>
      )}

      <p className="font-mono text-xs tracking-wider text-steel-500 uppercase">
        Sin spam. Solo el checklist.
      </p>
    </form>
  );
}
