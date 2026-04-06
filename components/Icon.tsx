import type { ComponentPropsWithoutRef, ReactNode } from "react";

const sharedProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const iconPaths = {
  accessible: (
    <>
      <circle cx="12.5" cy="6.5" r="1.5" {...sharedProps} />
      <circle cx="15.5" cy="17" r="3.5" {...sharedProps} />
      <path d="M12.5 8.5v4.25h4.25" {...sharedProps} />
      <path d="M10 12h3.75" {...sharedProps} />
      <path d="m12.5 13.5-3 5" {...sharedProps} />
    </>
  ),
  add: (
    <>
      <path d="M12 5v14" {...sharedProps} />
      <path d="M5 12h14" {...sharedProps} />
    </>
  ),
  arrow_back: (
    <>
      <path d="M19 12H5" {...sharedProps} />
      <path d="m11 18-6-6 6-6" {...sharedProps} />
    </>
  ),
  arrow_forward: (
    <>
      <path d="M5 12h14" {...sharedProps} />
      <path d="m13 6 6 6-6 6" {...sharedProps} />
    </>
  ),
  chair: (
    <>
      <path d="M8 11h8a2 2 0 0 1 2 2v2H6v-2a2 2 0 0 1 2-2Z" {...sharedProps} />
      <path d="M8 11V7a2 2 0 1 1 4 0v4" {...sharedProps} />
      <path d="M8 15v4" {...sharedProps} />
      <path d="M16 15v4" {...sharedProps} />
    </>
  ),
  chevron_right: <path d="m9 6 6 6-6 6" {...sharedProps} />,
  compare: (
    <>
      <path d="M10 3H5a2 2 0 0 0-2 2v4" {...sharedProps} />
      <path d="M14 21h5a2 2 0 0 0 2-2v-4" {...sharedProps} />
      <path d="m3 15 4-4 4 4" {...sharedProps} />
      <path d="m21 9-4 4-4-4" {...sharedProps} />
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18" {...sharedProps} />
      <path d="m6 6 12 12" {...sharedProps} />
    </>
  ),
  eco: (
    <>
      <path
        d="M6.5 13.5c0-4.25 2.75-7.5 9-8-1 5.75-4.25 10.5-9 11.5-.5-1-.75-2.25-.75-3.5Z"
        {...sharedProps}
      />
      <path d="M8 16c2-2.5 5-4.5 8.5-6" {...sharedProps} />
    </>
  ),
  emoji_events: (
    <>
      <path d="M8 4h8v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4Z" {...sharedProps} />
      <path d="M8 6H5a2 2 0 0 0 2 4h1" {...sharedProps} />
      <path d="M16 6h3a2 2 0 0 1-2 4h-1" {...sharedProps} />
      <path d="M12 12v4" {...sharedProps} />
      <path d="M9 20h6" {...sharedProps} />
      <path d="M10 16h4" {...sharedProps} />
    </>
  ),
  filter_alt: (
    <>
      <path d="M4 6h16l-6 7v5l-4 2v-7Z" {...sharedProps} />
    </>
  ),
  grain: (
    <>
      <path d="M12 21V8" {...sharedProps} />
      <path d="M12 12c-2 0-3-1.5-3-3 2 0 3 1.5 3 3Z" {...sharedProps} />
      <path d="M12 16c-2 0-3-1.5-3-3 2 0 3 1.5 3 3Z" {...sharedProps} />
      <path d="M12 12c2 0 3-1.5 3-3-2 0-3 1.5-3 3Z" {...sharedProps} />
      <path d="M12 16c2 0 3-1.5 3-3-2 0-3 1.5-3 3Z" {...sharedProps} />
    </>
  ),
  language: (
    <>
      <circle cx="12" cy="12" r="9" {...sharedProps} />
      <path d="M3 12h18" {...sharedProps} />
      <path d="M12 3c2.5 2.25 4 5.75 4 9s-1.5 6.75-4 9c-2.5-2.25-4-5.75-4-9s1.5-6.75 4-9Z" {...sharedProps} />
      <path d="M5.5 7.5h13" {...sharedProps} />
      <path d="M5.5 16.5h13" {...sharedProps} />
    </>
  ),
  local_cafe: (
    <>
      <path d="M6 6h9v8a4 4 0 0 1-4 4h-1a4 4 0 0 1-4-4Z" {...sharedProps} />
      <path d="M15 8h1.5a2.5 2.5 0 1 1 0 5H15" {...sharedProps} />
      <path d="M5 20h12" {...sharedProps} />
    </>
  ),
  location_city: (
    <>
      <path d="M4 20V8l6-3v15" {...sharedProps} />
      <path d="M10 20V4l10 4v12" {...sharedProps} />
      <path d="M4 20h16" {...sharedProps} />
      <path d="M7 10h.01" {...sharedProps} />
      <path d="M7 13h.01" {...sharedProps} />
      <path d="M14 9h.01" {...sharedProps} />
      <path d="M14 12h.01" {...sharedProps} />
      <path d="M17 9h.01" {...sharedProps} />
      <path d="M17 12h.01" {...sharedProps} />
    </>
  ),
  location_on: (
    <>
      <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z" {...sharedProps} />
      <circle cx="12" cy="10" r="2.5" {...sharedProps} />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" {...sharedProps} />
      <path d="M4 12h16" {...sharedProps} />
      <path d="M4 17h16" {...sharedProps} />
    </>
  ),
  map: (
    <>
      <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" {...sharedProps} />
      <path d="M9 3v15" {...sharedProps} />
      <path d="M15 6v15" {...sharedProps} />
    </>
  ),
  menu_book: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v16H6.5A2.5 2.5 0 0 0 4 22Z" {...sharedProps} />
      <path d="M4 6.5V20" {...sharedProps} />
      <path d="M8 7h8" {...sharedProps} />
      <path d="M8 11h6" {...sharedProps} />
    </>
  ),
  movie: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" {...sharedProps} />
      <path d="M8 5v14" {...sharedProps} />
      <path d="M16 5v14" {...sharedProps} />
      <path d="M4 9h4" {...sharedProps} />
      <path d="M4 15h4" {...sharedProps} />
      <path d="M16 9h4" {...sharedProps} />
      <path d="M16 15h4" {...sharedProps} />
    </>
  ),
  payments: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" {...sharedProps} />
      <circle cx="12" cy="12" r="2.5" {...sharedProps} />
      <path d="M7 9h.01" {...sharedProps} />
      <path d="M17 15h.01" {...sharedProps} />
    </>
  ),
  pets: (
    <>
      <circle cx="8.5" cy="8.5" r="1.5" {...sharedProps} />
      <circle cx="15.5" cy="8.5" r="1.5" {...sharedProps} />
      <circle cx="6.5" cy="13.5" r="1.5" {...sharedProps} />
      <circle cx="17.5" cy="13.5" r="1.5" {...sharedProps} />
      <path d="M12 18c-1.8 0-4-1-4-3 0-1.5 1.2-2.5 2.5-2.5.8 0 1.4.3 1.5.7.1-.4.7-.7 1.5-.7 1.3 0 2.5 1 2.5 2.5 0 2-2.2 3-4 3Z" {...sharedProps} />
    </>
  ),
  photo_camera: (
    <>
      <path d="M4 8h3l2-2h6l2 2h3v10H4Z" {...sharedProps} />
      <circle cx="12" cy="13" r="3.5" {...sharedProps} />
    </>
  ),
  podcasts: (
    <>
      <circle cx="12" cy="12" r="1.5" {...sharedProps} />
      <path d="M9.5 9.5a3.5 3.5 0 0 1 5 5" {...sharedProps} />
      <path d="M8 8a5.7 5.7 0 0 1 8 8" {...sharedProps} />
      <path d="M6 6a8.5 8.5 0 0 1 12 12" {...sharedProps} />
      <path d="M12 13.5v4" {...sharedProps} />
    </>
  ),
  search_off: (
    <>
      <circle cx="11" cy="11" r="6" {...sharedProps} />
      <path d="m16 16 4 4" {...sharedProps} />
      <path d="M5 5 19 19" {...sharedProps} />
    </>
  ),
  send: (
    <>
      <path d="M3 11.5 21 4l-7.5 16-2.5-6L3 11.5Z" {...sharedProps} />
      <path d="M10.5 13.5 21 4" {...sharedProps} />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2" {...sharedProps} />
      <circle cx="6" cy="12" r="2" {...sharedProps} />
      <circle cx="18" cy="19" r="2" {...sharedProps} />
      <path d="m7.7 11 8.6-4.7" {...sharedProps} />
      <path d="m7.7 13 8.6 4.7" {...sharedProps} />
    </>
  ),
  star: (
    <path
      d="m12 3 2.8 5.67 6.26.91-4.53 4.42 1.07 6.25L12 17.27l-5.6 2.98 1.07-6.25L2.94 9.58l6.26-.91L12 3Z"
      {...sharedProps}
    />
  ),
  storefront: (
    <>
      <path d="m4.5 9.5 1.5-5h12l1.5 5" {...sharedProps} />
      <path d="M5 9.5a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 10 9.5" {...sharedProps} />
      <path d="M10 9.5a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 15 9.5" {...sharedProps} />
      <path d="M15 9.5a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 20 9.5" {...sharedProps} />
      <path d="M6 12v7h12v-7" {...sharedProps} />
      <path d="M10 19v-4h4v4" {...sharedProps} />
    </>
  ),
  takeout_dining: (
    <>
      <path d="M8 6h8l1 13H7Z" {...sharedProps} />
      <path d="M10 6V4h4v2" {...sharedProps} />
      <path d="M13 10V7l3-2" {...sharedProps} />
    </>
  ),
  update: (
    <>
      <path d="M4 4v5h5" {...sharedProps} />
      <path d="M20 20v-5h-5" {...sharedProps} />
      <path d="M5.5 14A7 7 0 0 0 18 17" {...sharedProps} />
      <path d="M18.5 10A7 7 0 0 0 6 7" {...sharedProps} />
    </>
  ),
  verified: (
    <>
      <circle cx="12" cy="12" r="9" {...sharedProps} />
      <path d="m8.5 12 2.5 2.5 4.5-4.5" {...sharedProps} />
    </>
  ),
  water_drop: (
    <>
      <path d="M12 3s5 5.5 5 9a5 5 0 1 1-10 0c0-3.5 5-9 5-9Z" {...sharedProps} />
    </>
  ),
  wifi: (
    <>
      <path d="M5 9a11 11 0 0 1 14 0" {...sharedProps} />
      <path d="M8 12a7 7 0 0 1 8 0" {...sharedProps} />
      <path d="M11 15a3 3 0 0 1 2 0" {...sharedProps} />
      <circle cx="12" cy="18" r="1" {...sharedProps} />
    </>
  ),
} as const satisfies Record<string, ReactNode>;

export type IconName = keyof typeof iconPaths;

type IconProps = Omit<ComponentPropsWithoutRef<"svg">, "children"> & {
  name: IconName;
  title?: string;
};

export default function Icon({ name, className, title, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      className={`inline-block shrink-0 align-middle ${className ?? ""}`.trim()}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {iconPaths[name]}
    </svg>
  );
}
