"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { updateUserRoleAction } from "@/lib/actions/users";
import { ROLES, ROLE_LABELS, type Profile, type Role } from "@/lib/types";

export function UsersManager({
  users,
  currentUserId,
}: {
  users: Profile[];
  currentUserId: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <UserRow key={user.id} user={user} currentUserId={currentUserId} />
      ))}
    </div>
  );
}

function UserRow({
  user,
  currentUserId,
}: {
  user: Profile;
  currentUserId: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const onChange = (role: string) => {
    const form = new FormData();
    form.set("user_id", user.id);
    form.set("role", role);
    startTransition(async () => {
      await updateUserRoleAction(form);
      router.refresh();
    });
  };

  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={user.full_name ?? user.nickname} src={user.avatar_url} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">
            {user.full_name ?? "Tanpa nama"}
            {user.id === currentUserId ? (
              <span className="ml-2 text-xs font-normal text-ink-faint">(kamu)</span>
            ) : null}
          </p>
          <p className="truncate text-xs text-ink-muted">
            {user.nickname ? `“${user.nickname}” · ` : ""}
            {user.bio ?? user.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge tone="navy">{ROLE_LABELS[user.role]}</Badge>
        <Select
          aria-label={`Ubah role ${user.full_name ?? "user"}`}
          value={user.role}
          onChange={(e) => onChange(e.target.value)}
          disabled={pending || user.role === "super_admin" && user.id === currentUserId}
          className="h-9 w-40"
        >
          {ROLES.filter((role) => role !== "super_admin" || user.role === "super_admin").map(
            (role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role as Role]}
              </option>
            ),
          )}
        </Select>
      </div>
    </Card>
  );
}