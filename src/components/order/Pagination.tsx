const buildPageList = (page: number, totalPages: number): (number | "…")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 3) {
    return [1, 2, 3, 4, "…", totalPages - 1, totalPages];
  } else if (page >= totalPages - 2) {
    return [1, 2, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }
}

const PaginationBtn = ({
  children,
  active,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

const Pagination = ({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}) => {
  const pages = buildPageList(page, totalPages);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-50 border-t border-slate-200">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {[5, 10, 20, 50].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <PaginationBtn onClick={() => onPageChange(1)} disabled={page === 1} title="First page">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
          </svg>
        </PaginationBtn>
        <PaginationBtn onClick={() => onPageChange(page - 1)} disabled={page === 1} title="Previous page">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </PaginationBtn>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ell-${i}`} className="w-8 text-center text-xs text-slate-400 select-none">…</span>
          ) : (
            <PaginationBtn key={p} active={p === page} onClick={() => onPageChange(p as number)}>
              {p}
            </PaginationBtn>
          )
        )}
        <PaginationBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages} title="Next page">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </PaginationBtn>
        <PaginationBtn onClick={() => onPageChange(totalPages)} disabled={page === totalPages} title="Last page">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M6 5l7 7-7 7" />
          </svg>
        </PaginationBtn>
      </div>
    </div>
  );
}

export default Pagination;
