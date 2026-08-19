import React from "react";

const CharacterCounter = ({ value, maxLength }) => {
  if (!maxLength) return null;

  const currentLength = value?.trim().length || 0;
  const isNearLimit = currentLength > maxLength * 0.8;
  const isExceeding = currentLength > maxLength;

  return (
    <div
      className={`text-xs mt-1 ${
        isExceeding
          ? "text-red-500 font-semibold"
          : isNearLimit
          ? "text-yellow-500"
          : "text-gray-500"
      }`}
    >
      {currentLength}/{maxLength} characters
      {isExceeding && <span className="ml-2">(Exceeds limit!)</span>}
    </div>
  );
};

export default CharacterCounter;