const GradeScale = ({ passingPercentage }) => {
  const grades = [
    {
      rangeFrom: 90,
      rangeTo: 100,
      gradeValue: 5,
      grade: "A",
    },
    {
      rangeFrom: 80,
      rangeTo: 89.99,
      gradeValue: 4,
      grade: "B",
    },
    {
      rangeFrom: 70,
      rangeTo: 79.99,
      gradeValue: 3,
      grade: "C",
    },
    {
      rangeFrom: passingPercentage,
      rangeTo: 69.99,
      gradeValue: 2,
      grade: "D",
    },
    {
      rangeFrom: Math.floor(passingPercentage / 2),
      rangeTo: passingPercentage - 0.01,
      gradeValue: 1,
      grade: "E",
    },
    {
      rangeFrom: 0,
      rangeTo: Math.floor(passingPercentage / 2) - 0.01,
      gradeValue: 0,
      grade: "F",
    },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
      <h3 className="font-semibold text-lg mb-4">
        Grade Scale (Passing: {passingPercentage}%)
      </h3>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">Range From (%)</th>
            <th className="border p-2">Range To (%)</th>
            <th className="border p-2">Grade Value</th>
            <th className="border p-2">Grade</th>
          </tr>
        </thead>

        <tbody>
          {grades.map((item) => (
            <tr key={item.grade}>
              <td className="border p-2">{item.rangeFrom}</td>
              <td className="border p-2">{item.rangeTo}</td>
              <td className="border p-2">{item.gradeValue}</td>
              <td className="border p-2 font-semibold">
                {item.grade}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeScale;
