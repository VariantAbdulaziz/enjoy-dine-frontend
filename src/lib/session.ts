import "server-only";

import * as React from "react";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const getSession = React.cache(async () => {
  const session = await auth();
  if (!session) redirect("/login");
  return session;
});
