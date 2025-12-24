"use client";

import React from "react";
import useAutoLogout from "../hooks/useAutoLogout";

export default function AutoLogoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useAutoLogout(); // client-side hook runs here
  return <>{children}</>;
}
