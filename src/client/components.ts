import type { PathLike } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { Collection } from "discord.js";
import { Client } from "./index.js";
import type { Command } from '../commands/index.js';
import type { Task } from '../tasks/index.js';

export type StructurePredicate<T> = (structure: unknown) => structure is T;

export class Components {
  public client: Client;
  public commands: Collection<string, Command>;
  public tasks: Collection<string, Task>;

  constructor(client: Client) {
    this.client = client;
    this.commands = new Collection();
    this.tasks = new Collection();
  }

  async load<T>(dir: PathLike, predicate: StructurePredicate<T>, recursive = true): Promise<T[]> {
    const statDir = await stat(dir);

    if (!statDir.isDirectory()) {
      throw new Error(`${dir} is not a directory`);
    }

    const files = await readdir(dir);
    const structures: T[] = [];

    for (const file of files) {
      if (file === 'index.js' || !file.endsWith('.js')) {
        continue;
      }

      const statFile = await stat(new URL(`${dir}/${file}`));
      if (statFile.isDirectory() && recursive) {
        structures.push(...(await this.load(`${dir}/${file}`, predicate, recursive)));
        continue;
      }
      const structure = (await import(`${dir}/${file}`)).default;
      if (predicate(structure)) structures.push(structure);
    }
    return structures;
  }
}