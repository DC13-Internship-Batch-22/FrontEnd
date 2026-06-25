export const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value ?? 0);

export const formatNumber = (value?: number) =>
  new Intl.NumberFormat("en-US").format(value ?? 0);

export const formatPercent = (value: number) =>
  `${Math.round(Number.isFinite(value) ? value : 0)}%`;

export const formatDateTime = (value?: string) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
