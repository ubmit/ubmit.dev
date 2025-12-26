export const formatDistance = (value: number, unit: "m" | "km") => {
  if (unit === "m") {
    return new Intl.NumberFormat("en-US").format(Math.round(value));
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};
