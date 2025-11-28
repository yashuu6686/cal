import dayjs from "dayjs";

export const buildCalendarPayload = ({
  selectedServices,
  services,
  selectedSpecialties,
  specialties,
  days,
  slots,
  breakData,
  holidayData,
  masterProfileId,
  advanceBooking,
  calendar, //  Add calendar parameter
}) => {
  const buildServicesPayload = () => {
    return services
      .filter((s) => selectedServices.includes(s._id))
      .map((s) => ({
        keyIdentifier: s.keyIdentifier,
        duration: s.duration,
        name: s.name,
        addressId: s.addressId || null,
      }));
  };

  const buildSpecialtiesPayload = () => {
    return specialties.filter((s) => selectedSpecialties.includes(s._id));
  };

  const buildBreaksForDay = (day) => {
   
    if (breakData.selectedDays.includes(day) && breakData.breakStartTime && breakData.breakEndTime) {
      return [
        {
          breakStartTime: breakData.breakStartTime.format("HH:mm"),
          breakEndTime: breakData.breakEndTime.format("HH:mm"),
        },
      ];
    }

   
     const existingDayData = calendar?.availability?.find((item) => item.day === day);
  if (existingDayData?.breaks && existingDayData.breaks.length > 0) {
    return existingDayData.breaks.map(({ _id, ...rest }) => rest); 
  }

  return [];
  };

  const buildServicesForDay = (daySlots) => {
    return daySlots.map((s) => ({
      keyIdentifier: s.serviceType.keyIdentifier,
      name: s.serviceType.name,
      startTime: s.startTime?.format("HH:mm"),
      endTime: s.endTime?.format("HH:mm"),
    }));
  };

  const buildAvailability = () => {
    return days.map((day) => ({
      day,
      breaks: buildBreaksForDay(day),
      services: buildServicesForDay(slots[day]),
    }));
  };

  const buildHolidays = () => {
    let holidays = [];


    if (calendar?.holidays && calendar.holidays.length > 0) {
      holidays = calendar.holidays.map((h) => ({
        date: dayjs(h.date).format("YYYY-MM-DD"),
        startTime: h.startTime || null,
        endTime: h.endTime || null,
      }));
    }


    if (holidayData?.date) {
      holidays.push({
        date: dayjs(holidayData.date).format("YYYY-MM-DD"),
        startTime: holidayData.startTime?.format("HH:mm") || null,
        endTime: holidayData.endTime?.format("HH:mm") || null,
      });
    }

    return holidays;
  };

  const masterProfileID = () => {
    return masterProfileId;
  };

  return {
    specialties: buildSpecialtiesPayload(),
    services: buildServicesPayload(),
    availability: buildAvailability(),
    holidays: buildHolidays(),
    masterProfileId: masterProfileID(),
    advanceBookingDays: advanceBooking.advanceBookingDays,
    checkInTime: advanceBooking.checkInTime,
  };
};