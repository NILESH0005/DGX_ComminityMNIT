import React from "react";

export default function CommonTable({
  title,
  columns = [],
  data = [],
  loading = false,
  maxHeight = "max-h-96",
}) {
  return (
    <div className="h-full">
      {/* Title */}
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      )}

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className={`${maxHeight} overflow-y-auto thin-scrollbar`}>
          {/* <div className="overflow-x-auto"> */}
          <table className="w-full text-sm text-left text-gray-700">
            {/* Header */}
            <thead
              // className="bg-gray-100 text-gray-800 uppercase text-xs sticky top-0 z-10"
              className="sticky top-0 bg-gray-100 z-20 backdrop-blur"
            >
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="px-3 py-2 whitespace-nowrap">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : !data?.length ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    No Data Found
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={row.DistrictName || rowIndex}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-3 py-2 whitespace-nowrap"
                      >
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
