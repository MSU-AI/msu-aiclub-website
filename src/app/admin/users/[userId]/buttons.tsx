"use client";

import { Button } from "@nextui-org/react";
import { deleteComment } from "~/server/actions/comments";
import { addToProject, deleteProject, removeFromProject } from "~/server/actions/projects";
import { addRole, deleteRole, removeFromRole } from "~/server/actions/role";
import { deleteUser } from "~/server/actions/user";

export function DeleteUserButton({ userId }: { userId: string }) {
    return (
        <Button onPress={() => deleteUser(userId)}>Delete User</Button>
    );
}

export function DeleteProjectButton({ projectId }: { projectId: string }) {
    return (
        <Button onPress={() => deleteProject(projectId)}>Delete Project</Button>
    );
}

export function DeleteCommentButton({ commentId }: { commentId: string }) {
    return (
        <Button onPress={() => deleteComment(commentId)}>Delete Comment</Button>
    );
}

export function RemoveFromRoleButton({ userId, roleId }: { userId: string, roleId: string }) {
    return (
        <Button onPress={() => removeFromRole(userId, roleId)}>Remove from Role</Button>
    );
}

export function AddRoleButton({ userId, roleId }: { userId: string, roleId: string }) {
    return (
        <Button onPress={() => addRole(userId, roleId)}>Make Team Lead</Button>
    );
}

export function AddToProjectButton({ userId, projectId }: { userId: string, projectId: string }) {
    return (
        <Button onPress={() => addToProject(userId, projectId)}>Add to Dummy Project</Button>
    );
}

export function RemoveFromProjectButton({ userId, projectId }: { userId: string, projectId: string }) {
    return (
        <Button onPress={() => removeFromProject(userId, projectId)}>Remove from Dummy Project</Button>
    );
}