import React from "react";

interface ReportTableProps {
  columns: { label: string; key: string }[];
  data: Record<string, unknown>[];
}

const ReportTable: React.FC<ReportTableProps> = ({ columns, data }) => {
  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border dark:border-gray-700 mb-4">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-blue-950 text-white">
              <th className="border border-blue-800 px-3 py-3 text-center whitespace-nowrap">#</th>
              {columns.map((col) => (
                <th key={col.key} className="border border-blue-800 px-3 py-3 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row._id as string}
                className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
              >
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {index + 1}
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="border border-gray-200 dark:border-gray-700 px-3 py-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
                    {(row[col.key] as string) ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-right text-xs text-gray-400 mb-4">
        Total Entries: {data.length}
      </div>
    </>
  );
};

export default ReportTable;