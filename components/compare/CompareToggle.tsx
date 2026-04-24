"use client";

import Icon from "@/components/Icon";
import { useCompare, type ComparableShop } from "./CompareProvider";

type Props = {
  shop: ComparableShop;
};

export default function CompareToggle({ shop }: Props) {
  const { toggle, isSelected } = useCompare();
  const active = isSelected(shop.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(shop);
      }}
      className={`flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-bold shadow-sm transition-colors ${
        active
          ? "bg-primary text-on-primary"
          : "glass-nav bg-surface/90 text-on-surface-variant hover:text-primary"
      }`}
      aria-label={active ? `Quitar ${shop.name} de la comparación` : `Añadir ${shop.name} a la comparación`}
      aria-pressed={active}
      title={active ? "Quitar del comparador" : "Comparar"}
    >
      <Icon name="compare" className="text-sm" />
      <span>{active ? "Añadido" : "Comparar"}</span>
    </button>
  );
}
