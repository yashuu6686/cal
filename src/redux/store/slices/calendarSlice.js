import {
  createAsyncThunk,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import dayjs from "dayjs";
import moment from "moment";

import api from "@/components/calendar/utils/axios";

export const createDoctorCalendar = createAsyncThunk(
  "calendar/createDoctorCalendar",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/createDoctorCalendar", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "API Error");
    }
  }
);

export const getSpecialtyMaster = createAsyncThunk(
  "specialtyMaster/getSpecialtyMaster",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/specialty-master");
      return res.data.data; // return only array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getServiceMaster = createAsyncThunk(
  "serviceMaster/getServiceMaster",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/service-master");
      return res.data.data; // just the array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getDoctorCalendar = createAsyncThunk(
  "doctorCalendar/getDoctorCalendar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/doctor-calendar");
      return response.data.data; // only data object return
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDoctorCalendar = createAsyncThunk(
  "doctorCalendar/updateDoctorCalendar",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.put("/api/update-doctor-calendar", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const selectTotalUsedMinutes = (state) => {
  return state.calendar.weekSchedule.reduce((sum, day) => {
    return (
      sum +
      day.slots.reduce((subSum, slot) => subSum + Number(slot.duration || 0), 0)
    );
  }, 0);
};

export const selectTotalSlots = (state) => {
  return state.calendar.weekSchedule.reduce(
    (count, day) => count + day.slots.length,
    0
  );
};

const dayToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const getNextDayOfWeek = (dayNum) => {
  const now = moment();
  const currentDay = now.day();
  let daysToAdd = dayNum - currentDay;
  if (daysToAdd < 0) daysToAdd += 7;
  return now.clone().add(daysToAdd, "days");
};

const initialState = {
  calendar: null,
  specialties: [],
  services: [],
  data: null,
  result: null,
  selectedServices: [],

  loading: false,
  error: null,

  events: [],
  weekSchedule: Object.keys(dayToNumber).map((day) => ({
    day,
    slots: [],
  })),

  // UI State
  openDialog: false,
  openHolidayDialog: false,
  isCalendarPublished: false,
  addServiceDialogOpen: false,
  isEditMode: false,

  isLoading: false,
};

// ===== SLICE =====
const calendarScheduleSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // // ===== UI STATE =====
    setOpenDialog: (state, action) => {
      state.openDialog = action.payload;
    },

    setOpenHolidayDialog: (state, action) => {
      state.openHolidayDialog = action.payload;
    },

    openAddServiceDialog: (state) => {
      state.addServiceDialogOpen = true;
    },
    closeAddServiceDialog: (state) => {
      state.addServiceDialogOpen = false;
    },

    setIsCalendarPublished: (state, action) => {
      state.isCalendarPublished = action.payload;
    },

    setIsEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setSelectedServices: (state, action) => {
      state.selectedServices = action.payload;
    },
    // Action to toggle a service
    toggleService: (state, action) => {
      const serviceId = action.payload;
      const index = state.selectedServices.indexOf(serviceId);

      if (index > -1) {
        state.selectedServices.splice(index, 1);
      } else {
        state.selectedServices.push(serviceId);
      }
    },

    clearSelectedServices: (state) => {
      state.selectedServices = [];
    },
    updateBreak: (state, action) => {
      const { breakIndex, dayIndex, startTime, endTime } = action.payload;

      // Check required structure
      if (!state.calendar?.availability?.[dayIndex]?.breaks?.[breakIndex])
        return;

      // Update real stored calendar data
      state.calendar.availability[dayIndex].breaks[breakIndex] = {
        ...state.calendar.availability[dayIndex].breaks[breakIndex],
        breakStartTime: startTime,
        breakEndTime: endTime,
      };

      // Sync helper flat breaks array
      state.breaks = state.calendar.availability.flatMap((dayItem, dIndex) =>
        dayItem.breaks.map((b, bIndex) => ({
          ...b,
          day: dayItem.day,
          dayIndex: dIndex,
          breakIndex: bIndex,
        }))
      );
    },

    deleteBreak: (state, action) => {
      const { dayIndex, breakIndex } = action.payload;

      if (!state.calendar?.availability?.[dayIndex]?.breaks?.[breakIndex])
        return;

      // Remove from actual stored calendar data
      state.calendar.availability[dayIndex].breaks.splice(breakIndex, 1);

      // Sync helper array
      state.breaks = state.calendar.availability.flatMap((dayItem, dIndex) =>
        dayItem.breaks.map((b, bIndex) => ({
          ...b,
          day: dayItem.day,
          dayIndex: dIndex,
          breakIndex: bIndex,
        }))
      );
    },
    updateHoliday: (state, action) => {
      const { index, date, startTime, endTime } = action.payload;

      if (!state.calendar?.holidays || !state.calendar.holidays[index]) return;

      state.calendar.holidays[index] = {
        ...state.calendar.holidays[index],
        date,
        startTime,
        endTime,
      };

      // Also update state.holidays if needed for consistency
      state.holidays = [...state.calendar.holidays];
    },
    deleteHoliday: (state, action) => {
      const index = action.payload;

      // Validate calendar exists and holiday index exists
      if (!state.calendar?.holidays || !state.calendar.holidays[index]) return;

      // Remove from calendar holidays (UI reads from here)
      state.calendar.holidays.splice(index, 1);

      // Sync helper state.holidays too (for consistency)
      state.holidays = [...state.calendar.holidays];
    },

    deleteSlot(state, action) {
      const { dayIndex, slotIndex, slotId } = action.payload;

     
      const slot = state.calendar?.availability?.[dayIndex]?.services?.[slotIndex];
      
   
      const idToDelete = slotId || slot?._id;
      
      if (!idToDelete) {
        console.warn('⚠️ deleteSlot: No slot ID found for deletion');
        return;
      }

  
      if (state.calendar?.availability?.[dayIndex]?.services) {
        state.calendar.availability[dayIndex].services.splice(slotIndex, 1);
      }

      
      state.events = state.events.filter((ev) => ev.serviceId !== idToDelete);
    },

    updateEvents: (state, action) => {
      state.events = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getServiceMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getServiceMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSpecialtyMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpecialtyMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.specialties = action.payload;
      })
      .addCase(getSpecialtyMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDoctorCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDoctorCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendar = action.payload;
        state.holidays = action.payload?.holidays || [];
        state.isCalendarPublished = !!action.payload?._id;

        state.breaks =
          action.payload?.availability?.flatMap((dayItem, dayIndex) =>
            dayItem.breaks.map((b, breakIndex) => ({
              ...b,
              day: dayItem.day,
              dayIndex,
              breakIndex,
            }))
          ) || [];

        if (action.payload?.availability) {
          state.weekSchedule = action.payload.availability.map((dayItem) => ({
            day: dayItem.day,
            slots: dayItem.services.map((service) => ({
              id: nanoid(),
              start: dayjs(`2000-01-01 ${service.startTime}`), 
              end: dayjs(`2000-01-01 ${service.endTime}`),
              serviceType: service.name,
              speciality: ["General"],
              isDummy: false,
              duration: service.duration || 15,
              keyIdentifier: service.keyIdentifier,
              _id: service._id,
            })),
          }));
        }

        // Selected services IDs collect karein
        const activeServiceIds = new Set();
        if (action.payload?.availability) {
          action.payload.availability.forEach((item) => {
            if (item.services && item.services.length > 0) {
              item.services.forEach((srv) => {
                if (srv._id) {
                  activeServiceIds.add(srv._id);
                }
              });
            }
          });
        }
        state.selectedServices = Array.from(activeServiceIds);

        const newEvents = [];
        state.weekSchedule.forEach((item) => {
          const dayNum = dayToNumber[item.day];
          const base = getNextDayOfWeek(dayNum);

          item.slots.forEach((slot) => {
            const specialitiesText = Array.isArray(slot.speciality)
              ? slot.speciality.join(", ")
              : slot.speciality || "";

            newEvents.push({
              // id: slot.id,

              serviceId: slot._id,
              title: `${slot.serviceType} ${specialitiesText}`,
              start: slot.start
                ? base
                    .clone()
                    .set({
                      hour: dayjs(slot.start).hour(),
                      minute: dayjs(slot.start).minute(),
                    })
                    .toDate()
                : null,
              end: slot.end
                ? base
                    .clone()
                    .set({
                      hour: dayjs(slot.end).hour(),
                      minute: dayjs(slot.end).minute(),
                    })
                    .toDate()
                : null,
              serviceType: slot.serviceType,
              duration: slot.duration,
              keyIdentifier: slot.keyIdentifier,
              specialities: Array.isArray(slot.speciality)
                ? slot.speciality
                : typeof slot.speciality === "string"
                ? slot.speciality.split(",").map((s) => s.trim())
                : [],
            });
          });
        });
        state.events = newEvents;
      })
      .addCase(getDoctorCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createDoctorCalendar.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDoctorCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isCalendarPublished = true;
      })
      .addCase(createDoctorCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateDoctorCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDoctorCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        state.success = true;
        state.isCalendarPublished = true;
        state.isEditMode = false;

        if (action.payload?.data) {
          state.calendar = {
            ...state.calendar,
            ...action.payload.data,
          };
        }
      })
      .addCase(updateDoctorCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

// Export Actions
export const {
  setOpenDialog,
  setOpenHolidayDialog,
  openAddSlotDialog,
  setIsCalendarPublished,
  setIsEditMode,
  // setCalendarId,
  setLoading,

  updateEvents,
  // resetSchedule,
  setSelectedServices,
  toggleService,
  clearSelectedServices,
  updateBreak,
  deleteBreak,
  updateHoliday,
  deleteHoliday,
  deleteSlot,
  openAddServiceDialog,
  closeAddServiceDialog,
} = calendarScheduleSlice.actions;

export const selectIsLoading = (state) => state.calendar.isLoading;

export const selectCalendar = (state) => state.calendar.calendar;
export const selectServices = (state) => state.calendar.services;
export const selectSelectedServices = (state) =>
  state.calendar.selectedServices;
export const selectLoading = (state) => state.calendar.loading;
export const selectError = (state) => state.calendar.error;

export const selectIsFieldsDisabled = (state) =>
  state.calendar.isCalendarPublished && !state.calendar.isEditMode;

export const selectServiceTypesForDropdown = createSelector(
  [
    (state) => state.calendar.services,
    (state) => state.calendar.selectedServices,
  ],
  (services, selectedIds) => {
    return services
      .filter((service) => selectedIds.includes(service._id))
      .map((service) => ({
        label: service.name,
        value: service.name,
        duration: service.duration,
        id: service._id,
        keyIdentifier: service.keyIdentifier,
      }));
  }
);

export default calendarScheduleSlice.reducer;

{
  /*

  import {
  createAsyncThunk,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import dayjs from "dayjs";
import moment from "moment";
import axios from "axios";
import api from "@/components/calendar/utils/axios";

export const createDoctorCalendar = createAsyncThunk(
  "calendar/createDoctorCalendar",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post("/createDoctorCalendar", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "API Error");
    }
  }
);

export const getSpecialtyMaster = createAsyncThunk(
  "specialtyMaster/getSpecialtyMaster",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/specialty-master");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getServiceMaster = createAsyncThunk(
  "serviceMaster/getServiceMaster",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/service-master");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getDoctorCalendar = createAsyncThunk(
  "doctorCalendar/getDoctorCalendar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/doctor-calendar");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const selectTotalUsedMinutes = (state) => {
  return state.calendar.weekSchedule.reduce((sum, day) => {
    return (
      sum +
      day.slots.reduce((subSum, slot) => subSum + Number(slot.duration || 0), 0)
    );
  }, 0);
};

export const selectTotalSlots = (state) => {
  return state.calendar.weekSchedule.reduce(
    (count, day) => count + day.slots.length,
    0
  );
};

const dayToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const getNextDayOfWeek = (dayNum) => {
  const now = moment();
  const currentDay = now.day();
  let daysToAdd = dayNum - currentDay;
  if (daysToAdd < 0) daysToAdd += 7;
  return now.clone().add(daysToAdd, "days");
};

const initialState = {
  calendar: null,
  specialties: [],
  services: [],
  data: null,
  selectedServices: [],
  loading: false,
  error: null,

  events: [],
  weekSchedule: Object.keys(dayToNumber).map((day) => ({
    day,
    slots: [],
  })),

  // 🔥 Initialize breaks and holidays as empty arrays
  breaks: [],
  holidays: [],

  // UI State
  openDialog: false,
  openHolidayDialog: false,
  isCalendarPublished: false,
  isEditMode: false,

  isLoading: false,
};

// ===== SLICE =====
const calendarScheduleSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setOpenDialog: (state, action) => {
      state.openDialog = action.payload;
    },

    setOpenHolidayDialog: (state, action) => {
      state.openHolidayDialog = action.payload;
    },

    setIsCalendarPublished: (state, action) => {
      state.isCalendarPublished = action.payload;
    },

    setIsEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setSelectedServices: (state, action) => {
      state.selectedServices = action.payload;
    },

    toggleService: (state, action) => {
      const serviceId = action.payload;
      const index = state.selectedServices.indexOf(serviceId);

      if (index > -1) {
        state.selectedServices.splice(index, 1);
      } else {
        state.selectedServices.push(serviceId);
      }
    },

    clearSelectedServices: (state) => {
      state.selectedServices = [];
    },

    // 🔥 FIXED: updateBreak with proper logging
    updateBreak: (state, action) => {
      console.log("🔄 Redux updateBreak called with:", action.payload);
      
      const { breakIndex, dayIndex, startTime, endTime } = action.payload;

      if (!state.breaks || state.breaks.length === 0) {
        console.error("❌ state.breaks is empty or undefined");
        return;
      }

      const targetIndex = state.breaks.findIndex(
        (x) => x.breakIndex === breakIndex && x.dayIndex === dayIndex
      );

      console.log("🔍 Found break at index:", targetIndex);

      if (targetIndex !== -1) {
        // Create new object to ensure immutability
        state.breaks[targetIndex] = {
          ...state.breaks[targetIndex],
          breakStartTime: startTime,
          breakEndTime: endTime,
        };
        
        console.log("✅ Break updated successfully:", state.breaks[targetIndex]);
      } else {
        console.error("❌ Break not found with breakIndex:", breakIndex, "dayIndex:", dayIndex);
      }
    },

    // 🔥 FIXED: updateHoliday with proper logging and immutability
    updateHoliday: (state, action) => {
      console.log("🔄 Redux updateHoliday called with:", action.payload);
      
      const { index, date, startTime, endTime } = action.payload;

      if (!state.holidays || state.holidays.length === 0) {
        console.error("❌ state.holidays is empty or undefined");
        return;
      }

      if (index < 0 || index >= state.holidays.length) {
        console.error("❌ Invalid holiday index:", index);
        return;
      }

      // Create new object to ensure immutability and trigger re-render
      state.holidays[index] = {
        ...state.holidays[index],
        date,
        startTime,
        endTime,
      };

      console.log("✅ Holiday updated successfully:", state.holidays[index]);
      
      // 🔥 Also update calendar.holidays if it exists
      if (state.calendar && state.calendar.holidays) {
        state.calendar.holidays[index] = {
          ...state.calendar.holidays[index],
          date,
          startTime,
          endTime,
        };
        console.log("✅ Calendar.holidays also updated");
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getServiceMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getServiceMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSpecialtyMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpecialtyMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.specialties = action.payload;
      })
      .addCase(getSpecialtyMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDoctorCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDoctorCalendar.fulfilled, (state, action) => {
        console.log("📥 getDoctorCalendar fulfilled with:", action.payload);
        
        state.loading = false;
        state.calendar = action.payload;
        
        // 🔥 Initialize holidays properly
        state.holidays = action.payload?.holidays || [];
        console.log("📅 Holidays initialized:", state.holidays);

        // 🔥 Breaks mapping with proper structure
        state.breaks =
          action.payload?.availability?.flatMap((dayItem, dayIndex) =>
            dayItem.breaks.map((b, breakIndex) => ({
              ...b,
              day: dayItem.day,
              dayIndex,
              breakIndex,
            }))
          ) || [];
        console.log("☕ Breaks initialized:", state.breaks);

        // weekSchedule ko API data se populate karein
        if (action.payload?.availability) {
          state.weekSchedule = action.payload.availability.map((dayItem) => ({
            day: dayItem.day,
            slots: dayItem.services.map((service) => ({
              id: nanoid(),
              start: dayjs(`2000-01-01 ${service.startTime}`),
              end: dayjs(`2000-01-01 ${service.endTime}`),
              serviceType: service.name,
              speciality: ["General"],
              isDummy: false,
              duration: service.duration || 15,
              keyIdentifier: service.keyIdentifier,
              _id: service._id,
            })),
          }));
        }

        // Selected services IDs collect karein
        const activeServiceIds = new Set();
        if (action.payload?.availability) {
          action.payload.availability.forEach((item) => {
            if (item.services && item.services.length > 0) {
              item.services.forEach((srv) => {
                if (srv._id) {
                  activeServiceIds.add(srv._id);
                }
              });
            }
          });
        }
        state.selectedServices = Array.from(activeServiceIds);

        // Events bhi update karein
        const newEvents = [];
        state.weekSchedule.forEach((item) => {
          const dayNum = dayToNumber[item.day];
          const base = getNextDayOfWeek(dayNum);

          item.slots.forEach((slot) => {
            const specialitiesText = Array.isArray(slot.speciality)
              ? slot.speciality.join(", ")
              : slot.speciality || "";

            newEvents.push({
              id: slot.id,
              title: `${slot.serviceType} ${specialitiesText}`,
              start: slot.start
                ? base
                    .clone()
                    .set({
                      hour: dayjs(slot.start).hour(),
                      minute: dayjs(slot.start).minute(),
                    })
                    .toDate()
                : null,
              end: slot.end
                ? base
                    .clone()
                    .set({
                      hour: dayjs(slot.end).hour(),
                      minute: dayjs(slot.end).minute(),
                    })
                    .toDate()
                : null,
              serviceType: slot.serviceType,
              duration: slot.duration,
              keyIdentifier: slot.keyIdentifier,
              specialities: Array.isArray(slot.speciality)
                ? slot.speciality
                : typeof slot.speciality === "string"
                ? slot.speciality.split(",").map((s) => s.trim())
                : [],
            });
          });
        });
        state.events = newEvents;
      })
      .addCase(getDoctorCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createDoctorCalendar.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDoctorCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log("✅ Calendar created/updated:", action.payload);
      })
      .addCase(createDoctorCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Actions
export const {
  setOpenDialog,
  setOpenHolidayDialog,
  openAddSlotDialog,
  setIsCalendarPublished,
  setIsEditMode,
  setLoading,
  updateEvents,
  setSelectedServices,
  toggleService,
  clearSelectedServices,
  updateBreak,
  updateHoliday,
} = calendarScheduleSlice.actions;

export const selectIsLoading = (state) => state.calendar.isLoading;
export const selectCalendar = (state) => state.calendar.calendar;
export const selectServices = (state) => state.calendar.services;
export const selectSelectedServices = (state) =>
  state.calendar.selectedServices;
export const selectLoading = (state) => state.calendar.loading;
export const selectError = (state) => state.calendar.error;

export const selectServiceTypesForDropdown = createSelector(
  [
    (state) => state.calendar.services,
    (state) => state.calendar.selectedServices,
  ],
  (services, selectedIds) => {
    return services
      .filter((service) => selectedIds.includes(service._id))
      .map((service) => ({
        label: service.name,
        value: service.name,
        duration: service.duration,
        id: service._id,
        keyIdentifier: service.keyIdentifier,
      }));
  }
);

export default calendarScheduleSlice.reducer;
  
  */
}
