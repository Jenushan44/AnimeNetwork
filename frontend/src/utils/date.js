export function getCurrentSeason() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const season =
    month >= 1 && month <= 3 ? "WINTER" :
      month >= 4 && month <= 6 ? "SPRING" :
        month >= 7 && month <= 9 ? "SUMMER" :
          "FALL";

  return { season, year };
}

export function formatDate({ year, month, day }) {
  if (!year) return "Unknown";

  const months = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${months[month]} ${day}, ${year}`;
}
