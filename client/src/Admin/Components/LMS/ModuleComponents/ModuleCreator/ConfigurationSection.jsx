import React from "react";

const ConfigurationSection = ({
  groupedBatches,
  loadingBatches,
  uiTypeOptions,
  loadingUiTypes,
  eventOptions,
  loadingEvents,
  lmsLevels,
  loadingLmsLevels,
  lmsUserCategories,
  loadingLmsUserCategories,
  module,
  onChange,
}) => {
  return (
    <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-7 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Learning Configuration
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Configure batches, UI types, levels, and accessibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Batch
          </label>
          <select
            name="batchId"
            value={module.batchId}
            onChange={onChange}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
          >
            <option value="">
              {loadingBatches ? "Loading batches..." : "-- Select Batch --"}
            </option>
            {Object.entries(groupedBatches).map(([group, batches]) => (
              <optgroup key={group} label={group}>
                {batches.map((batch) => (
                  <option key={batch.batch_ID} value={batch.batch_ID}>
                    {batch.batch_Name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Event
          </label>
          <select
            name="eventId"
            value={module.eventId}
            onChange={onChange}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
          >
            <option value="">
              {loadingEvents ? "Loading Events..." : "-- Select Event --"}
            </option>
            {eventOptions.map((event) => (
              <option key={event.EventID} value={event.EventID}>
                {event.EventName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select UI Type
          </label>
          <select
            name="uiTypeId"
            value={module.uiTypeId}
            onChange={onChange}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
          >
            <option value="">
              {loadingUiTypes ? "Loading UI Types..." : "-- Select UI Type --"}
            </option>
            {uiTypeOptions.map((ui) => (
              <option key={ui.UITypeID} value={ui.UITypeID}>
                {ui.UIName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select LMS Level
          </label>
          <select
            name="lmsLevel"
            value={module.lmsLevel}
            onChange={onChange}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
          >
            <option value="">
              {loadingLmsLevels
                ? "Loading LMS Levels..."
                : "-- Select LMS Level --"}
            </option>
            {lmsLevels.map((level) => (
              <option key={level.idCode} value={level.idCode}>
                {level.ddValue}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select LMS User Category
        </label>
        <select
          name="lmsUserCategory"
          value={module.lmsUserCategory}
          onChange={onChange}
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
        >
          <option value="">
            {loadingLmsUserCategories
              ? "Loading Categories..."
              : "-- Select User Category --"}
          </option>
          {lmsUserCategories.map((category) => (
            <option key={category.idCode} value={category.idCode}>
              {category.ddValue}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ConfigurationSection;