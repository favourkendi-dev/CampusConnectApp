export const parseTimeSlot = (slot) => {
  const [start, end] = slot.split('-');
  return { start, end };
};

export const isTimeSlotAvailable = (slot, busySlots) => {
  const { start, end } = parseTimeSlot(slot);
  return !busySlots.some((busy) => {
    const { start: bStart, end: bEnd } = parseTimeSlot(busy);
    return (start >= bStart && start < bEnd) || (end > bStart && end <= bEnd);
  });
};

export const findCommonFreeTimes = (schedules) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const allSlots = [
    '08:00-10:00', '10:00-12:00', '12:00-14:00',
    '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00',
  ];

  return days.flatMap((day) => {
    const daySchedules = schedules.map((s) => s[day] || []);
    return allSlots
      .filter((slot) => daySchedules.every((busy) => isTimeSlotAvailable(slot, busy)))
      .map((slot) => ({ day, time: slot }));
  });
};

export const formatScheduleForDisplay = (schedule) => {
  return Object.entries(schedule).map(([day, slots]) => ({
    day,
    slots: slots.map(parseTimeSlot),
  }));
};