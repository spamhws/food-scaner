import React from "react";

export function CornerDecorations() {
  return (
    <div className="absolute inset-0 z-10">
      {/* Top Left */}
      <div className="absolute top-0 left-0 h-24 w-24 rounded-tl-3xl border-t-4 border-l-4 border-white" />
      {/* Top Right */}
      <div className="absolute top-0 right-0 h-24 w-24 rounded-tr-3xl border-t-4 border-r-4 border-white" />
      {/* Bottom Left */}
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-bl-3xl border-b-4 border-l-4 border-white" />
      {/* Bottom Right */}
      <div className="absolute right-0 bottom-0 h-24 w-24 rounded-br-3xl border-r-4 border-b-4 border-white" />
    </div>
  );
}
