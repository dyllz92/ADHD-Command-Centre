import clsx from "clsx";

export type PrimaryButtonProps = {
  label: string;
  sublabel?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  size?: "lg" | "md";
  type?: "button" | "submit";
};

export const PrimaryButton = ({
  label,
  sublabel,
  onClick,
  fullWidth = true,
  size = "lg",
  type = "button"
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "rounded-2xl bg-ink-900 text-left text-white shadow-sm transition active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calm-500 focus-visible:ring-offset-2",
        fullWidth && "w-full",
        size === "lg" ? "min-h-[64px] px-5 py-4" : "min-h-[52px] px-4 py-3"
      )}
    >
      <div className="text-lg font-semibold">{label}</div>
      {sublabel && <div className="text-sm text-sand-100/90">{sublabel}</div>}
    </button>
  );
};
