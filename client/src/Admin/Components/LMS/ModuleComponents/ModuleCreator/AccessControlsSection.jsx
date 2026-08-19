import React from "react";

const AccessControlsSection = ({ module, setNewModule }) => {
  const controls = [
    {
      key: "hasCertificate",
      icon: "🎓",
      label: "Certificate",
      description: "Generate certificates after completion.",
      color: "green",
    },
    {
      key: "quizAccessOnSubModuleCompletion",
      icon: "🧠",
      label: "Quiz Unlock",
      description: "Unlock quiz after submodule completion.",
      color: "blue",
    },
    {
      key: "onBackShowSubModule",
      icon: "↩",
      label: "Smart Back",
      description: "Show submodules while navigating back.",
      color: "indigo",
      isNumber: true,
    },
    // Added: Badge toggle
    {
      key: "isBadgeEnabled",
      icon: "🏅",
      label: "Badges",
      description: "Enable badges for learners completing this module.",
      color: "yellow",
    },
  ];

  return (
    <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Access & Controls
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure module accessibility, learning behavior, and gamification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {controls.map(({ key, icon, label, description, color, isNumber }) => (
          <label
            key={key}
            className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 cursor-pointer hover:shadow-sm transition-all"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-${color}-50 text-${color}-600 group-hover:scale-105 transition-all`}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-gray-800 text-sm">
                  {label}
                </h4>
                <input
                  type="checkbox"
                  checked={
                    isNumber
                      ? module[key] === 1
                      : module[key] || false
                  }
                  onChange={(e) =>
                    setNewModule((prev) => ({
                      ...prev,
                      [key]: isNumber
                        ? e.target.checked
                          ? 1
                          : 0
                        : e.target.checked,
                    }))
                  }
                  className={`h-4 w-4 accent-${color}-600`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {description}
              </p>
              {/* Show badge info when enabled */}
              {key === "isBadgeEnabled" && module.isBadgeEnabled && (
                <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-1.5 rounded-lg border border-yellow-200">
                  <span className="font-medium">✨</span> Learners will earn badges for:
                  <ul className="mt-1 ml-3 list-disc text-yellow-700">
                    <li>Module completion</li>
                    <li>Perfect scores</li>
                    <li>Progress milestones</li>
                  </ul>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AccessControlsSection;