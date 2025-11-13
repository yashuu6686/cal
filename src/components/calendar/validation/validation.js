import dayjs from "dayjs";
import * as yup from "yup";

// Working Plan Validation Schema
export const workingPlanSchema = yup.object().shape({
  weekSchedule: yup
    .mixed()

    .test("validate-slots", function (weekSchedule) {
      if (!weekSchedule || !Array.isArray(weekSchedule)) return true;

      const { selectedServices } = this.options.context || {};

      for (let dayIndex = 0; dayIndex < weekSchedule.length; dayIndex++) {
        const dayData = weekSchedule[dayIndex];
        if (!dayData?.slots) continue;

        for (let slotIndex = 0; slotIndex < dayData.slots.length; slotIndex++) {
          const slot = dayData.slots[slotIndex];

          // Validate service type
          if (!slot.serviceType) {
            return this.createError({
              path: `weekSchedule[${dayIndex}].slots[${slotIndex}].serviceType`,
              message: "Service type is required",
            });
          }

          // Validate start time
          if (!slot.start) {
            return this.createError({
              path: `weekSchedule[${dayIndex}].slots[${slotIndex}].start`,
              message: "Start time is required",
            });
          }

          // Validate end time
          if (!slot.end) {
            return this.createError({
              path: `weekSchedule[${dayIndex}].slots[${slotIndex}].end`,
              message: "End time is required",
            });
          }

          // Validate end after start
          if (
            slot.start &&
            slot.end &&
            !dayjs(slot.end).isAfter(dayjs(slot.start))
          ) {
            return this.createError({
              path: `weekSchedule[${dayIndex}].slots[${slotIndex}].end`,
              message: "End time must be after start time",
            });
          }

          // Validate minimum duration
          if (slot.start && slot.end && slot.serviceType && selectedServices) {
            const service = selectedServices.find(
              (s) => s.type === slot.serviceType
            );

            if (service) {
              const duration = dayjs(slot.end).diff(
                dayjs(slot.start),
                "minute"
              );
              const required = parseInt(service.time);

              if (duration < required) {
                return this.createError({
                  path: `weekSchedule[${dayIndex}].slots[${slotIndex}].end`,
                  message: `Slot must be at least ${required} minutes`,
                });
              }
            }
          }
        }

        // Check overlaps within same day
        if (dayData.slots.length > 1) {
          for (let i = 0; i < dayData.slots.length; i++) {
            for (let j = i + 1; j < dayData.slots.length; j++) {
              const slot1 = dayData.slots[i];
              const slot2 = dayData.slots[j];

              if (slot1.start && slot1.end && slot2.start && slot2.end) {
                const overlap =
                  dayjs(slot1.start).isBefore(dayjs(slot2.end)) &&
                  dayjs(slot1.end).isAfter(dayjs(slot2.start));

                if (overlap) {
                  return this.createError({
                    path: `weekSchedule[${dayIndex}].slots[${i}].start`,
                    message: "Time slots are already booked.",
                  });
                }
              }
            }
          }
        }
      }

      return true;
    }),
});

// Holiday Validation Schema

export const holidayValidationSchema = (isPublishingOrUpdating = false) =>
  yup.object().shape({
    date: yup
      .mixed()
      .required("Holiday date is required")
      .test("is-valid-date", "Please select a valid date", function (value) {
        return value && dayjs(value).isValid();
      }),

    startTime: yup
      .mixed()
      .nullable()
      .test("valid-if-provided", "Invalid start time", function (value) {
        if (value && !dayjs(value).isValid()) return false;
        return true;
      })
      .when([], {
        is: () => isPublishingOrUpdating,
        then: (schema) =>
          schema.required("Start time is required when publishing or updating"),
      }),

    endTime: yup
      .mixed()
      .nullable()
      .test("valid-if-provided", "Invalid end time", function (value) {
        if (value && !dayjs(value).isValid()) return false;
        return true;
      })
      .test(
        "is-after-start",
        "End time must be after start time",
        function (value) {
          const { startTime } = this.parent;
          if (startTime && value) {
            return dayjs(value).isAfter(dayjs(startTime));
          }
          return true;
        }
      )
      .when([], {
        is: () => isPublishingOrUpdating,
        then: (schema) =>
          schema.required("End time is required when publishing or updating"),
      })
      .test(
        "no-overlap-with-existing-holidays",
        "This time slot is already booked.",
        function (endTime) {
          const { startTime, date } = this.parent;
          const { existingHolidays, holidayEditIndex } =
            this.options.context || {};

          if (!date || !startTime || !endTime) return true;
          if (!existingHolidays || existingHolidays.length === 0) return true;

          const newDate = dayjs(date).format("YYYY-MM-DD");
          const newStartTime = dayjs(startTime).format("HH:mm");
          const newEndTime = dayjs(endTime).format("HH:mm");

          const newStart = dayjs(
            `${newDate} ${newStartTime}`,
            "YYYY-MM-DD HH:mm"
          );
          const newEnd = dayjs(`${newDate} ${newEndTime}`, "YYYY-MM-DD HH:mm");

          const hasOverlap = existingHolidays.some((holiday, index) => {
            if (
              holidayEditIndex !== null &&
              holidayEditIndex !== undefined &&
              index === holidayEditIndex
            ) {
              return false;
            }

            if (!holiday.date || !holiday.startTime || !holiday.endTime)
              return false;

            const existingDate = dayjs(holiday.date).format("YYYY-MM-DD");
            if (existingDate !== newDate) return false;

            const existingStart = dayjs(
              `${existingDate} ${holiday.startTime}`,
              "YYYY-MM-DD HH:mm"
            );
            const existingEnd = dayjs(
              `${existingDate} ${holiday.endTime}`,
              "YYYY-MM-DD HH:mm"
            );

            return (
              newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)
            );
          });

          return !hasOverlap;
        }
      ),
  });
// ✅ Break Validation Schema
export const breakValidationSchema = yup.object().shape({
  breakSelectedDays: yup
    .array()
    .min(1, "Please select at least one day for break"),
  startTime: yup.mixed().required("Break start time is required"),
  endTime: yup
    .mixed()
    .required("Break end time is required")
    .test("is-after", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      return value && startTime ? dayjs(value).isAfter(dayjs(startTime)) : true;
    })
    .test(
      "no-overlap-with-existing-breaks",
      "This time slot is already booked.",
      function (endTime) {
        const { startTime, breakSelectedDays } = this.parent;
        const { breaks, editIndex } = this.options.context || {};

        if (!startTime || !endTime || !breakSelectedDays?.length) return true;
        if (!breaks || breaks.length === 0) return true;

        const newStartTime = dayjs(startTime).format("HH:mm");
        const newEndTime = dayjs(endTime).format("HH:mm");
        const today = dayjs().format("YYYY-MM-DD");
        const breakStart = dayjs(
          `${today} ${newStartTime}`,
          "YYYY-MM-DD HH:mm"
        );
        const breakEnd = dayjs(`${today} ${newEndTime}`, "YYYY-MM-DD HH:mm");

        const hasOverlap = breakSelectedDays.some((day) => {
          return breaks.some((existingBreak, index) => {
            if (
              editIndex !== null &&
              editIndex !== undefined &&
              index === editIndex
            ) {
              return false;
            }

            if (!existingBreak.days.includes(day)) return false;
            if (!existingBreak.startTime || !existingBreak.endTime)
              return false;

            const existingStart = dayjs(
              `${today} ${existingBreak.startTime}`,
              "YYYY-MM-DD HH:mm"
            );
            const existingEnd = dayjs(
              `${today} ${existingBreak.endTime}`,
              "YYYY-MM-DD HH:mm"
            );

            return (
              breakStart.isBefore(existingEnd) &&
              breakEnd.isAfter(existingStart)
            );
          });
        });

        return !hasOverlap;
      }
    ),
});

// Add Service Schema
export const addServiceSchema = yup.object().shape({
  name: yup
    .string()
    .required("Service name is required")
    .min(3, "Service name must be at least 3 characters")
    .max(50, "Service name must be less than 50 characters"),
  duration: yup
    .number()
    .required("Duration is required")
    .oneOf([15, 30, 45, 60, 90], "Please select a valid duration"),
  type: yup
    .string()
    .required("Service type is required")
    .oneOf(
      ["Home Visit", "Video Call", "Clinic Visit"],
      "Please select a valid service type"
    ),
});

//  Step 2 Combined Validation Schema (Break + Holiday)
export const step2ValidationSchema = yup.object().shape({
  breakSelectedDays: yup
    .array()
    .test(
      "required-with-times",
      "Please select at least one day for break",
      function (value) {
        const { startTime, endTime } = this.parent;
        if (startTime || endTime) {
          return value && value.length > 0;
        }
        return true;
      }
    ),

  startTime: yup
    .mixed()
    .nullable()
    .test(
      "required-with-days",
      "Break start time is required",
      function (value) {
        const { breakSelectedDays } = this.parent;
        if (breakSelectedDays && breakSelectedDays.length > 0) {
          return !!value;
        }
        return true;
      }
    ),

  endTime: yup
    .mixed()
    .nullable()
    .test(
      "required-with-start",
      "Break end time is required",
      function (value) {
        const { startTime } = this.parent;
        if (startTime) {
          return !!value;
        }
        return true;
      }
    )
    .test("is-after", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      if (!value || !startTime) return true;
      return dayjs(value).isAfter(dayjs(startTime));
    })
    .test(
      "no-overlap-with-existing-breaks",
      "This time slot is already booked.",
      function (endTime) {
        const { startTime, breakSelectedDays } = this.parent;
        const { breaks, editIndex } = this.options.context || {};

        if (!startTime || !endTime || !breakSelectedDays?.length) return true;
        if (!breaks || breaks.length === 0) return true;

        const newStartTime = dayjs(startTime).format("HH:mm");
        const newEndTime = dayjs(endTime).format("HH:mm");

        const today = dayjs().format("YYYY-MM-DD");
        const breakStart = dayjs(
          `${today} ${newStartTime}`,
          "YYYY-MM-DD HH:mm"
        );
        const breakEnd = dayjs(`${today} ${newEndTime}`, "YYYY-MM-DD HH:mm");

        const hasOverlap = breakSelectedDays.some((day) => {
          return breaks.some((existingBreak, index) => {
            if (
              editIndex !== null &&
              editIndex !== undefined &&
              index === editIndex
            ) {
              return false;
            }

            if (!existingBreak.days.includes(day)) return false;
            if (!existingBreak.startTime || !existingBreak.endTime)
              return false;

            const existingStart = dayjs(
              `${today} ${existingBreak.startTime}`,
              "YYYY-MM-DD HH:mm"
            );
            const existingEnd = dayjs(
              `${today} ${existingBreak.endTime}`,
              "YYYY-MM-DD HH:mm"
            );

            return (
              breakStart.isBefore(existingEnd) &&
              breakEnd.isAfter(existingStart)
            );
          });
        });

        return !hasOverlap;
      }
    ),

  //  Holiday fields (auto-require times when date is selected)
  holidayDate: yup
    .mixed()
    .nullable()
    .test("is-valid-date", "Please select a valid date", function (value) {
      if (!value) return true; // allow empty
      return dayjs(value).isValid();
    }),

  holidayStartTime: yup
    .mixed()
    .nullable()
    .when("holidayDate", {
      is: (holidayDate) => holidayDate && dayjs(holidayDate).isValid(),
      then: (schema) =>
        schema
          .required("Start time is required")
          .test("valid-if-provided", "Invalid start time", (value) =>
            value ? dayjs(value).isValid() : true
          ),
      otherwise: (schema) => schema.nullable(),
    }),

  holidayEndTime: yup
    .mixed()
    .nullable()
    .when("holidayDate", {
      is: (holidayDate) => holidayDate && dayjs(holidayDate).isValid(),
      then: (schema) =>
        schema
          .required("End time is required ")
          .test(
            "is-after-start",
            "End time must be after start time",
            function (value) {
              const { holidayStartTime } = this.parent;
              if (!holidayStartTime || !value) return true;
              return dayjs(value).isAfter(dayjs(holidayStartTime));
            }
          ),
      otherwise: (schema) => schema.nullable(),
    })
    .test(
      "both-or-neither",
      "Both start and end time must be provided or left empty",
      function (value) {
        const { holidayStartTime, holidayDate } = this.parent;
        // When date selected but one time missing → invalid
        if (holidayDate && (!holidayStartTime || !value)) return false;
        return true;
      }
    )
    .test(
      "no-overlap-with-existing-holidays",
      "This time slot is already booked.",
      function (endTime) {
        const { holidayStartTime, holidayDate } = this.parent;
        const { existingHolidays, holidayEditIndex } =
          this.options.context || {};

        if (!holidayDate || !holidayStartTime || !endTime) return true;
        if (!existingHolidays || existingHolidays.length === 0) return true;

        const newDate = dayjs(holidayDate).format("YYYY-MM-DD");
        const newStartTime = dayjs(holidayStartTime).format("HH:mm");
        const newEndTime = dayjs(endTime).format("HH:mm");

        const newStart = dayjs(
          `${newDate} ${newStartTime}`,
          "YYYY-MM-DD HH:mm"
        );
        const newEnd = dayjs(`${newDate} ${newEndTime}`, "YYYY-MM-DD HH:mm");

        const hasOverlap = existingHolidays.some((holiday, index) => {
          if (
            holidayEditIndex !== null &&
            holidayEditIndex !== undefined &&
            index === holidayEditIndex
          )
            return false;

          if (!holiday.date || !holiday.startTime || !holiday.endTime)
            return false;

          const existingDate = dayjs(holiday.date).format("YYYY-MM-DD");
          if (existingDate !== newDate) return false;

          const existingStart = dayjs(
            `${existingDate} ${holiday.startTime}`,
            "YYYY-MM-DD HH:mm"
          );
          const existingEnd = dayjs(
            `${existingDate} ${holiday.endTime}`,
            "YYYY-MM-DD HH:mm"
          );

          return (
            newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)
          );
        });

        return !hasOverlap;
      }
    ),
});
