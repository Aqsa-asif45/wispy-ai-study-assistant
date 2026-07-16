import React from "react";

export default function PixelWindow({ title, children, widthClass = "max-w-2xl" }) {
  return (
    <div className={`w-full ${widthClass} mx-auto bg-[#white] border-[6px] border-ink-brown rounded-sm shadow-[8px_8px_0px_0px_#4A3F52] overflow-hidden`}>
      {/* Title Bar */}
      <div className="bg-titlebar-purple border-b-[6px] border-ink-brown px-4 py-2 flex items-center justify-between select-none">
        <span className="font-pixel text-[10px] text-white tracking-wider truncate">
          {title || "system_message.exe"}
        </span>
        {/* Retro window action controls */}
        <div className="flex gap-1.5">
          <div className="w-5 h-5 border-[3px] border-ink-brown bg-cream flex items-center justify-center font-pixel text-[8px] font-bold text-ink-brown cursor-pointer hover:bg-hot-pink active:translate-y-0.5">
            _
          </div>
          <div className="w-5 h-5 border-[3px] border-ink-brown bg-cream flex items-center justify-center font-pixel text-[8px] font-bold text-ink-brown cursor-pointer hover:bg-red-400 active:translate-y-0.5">
            X
          </div>
        </div>
      </div>
      
      {/* Window Body */}
      <div className="p-6 bg-cream text-ink-brown">
        {children}
      </div>
    </div>
  );
}