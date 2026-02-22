export type SecondaryButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export const SecondaryButton = ({ label, onClick, type = "button" }: SecondaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="min-h-[48px] rounded-2xl border border-sand-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-sm"
    >
      {label}
    </button>
  );
};
