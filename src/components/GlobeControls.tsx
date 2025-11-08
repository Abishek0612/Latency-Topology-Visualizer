"use client";

import { ZoomIn, ZoomOut } from "lucide-react";

interface GlobeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function GlobeControls({
  onZoomIn,
  onZoomOut,
}: GlobeControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
      <button
        onClick={onZoomIn}
        className="p-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-lg transition-colors border border-gray-200 dark:border-gray-700"
        title="Zoom In"
      >
        <ZoomIn size={20} className="text-gray-900 dark:text-white" />
      </button>
      <button
        onClick={onZoomOut}
        className="p-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-lg transition-colors border border-gray-200 dark:border-gray-700"
        title="Zoom Out"
      >
        <ZoomOut size={20} className="text-gray-900 dark:text-white" />
      </button>
    </div>
  );
}
