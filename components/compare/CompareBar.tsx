"use client";

import Icon from "@/components/Icon";
import { useCompare } from "./CompareProvider";

export default function CompareBar() {
  const { selected, remove, clear, openDrawer, triggerRef } = useCompare();

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto glass-nav rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 overflow-x-auto">
          {selected.map((shop) => (
            <div
              key={shop.id}
              className="flex items-center gap-1.5 sm:gap-2 bg-surface-container-low rounded-full pl-2.5 sm:pl-3 pr-1 sm:pr-1.5 py-1 sm:py-1.5 min-w-0 shrink-0"
            >
              <span className="text-[11px] sm:text-xs font-semibold text-on-background truncate max-w-[80px] sm:max-w-[100px]">
                {shop.name}
              </span>
              <button
                onClick={() => remove(shop.id)}
                className="shrink-0 w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                aria-label={`Quitar ${shop.name} de la comparación`}
              >
                <Icon name="close" className="text-xs" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="text-xs font-semibold text-on-surface-variant hover:text-error transition-colors px-2 py-1"
          >
            Limpiar
          </button>
          <button
            ref={triggerRef}
            onClick={openDrawer}
            disabled={selected.length < 2}
            data-flip-id="compare-modal"
            className="btn btn-primary btn-xs"
          >
            Comparar ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}
