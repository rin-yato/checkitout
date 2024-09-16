export const iife = <Fn extends () => any>(fn: Fn): ReturnType<Fn> => fn();

export function getInitial(name: string): string {
  return name.charAt(0).toUpperCase() || "@";
}
