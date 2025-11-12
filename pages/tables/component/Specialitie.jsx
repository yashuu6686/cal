// import React, { useState } from "react";
// import CommonButton from "@/components/CommonButton";
// import CommonCard from "@/components/CommonCard";
// import CommonDialog from "@/components/CommonDialog";
// import { Autocomplete, Box, Divider, TextField, Typography } from "@mui/material";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
// import Video_Call_Service from "../../../public/Video_Call_Service.png";
// import * as Yup from "yup";

// // Yup schema
// const serviceSchema = Yup.object().shape({
//   name: Yup.string().required("Service Name is required"),
//   duration: Yup.string().required("Duration is required"),
//   service: Yup.string().required("Service Type is required"),
// });

// function Specialitie({
//   dataOfService,
//   setDataOfService,
//   Specialities,
//   editMode,
//   openAddService,
//   setOpenAddService,
//   setSelectedSpecialities,
//   selectedSpecialities,
//   setSelectedServices,
//   selectedServices,
//   item,
//   setItem,
// }) {
//   const [errors, setErrors] = useState({});

//   const handleOnSave = async () => {
//     try {
//       await serviceSchema.validate(item, { abortEarly: false });
//       setErrors({});

//       const newService = {
//         type: item.name,
//         time: item.duration,
//         img: Video_Call_Service,
//       };

//       setDataOfService((prev) => [...prev, newService]);
//       setOpenAddService(false);
//       setItem({ name: "", duration: null, service: null });
//     } catch (err) {
//       if (err.inner) {
//         const formErrors = {};
//         err.inner.forEach((e) => {
//           formErrors[e.path] = e.message;
//         });
//         setErrors(formErrors);
//       }
//     }
//   };

//   const handleServiceSelect = (item) => {
//     if (!editMode) return;
//     if (selectedServices.some((s) => s.type === item.type)) {
//       setSelectedServices((prev) => prev.filter((s) => s.type !== item.type));
//     } else {
//       setSelectedServices((prev) => [...prev, item]);
//     }
//   };

//   const handleSpecialitySelect = (item) => {
//     if (!editMode) return;
//     if (selectedSpecialities.some((sp) => sp.type === item.type)) {
//       setSelectedSpecialities((prev) =>
//         prev.filter((sp) => sp.type !== item.type)
//       );
//     } else {
//       setSelectedSpecialities((prev) => [...prev, item]);
//     }
//   };

//   return (
//     <CommonCard
//       title={
//         <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <AccessTimeIcon sx={{ color: "#1976d2",width:23,height:23 }} fontSize="small" /> Service Type
//         </span>
//       }
//       actions={[
//         {
//           label: "Add Service",
//           onClick: () => setOpenAddService(true),
//           variant: "contained",
//           disabled: !editMode,
//         },
//       ]}
//     >
//       {/* Services Buttons */}
//       <Box sx={{ display: "flex", flexWrap: "wrap", m: "3px", mt: 2 }}>
//         {dataOfService?.map((item, index) => {
//           const isSelected = selectedServices.some((s) => s.type === item.type);
//           return (
//             <CommonButton
//               disabled={!editMode}
//               key={index}
//               src={item.img}
//               isSelected={isSelected}
//               onClick={() => handleServiceSelect(item)}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   flexDirection: "column",
//                 }}
//               >
//                 <Typography sx={{ fontWeight: 600, fontSize: "0.7rem", ml: "3px", textTransform: "none" }} variant="body2">
//                   {item.type}
//                 </Typography>
//                 <Typography sx={{ fontSize: "0.6rem", textTransform: "none" }}>
//                   {item.time}
//                 </Typography>
//               </Box>
//             </CommonButton>
//           );
//         })}
//       </Box>

//       <Box mt={2} mb={2}>
//         <Divider />
//       </Box>

//       {/* Specialities */}
//       <Typography sx={{ backgroundColor: "rgb(241, 241, 241)", p: "12px", mt: 2, borderRadius: 2 }}>
//         <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <MedicalServicesIcon sx={{ color: "#1976d2",width:23,height:23 }} fontSize="small" /> Specialities
//         </span>
//       </Typography>

//       <Box sx={{ display: "flex", flexWrap: "wrap", m: "3px", mt: 2, mb: 1 }}>
//         {Specialities.map((item) => {
//           const isSelected = selectedSpecialities.some((sp) => sp.type === item.type);
//           return (
//             <CommonButton
//               disabled={!editMode}
//               key={item.type}
//               src={item.img}
//               isSelected={isSelected}
//               onClick={() => handleSpecialitySelect(item)}
//             >
//               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
//                 <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", ml: "3px", textTransform: "none" }}>
//                   {item.type}
//                 </Typography>
//               </Box>
//             </CommonButton>
//           );
//         })}
//       </Box>

//       {/* Add Service Dialog */}
//       <CommonDialog
//         open={openAddService}
//         onClose={() => setOpenAddService(false)}
//         title="Add New Service"
//         onSave={handleOnSave}
//         saveLabel="Save"
//         cancelLabel="Cancel"
//       >
//         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", m: 1 }}>
//           {/* Service Name */}
//           <TextField
//             fullWidth
//             value={item.name}
//             onChange={(e) => setItem((prev) => ({ ...prev, name: e.target.value }))}
//             placeholder="Service Name"
//             error={!!errors.name}
//             helperText={errors.name}
//             sx={{ mt: 1 }}
//           />

//           {/* Duration */}
//           <Autocomplete
//             fullWidth
//             options={["15 Minutes", "30 Minutes", "40 Minutes", "60 Minutes"]}
//             value={item.duration}
//             onChange={(e, newValue) => setItem((prev) => ({ ...prev, duration: newValue }))}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 placeholder="Duration"
//                 fullWidth
//                 error={!!errors.duration}
//                 helperText={errors.duration}
//                 sx={{ mt: 1 }}
//               />
//             )}
//           />

//           {/* Service Type */}
//           <Autocomplete
//             fullWidth
//             options={["Clinic Consultation", "Home Consultation", "Video Consultation"]}
//             value={item.service}
//             onChange={(e, newValue) => setItem((prev) => ({ ...prev, service: newValue }))}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 placeholder="Service Type"
//                 fullWidth
//                 error={!!errors.service}
//                 helperText={errors.service}
//                 sx={{ mt: 1 }}
//               />
//             )}
//           />
//         </Box>
//       </CommonDialog>
//     </CommonCard>
//   );
// }

// export default Specialitie;
