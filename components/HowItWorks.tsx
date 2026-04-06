const steps = [
  {
    number: "1",
    title: "Elige Ciudad",
    description: "Selecciona entre nuestros destinos curados en España.",
  },
  {
    number: "2",
    title: "Compara Locales",
    description: "Filtra por ambiente, precio o tipo de perlas artesanales.",
  },
  {
    number: "3",
    title: "Disfruta tu Té",
    description: "Visita el local y cuéntanos tu experiencia en el club.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="section-title section-title-md mb-2 italic">
            Encuentra tu próximo sorbo
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-primary-container" />
        </div>

        <div className="relative grid grid-cols-1 gap-16 md:grid-cols-3">
          <div className="absolute left-[20%] right-[20%] top-8 -z-10 hidden h-0.5 border-t-2 border-dashed border-outline-variant md:block" />

          {steps.map((step) => (
            <div
              key={step.number}
              className="card-soft flex flex-col items-center space-y-6 p-8 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-highest text-xl font-bold">
                {step.number}
              </div>
              <h5 className="text-xl font-bold">{step.title}</h5>
              <p className="text-sm text-on-surface-variant">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
