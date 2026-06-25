import type { ReactNode } from "react";

type ReportSummaryCardProps = {
  title: string;
  value: string;
  helper: string;
  icon: ReactNode;
  loading: boolean;
  tone?: "primary" | "success" | "warning";
};

const toneClasses = {
  primary: "bg-blue-50 text-blue-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
};

const ReportSummaryCard = ({
  title,
  value,
  helper,
  icon,
  loading,
  tone = "primary",
}: ReportSummaryCardProps) => {
  return (
    <article className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>
          {loading ? (
            <div className="mt-3 h-8 w-32 animate-pulse rounded bg-slate-200" />
          ) : (
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{value}</h2>
          )}
          <p className="mt-2 text-sm text-slate-500">{helper}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
};

export default ReportSummaryCard;
