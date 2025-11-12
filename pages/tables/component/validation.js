// import * as Yup from "yup";
// import dayjs from "dayjs";

// export const validationSchema = Yup.object().shape({
//   service: Yup.string().required("Service type is required"),
//   startTime: Yup.string().required("Start time is required"),
//   endTime: Yup.string()
//     .required("End time is required")
//     .test(
//       "different-time",
//       "Start and End time cannot be same",
//       function (value) {
//         const { startTime } = this.parent;
//         return startTime !== value;
//       }
//     )
//     .test("time-order", "End time must be after start time", function (value) {
//       const { startTime } = this.parent;
//       if (!startTime || !value) return true;
//       return dayjs(`1970-01-01T${value}`).isAfter(
//         dayjs(`1970-01-01T${startTime}`)
//       );
//     }),
//   days: Yup.array().min(1, "Select at least one day"),
// });

// export const holidayValidationSchema = Yup.object().shape({
//   date: Yup.date()
//     .nullable()
//     .required("Date is required")
//     .test("not-in-past", " Please Select validate date", (value) => {
//       if (!value) return false;
//       const today = dayjs().startOf("day");
//       return (
//         dayjs(value).isSame(today, "day") || dayjs(value).isAfter(today, "day")
//       );
//     }),
//   startTime: Yup.string().required("Start time is required"),
//   endTime: Yup.string()
//     .required("End time is required")
//     .test(
//       "same-time",
//       "Start and End time cannot be the same",
//       function (value) {
//         const { startTime } = this.parent;
//         return startTime !== value;
//       }
//     )
//     .test("valid-time", "End time must be after Start time", function (value) {
//       const { startTime } = this.parent;
//       if (!startTime || !value) return true;
//       return dayjs(`1970-01-01T${value}`).isAfter(
//         dayjs(`1970-01-01T${startTime}`)
//       );
//     }),
// });

// export const validateSlotAndSave = async ({
//   values,
//   validationSchema,
//   selectedServices,
//   schedule,
//   setErrors,
//   editing = null,
//   setSchedule,
//   onSave,
// }) => {
//   try {
//     await validationSchema.validate(values, { abortEarly: false });

//     const start = dayjs(`1970-01-01T${values.startTime}`);
//     const end = dayjs(`1970-01-01T${values.endTime}`);
//     const duration = end.diff(start, "minute");

//     // ✅ Service duration check
//     const serviceObj = selectedServices.find((s) => s.type === values.service);
//    if (!values.startTime || !values.endTime || !end.isAfter(start)) {
//   setErrors({
//     startTime: "Please select valid Start Time & End Time.",
//   });
//   return false;
// }

// if (serviceObj && duration < parseInt(serviceObj.time)) {
//   setErrors({
//     startTime: "Please select valid Start Time & End Time.",
//   });
//   return false;
// }


//     // ✅ Flatten all slots for overlap check
//     const allSlots = schedule.flatMap((daySlots, dIdx) =>
//       (daySlots || []).map((slot) => ({ ...slot, dayIndex: dIdx }))
//     );

//     // ✅ Check overlaps for all selected days
//     const hasOverlap = values.days.some((dayIdx) =>
//       allSlots.some((slot) => {
//         // skip current slot in edit mode
//         if (editing && slot.id === editing.slotId) return false;

//         // must be on the same day
//         if (slot.dayIndex !== dayIdx) return false;

//         const slotStart = dayjs(`1970-01-01T${slot.startTime}`);
//         const slotEnd = dayjs(`1970-01-01T${slot.endTime}`);
//         return start.isBefore(slotEnd) && end.isAfter(slotStart);
//       })
//     );

//     if (hasOverlap) {
//       setErrors({ startTime: "This time slot is already booked." });
//       return false;
//     }

//     // ✅ Save or Update
//     if (editing) {
//       // Update slot in state
//       if (setSchedule) {
//         setSchedule((prev) =>
//           prev.map((daySlots, dIdx) =>
//             dIdx === editing.dayIndex
//               ? daySlots.map((slot) =>
//                   slot.id === editing.slotId
//                     ? { ...slot, ...values, duration }
//                     : slot
//                 )
//               : daySlots
//           )
//         );
//       }
//     } else {
//       // New slot → pass to parent
//       onSave({ ...values, duration, id: Date.now() });
//     }

//     setErrors({});
//     return true;
//   } catch (err) {
//     const formattedErrors = {};
//     err.inner?.forEach((e) => (formattedErrors[e.path] = e.message));
//     setErrors(formattedErrors);
//     return false;
//   }
// };

// export const validateHolidayAndSave = async ({
//   values,
//   validationSchema,
//   holidays,
//   setErrors,
//   editing = null,
//   setHolidays,
//   onSave,
// }) => {
//   try {
//     await validationSchema.validate(values, { abortEarly: false });

//     const start = dayjs(`1970-01-01T${values.startTime}`);
//     const end = dayjs(`1970-01-01T${values.endTime}`);
//     const duration = end.diff(start, "minute");

//     // ✅ Check overlaps for the same date
//     const hasOverlap = holidays.some((h, idx) => {
//       // skip current holiday in edit mode
//       if (editing !== null && idx === editing) return false;

//       // must be on the same date
//       if (
//         dayjs(h.date).format("YYYY-MM-DD") !==
//         dayjs(values.date).format("YYYY-MM-DD")
//       )
//         return false;

//       const hStart = dayjs(`1970-01-01T${h.startTime}`);
//       const hEnd = dayjs(`1970-01-01T${h.endTime}`);
//       return start.isBefore(hEnd) && end.isAfter(hStart);
//     });

//     if (hasOverlap) {
//       setErrors({ startTime: "Holiday Already Taken for this time slot." });
//       return false;
//     }

//     // ✅ Save or Update
//     if (editing !== null) {
//       // Update holiday in state
//       if (setHolidays) {
//         setHolidays((prev) =>
//           prev.map((h, i) => (i === editing ? { ...values } : h))
//         );
//       }
//     } else {
//       // New holiday → pass to parent
//       onSave(values);
//     }

//     setErrors({});
//     return true;
//   } catch (err) {
//     const formattedErrors = {};
//     err.inner?.forEach((e) => (formattedErrors[e.path] = e.message));
//     setErrors(formattedErrors);
//     return false;
//   }
// };
