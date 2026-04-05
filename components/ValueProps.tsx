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
];

export default function ValueProps() {
  return (
    <section className="py-24 px-6 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {props.map((item) => (
            <div key={item.title} className="space-y-4">
              <div className="text-primary">
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
              </div>
              <h4 className="text-xl font-bold">{item.title}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
