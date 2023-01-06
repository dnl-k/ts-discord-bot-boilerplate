import { statSync } from 'fs';
import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { singleton, container } from 'tsyringe';
import { AnyComponentBuilder, Client, Collection, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export class ComponentManager {
  public async loadDirectory(dir: string): Promise<any[]> {
    const prefixedPath = join(dirname(fileURLToPath(import.meta.url)), dir);
    let imports = [];
    try {
      const dirStructure = await readdir(prefixedPath);

      for (const item of dirStructure) {
        const relativePath = join(prefixedPath, item);
        if (statSync(relativePath)
          .isFile()) {
          const imported = await import(pathToFileURL(relativePath).href);
          if (imported.default) {
            imports.push(imported.default);
          } else {
            for (const key of Object.keys(imported)) {
              imports.push(imported[key]);
            }
          }
        } else imports = [...imports, ...(await this.loadDirectory(join(dir, item)))];
      }
    } catch (error) {
      return [];
    }
    return imports;
  }
}

export abstract class Component {
  public componentData: AnyComponentBuilder;
  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({ content: 'Could not execute: Missing handler', ephemeral: true });
  }
}

export abstract class Event {
  public async run(...args: any[]): Promise<void> {}
}

@singleton()
export class EventManager extends ComponentManager {
  public async load(dir: string): Promise<void> {
    const client = container.resolve<Client>('client');
    const events = await this.loadDirectory(dir);
    for (const event of events) {
      if (!(typeof event === 'function' && typeof event.prototype === 'object' && event.toString()
        .substring(0, 5) === 'class')) return;
      const constructedEvent = new event();
      const eventName = constructedEvent.constructor.name[0].toLowerCase() + constructedEvent.constructor.name.slice(1);
      client.on(eventName, constructedEvent.run);
    }
  }
}

export abstract class Command {
  public commandData = new SlashCommandBuilder();
  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({ content: 'Could not execute command: Missing command handler', ephemeral: true });
  }
}

@singleton()
export class CommandManager extends ComponentManager {
  public commands: Collection<string, Command> = new Collection<string, Command>();

  public async load(dir: string): Promise<void> {
    const commands = await this.loadDirectory(dir);
    for (const command of commands) {
      const commandInstance = new command();
      this.commands.set(commandInstance.commandData.name, commandInstance);
    }
  }
}