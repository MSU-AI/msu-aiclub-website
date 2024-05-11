"use client";

import { useSearchParams } from "next/navigation"

export default function ErrorPage() {
    const params = useSearchParams();
    const message = params.get('message') ?? '';

    return (
      <div>
        <p>Sorry, something went wrong</p>
        <p>{message}</p>
      </div>
    );
};