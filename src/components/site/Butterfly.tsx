type FlightVariant = "drift" | "figure8" | "hover";

interface ButterflyProps {
  variant?: FlightVariant;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const flightClasses: Record<FlightVariant, string> = {
  drift: "animate-butterfly-drift",
  figure8: "animate-butterfly-1",
  hover: "animate-butterfly-2",
};

export function Butterfly({
  variant = "figure8",
  size = 24,
  color = "text-accent",
  className = "",
  style,
}: ButterflyProps) {
  const wingFlap = variant === "hover" ? "animate-wing-flap-slow" : "animate-wing-flap";

  return (
    <span
      aria-hidden
      className={`absolute pointer-events-none ${flightClasses[variant]} ${className}`}
      style={style}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={color}
      >
        {/* Left wing */}
        <g className={wingFlap} style={{ transformOrigin: "16px 16px" }}>
          <path
            d="M16 16C12 8 4 4 2 8C0 12 6 18 16 16Z"
            fill="currentColor"
            opacity="0.7"
          />
          <path
            d="M16 16C14 10 8 6 6 9C4 12 10 18 16 16Z"
            fill="currentColor"
            opacity="0.4"
          />
        </g>
        {/* Right wing */}
        <g
          className={wingFlap}
          style={{ transformOrigin: "16px 16px" }}
        >
          <path
            d="M16 16C20 8 28 4 30 8C32 12 26 18 16 16Z"
            fill="currentColor"
            opacity="0.7"
          />
          <path
            d="M16 16C18 10 24 6 26 9C28 12 22 18 16 16Z"
            fill="currentColor"
            opacity="0.4"
          />
        </g>
        {/* Body */}
        <ellipse cx="16" cy="17" rx="1.2" ry="5" fill="currentColor" opacity="0.9" />
      </svg>
    </span>
  );
}
