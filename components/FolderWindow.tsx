import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Search,
  Folder,
} from "lucide-react";

interface FolderWindowProps {
  title: string;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
}

const FolderWindow: React.FC<FolderWindowProps> = ({
  title,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="window-title flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Folder size={14} />
          <span className="text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="minimize-button" onClick={onMinimize}>
            <span className="window-button-icon">_</span>
          </button>
          <button className="maximize-button" onClick={onMaximize}>
            <span className="window-button-icon">□</span>
          </button>
          <button className="close-button" onClick={onClose}>
            <span className="window-button-icon">×</span>
          </button>
        </div>
      </div>

      <div className="window-content flex flex-col flex-1">
        {/* Menu Bar */}
        <div className="bg-[#ECE9D8] border-b border-[#ACA899] p-1">
          <div className="flex items-center gap-1 text-xs">
            <button className="px-2 py-0.5 hover:bg-[#316AC5] hover:text-white rounded">
              File
            </button>
            <button className="px-2 py-0.5 hover:bg-[#316AC5] hover:text-white rounded">
              Edit
            </button>
            <button className="px-2 py-0.5 hover:bg-[#316AC5] hover:text-white rounded">
              View
            </button>
            <button className="px-2 py-0.5 hover:bg-[#316AC5] hover:text-white rounded">
              Tools
            </button>
            <button className="px-2 py-0.5 hover:bg-[#316AC5] hover:text-white rounded">
              Help
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-[#ECE9D8] border-b border-[#ACA899] p-1">
          <div className="flex items-center gap-2 px-2">
            <button
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#e0e0e0] disabled:opacity-50"
              disabled
            >
              <ChevronLeft size={16} />
              <span className="text-xs">Back</span>
            </button>
            <button
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#e0e0e0] disabled:opacity-50"
              disabled
            >
              <ChevronRight size={16} />
              <span className="text-xs">Forward</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#e0e0e0]">
              <ArrowUp size={16} />
              <span className="text-xs">Up</span>
            </button>
            <div className="h-4 w-px bg-[#ACA899] mx-2" />
            <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#e0e0e0]">
              <Search size={16} />
              <span className="text-xs">Search</span>
            </button>
          </div>
        </div>

        {/* Address Bar */}
        <div className="flex items-center gap-2 p-2 bg-[#ECE9D8] border-b border-[#ACA899]">
          <span className="text-xs">Address</span>
          <input
            type="text"
            className="flex-1 px-2 py-1 text-xs border border-[#7F9DB9] bg-white"
            value="C:\Windows\System32"
            readOnly
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0">
          {/* Left Sidebar */}
          <div className="w-48 bg-[#ECE9D8] border-r border-[#ACA899] p-2">
            <div className="text-xs font-bold mb-2">File and Folder Tasks</div>
            <div className="space-y-1">
              <button className="w-full text-left text-xs px-2 py-1 hover:bg-[#316AC5] hover:text-white rounded">
                Make a new folder
              </button>
              <button className="w-full text-left text-xs px-2 py-1 hover:bg-[#316AC5] hover:text-white rounded">
                Publish this folder to the Web
              </button>
              <button className="w-full text-left text-xs px-2 py-1 hover:bg-[#316AC5] hover:text-white rounded">
                Share this folder
              </button>
            </div>
          </div>

          {/* Folder Content */}
          <div className="flex-1 bg-white p-2 overflow-auto">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 p-2 rounded hover:bg-[#316AC5] hover:text-white cursor-pointer"
                >
                  <Folder className="w-8 h-8 text-[#FCD53F]" />
                  <span className="text-xs text-center">Folder {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#ECE9D8] border-t border-[#ACA899] px-2 py-1 flex justify-between">
          <span className="text-xs">12 objects</span>
          <span className="text-xs">143 MB available</span>
        </div>
      </div>
    </div>
  );
};

export default FolderWindow;
