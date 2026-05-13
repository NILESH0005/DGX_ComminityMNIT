import React from "react";
import {
  FaCertificate,
  FaLock,
  FaDownload,
} from "react-icons/fa";

const CertificateSection = () => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">

      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white text-2xl font-bold">
            Certificate
          </h3>

          <p className="text-blue-100 text-sm mt-1">
            Course Completion Reward
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
          <FaCertificate className="text-3xl text-green-300" />
        </div>
      </div>

      {/* LOCKED STATE */}
      <div className="rounded-2xl bg-black/20 border border-white/10 p-5">

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center">
            <FaLock className="text-yellow-300 text-xl" />
          </div>

          <div>
            <h4 className="text-white text-lg font-semibold">
              Certificate Locked
            </h4>

            <p className="text-blue-100 text-sm mt-2 leading-relaxed">
              Pass the final quiz successfully to unlock your downloadable certificate.
            </p>
          </div>
        </div>

      </div>

      {/* BUTTON */}
      <button className="mt-6 w-full border border-white/20 text-white font-semibold py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3">
        <FaDownload />
        View Certificate
      </button>
    </div>
  );
};

export default CertificateSection;