import { IconKeyboard, IconBolt } from "@tabler/icons-react";

interface ScannerControlProps {
  onKeyboardClick: () => void;
  onFlashClick: () => void;
  controlHeight: number;
}

export function ScannerControl({
  onKeyboardClick,
  onFlashClick,
  controlHeight,
}: ScannerControlProps) {
  return (
    <div
      className={
        "flex w-full items-center justify-center gap-1 self-end overflow-hidden rounded-b-2xl"
      }
      style={{ height: `${controlHeight}px` }}
    >
      <button
        onClick={onKeyboardClick}
        className="flex h-full grow cursor-pointer items-center justify-center bg-white/10 backdrop-blur-sm"
      >
        <IconKeyboard size={24} stroke={2} className="text-white" />
      </button>
      <button
        onClick={onFlashClick}
        className="flex h-full grow cursor-pointer items-center justify-center bg-white/10 backdrop-blur-sm"
      >
        <IconBolt size={24} stroke={2} className="text-white" />
      </button>
    </div>
  );
}
