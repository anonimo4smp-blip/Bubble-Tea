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
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif mb-2 italic">
            Encuentra tu próximo sorbo
          </h2>
          <div className="w-24 h-1 bg-primary-container mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Dashed connector */}
          <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-outline-variant -z-10" />

          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-xl">
                {step.number}
              </div>
              <h5 className="text-xl font-bold">{step.title}</h5>
              <p className="text-on-surface-variant text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
