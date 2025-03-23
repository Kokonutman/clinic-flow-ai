// List of doctors with their schedules
export const doctors = [
  { 
    name: 'Dr. Sarah Johnson',
    specialty: 'General Medicine',
    schedule: {
      day1: { date: '2025-03-23', slots: [true, false, true, false, true] },
      day2: { date: '2025-03-24', slots: [false, false, true, true, false] },
      day3: { date: '2025-03-25', slots: [true, true, false, false, true] },
      day4: { date: '2025-03-26', slots: [false, true, true, false, true] },
      day5: { date: '2025-03-27', slots: [true, false, false, true, false] },
      day6: { date: '2025-03-28', slots: [false, true, true, false, true] }
    }
  },
  { 
    name: 'Dr. Michael Chen',
    specialty: 'Pediatrics',
    schedule: {
      day1: { date: '2025-03-23', slots: [false, true, false, true, false] },
      day2: { date: '2025-03-24', slots: [true, false, true, false, true] },
      day3: { date: '2025-03-25', slots: [false, true, true, false, false] },
      day4: { date: '2025-03-26', slots: [true, false, false, true, true] },
      day5: { date: '2025-03-27', slots: [false, true, true, false, true] },
      day6: { date: '2025-03-28', slots: [true, false, true, true, false] }
    }
  },
  { 
    name: 'Dr. Emily Rodriguez',
    specialty: 'Internal Medicine',
    schedule: {
      day1: { date: '2025-03-23', slots: [true, true, false, false, true] },
      day2: { date: '2025-03-24', slots: [false, true, false, true, false] },
      day3: { date: '2025-03-25', slots: [true, false, true, false, true] },
      day4: { date: '2025-03-26', slots: [false, true, false, true, false] },
      day5: { date: '2025-03-27', slots: [true, true, false, false, true] },
      day6: { date: '2025-03-28', slots: [false, true, true, true, false] }
    }
  }
];