import { z } from 'zod';
import type { StructurePredicate } from "../client/components.js";

/**
 * Defines the structure of a command
 */
export type Task = {
  /**
   * The name of the task
   */
  name: string;
  /**
   * The time in milliseconds between each execution
   */
  delay: number;
  /**
   * timeoutID returned by setInterval
   */
  timeoutID?: ReturnType<typeof setInterval>;
	/**
	 * Any data can be stored here
	 */
	data?: {};
	/**
	 * The function to execute when the command is called
	 */
	execute(): Promise<void> | void;
  /**
	 * Whether or not the task should only be executed once
	 *
	 * @defaultValue false
	 */
	once?: boolean;
};

/**
 * Defines the schema for a command
 */
export const schema = z.object({
  name: z.string(),
  delay: z.number().int().min(50),
  timeoutID: z.number().int().optional(),
	data: z.record(z.any()).optional(),
	execute: z.function(),
  once: z.boolean().optional().default(false),
});

/**
 * Defines the predicate to check if an object is a valid Command type.
 */
export const predicate: StructurePredicate<Task> = (structure: unknown): structure is Task =>
	schema.safeParse(structure).success;