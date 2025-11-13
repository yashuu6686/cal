
import moment from "moment";
import dayjs from "dayjs";

export const getServiceDetails = (event) => {
  if (!event?.title) {
    return { serviceType: "No title", speciality: "N/A" };
  }

  const parts = event.title.split(" - ");
  return {
    serviceType: parts[0] || "No title",
    speciality: parts[1] || "N/A",
  };
};


export const formatEventTime = (date) => {
  return moment(date).format("ddd, MMM D, h:mm A");
};


export const getEventDayName = (date) => {
  return moment(date).format("dddd");
};


export const sortBreaksByDayAndTime = (breaks) => {
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return breaks
    .flatMap((breakItem, breakIndex) =>
      breakItem.days.map((day, dayIndex) => ({
        ...breakItem,
        day,
        breakIndex,
        dayIndex,
      }))
    )
    .sort((a, b) => {
      const dayA = dayOrder.indexOf(a.day);
      const dayB = dayOrder.indexOf(b.day);
      if (dayA !== dayB) return dayA - dayB;

      const timeA = dayjs(a.startTime).hour() * 60 + dayjs(a.startTime).minute();
      const timeB = dayjs(b.startTime).hour() * 60 + dayjs(b.startTime).minute();
      return timeA - timeB;
    });
};

export const sortHolidaysByDateTime = (holidays) => {
  return [...holidays].sort((a, b) => {
    const dateA = dayjs(a.date);
    const dateB = dayjs(b.date);

    if (dateA.isSame(dateB, "day")) {
      const timeA = dayjs(a.startTime, "HH:mm");
      const timeB = dayjs(b.startTime, "HH:mm");
      return timeA.isBefore(timeB) ? -1 : 1;
    }

    return dateA.isBefore(dateB) ? -1 : 1;
  });
};