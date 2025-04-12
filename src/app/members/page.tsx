import { getUsers } from "~/server/db/queries/user";
import MembersPageClient from "./clientPage";
import { isAdmin } from "~/server/actions/auth";
import { getEvents, getUserEventsAttendance, getEventAttendanceCounts } from "~/server/db/queries/events";
import { getAllMembers } from "~/server/db/queries/users";
import type { Event, Member, AttendanceRecord } from "~/types/attendance";

export default async function MembersPage() {
    const members = await getUsers();
    const isUserAdmin = await isAdmin();
    
    console.log('Is user admin?', isUserAdmin); // Debug log
    
    // Fetch attendance data only if user is admin
    let attendanceData: AttendanceRecord[] = [];
    let events: Event[] = [];
    let allMembers: Member[] = [];
    let attendanceCounts: Map<string, number> = new Map<string, number>();
    
    if (isUserAdmin) {
        events = await getEvents(true);
        allMembers = await getAllMembers();
        attendanceData = await getUserEventsAttendance();
        attendanceCounts = await getEventAttendanceCounts();
    }

    return (
    <>
    <h1 className="text-3xl font-bold">Posts</h1>
    <MembersPageClient 
        members={members}
        isAdmin={isUserAdmin}
        events={events}
        allMembers={allMembers}
        attendanceData={attendanceData}
        attendanceCounts={attendanceCounts}
    />
    </>
    );
}