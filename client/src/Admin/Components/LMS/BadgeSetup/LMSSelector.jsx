import React, { useState, useEffect, useContext } from "react";
import ApiContext from "../../../../context/ApiContext";

const LMSSelector = ({
  selectedLMS,
  setSelectedLMS,
  events = [],
  loadingEvents = false,
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [lmsModules, setLmsModules] = useState([]);
  const [loadingLMS, setLoadingLMS] = useState(false);
  const { fetchData, userToken } = useContext(ApiContext);

  useEffect(() => {
    const fetchLMSModules = async () => {
      if (!selectedEvent) {
        setLmsModules([]);
        setSelectedLMS(null);
        return;
      }

      setLoadingLMS(true);
      try {
        const result = await fetchData(
          `lms/get-modules-by-event?eventId=${selectedEvent.EventID}`,
          "GET",
          {},
          { "auth-token": userToken },
        );

        console.log("API Response:", result); // Debug log

        if (result?.success) {
          // ✅ Handle both response formats:
          // 1. result.data is an array directly
          // 2. result.data.modules is an array (nested)
          let modulesData = [];

          if (Array.isArray(result.data)) {
            modulesData = result.data;
          } else if (
            result.data?.modules &&
            Array.isArray(result.data.modules)
          ) {
            modulesData = result.data.modules;
          } else {
            modulesData = [];
          }

          console.log("Modules data:", modulesData); // Debug log
          const badgeEnabledModules = modulesData.filter(
            (module) =>
              module.isBadgeEnabled === true ||
              Number(module.isBadgeEnabled) === 1,
          );

          setLmsModules(badgeEnabledModules);
        } else {
          setLmsModules([]);
        }
      } catch (error) {
        console.error("Error fetching LMS modules:", error);
        setLmsModules([]);
      } finally {
        setLoadingLMS(false);
      }
    };

    fetchLMSModules();
  }, [selectedEvent, fetchData, userToken, setSelectedLMS]);

  useEffect(() => {
    if (selectedLMS && selectedEvent) {
      const stillExists = lmsModules.some(
        (module) => module.ModuleID === selectedLMS.ModuleID,
      );
      if (!stillExists) {
        setSelectedLMS(null);
      }
    }
  }, [lmsModules, selectedLMS, selectedEvent, setSelectedLMS]);

  const badgeEnabledEvents = events.filter(
    (event) => event.isBadgeEnabled === true,
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Select Event */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <span className="inline-block bg-blue-600 text-white text-xs rounded-full px-2 py-1 mr-2">
                1
              </span>
              Select Event
            </label>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedEvent?.EventID || ""}
              onChange={(e) => {
                const event = events.find(
                  (item) => item.EventID === Number(e.target.value),
                );
                setSelectedEvent(event || null);
                setSelectedLMS(null);
              }}
            >
              <option value="">
                {loadingEvents ? "Loading Events..." : "-- Select Event --"}
              </option>

              {badgeEnabledEvents.map((event) => (
                <option key={event.EventID} value={event.EventID}>
                  {event.EventName}
                </option>
              ))}
            </select>

            {selectedEvent && (
              <div className="mt-2 text-green-600 text-sm">
                <svg
                  className="inline-block w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Selected: <strong>{selectedEvent.EventName}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Step 2: Select LMS Module */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <span className="inline-block bg-blue-600 text-white text-xs rounded-full px-2 py-1 mr-2">
                2
              </span>
              Select LMS Module
            </label>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={selectedLMS?.ModuleID || ""}
              onChange={(e) => {
                const lms = lmsModules.find(
                  (item) => item.ModuleID === Number(e.target.value),
                );
                setSelectedLMS(lms || null);
              }}
              disabled={!selectedEvent || lmsModules.length === 0}
            >
              <option value="">
                {loadingLMS
                  ? "Loading Modules..."
                  : !selectedEvent
                    ? "Please select an event first"
                    : lmsModules.length === 0
                      ? "No modules found"
                      : "-- Select LMS Module --"}
              </option>

              {/* ✅ Safe check before mapping */}
              {Array.isArray(lmsModules) &&
                lmsModules.map((lms) => (
                  <option key={lms.ModuleID} value={lms.ModuleID}>
                    {lms.ModuleName}
                  </option>
                ))}
            </select>

            {selectedEvent && lmsModules.length === 0 && !loadingLMS && (
              <div className="mt-2 text-yellow-600 text-sm">
                <svg
                  className="inline-block w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No modules found for this event</span>
              </div>
            )}

            {selectedLMS && (
              <div className="mt-2 text-green-600 text-sm">
                <svg
                  className="inline-block w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Selected: <strong>{selectedLMS.ModuleName}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Configuration Summary */}
        {selectedEvent && selectedLMS && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="mr-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h6 className="font-bold mb-1 text-green-800">
                  Configuration Ready
                </h6>
                <p className="mb-0 text-sm text-green-700">
                  <strong>Event:</strong> {selectedEvent.EventName}{" "}
                  &nbsp;|&nbsp;
                  <strong>Module:</strong> {selectedLMS.ModuleName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMSSelector;
