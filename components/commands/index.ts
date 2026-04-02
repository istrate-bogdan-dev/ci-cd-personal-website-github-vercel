// components/commands/index.ts
import { ReactNode } from "react";

export type CommandEntry = {
  description: string;
  handler: () => ReactNode;
};

export type CommandRegistry = Record<string, CommandEntry>;

export const registry: CommandRegistry = {};

export function registerCommand(name: string, entry: CommandEntry): void {
  registry[name] = entry;
}
