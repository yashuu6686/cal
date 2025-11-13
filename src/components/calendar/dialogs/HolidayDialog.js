
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenHolidayDialog } from "@/redux/store/slices/calendarSlice";
import HolidayTable from "@/components/calendar/right-side/TableHoliday";
import CommonDataDialog from "@/components/CommonDataDialog";

export default function HolidayDialog() {
  const dispatch = useDispatch();
  const openHolidayDialog = useSelector((state) => state.calendar.openHolidayDialog);
  const holidays = useSelector((state) => state.calendar.holidays);

  return (
    <CommonDataDialog
      open={openHolidayDialog}
      onClose={() => dispatch(setOpenHolidayDialog(false))}
      title="Holiday Details"
      data={holidays}
      TableComponent={HolidayTable}
      emptyIcon="🏖️"
      emptyMessage="No holidays scheduled"
      emptySubtext="Select date and times to add holiday schedules"
    />
  );
}