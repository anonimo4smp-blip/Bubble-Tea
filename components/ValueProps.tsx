import Icon from "@/components/Icon";

const props = [
  {
    icon: "verified",
    title: "Curación",
    description:
      "Probamos cada tienda personalmente. No hay espacio para la mediocridad.",
  },
  {
    icon: "map",
    title: "Ciudad por Ciudad",
    description:
      "Mapas detallados y guías de barrio para que nunca te pierdas tu té.",
  },
  {
    icon: "filter_alt",
    title: "Filtros Inteligentes",
    description:
      "¿Buscas leche vegetal o un lugar con Wi-Fi? Te lo ponemos fácil.",
  },
  {
    icon: "update",
    title: "Info Actualizada",
    description:
      "Precios, horarios y nuevos sabores revisados mensualmente.",
  },
] as const;

export default function ValueProps() {
  return (
    <section className="bg-surface-container-low px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {props.map((item) => (
            <div key={item.title} className="card-elevated space-y-4 p-8">
              <div className="text-primary">
                <Icon name={item.icon} className="text-4xl" />
              </div>
              <h4 className="section-title text-xl">{item.title}</h4>
              <p className="section-copy text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
