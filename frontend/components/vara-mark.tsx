interface VaraMarkProps {
  size?: number;
  className?: string;
}

export default function VaraMark({
  size = 36,
  className = "",
}: VaraMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Vara leaf logo"
    >
      {/* Left leaf */}
      <path
        d="M31.5 51
           C20 43 10 28 12 11
           C27 13 39 23 40 38
           C40.5 44 36.5 49 31.5 51Z"
        fill="#35D6BD"
      />

      {/* Right overlapping leaf */}
      <path
        d="M32.5 51
           C44 43 54 28 52 11
           C37 13 25 23 24 38
           C23.5 44 27.5 49 32.5 51Z"
        fill="#159E8C"
      />

      {/* Left leaf vein */}
      <path
        d="M31.5 49 C26 37 20 25 13 13"
        stroke="#D7FFF5"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Right leaf vein */}
      <path
        d="M32.5 49 C38 37 44 25 51 13"
        stroke="#D7FFF5"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Central overlapping detail */}
      <path
        d="M31.5 51 C32 45 32 39 32 32"
        stroke="#E8F5F2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}