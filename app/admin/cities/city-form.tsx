import Link from "next/link";

type CityData = {
  id?: number;
  name: string;
  region: string | null;
  province: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  keywordPrimary: string | null;
  latitudeCenter: number | null;
  longitudeCenter: number | null;
};

const inputClass =
  "w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-background outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50";

const labelClass = "block text-sm font-semibold text-on-background mb-1.5";

export function CityForm({
  city,
  action,
  submitLabel,
  error,
}: {
  city?: CityData;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  error?: string;
}) {
  return (
    <form action={action} className="space-y-10">
      {city?.id && <input type="hidden" name="id" value={city.id} />}

      {error && (
        <p className="text-sm text-error font-medium bg-error/5 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Datos básicos */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-6">
          Datos básicos
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label htmlFor="name" className={labelClass}>
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={city?.name ?? ""}
              placeholder="Madrid"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="region" className={labelClass}>
              Comunidad autónoma
            </label>
            <input
              type="text"
              id="region"
              name="region"
              defaultValue={city?.region ?? ""}
              placeholder="Comunidad de Madrid"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="province" className={labelClass}>
              Provincia
            </label>
            <input
              type="text"
              id="province"
              name="province"
              defaultValue={city?.province ?? ""}
              placeholder="Madrid"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Coordenadas */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-6">
          Coordenadas del centro
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="latitudeCenter" className={labelClass}>
              Latitud
            </label>
            <input
              type="number"
              step="any"
              id="latitudeCenter"
              name="latitudeCenter"
              defaultValue={city?.latitudeCenter ?? ""}
              placeholder="40.4168"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="longitudeCenter" className={labelClass}>
              Longitud
            </label>
            <input
              type="number"
              step="any"
              id="longitudeCenter"
              name="longitudeCenter"
              defaultValue={city?.longitudeCenter ?? ""}
              placeholder="-3.7038"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Descripciones */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-6">
          Contenido editorial
        </h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="shortDescription" className={labelClass}>
              Descripción corta
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={2}
              defaultValue={city?.shortDescription ?? ""}
              placeholder="Breve resumen de la escena de bubble tea en la ciudad..."
              className={inputClass + " resize-none"}
            />
          </div>
          <div>
            <label htmlFor="longDescription" className={labelClass}>
              Descripción larga
            </label>
            <textarea
              id="longDescription"
              name="longDescription"
              rows={5}
              defaultValue={city?.longDescription ?? ""}
              placeholder="Texto editorial completo sobre la ciudad..."
              className={inputClass + " resize-none"}
            />
          </div>
        </div>
      </section>

      {/* SEO */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-6">SEO</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="seoTitle" className={labelClass}>
              Título SEO
            </label>
            <input
              type="text"
              id="seoTitle"
              name="seoTitle"
              defaultValue={city?.seoTitle ?? ""}
              placeholder="Mejores locales de bubble tea en Madrid (2026)"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="seoDescription" className={labelClass}>
              Meta description
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={2}
              defaultValue={city?.seoDescription ?? ""}
              placeholder="Descubre los mejores locales de bubble tea en Madrid..."
              className={inputClass + " resize-none"}
            />
          </div>
          <div>
            <label htmlFor="keywordPrimary" className={labelClass}>
              Keyword principal
            </label>
            <input
              type="text"
              id="keywordPrimary"
              name="keywordPrimary"
              defaultValue={city?.keywordPrimary ?? ""}
              placeholder="bubble tea madrid"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          className="bg-primary text-on-primary rounded-full px-8 py-3 font-bold text-sm hover:opacity-90 transition-opacity"
        >
          {submitLabel}
        </button>
        <Link
          href="/admin/cities"
          className="text-sm font-semibold text-on-surface-variant hover:text-on-background transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
