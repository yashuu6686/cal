export const buildCalendarPayload = ({
  selectedServices,
  services,
  selectedSpecialties,
  specialties,
  days,
  slots,
  breakData,
  holidayData,
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
    if (!breakData.selectedDays.includes(day)) return [];

    return [
      {
        breakStartTime: breakData.breakStartTime?.format("HH:mm"),
        breakEndTime: breakData.breakEndTime?.format("HH:mm"),
      },
    ];
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
    if (!holidayData.date) return [];

    return [
      {
        date: holidayData.date.format("YYYY-MM-DD"),
        startTime: holidayData.startTime?.format("HH:mm") || null,
        endTime: holidayData.endTime?.format("HH:mm") || null,
      },
    ];
  };

  return {
    specialties: buildSpecialtiesPayload(),
    services: buildServicesPayload(),
    availability: buildAvailability(),
    holidays: buildHolidays(),
  };
};
