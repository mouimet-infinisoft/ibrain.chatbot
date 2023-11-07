"use client";

import { useEffect } from "react";
import { useInitialize } from "./navigation/actions.js";

const Layout = ({ children }: any) => {
  const { initialize } = useInitialize();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
};

export default Layout;
