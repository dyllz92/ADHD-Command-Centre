export type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const SectionHeader = ({ title, actionLabel, onAction }: SectionHeaderProps) => {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="text-sm font-medium text-calm-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
