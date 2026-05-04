import React, { useState, useRef, useEffect } from "react";
import generatePDF from "react-to-pdf";
import { toast } from "react-hot-toast";
import API from "../../api/axiosInstance";
import ReportFilters from "./ReportFilters";
import ReportTable from "./ReportTable";
import { COLUMNS, SECTIONS } from "./reportConstants";
import ReportPDFTemplate from "./ReportPDFTemplate";

const DownloadReport: React.FC = () => {
  const [section, setSection] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [preview, setPreview] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingMonths, setLoadingMonths] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const selectedSection = SECTIONS.find((s) => s.value === section);
  const columns = section ? COLUMNS[section] : [];
  const downloadDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!section) {
      setAvailableYears([]);
      setAvailableMonths([]);
      setYear("");
      setMonth("");
      setPreview(false);
      setData([]);
      return;
    }

    const fetchYears = async () => {
      setLoadingYears(true);
      setAvailableYears([]);
      setAvailableMonths([]);
      setYear("");
      setMonth("");
      setPreview(false);
      setData([]);
      try {
        const res = await API.get(`${selectedSection!.endpoint}?page=1&limit=1`);
        const years: string[] = res.data?.availableYears || [];
        setAvailableYears(years);
      } catch {
        toast.error("Failed to load years");
      } finally {
        setLoadingYears(false);
      }
    };

    fetchYears();
  }, [section]);

  useEffect(() => {
    if (!section || !year) {
      setAvailableMonths([]);
      setMonth("");
      setPreview(false);
      return;
    }

    const fetchMonths = async () => {
      setLoadingMonths(true);
      setAvailableMonths([]);
      setMonth("");
      setPreview(false);
      try {
        const res = await API.get(`${selectedSection!.endpoint}?page=1&limit=1&year=${year}`);
        const months: string[] = res.data?.availableMonths || [];
        setAvailableMonths(months);
      } catch {
        toast.error("Failed to load months");
      } finally {
        setLoadingMonths(false);
      }
    };

    fetchMonths();
  }, [year, section]);

  const handlePreview = async () => {
    if (!year || !month || !section) {
      toast.error("Please select Section, Year and Month");
      return;
    }
    setLoadingPreview(true);
    setPreview(false);
    setData([]);
    try {
      const res = await API.get(
        `${selectedSection!.endpoint}?year=${year}&month=${month}&page=1&limit=1000`
      );
      const entries: Record<string, unknown>[] = res.data?.data || [];
      if (entries.length === 0) {
        toast.error("No data found for this selection");
        return;
      }
      setData(entries);
      setPreview(true);
      toast.success("Data loaded successfully");
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownload = () => {
    if (!preview) {
      toast.error("Please preview first");
      return;
    }
    generatePDF(() => targetRef.current, {
      filename: `${selectedSection?.label}-${month}-${year}.pdf`,
    });
  };

  return (
    <div className="md:p-8 p-4 max-w-7xl mx-auto mt-5">
      <h1 className="text-2xl md:text-3xl font-black text-blue-950 dark:text-white mb-6 md:mb-8">
        Download Report
      </h1>

      <ReportFilters
        section={section}
        year={year}
        month={month}
        availableYears={availableYears}
        availableMonths={availableMonths}
        loadingYears={loadingYears}
        loadingMonths={loadingMonths}
        loadingPreview={loadingPreview}
        preview={preview}
        onSectionChange={setSection}
        onYearChange={setYear}
        onMonthChange={setMonth}
        onPreview={handlePreview}
        onDownload={handleDownload}
      />

      {preview && (
        <ReportTable columns={columns} data={data} />
      )}

      <ReportPDFTemplate
        targetRef={targetRef}
        columns={columns}
        data={data}
        sectionLabel={selectedSection?.label || ""}
        month={month}
        year={year}
        downloadDate={downloadDate}
      />
    </div>
  );
};

export default DownloadReport;