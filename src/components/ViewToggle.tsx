"use client";

import { Globe as GlobeIcon, Map } from "lucide-react";
import { ViewMode } from "../types";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({
  currentView,
  onViewChange,
}: ViewToggleProps) {
  return (
    <div className="inline-flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 shadow-inner">
      <button
        onClick={() => onViewChange("globe")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
          currentView === "globe"
            ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        <GlobeIcon size={18} />
        <span className="hidden sm:inline">3D Globe</span>
      </button>

      <button
        onClick={() => onViewChange("map")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
          currentView === "map"
            ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        <Map size={18} />
        <span className="hidden sm:inline">Map View</span>
      </button>
    </div>
  );
}
