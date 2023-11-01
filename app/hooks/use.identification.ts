
"use client"
import { useEffect } from "react"
import brainstack from './brainstack';
const { useBrainStack, getValue }  = brainstack

export const useIdentication = () => {
  const bstack = useBrainStack()

  useEffect(() => {
    bstack.store.emit('ibrain.voice.thought', {message: 'Hi how are you today?'})
    if (getValue(`me`) === null) {
      // introduce to user
      //set cookie
    } else {
      // welcome back user
    }
  }, [])
}