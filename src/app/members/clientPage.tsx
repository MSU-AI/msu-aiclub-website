"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { UserMetadata } from './data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { X, ExternalLink, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { addRole, removeRole } from '~/server/actions/role';
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import type { Event, Member, AttendanceRecord } from "~/types/attendance";

const TAG_COLORS = [
  'bg-blue-200 text-blue-800',
  'bg-green-200 text-green-800',
  'bg-yellow-200 text-yellow-800',
  'bg-red-200 text-red-800',
  'bg-purple-200 text-purple-800',
];

export default function MembersPageClient({
  members,
  isAdmin,
  events = [],
  allMembers = [],
  attendanceData = [],
  attendanceCounts = new Map(),
} : {
  members: any,
  isAdmin: boolean,
  events?: Event[],
  allMembers?: Member[],
  attendanceData?: AttendanceRecord[],
  attendanceCounts?: Map<string, number>,
}) {
  const [curMembers, setCurMembers] = useState(members);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Attendance related state
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [attendanceThreshold, setAttendanceThreshold] = useState(50); // Default 50%
  const [currentTab, setCurrentTab] = useState("members");
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState("");
  const [attendanceSortOrder, setAttendanceSortOrder] = useState("desc"); // Default sort order
  const [includeZeroAttendance, setIncludeZeroAttendance] = useState(false); // Default: exclude 0% attendance
  
  // Advanced filtering options for members table
  const [sortField, setSortField] = useState<string>("points"); // Default sort by points
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc"); // Default descending
  
  // Calculate attendance stats
  const attendanceStats = useMemo(() => {
    // Filter events if any are selected
    const filteredEvents = selectedEvents.length > 0 
      ? events.filter(event => selectedEvents.includes(event.id))
      : events;
    
    // Map of eventIds that are selected (or all if none selected)
    const eventIdMap = new Map(filteredEvents.map(event => [event.id, true]));
    
    // Calculate attendance rate for each member
    return allMembers.map(member => {
      // Get all attendance records for this member
      const memberAttendance = attendanceData.filter(record => 
        record.userId === member.id && eventIdMap.has(record.eventId)
      );
      
      // Calculate attendance rate
      const attendanceRate = filteredEvents.length > 0
        ? (memberAttendance.length / filteredEvents.length) * 100
        : 0;
      
      // List of events this member attended
      const attendedEvents = memberAttendance.map(record => 
        events.find(event => event.id === record.eventId)
      ).filter(Boolean) as Event[];
      
      // List of events this member missed
      const missedEvents = filteredEvents.filter(event => 
        !memberAttendance.some(record => record.eventId === event.id)
      );
      
      return {
        member,
        attendanceRate,
        attendedEvents,
        missedEvents,
        totalEvents: filteredEvents.length,
        eventsAttended: memberAttendance.length,
        hasAttendedAnyEvent: memberAttendance.length > 0
      };
    });
  }, [allMembers, events, attendanceData, selectedEvents]);

  const sortedAndFilteredMembers = useMemo(() => {
    // First filter the members based on search term
    const filteredMembers = [...curMembers].filter(member => 
      Object.values(member).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      Object.values(member.metadata || {}).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    // Then sort based on the selected sort field and direction
    return filteredMembers.sort((a, b) => {
      let aValue: any, bValue: any;
      
      // Determine values to compare based on sort field
      switch (sortField) {
        case 'points':
          aValue = a.points ?? 0;
          bValue = b.points ?? 0;
          break;
        case 'name':
          aValue = a.metadata?.name?.toLowerCase() ?? '';
          bValue = b.metadata?.name?.toLowerCase() ?? '';
          // String comparison
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        case 'email':
          aValue = a.email?.toLowerCase() ?? '';
          bValue = b.email?.toLowerCase() ?? '';
          // String comparison
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        case 'attendance':
          // Find attendance stats for these members
          const aStats = attendanceStats.find(stat => stat.member.id === a.id);
          const bStats = attendanceStats.find(stat => stat.member.id === b.id);
          aValue = aStats?.attendanceRate ?? 0;
          bValue = bStats?.attendanceRate ?? 0;
          break;
        case 'eventsAttended':
          // Find attendance stats for these members
          const aAttendance = attendanceStats.find(stat => stat.member.id === a.id);
          const bAttendance = attendanceStats.find(stat => stat.member.id === b.id);
          aValue = aAttendance?.eventsAttended ?? 0;
          bValue = bAttendance?.eventsAttended ?? 0;
          break;
        default:
          aValue = a.points ?? 0;
          bValue = b.points ?? 0;
      }
      
      // Numeric comparison
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [curMembers, searchTerm, sortField, sortDirection, attendanceStats]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredMembers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAndFilteredMembers.length / itemsPerPage);

  const handleFieldChange = (memberId: string, field: keyof UserMetadata, value: any) => {
    setCurMembers(curMembers.map(member => 
      member.id === memberId ? { ...member, [field]: value } : member
    ));
  };

  const EditableCell = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    if (isEditing) {
      return (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => {
            onChange(editValue);
            setIsEditing(false);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onChange(editValue);
              setIsEditing(false);
            }
          }}
          autoFocus
        />
      );
    }

    return (
      <div onClick={() => isAdmin && setIsEditing(true)} className={isAdmin ? "cursor-pointer" : ""}>
        {value}
      </div>
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const exportToCSV = () => {
    const headers = [
      'Name', 'Email', 'Member Type', 'University', 'Major', 'School Year',
      'Level', 'Points', 'Discord Username', 'Roles'
    ];

    const csvContent = [
      headers.join(','),
      ...curMembers.map(member => [
        member.metadata.fullName,
        member.email,
        member.metadata.memberType,
        member.metadata.university,
        member.metadata.major,
        member.metadata.schoolYear,
        member.level,
        member.points,
        member.metadata.discordUsername,
        member.roles.map(role => role.name).join(';')
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'members_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };



  // Filter and sort the attendance stats
  const filteredAttendanceStats = useMemo(() => {
    return attendanceStats
      .filter(stat => {
        // Filter by search term if provided
        if (attendanceSearchQuery) {
          const member = stat.member;
          const searchLower = attendanceSearchQuery.toLowerCase();
          return (
            member.name?.toLowerCase().includes(searchLower) ||
            member.email?.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      // Filter out members with 0% attendance if includeZeroAttendance is false
      .filter(stat => includeZeroAttendance || stat.hasAttendedAnyEvent);
  }, [attendanceStats, attendanceSearchQuery, includeZeroAttendance]);

  // Stats for the overview section
  const overviewStats = useMemo(() => {
    // Default values in case of no data
    if (!attendanceStats || attendanceStats.length === 0) {
      return {
        averageAttendanceRate: 0,
        membersBelowThreshold: 0,
        percentBelowThreshold: 0,
        totalMembers: allMembers?.length || 0,
        totalEvents: events?.length || 0,
        selectedEvents: selectedEvents?.length || 0,
        membersWithZeroAttendance: 0,
      };
    }
    
    // Filter out members with 0% attendance if includeZeroAttendance is false
    const filteredStats = includeZeroAttendance 
      ? attendanceStats 
      : attendanceStats.filter(stat => stat.attendanceRate > 0 || stat.eventsAttended > 0);
    
    const membersWithZeroAttendance = attendanceStats.length - filteredStats.length;
    
    // Calculate average attendance based on filtered stats
    const totalAttendance = filteredStats.reduce((sum, stat) => sum + stat.attendanceRate, 0);
    const avgAttendance = filteredStats.length > 0 ? totalAttendance / filteredStats.length : 0;
    
    // Calculate members below threshold
    const belowThreshold = attendanceStats.filter(stat => stat.attendanceRate < attendanceThreshold && (includeZeroAttendance || stat.attendanceRate > 0)).length;
    const percentBelowThreshold = filteredStats.length > 0 
      ? (belowThreshold / filteredStats.length) * 100 
      : 0;
    
    return {
      averageAttendanceRate: avgAttendance,
      membersBelowThreshold: belowThreshold,
      percentBelowThreshold,
      totalMembers: allMembers?.length || 0,
      totalEvents: events?.length || 0,
      selectedEvents: selectedEvents?.length > 0 ? selectedEvents.length : (events?.length || 0),
      membersWithZeroAttendance,
    };
  }, [attendanceStats, attendanceThreshold, allMembers, events, selectedEvents, includeZeroAttendance]);

  // Toggle event selection
  const handleEventSelectionChange = (eventId: string) => {
    setSelectedEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  // Select all events
  const selectAllEvents = () => {
    setSelectedEvents(events.map(event => event.id));
  };

  // Clear all selected events
  const clearEventSelection = () => {
    setSelectedEvents([]);
  };

  // Helper function to format date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Export attendance data as CSV
  const exportAttendanceCSV = () => {
    const headers = ['Member Name', 'Email', 'Attendance Rate', 'Events Attended', 'Total Events'];
    
    const csvContent = [
      headers.join(','),
      ...filteredAttendanceStats.map(stat => [
        `"${stat.member.name}"`,
        `"${stat.member.email}"`,
        `"${stat.attendanceRate.toFixed(1)}%"`,
        `"${stat.eventsAttended}"`,
        `"${stat.totalEvents}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'attendance_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Debug logs
  console.log('Is admin?', isAdmin);
  console.log('Current tab:', currentTab);
  console.log('Admin tabs should be visible:', isAdmin === true);

  return (
    <div className="container mx-auto py-6">
      {/* Debug UI element */}
      <div className="bg-blue-100 p-2 mb-4 rounded">
        Admin Status: {isAdmin ? 'Admin (true)' : 'Not Admin (false)'}
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          {/* Force render admin tabs for debugging */}
          <TabsTrigger value="attendance">Attendance Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          {/* Event filtering information */}
          {isAdmin && selectedEvents.length > 0 && selectedEvents.length !== events.length && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex items-center justify-between">
              <div>
                <span className="font-medium">Filtered view:</span> Showing data for {selectedEvents.length} selected events
                <Button 
                  variant="link" 
                  className="text-blue-600 dark:text-blue-400 p-0 h-auto ml-2"
                  onClick={() => setCurrentTab("events")}
                >
                  Manage selection
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearEventSelection}
                className="text-xs"
              >
                Clear filter
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor="memberAttendanceThreshold" className="whitespace-nowrap">Min. Attendance:</Label>
                  <div className="flex items-center">
                    <Input
                      id="memberAttendanceThreshold"
                      type="number"
                      min="0"
                      max="100"
                      value={attendanceThreshold}
                      onChange={(e) => setAttendanceThreshold(parseInt(e.target.value) || 0)}
                      className="w-16"
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="sortField" className="whitespace-nowrap">Sort by:</Label>
                    <Select value={sortField} onValueChange={setSortField}>
                      <SelectTrigger id="sortField" className="w-36">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="points">Points</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="attendance">Attendance Rate</SelectItem>
                        <SelectItem value="eventsAttended">Events Attended</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                      className="h-9 w-9"
                    >
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                )}
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="10 per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isAdmin && (
                <Button onClick={exportToCSV} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              )}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Member Type</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>School Year</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Discord Username</TableHead>
                {isAdmin && (
                  <>
                    <TableHead>Attendance %</TableHead>
                    <TableHead>Events Attended</TableHead>
                  </>
                )}
                <TableHead>Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger>{member.metadata.fullName}</PopoverTrigger>
                      <PopoverContent>
                        {/* ... (rest of the code remains the same) */}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={member.email}
                      onChange={(value) => handleFieldChange(member.id, 'email', value)}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={member.metadata.memberType}
                      onChange={(value) => handleFieldChange(member.id, 'memberType', value)}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={member.metadata.university}
                      onChange={(value) => handleFieldChange(member.id, 'university', value)}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={member.metadata.major}
                      onChange={(value) => handleFieldChange(member.id, 'major', value)}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={member.metadata.schoolYear}
                      onChange={(value) => handleFieldChange(member.id, 'schoolYear', value)}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={member.level?.toString() || ''}
                      onChange={(value) => handleFieldChange(member.id, 'level', parseInt(value))}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={member.points?.toString() || ''}
                      onChange={(value) => handleFieldChange(member.id, 'points', parseInt(value))}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={member.metadata.discordUsername}
                      onChange={(value) => handleFieldChange(member.id, 'discordUsername', value)}
                    />
                  </TableCell>
                  {isAdmin && (() => {
                    const memberStats = attendanceStats.find(stat => stat.member.id === member.id);
                    return (
                      <>
                        <TableCell>
                          {memberStats?.attendanceRate.toFixed(1) ?? '0.0'}%
                        </TableCell>
                        <TableCell>
                          {memberStats?.eventsAttended ?? 0} / {memberStats?.totalEvents ?? 0}
                        </TableCell>
                      </>
                    );
                  })()}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.roles.map((role: any, index: any) => (
                        <Badge key={role.id} className={`mr-1 mb-1 ${TAG_COLORS[index % TAG_COLORS.length]}`}>
                          {role.name}
                          {isAdmin && (
                            <X
                              className="ml-1 h-3 w-3 cursor-pointer"
                              onClick={() => removeRole(member.id, role.id)}
                            />
                          )}
                        </Badge>
                      ))}
                      {isAdmin && (
                        <Input
                          className="w-20 h-6 text-xs"
                          placeholder="Add role"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addRole(member.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </TabsContent>

        {/* Attendance Overview Tab */}
        <TabsContent value="attendance">
              {/* Filtering controls */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Label htmlFor="attendanceThreshold">Attendance Threshold:</Label>
                  <div className="flex items-center">
                    <Input
                      id="attendanceThreshold"
                      type="number"
                      min="0"
                      max="100"
                      value={attendanceThreshold}
                      onChange={(e) => setAttendanceThreshold(parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeZeroAttendance" 
                      checked={includeZeroAttendance}
                      onCheckedChange={() => setIncludeZeroAttendance(!includeZeroAttendance)}
                    />
                    <Label 
                      htmlFor="includeZeroAttendance" 
                      className="text-sm font-normal"
                    >
                      Include members with 0% attendance
                    </Label>
                  </div>
                </div>

                {selectedEvents.length > 0 && selectedEvents.length !== events.length && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 flex items-center">
                    <span className="text-sm">Filtered: {selectedEvents.length} events selected</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 ml-2 text-xs"
                      onClick={clearEventSelection}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Average Attendance</CardTitle>
                    <CardDescription>
                      {selectedEvents.length > 0 && selectedEvents.length !== events.length
                        ? `Based on ${selectedEvents.length} selected events`
                        : "Based on all events"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{overviewStats.averageAttendanceRate.toFixed(1)}%</div>
                    <Progress 
                      value={overviewStats.averageAttendanceRate} 
                      className="mt-2" 
                    />
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle>Members Below Threshold</CardTitle>
                    <CardDescription>{attendanceThreshold}% attendance threshold</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {overviewStats.membersBelowThreshold} / {overviewStats.totalMembers}
                    </div>
                    <Progress 
                      value={overviewStats.percentBelowThreshold} 
                      className="mt-2" 
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Distribution</CardTitle>
                    <CardDescription>
                      {selectedEvents.length > 0 && selectedEvents.length !== events.length
                        ? `Based on ${selectedEvents.length} selected events`
                        : "Based on all events"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          <linearGradient id="belowThresholdGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="aboveThresholdGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <Pie
                          data={[
                            { 
                              name: 'Below Threshold', 
                              value: filteredAttendanceStats
                                .filter(stat => stat.attendanceRate < attendanceThreshold)
                                .length,
                              fill: 'url(#belowThresholdGradient)', // Use gradient
                              stroke: '#3b82f6', // Blue outline
                              strokeWidth: 1
                            },
                            { 
                              name: 'Above Threshold', 
                              value: filteredAttendanceStats
                                .filter(stat => stat.attendanceRate >= attendanceThreshold)
                                .length,
                              fill: 'url(#aboveThresholdGradient)', // Use gradient
                              stroke: '#8b5cf6', // Purple outline
                              strokeWidth: 1
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} members`, '']} 
                          contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #475569', padding: '8px 12px', borderRadius: '4px' }}
                          labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                          itemStyle={{ color: '#ffffff' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Rates</CardTitle>
                    <CardDescription>
                      Distribution of attendance rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { range: '0-25%', count: filteredAttendanceStats
                            .filter(stat => 
                              (includeZeroAttendance || stat.attendanceRate > 0) && 
                              stat.attendanceRate >= 0 && 
                              stat.attendanceRate < 25
                            ).length 
                          },
                          { range: '25-50%', count: filteredAttendanceStats.filter(stat => stat.attendanceRate >= 25 && stat.attendanceRate < 50).length },
                          { range: '50-75%', count: filteredAttendanceStats.filter(stat => stat.attendanceRate >= 50 && stat.attendanceRate < 75).length },
                          { range: '75-100%', count: filteredAttendanceStats.filter(stat => stat.attendanceRate >= 75 && stat.attendanceRate <= 100).length },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} members`, 'Count']} 
                          contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #475569', padding: '8px 12px', borderRadius: '4px' }}
                          labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                          itemStyle={{ color: '#ffffff' }}
                        />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <Bar dataKey="count" fill="url(#barGradient)" stroke="#10b981" strokeWidth={1.5} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trends</CardTitle>
                  <CardDescription>
                    {selectedEvents.length > 0 && selectedEvents.length !== events.length
                      ? `Based on ${selectedEvents.length} selected events`
                      : "Based on all events"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={events
                        .filter(event => selectedEvents.length === 0 || selectedEvents.includes(event.id))
                        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
                        .map(event => {
                          // Get the list of members who attended this specific event
                          const attendeesForThisEvent = attendanceData
                            .filter(record => record.eventId === event.id)
                            .map(record => record.userId);
                          
                          const attendeeCount = attendeesForThisEvent.length;
                          
                          // Calculate effective member count based on includeZeroAttendance setting
                          let effectiveMemberCount = allMembers.length;
                          
                          // If we're not including zero attendance, adjust the member count
                          if (!includeZeroAttendance) {
                            // Get members who have attended at least one event (any event)
                            const membersWithAnyAttendance = new Set();
                            attendanceData.forEach(record => {
                              membersWithAnyAttendance.add(record.userId);
                            });
                            effectiveMemberCount = membersWithAnyAttendance.size;
                          }
                          
                          const attendanceRate = effectiveMemberCount > 0 
                            ? (attendeeCount / effectiveMemberCount) * 100
                            : 0;
                            
                          return {
                            name: event.title,
                            date: formatDate(event.time),
                            rate: parseFloat(attendanceRate.toFixed(1))
                          };
                        })}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Attendance Rate']} 
                        contentStyle={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #475569', padding: '8px 12px', borderRadius: '4px' }}
                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                        itemStyle={{ color: '#ffffff' }}
                      />
                      <Legend />
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4}/>
                        </linearGradient>
                      </defs>
                      <Line type="monotone" dataKey="rate" stroke="url(#lineGradient)" strokeWidth={2.5} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Events Tab */}
            <TabsContent value="events">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Select Events for Analysis</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={selectAllEvents}>Select All</Button>
                  <Button variant="outline" onClick={clearEventSelection}>Clear</Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Attendees</TableHead>
                        <TableHead className="text-right">Attendance Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sort events from most recent to oldest */}
                      {[...events]
                        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                        .map((event) => {
                        // Get the list of members who attended this specific event
                        const attendeesForThisEvent = attendanceData
                          .filter(record => record.eventId === event.id)
                          .map(record => record.userId);
                        
                        const attendeeCount = attendeesForThisEvent.length;
                        
                        // Calculate effective member count based on includeZeroAttendance setting
                        let effectiveMemberCount = allMembers.length;
                        
                        // If we're not including zero attendance, adjust the member count
                        if (!includeZeroAttendance) {
                          // Get members who have attended at least one event (any event)
                          const membersWithAnyAttendance = new Set();
                          attendanceData.forEach(record => {
                            membersWithAnyAttendance.add(record.userId);
                          });
                          effectiveMemberCount = membersWithAnyAttendance.size;
                        }
                        
                        const attendanceRate = effectiveMemberCount > 0 
                          ? (attendeeCount / effectiveMemberCount) * 100
                          : 0;
                        
                        return (
                          <TableRow key={event.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedEvents.includes(event.id)}
                                onCheckedChange={() => handleEventSelectionChange(event.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>{formatDate(event.time)}</TableCell>
                            <TableCell className="text-right">{attendeeCount}/{allMembers.length}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Progress value={attendanceRate} className="w-20" />
                                <span>{attendanceRate.toFixed(1)}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {events.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No events found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
      </Tabs>
    </div>
  );
}
