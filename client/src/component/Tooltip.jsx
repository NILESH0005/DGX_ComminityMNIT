import { useState } from "react";

export default function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-700 rounded shadow-lg whitespace-nowrap z-50">
          {text}
        </div>
      )}
    </div>
  );
}