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

const inputClass = "form-control";
const labelClass = "form-label";

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

      {error && <p className="form-error">{error}</p>}

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
              className="form-textarea"
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
              className="form-textarea"
            />
          </div>
        </div>
      </section>

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
              className="form-textarea"
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

      <div className="flex items-center gap-4 pt-4">
        <button type="submit" className="btn btn-primary btn-md">
          {submitLabel}
        </button>
        <Link href="/admin/cities" className="btn btn-subtle btn-sm">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
