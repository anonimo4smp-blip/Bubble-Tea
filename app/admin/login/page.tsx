import { sendMagicLink } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif italic text-on-background mb-2">
            Bubble Tea España
          </h1>
          <p className="text-sm text-on-surface-variant tracking-widest uppercase font-semibold">
            Panel de administración
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow">
          <h2 className="text-xl font-bold text-on-background mb-2">
            Acceso editorial
          </h2>
          <p className="text-sm text-on-surface-variant mb-8">
            Introduce tu email y te enviaremos un enlace de acceso instantáneo.
          </p>

          <form action={sendMagicLink} className="space-y-4">
            <input
              type="email"
              name="email"
              required
              placeholder="tu@email.com"
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-background outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50"
            />
            <button
              type="submit"
              className="w-full bg-primary text-on-primary rounded-full py-3 font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Enviar enlace de acceso
            </button>
          </form>

          <MessageBanner searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}

async function MessageBanner({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;

  if (params.message) {
    return (
      <p className="mt-6 text-center text-sm text-primary font-medium">
        {params.message}
      </p>
    );
  }
  if (params.error) {
    return (
      <p className="mt-6 text-center text-sm text-error font-medium">
        {params.error}
      </p>
    );
  }
  return null;
}
