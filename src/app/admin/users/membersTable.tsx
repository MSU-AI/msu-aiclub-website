"use client"
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Button } from "@nextui-org/react";
import type { Profile } from "~/types/profiles";
import { revalidatePath } from "next/cache"

export default function MembersTable({ profiles }: { profiles: Profile[] }) {
    
    // const handleDelete = async (supaId: string) => {
    //     // const success = await deleteProfile(supaId);

    //     if (success) {
    //         revalidatePath("/admin/users", "page");
    //     } else {
    //         alert("Profile deletion failed");
    //     }
    // }

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
            {profiles.map((profile, index) => (
              <TableRow key={index}>
                <TableCell>{profile.supaId /* Replace this with the email associated with the supaId */}</TableCell>
                <TableCell>{profile.projectId}</TableCell>
                <TableCell>{profile.userType}</TableCell>
                <TableCell>
                    <Button> Edit </Button>
                    <Button onClick={() => (console.log("Delete profile", profile.supaId))}> Delete </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

