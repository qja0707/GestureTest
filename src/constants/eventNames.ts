export const EVENT_NAMES = {
  TODO_MOVING: 'todoMoving',
  TODO_FINALIZE: 'todoFinalize',
} as const;

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];
