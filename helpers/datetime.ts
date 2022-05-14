const padLeft = (value: string | number): string => {
  return value.toString().padStart(2, '0');
}


// Formats date to format: DD/MM/YYYY, or local equivalent
const formatFullDate = (date: Date): string => {
  return date.toLocaleDateString()
};

const formatShortDate = (date: Date, monthsList?: string[]): string => {
  return monthsList ? `${padLeft(date.getDate())} ${getMonth(date, monthsList)}` : `${padLeft(date.getDate())} / ${padLeft(date.getMonth() + 1)} `;
}

const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${padLeft(hours)}:${padLeft(minutes)}`;
}

// const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekdaysShort = ['Sön', 'Mon', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
const weekdaysLong = ['Söndag', 'Mondag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
const getWeekday = (date: Date, weekdaysList: string[]): string => {
  const weekday = date.getDay();
  return weekdaysList[weekday];
}

const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
const monthsLong = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
const getMonth = (date: Date, monthsList: string[]): string => {
  const month = date.getMonth();
  return monthsList[month];
}

// Formats date to format: HH:MM, Monday 23rd of March
const formatWithWeekday = (date: Date, weekdaysList: string[]): string => {
  return `${formatTime(date)}, ${getWeekday(date, weekdaysList)} `;
}

/* THIS IS FOR WHEN TRANSLATIONS ARE ADDED */
type DateTimeStrings = {
  weekdaysLong: string[]
  weekdaysShort: string[]
  monthsShort: string[]
  monthsLong: string[]
}

const formatReadableDateTime = (date: Date, dateTimeStrings: DateTimeStrings): string => {
  const timeSince = new Date().getTime() - date.getTime();
  // If today
  if (timeSince < 86400000) {
    return formatTime(date);
  }
  // If less than a week ago
  if (timeSince < 604800000) {
    return formatWithWeekday(date, dateTimeStrings.weekdaysLong);
  }
  // If within 2 weeks ago or this month
  if (timeSince < 1209600000 || date.getMonth() === new Date().getMonth()) {
    return `${getWeekday(date, dateTimeStrings.weekdaysLong)} ${formatShortDate(date, dateTimeStrings.monthsLong)}, ${formatTime(date)} `
  }
  // If this year
  if (date.getFullYear() === new Date().getFullYear()) {
    return `${formatShortDate(date, dateTimeStrings.monthsLong)}, ${formatTime(date)} `;
  }
  return `${formatFullDate(date)}, ${formatTime(date)} `;
}


const DateTime = {
  formatFullDate,
  formatShortDate,
  formatTime,
  getWeekday,
  formatWithWeekday,
  formatReadableDateTime: (date: Date) => formatReadableDateTime(date, { weekdaysLong, weekdaysShort, monthsLong, monthsShort })
}

export default DateTime