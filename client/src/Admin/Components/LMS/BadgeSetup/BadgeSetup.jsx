import React, { useState } from "react";
import LMSSelector from "./LMSSelector";
import BadgeMapper from "./BadgeMapper";

const BadgeSetup = ({ events = [], loadingEvents = false }) => {
  const [selectedLMS, setSelectedLMS] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-2xl font-bold mb-1">Badge Setup</h3>
          <p className="text-gray-500">Configure badges for your LMS modules</p>
        </div>
      </div>

      <LMSSelector
        selectedLMS={selectedLMS}
        setSelectedLMS={setSelectedLMS}
        events={events}
        loadingEvents={loadingEvents}
      />

      {selectedLMS && <BadgeMapper selectedLMS={selectedLMS} />}
    </div>
  );
};

export default BadgeSetup;