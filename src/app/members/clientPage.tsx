"use client";
import { useState } from 'react';
import { membersData, UserMetadata } from './data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { X, ExternalLink } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { addRole, removeRole } from '~/server/actions/role';

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

  console.log(curMembers);

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

  return (
    <div className="container mx-auto py-10 pt-28">
      <h1 className="text-2xl font-bold mb-5">Members</h1>
      <Table>
        <TableHeader>
          <TableRow>
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
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <Popover>
                  <PopoverTrigger>{member.fullName}</PopoverTrigger>
                  <PopoverContent>
                    {member.githubUrl && (
                      <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center mb-2">
                        <ExternalLink className="mr-2" /> GitHub
                      </a>
                    )}
                    {member.personalWebsite && (
                      <a href={member.personalWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center mb-2">
                        <ExternalLink className="mr-2" /> Personal Website
                      </a>
                    )}
                    {member.linkedinUrl && (
                      <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
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
                  value={member.memberType}
                  onChange={(value) => handleFieldChange(member.id, 'memberType', value)}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={member.university}
                  onChange={(value) => handleFieldChange(member.id, 'university', value)}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={member.major}
                  onChange={(value) => handleFieldChange(member.id, 'major', value)}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={member.schoolYear}
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
                  value={member.discordUsername}
                  onChange={(value) => handleFieldChange(member.id, 'discordUsername', value)}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {member.roles.map((role, index) => (
                    <Badge key={role} className={`mr-1 mb-1 ${TAG_COLORS[index % TAG_COLORS.length]}`}>
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
    </div>
  );
}
