"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { UserMetadata } from './data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { X, ExternalLink, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { addRole, removeRole } from '~/server/actions/role';
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

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
} : {
  members: any,
  isAdmin: boolean,
}) {
  const [curMembers, setCurMembers] = useState(members);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sortedAndFilteredMembers = useMemo(() => {
    return [...curMembers]
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .filter(member => 
        Object.values(member).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        Object.values(member.metadata).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
  }, [curMembers, searchTerm]);

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

  return (
    <div className="container mx-auto py-10 pt-28">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Members</h1>
        {isAdmin && (
          <Button onClick={exportToCSV} className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
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
                    {member.githubUrl && (
                      <a href={member.metadata.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center mb-2">
                        <ExternalLink className="mr-2" /> GitHub
                      </a>
                    )}
                    {member.personalWebsite && (
                      <a href={member.metadata.personalWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center mb-2">
                        <ExternalLink className="mr-2" /> Personal Website
                      </a>
                    )}
                    {member.linkedinUrl && (
                      <a href={member.metadata.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <ExternalLink className="mr-2" /> LinkedIn
                      </a>
                    )}
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
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {member.roles.map((role, index) => (
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
    </div>
  );
}
