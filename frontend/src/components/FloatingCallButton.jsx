import React from "react";
import { PhoneCall } from "lucide-react";

const PHONE_NUMBER = "+91 98264 88991";

const FloatingCallButton = () => {
  return (
    <div className="group fixed bottom-6 right-6 z-50">
      <div className="flex items-center justify-end gap-3">
        <span className="pointer-events-none max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-black px-0 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition-all duration-300 group-hover:max-w-xs group-hover:px-4 group-hover:opacity-100">
          {PHONE_NUMBER}
        </span>

        <a
          href={`tel:${PHONE_NUMBER.replace(/\s+/g, "")}`}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-black shadow-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-500"
          title={`Call ${PHONE_NUMBER}`}
          aria-label={`Call ${PHONE_NUMBER}`}
        >
          <PhoneCall className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};

export default FloatingCallButton;
