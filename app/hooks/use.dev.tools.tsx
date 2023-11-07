"use client";
import React, { useEffect } from "react";

import { core } from "./brainstack";

export const useDevTools = () => {
  useEffect(() => {
    let devTools: any = null;
    if (typeof window !== "undefined") {
      // Send initial state
      devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
      devTools.connect().init(core.store.getState());
      core.log.info(`Connected to Redux Devtools`);

      // Subscribe to state changes
      core.store.on(/.*/, ({ event, ...payload }: any) => {
        core.log.info(event, payload);
        devTools.send({ type: event, payload }, core.store.getState(), {
          trace: true,
          name: "brainstack iBrain",
        });
      });

      return () => {
        devTools.disconnect();
        core.log.info(`Disconnected from Redux Devtools`);
      };
    }
  }, []);
};
