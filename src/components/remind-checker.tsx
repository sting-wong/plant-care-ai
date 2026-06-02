"use client";

import { useRemindCheck } from "@/hooks/use-remind-check";

export function RemindChecker() {
  useRemindCheck();
  return null;
}
