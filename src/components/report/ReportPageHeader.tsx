import { CalendarDays, Download } from "lucide-react";

type ReportPageHeaderProps = {
  from: string;
  to: string;
  loading: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onRefresh: () => void;
  onExport: () => void;
};

const ReportPageHeader = ({
  from,
  to,
  loading,
  onFromChange,
  onToChange,
  onRefresh,
  onExport,
}: ReportPageHeaderProps) => {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Reports Dashboard</h1>
        <p className="mt-1 text-slate-500">
          Live operational overview for the selected reporting period.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          From
          <input
            className="h-11 rounded border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            type="date"
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          To
          <input
            className="h-11 rounded border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            type="date"
            value={to}
            onChange={(event) => onToChange(event.target.value)}
          />
        </label>
        <button
          className="inline-flex h-11 items-center gap-2 rounded border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          onClick={onRefresh}
          type="button"
        >
          <CalendarDays size={18} />
          Apply
        </button>
        <button
          className="inline-flex h-11 items-center gap-2 rounded bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          onClick={onExport}
          type="button"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>
    </header>
  );
};

export default ReportPageHeader;
