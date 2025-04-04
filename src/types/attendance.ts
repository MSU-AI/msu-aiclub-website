// Type definitions for the attendance tracking system

export interface Member {
  id: string;
  name: string;
  email: string;
  raw_user_meta_data?: Record<string, string>;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  time: Date;
  place: string;
  points: number;
  code: string;
  photo?: string | null;
  hidden: boolean | null;
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  eventId: string;
  createdAt: Date;
}

export interface MemberAttendanceStats {
  member: Member;
  attendanceRate: number;
  attendedEvents: Event[];
  missedEvents: Event[];
  totalEvents: number;
  eventsAttended: number;
}

export interface AttendanceOverviewStats {
  averageAttendanceRate: number;
  membersBelowThreshold: number;
  percentBelowThreshold: number;
  totalMembers: number;
  totalEvents: number;
  selectedEvents: number;
}
