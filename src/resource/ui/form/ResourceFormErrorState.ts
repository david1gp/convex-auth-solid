import { type SignalObject, createSignalObject } from "~ui/utils/createSignalObject"

export type ResourceFormErrorState = {
  resourceId: SignalObject<string>
  // General
  name: SignalObject<string>
  description: SignalObject<string>
  type: SignalObject<string>
  // Display
  visibility: SignalObject<string>
  image: SignalObject<string>
  language: SignalObject<string>
  // Files
  fileIds: SignalObject<string>
}

export function resourceCreateErrorState(): ResourceFormErrorState {
  return {
    resourceId: createSignalObject(""),
    // General
    name: createSignalObject(""),
    description: createSignalObject(""),
    type: createSignalObject(""),
    // Display
    visibility: createSignalObject(""),
    image: createSignalObject(""),
    language: createSignalObject(""),
    // Files
    fileIds: createSignalObject(""),
  }
}
