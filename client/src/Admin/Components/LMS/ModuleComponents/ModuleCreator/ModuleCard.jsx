import React from "react";
import { motion } from "framer-motion";

const ModuleCard = ({ module }) => {
  const bannerUrl =
    module.bannerUrl ||
    (module.banner && typeof module.banner !== "string"
      ? URL.createObjectURL(module.banner)
      : module.banner);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        {bannerUrl && (
          <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg border">
            <img
              src={bannerUrl}
              alt={module.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-image.png";
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">
            {module.name}
          </h3>
          {module.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {module.description}
            </p>
          )}
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {module.subModules?.length || 0} submodules
            </span>
            <span className="text-xs text-gray-400">
              {new Date(module.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleCard;