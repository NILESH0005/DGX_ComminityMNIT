import React, { useState } from "react";

const GradeScale = ({ gradeScale, setGradeScale, isEditable = true }) => {
  const [rowErrors, setRowErrors] = useState({});
  const validateAllRows = (rows) => {
    const errors = {};
    rows.forEach((row, index) => {
      const rangeFrom = Number(row.rangeFrom);
      const rangeTo = Number(row.rangeTo);
      if (row.rangeTo === "") {
        errors[index] = "Range To is required";
        return;
      }
      if (rangeTo <= rangeFrom) {
        errors[index] = "Range To must be greater than Range From";
        return;
      }
      if (index < rows.length - 1) {
        const nextRangeFrom = Number(rows[index + 1].rangeFrom);
        const expectedNextFrom = Number((rangeTo + 0.01).toFixed(2));
        if (Number(nextRangeFrom.toFixed(2)) !== expectedNextFrom) {
          errors[index] = "Invalid range sequence detected";
        }
      }
      if (rangeTo > 100) {
        errors[index] = "Range To cannot exceed 100";
      }
    });
    return errors;
  };

  const addRow = () => {
    const lastRow = gradeScale[gradeScale.length - 1];

    const updated = [
      ...gradeScale,
      {
        rangeFrom: Number(lastRow.rangeTo) + 0.01,
        rangeTo: "",
        gradeValue: gradeScale.length,
        grade: "",
      },
    ];

    setGradeScale(updated);
    setRowErrors(validateAllRows(updated));
  };

  const updateRangeTo = (index, value) => {
    const updated = [...gradeScale];

    updated[index].rangeTo = value;

    // Auto-update all next rows
    for (let i = index + 1; i < updated.length; i++) {
      const previousRangeTo = Number(updated[i - 1].rangeTo || 0);

      updated[i].rangeFrom = Number((previousRangeTo + 0.01).toFixed(2));
    }

    const errors = validateAllRows(updated);

    setRowErrors(errors);
    setGradeScale(updated);
  };

  const updateField = (index, field, value) => {
    const updated = [...gradeScale];
    updated[index][field] = value;
    setGradeScale(updated);
  };

  const removeRow = (index) => {
    const updated = gradeScale.filter((_, i) => i !== index);

    // Recalculate all Range From values
    for (let i = 1; i < updated.length; i++) {
      updated[i].rangeFrom = Number(
        (Number(updated[i - 1].rangeTo) + 0.01).toFixed(2),
      );
    }

    setGradeScale(updated);
    setRowErrors(validateAllRows(updated));
  };



  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-lg">Grade Scale</h3>

        <button
          type="button"
          onClick={addRow}
          disabled={!isEditable}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          + Add Row
        </button>
      </div>

      {!isEditable && (
        <div className="mb-3 rounded border border-yellow-300 bg-yellow-100 p-3 text-yellow-800">
          Grade Scale cannot be edited because at least one user has already
          attempted this quiz.
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Range From</th>
            <th className="border p-2">Range To</th>
            <th className="border p-2">Grade Value</th>
            <th className="border p-2">Grade</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {gradeScale.map((row, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input value={row.rangeFrom} readOnly className="w-full" />
              </td>

              <td className="border p-2">
                <div>
                  <input
                    type="number"
                    value={row.rangeTo}
                    onChange={(e) => updateRangeTo(index, e.target.value)}
                    disabled={!isEditable || index === 0}
                    className={`w-full border p-1 rounded ${
                      rowErrors[index]
                        ? "border-red-500 bg-red-50"
                        : "border-slate-300"
                    }`}
                  />

                  {rowErrors[index] && (
                    <p className="text-red-500 text-xs mt-1">
                      {rowErrors[index]}
                    </p>
                  )}
                </div>
              </td>

              <td className="border p-2">
                <input
                  type="number"
                  value={row.gradeValue}
                  onChange={(e) =>
                    updateField(index, "gradeValue", e.target.value)
                  }
                  disabled={!isEditable}
                  className="w-full border p-1"
                />
              </td>

              <td className="border p-2">
                <input
                  value={row.grade}
                  onChange={(e) => updateField(index, "grade", e.target.value)}
                  disabled={!isEditable}
                  className="w-full border p-1"
                />
              </td>

              <td className="border p-2">
                {index === 0 ? (
                  <span className="text-gray-400">Auto</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    disabled={!isEditable}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeScale;
