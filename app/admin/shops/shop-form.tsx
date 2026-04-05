import Link from "next/link";

type ShopData = {
  id?: number;
  name: string;
  cityId: number;
  brandName: string | null;
  isIndependent: boolean;
  address: string | null;
  postalCode: string | null;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  priceMin: number | null;
  priceMax: number | null;
  averagePrice: number | null;
  editorSummary: string | null;
  whyItStandsOut: string | null;
  recommendedOrder: string | null;
};

type FeaturesData = {
  veganOptions: boolean;
  lactoseFreeOptions: boolean;
  glutenFreeOptions: boolean;
  takeaway: boolean;
  seating: boolean;
  wifi: boolean;
  studyFriendly: boolean;
  photoFriendly: boolean;
  petFriendly: boolean;
  wheelchairAccessible: boolean;
};

type HoursData = {
  weekday: string;
  opensAt: string | null;
  closesAt: string | null;
  isClosed: boolean;
};

type ScoresData = {
  qualityScore: number | null;
  priceScore: number | null;
  varietyScore: number | null;
  experienceScore: number | null;
  googleRatingScore: number | null;
  popularityScore: number | null;
  totalScore: number | null;
};

type CityOption = { id: number; name: string };

const inputClass =
  "w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-background outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50";

const labelClass = "block text-sm font-semibold text-on-background mb-1.5";

const checkboxLabel =
  "flex items-center gap-2.5 text-sm text-on-background cursor-pointer";

const WEEKDAY_LABELS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

const FEATURE_LABELS: { key: keyof FeaturesData; label: string }[] = [
  { key: "veganOptions", label: "Opciones veganas" },
  { key: "lactoseFreeOptions", label: "Sin lactosa" },
  { key: "glutenFreeOptions", label: "Sin gluten" },
  { key: "takeaway", label: "Para llevar" },
  { key: "seating", label: "Con asientos" },
  { key: "wifi", label: "WiFi" },
  { key: "studyFriendly", label: "Para estudiar" },
  { key: "photoFriendly", label: "Instagrameable" },
  { key: "petFriendly", label: "Pet-friendly" },
  { key: "wheelchairAccessible", label: "Accesible" },
];

const SCORE_LABELS: { key: keyof Omit<ScoresData, "totalScore">; label: string; weight: string }[] = [
  { key: "qualityScore", label: "Calidad", weight: "35%" },
  { key: "priceScore", label: "Precio", weight: "15%" },
  { key: "varietyScore", label: "Variedad", weight: "15%" },
  { key: "experienceScore", label: "Experiencia", weight: "10%" },
  { key: "googleRatingScore", label: "Google Rating", weight: "15%" },
  { key: "popularityScore", label: "Popularidad", weight: "10%" },
];

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function ShopForm({
  shop,
  features,
  hours,
  scores,
  cityOptions,
  action,
  submitLabel,
  error,
}: {
  shop?: ShopData;
  features?: FeaturesData;
  hours?: HoursData[];
  scores?: ScoresData;
  cityOptions: CityOption[];
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  error?: string;
}) {
  const hoursMap = new Map(hours?.map((h) => [h.weekday, h]));

  return (
    <form action={action} className="space-y-10">
      {shop?.id && <input type="hidden" name="id" value={shop.id} />}

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
              Nombre del local *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={shop?.name ?? ""}
              placeholder="Mooboo Madrid Sol"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="cityId" className={labelClass}>
              Ciudad *
            </label>
            <select
              id="cityId"
              name="cityId"
              required
              defaultValue={shop?.cityId ?? ""}
              className={inputClass}
            >
              <option value="">Selecciona ciudad</option>
              {cityOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="brandName" className={labelClass}>
              Marca / cadena
            </label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              defaultValue={shop?.brandName ?? ""}
              placeholder="Mooboo"
              className={inputClass}
            />
          </div>
          <div className="col-span-2">
            <label className={checkboxLabel}>
              <input
                type="checkbox"
                name="isIndependent"
                defaultChecked={shop?.isIndependent ?? true}
                className="w-4 h-4 accent-primary"
              />
              Local independiente
            </label>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-6">
          Ubicación
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label htmlFor="address" className={labelClass}>
              Dirección
            </label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={shop?.address ?? ""}
              placeholder="Calle Gran Vía 42, Madrid"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="postalCode" className={labelClass}>
              Código postal
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              defaultValue={shop?.postalCode ?? ""}
              placeholder="28013"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="neighborhood" className={labelClass}>
              Barrio
            </label>
            <input
              type="text"
              id="neighborhood"
              name="neighborhood"
              defaultValue={shop?.neighborhood ?? ""}
              placeholder="Sol"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="latitude" className={labelClass}>
              Latitud
            </label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              defaultValue={shop?.latitude ?? ""}
              placeholder="40.4168"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="longitude" className={labelClass}>
              Longitud
            </label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              defaultValue={shop?.longitude ?? ""}
              placeholder="-3.7038"
              className={inputClass}
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="googleMapsUrl" className={labelClass}>
              URL de Google Maps
            </label>
            <input
              type="url"
              id="googleMapsUrl"
              name="googleMapsUrl"
              defaultValue={shop?.googleMapsUrl ?? ""}
              placeholder="https://maps.google.com/..."
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Enlaces */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-6">
          Redes y web
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="websiteUrl" className={labelClass}>
              Web
            </label>
            <input
              type="url"
              id="websiteUrl"
              name="websiteUrl"
              defaultValue={shop?.websiteUrl ?? ""}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="instagramUrl" className={labelClass}>
              Instagram
            </label>
            <input
              type="url"
              id="instagramUrl"
              name="instagramUrl"
              defaultValue={shop?.instagramUrl ?? ""}
              placeholder="https://instagram.com/..."
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tiktokUrl" className={labelClass}>
              TikTok
            </label>
            <input
              type="url"
              id="tiktokUrl"
              name="tiktokUrl"
              defaultValue={shop?.tiktokUrl ?? ""}
              placeholder="https://tiktok.com/@..."
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Precios */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-6">Precios</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label htmlFor="priceMin" className={labelClass}>
              Precio mín. (€)
            </label>
            <input
              type="number"
              step="0.1"
              id="priceMin"
              name="priceMin"
              defaultValue={shop?.priceMin ?? ""}
              placeholder="3.5"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="priceMax" className={labelClass}>
              Precio máx. (€)
            </label>
            <input
              type="number"
              step="0.1"
              id="priceMax"
              name="priceMax"
              defaultValue={shop?.priceMax ?? ""}
              placeholder="6.5"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="averagePrice" className={labelClass}>
              Precio medio (€)
            </label>
            <input
              type="number"
              step="0.1"
              id="averagePrice"
              name="averagePrice"
              defaultValue={shop?.averagePrice ?? ""}
              placeholder="4.5"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Contenido editorial */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-6">
          Contenido editorial
        </h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="editorSummary" className={labelClass}>
              Resumen editorial
            </label>
            <textarea
              id="editorSummary"
              name="editorSummary"
              rows={3}
              defaultValue={shop?.editorSummary ?? ""}
              placeholder="Breve valoración editorial del local..."
              className={inputClass + " resize-none"}
            />
          </div>
          <div>
            <label htmlFor="whyItStandsOut" className={labelClass}>
              ¿Por qué destaca?
            </label>
            <textarea
              id="whyItStandsOut"
              name="whyItStandsOut"
              rows={3}
              defaultValue={shop?.whyItStandsOut ?? ""}
              placeholder="Lo que hace especial a este local..."
              className={inputClass + " resize-none"}
            />
          </div>
          <div>
            <label htmlFor="recommendedOrder" className={labelClass}>
              Pedido recomendado
            </label>
            <input
              type="text"
              id="recommendedOrder"
              name="recommendedOrder"
              defaultValue={shop?.recommendedOrder ?? ""}
              placeholder="Taro milk tea con tapioca extra"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-6">
          Características
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {FEATURE_LABELS.map(({ key, label }) => (
            <label key={key} className={checkboxLabel}>
              <input
                type="checkbox"
                name={key}
                defaultChecked={features?.[key] ?? false}
                className="w-4 h-4 accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      {/* Horarios */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-6">Horarios</h2>
        <div className="space-y-3">
          {WEEKDAYS.map((day) => {
            const h = hoursMap.get(day);
            return (
              <div
                key={day}
                className="grid grid-cols-[140px_1fr_1fr_auto] gap-4 items-center"
              >
                <span className="text-sm font-semibold text-on-background">
                  {WEEKDAY_LABELS[day]}
                </span>
                <input
                  type="time"
                  name={`hours_${day}_open`}
                  defaultValue={h?.opensAt ?? ""}
                  className={inputClass}
                />
                <input
                  type="time"
                  name={`hours_${day}_close`}
                  defaultValue={h?.closesAt ?? ""}
                  className={inputClass}
                />
                <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    name={`hours_${day}_closed`}
                    defaultChecked={h?.isClosed ?? false}
                    className="w-4 h-4 accent-primary"
                  />
                  Cerrado
                </label>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scores */}
      <section>
        <h2 className="text-lg font-bold text-on-background mb-2">
          Puntuaciones
        </h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Cada dimensión va de 0 a 100. La nota total se calcula automáticamente.
          {scores?.totalScore != null && (
            <span className="ml-2 font-semibold text-primary">
              Total actual: {scores.totalScore.toFixed(1)}
            </span>
          )}
        </p>
        <div className="grid grid-cols-2 gap-6">
          {SCORE_LABELS.map(({ key, label, weight }) => (
            <div key={key}>
              <label htmlFor={key} className={labelClass}>
                {label}{" "}
                <span className="text-on-surface-variant font-normal">
                  ({weight})
                </span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                id={key}
                name={key}
                defaultValue={scores?.[key] ?? ""}
                placeholder="0-100"
                className={inputClass}
              />
            </div>
          ))}
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
          href="/admin/shops"
          className="text-sm font-semibold text-on-surface-variant hover:text-on-background transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
