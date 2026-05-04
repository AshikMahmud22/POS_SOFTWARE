import React from "react";

interface ReportPDFTemplateProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  columns: { label: string; key: string }[];
  data: Record<string, unknown>[];
  sectionLabel: string;
  month: string;
  year: string;
  downloadDate: string;
}

const ReportPDFTemplate: React.FC<ReportPDFTemplateProps> = ({
  targetRef,
  columns,
  data,
  sectionLabel,
  month,
  year,
  downloadDate,
}) => {
  return (
    <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
      <div
        ref={targetRef}
        style={{
          backgroundColor: "#ffffff",
          padding: "24px",
          fontFamily: "Arial, sans-serif",
          width: "1100px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            borderBottom: "2px solid #1e3a5f",
            paddingBottom: "14px",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "900",
              color: "#1e3a5f",
              margin: "0 0 6px 0",
              textTransform: "uppercase",
              letterSpacing: "2px",
              textAlign: "center",
            }}
          >
            Sweet Home Construction
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#555555",
              margin: "0 0 2px 0",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {sectionLabel} Report — {month} {year}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#888888",
              margin: "0",
              textAlign: "center",
            }}
          >
            Downloaded on: {downloadDate}
          </p>
        </div>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11px",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#1e3a5f", color: "#ffffff" }}>
                <th
                  style={{
                    border: "1px solid #1e3a5f",
                    padding: "8px 6px",
                    textAlign: "center",
                    width: "40px",
                    wordBreak: "break-word",
                  }}
                >
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      border: "1px solid #1e3a5f",
                      padding: "8px 6px",
                      textAlign: "center",
                      wordBreak: "break-word",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={row._id as string}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f5f7fa",
                  }}
                >
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      padding: "6px",
                      textAlign: "center",
                      color: "#666666",
                      fontWeight: "600",
                      wordBreak: "break-word",
                    }}
                  >
                    {index + 1}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        border: "1px solid #dddddd",
                        padding: "6px",
                        textAlign: "center",
                        color: "#222222",
                        wordBreak: "break-word",
                      }}
                    >
                      {(row[col.key] as string) ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "11px",
            color: "#888888",
          }}
        >
          Total Entries: {data.length}
        </div>
      </div>
    </div>
  );
};

export default ReportPDFTemplate;