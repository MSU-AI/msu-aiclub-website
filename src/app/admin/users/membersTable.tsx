"use client"
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Button } from "@nextui-org/react";
import { deleteUser } from "~/server/actions/users";

export default function MembersTable({ 
  profiles,
  roles
}: { 
  profiles: any[],
  roles: any[]
}) {

  return (
    <div className="flex w-screen h-screen justify-center items-start">
      <div className="flex justify-center items-center w-1/2">
        <Table aria-label="Members collection table">
          <TableHeader>
            <TableColumn>Email</TableColumn>
            <TableColumn>Projects</TableColumn>
            <TableColumn>User Type</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {profiles.map((profile, index) => (
              <TableRow key={index}>
                <TableCell>{profile.id}</TableCell>
                <TableCell>
                  {profile.projects.map((project: any) => project.project.name).join(", ")}
                </TableCell>
                <TableCell>
                  {profile.roles.map((role: any) => role.role.name).join(", ")}
                </TableCell>
                <TableCell>
                  <Button> Edit </Button>
                  <Button onPress={() => deleteUser(profile.id)}> Delete </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
