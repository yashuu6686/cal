// import { createSlice } from "@reduxjs/toolkit";
// import video from "../../../../public/Video_Call_Service.png";
// import clinic from "../../../../public/Clinic_Visit_Service.png";
// import home from "../../../../public/Home_Visit_Service.webp";
// import tooth from "../../../../public/tooth 1.png";
// import gen from "../../../../public/General.png";
// import nuro from "../../../../public/Neurologist.png";
// import ortho from "../../../../public/Orthopaedic.png";
// import cardio from "../../../../public/cardiology.png";

// const initialState = {
//   dataOfService: [
//     { img: video, type: "Video Call", time: "15" },
//     { img: home, type: "Home Visit", time: "90" },
//     { img: clinic, type: "Clinic Visit", time: "15" },
//   ],
//   specialities: [
//     { img: nuro, type: "Neurologist" },
//     { img: gen, type: "General" },
//     { img: ortho, type: "Orthopaedic" },
//     { img: tooth, type: "Dental" },
//     { img: cardio, type: "Cardiology" },
//   ],
//   selectedServices: [],
//   selectedSpecialities: [],
// };

// const uiSlice = createSlice({
//   name: "ui",
//   initialState,
//   reducers: {
//     // ===== SERVICE ACTIONS =====
//    toggleService: (state, action) => {
//   const id = action.payload;
//   if (state.selectedServices.includes(id)) {
//     state.selectedServices = state.selectedServices.filter(s => s !== id);
//   } else {
//     state.selectedServices.push(id);
//   }
// },

//     addNewService: (state, action) => {
//       const { serviceName, duration, serviceType } = action.payload;
//       const newService = {
//         img:
//           serviceType === "Video Call"
//             ? video
//             : serviceType === "Home Visit"
//             ? home
//             : clinic,
//         type: serviceName,
//         time: duration.toString(),
//       };
//       state.dataOfService.push(newService);
//     },

//     removeService: (state, action) => {
//       const serviceType = action.payload;
//       state.dataOfService = state.dataOfService.filter(
//         (s) => s.type !== serviceType
//       );
//       state.selectedServices = state.selectedServices.filter(
//         (s) => s.type !== serviceType
//       );
//     },

//     // ===== SPECIALITY ACTIONS =====
//     toggleSpeciality: (state, action) => {
//       const speciality = action.payload;
//       const exists = state.selectedSpecialities.some(
//         (s) => s.type === speciality.type
//       );
//       if (exists) {
//         state.selectedSpecialities = state.selectedSpecialities.filter(
//           (s) => s.type !== speciality.type
//         );
//       } else {
//         state.selectedSpecialities.push(speciality);
//       }
//     },

//     addNewSpeciality: (state, action) => {
//       const { name, imageUrl } = action.payload;
//       const newSpeciality = {
//         img: imageUrl || gen,
//         type: name,
//       };
//       state.specialities.push(newSpeciality);
//     },

//     removeSpeciality: (state, action) => {
//       const specialityType = action.payload;
//       state.specialities = state.specialities.filter(
//         (s) => s.type !== specialityType
//       );
//       state.selectedSpecialities = state.selectedSpecialities.filter(
//         (s) => s.type !== specialityType
//       );
//     },

//     // ===== RESET ACTIONS =====
//     resetSelectedServices: (state) => {
//       state.selectedServices = [];
//     },

//     resetSelectedSpecialities: (state) => {
//       state.selectedSpecialities = [];
//     },

//     resetAll: (state) => {
//       state.selectedServices = [];
//       state.selectedSpecialities = [];
//     },
//   },
// });

// // Export Actions
// export const {
//   toggleService,
//   addNewService,
//   removeService,
//   toggleSpeciality,
//   addNewSpeciality,
//   removeSpeciality,
//   resetSelectedServices,
//   resetSelectedSpecialities,
//   resetAll,
// } = uiSlice.actions;

// // Selectors
// export const selectAllServices = (state) => state.ui.dataOfService;
// export const selectSelectedServices = (state) => state.ui.selectedServices;
// export const selectSpecialities = (state) => state.ui.specialities;
// export const selectSelectedSpecialities = (state) => state.ui.selectedSpecialities;

// export default uiSlice.reducer;
