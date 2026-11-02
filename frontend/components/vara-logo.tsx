import VaraMark from "./vara-mark";

interface VaraLogoProps {
  showTagline?: boolean;
  iconSize?: number;
}

export default function VaraLogo({
  showTagline = false,
  iconSize = 30,
}: VaraLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123D3A]">
        <VaraMark
          size={iconSize}
          className="text-[#35D6BD]"
        />
      </div>

      <div className="flex flex-col">
        <span className="text-xl font-semibold tracking-tight text-[#E8F5F2]">
          Vara
        </span>

        {showTagline && (
          <span className="text-xs text-[#8DA5A0]">
            SI Chatbot
          </span>
        )}
      </div>
    </div>
  );
}