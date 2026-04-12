export type ActionState<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
