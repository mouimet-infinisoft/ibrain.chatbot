"use client"

import React, {createContext} from 'react'
import { createBrainstack } from "@brainstack/react";

const options = {
  eventHubOptions: [],
  stateOptions: {
    search: '',
    me: {},//getCookie('ID'),
    // Wait queue for user feedback
    wait: []
  },
  loggerOptions: [5],
};

const {
  BrainStackProvider,
  useBrainStack,
  core,
  getValue,
  createEventHandlerMutator,
  createEventHandlerMutatorShallow,
} = createBrainstack(options);

export default  {
  BrainStackProvider,
  useBrainStack,
  core,
  getValue,
  createEventHandlerMutator,
  createEventHandlerMutatorShallow,
}