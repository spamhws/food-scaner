import { IconSettings, IconHistory, IconHeart } from "@tabler/icons-react";

type NavigationProps = {
  navigationHeight: number;
};

export function Navigation({ navigationHeight }: NavigationProps) {
  return (
    <nav
      className="flex h-16 w-full items-center justify-center gap-1 overflow-hidden rounded-2xl"
      style={{ height: `${navigationHeight}px` }}
    >
      <a
        href="#"
        className="flex h-full flex-1 items-center justify-center bg-white/10 backdrop-blur-sm"
      >
        <IconSettings size={24} stroke={2} className="text-white" />
      </a>
      <a
        href="#"
        className="flex h-full flex-1 items-center justify-center bg-white/10 backdrop-blur-sm"
      >
        <IconHistory size={24} stroke={2} className="text-white" />
      </a>
      <a
        href="#"
        className="flex h-full flex-1 items-center justify-center bg-white/10 backdrop-blur-sm"
      >
        <IconHeart size={24} stroke={2} className="text-white" />
      </a>
    </nav>
  );
}
