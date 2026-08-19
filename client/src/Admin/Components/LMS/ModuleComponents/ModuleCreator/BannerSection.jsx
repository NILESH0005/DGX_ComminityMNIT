import React from "react";
import ValidationError from "./ValidationError";
import FileUploader from "../../../../../container/FileUploader";

const BannerSection = ({
  module,
  errors,
  touched,
  onImageUpload,
  onRemoveImage,
}) => {
  const bannerUrl = module.bannerUrl || 
    (module.banner && typeof module.banner !== "string" 
      ? URL.createObjectURL(module.banner) 
      : null);

  return (
    <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-7 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Banner & Media
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload a visually appealing banner for the module.
        </p>
      </div>

      <div className="rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Banner Image <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-blue-500 mb-4">
          Recommended: 800×400px • Max Size: 200KB
        </p>

        {bannerUrl ? (
          <div className="relative">
            <img
              src={bannerUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-2xl border border-gray-200"
            />
            <button
              onClick={onRemoveImage}
              type="button"
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
            >
              ✕
            </button>
          </div>
        ) : (
          <FileUploader
            moduleName="LMS"
            folderName="module-banners"
            onUploadComplete={onImageUpload}
            accept="image/*"
            maxSize={200 * 1024}
            label="Upload Banner Image"
            previewType="image"
          />
        )}
        <ValidationError error={errors.banner} touched={touched.banner} />
      </div>
    </div>
  );
};

export default BannerSection;