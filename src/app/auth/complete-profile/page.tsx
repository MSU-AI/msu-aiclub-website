"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { completeAccount } from "~/server/actions/auth";

export default function CompleteProfile() {
  const router = useRouter();

  const handleCompleteProfile = async () => {
    await completeAccount();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <Button onPress={async () => await handleCompleteProfile()} variant="solid">
            Complete Account
        </Button>
    </div>
  );
}