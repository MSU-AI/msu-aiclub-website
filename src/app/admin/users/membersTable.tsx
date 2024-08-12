"use client"
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Button } from "@nextui-org/react";
import { revalidatePath } from "next/cache"

type Role = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
};

type UserProfile = {
  id: string;
  email: string;
  roles: Role[];
  projects: Project[];
};

export default function MembersTable({ profiles }: { profiles: UserProfile[] }) {
    
    const handleDelete = async (userId: string) => {
        // Implement delete logic here
        console.log("Delete user", userId);
        // After successful deletion:
        // revalidatePath("/admin/users");
    }

    const handleEdit = (userId: string) => {
        // Implement edit logic here
        console.log("Edit user", userId);
    }

  return (
    <div className="flex w-screen h-screen justify-center">
      <div className="flex justify-center items-center w-1/2">
        <Table aria-label="Members collection table">
          <TableHeader>
            <TableColumn>Email</TableColumn>
            <TableColumn>Projects</TableColumn>
            <TableColumn>User Type</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.email}</TableCell>
                <TableCell>{profile.projects.map(p => p.name).join(", ") || "No projects"}</TableCell>
                <TableCell>{profile.roles.map(r => r.name).join(", ") || "No role assigned"}</TableCell>
                <TableCell>
                    <Button onClick={() => handleEdit(profile.id)}> Edit </Button>
                    <Button onClick={() => handleDelete(profile.id)}> Delete </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}