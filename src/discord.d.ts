import { Collection } from "discord.js";
import { Components } from "./client/components.ts";
import { Command, Task } from "../structures/index.ts";

declare module "discord.js" {
    export interface Client {
      components: Components,
      commands: Collection<string, Command>,
      tasks: Collection<string, Task>
    }
}