import React from "react";

const CertificateCard = ({ userName = "User", moduleName = "Module" }) => {
  return (
    <div
      className="
        w-[140px] sm:w-[150px] md:w-[160px]
        aspect-[3/2]
        bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]
        rounded-lg p-2 text-center font-serif
        shadow-md border-2 border-[#d4af37]
        flex flex-col justify-center
      "
    >
      <h4 className="text-[0.55rem] sm:text-[0.6rem] md:text-[0.7rem] mb-1">
        Certificate of Completion
      </h4>

      <p className="text-[0.45rem] sm:text-[0.5rem] m-0">
        This certifies that
      </p>

      <h3 className="text-[0.7rem] sm:text-[0.8rem] md:text-[0.9rem] my-1 text-gray-800">
        {userName}
      </h3>

      <p className="text-[0.45rem] sm:text-[0.5rem] m-0">
        has completed
      </p>

      <p className="text-[0.55rem] sm:text-[0.6rem] md:text-[0.65rem] font-bold my-[2px]">
        {moduleName}
      </p>

      <p className="text-[0.4rem] sm:text-[0.45rem] md:text-[0.5rem] mt-1">
        🎉 Congratulations 🎉
      </p>
    </div>
  );
};

export default CertificateCard;