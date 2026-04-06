import { sendMagicLink } from "./actions";
import {
  ADMIN_EMAIL_ALLOWLIST_ENV,
  hasAdminEmailAllowlist,
} from "@/lib/admin-auth";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const isAdminConfigured = hasAdminEmailAllowlist();

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

        <div className="card-elevated rounded-2xl p-8">
          <h2 className="text-xl font-bold text-on-background mb-2">
            Acceso editorial
          </h2>
          <p className="text-sm text-on-surface-variant mb-8">
            Introduce tu email autorizado y te enviaremos un enlace de acceso.
          </p>

          {!isAdminConfigured && (
            <p className="mb-6 text-sm text-error font-medium bg-error/5 rounded-xl px-4 py-3">
              El acceso admin está desactivado hasta configurar{" "}
              <code>{ADMIN_EMAIL_ALLOWLIST_ENV}</code>.
            </p>
          )}

          <form action={sendMagicLink} className="space-y-4">
            <input
              type="email"
              name="email"
              required
              disabled={!isAdminConfigured}
              placeholder="tu@email.com"
              className="form-control"
            />
            <button
              type="submit"
              disabled={!isAdminConfigured}
              className="btn btn-primary btn-md btn-block"
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
