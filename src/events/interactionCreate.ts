import { CommandInteraction } from "discord.js";
import red from "chalk";
import { client } from "../../";
import fs from "fs";
import { bold, italic } from "../../node_modules/@discordjs/builders/dist";

const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  (client as any).commands.set(command.data.name, command);
}
export = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;
    const commands = (client as any).commands;
    const command = commands.get(interaction.commandName);
    if (!command) return;

    if (interaction.channel?.type == "DM") {
      return await interaction.reply(`
          Hey ${bold(
            interaction.user.username
          )}, Commands are not allowed here. 
          ${italic("Maybe try on a server?")}
      `);
    } else {
      try {
        await command.execute(interaction);
      } catch (err) {
        console.log(red("Interaction Failed"));
        console.error(err);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};
