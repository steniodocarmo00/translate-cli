#!/usr/bin/env node

import translate from "@iamtraction/google-translate";
import { languages } from "./utils/languages.js";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";

const languageChoices = Object.keys(languages);
const filteredChoices = languageChoices.filter(
  (choice) => choice !== "Automatic",
);

async function App() {
  let langSource: string;
  let langDestiny: string;
  let textToTranslate: string;

  async function Questions() {
    const firstChoice = await inquirer.prompt<{
      sourceLanguage: keyof typeof languages;
    }>({
      name: "sourceLanguage",
      type: "list",
      message: "Choose the language that you want to translate from:",
      choices: languageChoices,
    });
    langSource = languages[firstChoice.sourceLanguage];

    const secondChoice = await inquirer.prompt<{
      destinyLanguage: keyof typeof languages;
    }>({
      name: "destinyLanguage",
      type: "list",
      message: "Choose the language that you want to translate to:",
      choices: filteredChoices,
    });
    langDestiny = languages[secondChoice.destinyLanguage];

    const textInput = await inquirer.prompt<{ text: string }>({
      name: "text",
      type: "input",
      message: "Type the text that you want to translate:",
      default() {
        return "Let's go, Bill!";
      },
    });

    textToTranslate = textInput.text;
  }

  async function Translate() {
    const spinner = createSpinner("Translating...").start();

    try {
      const result = await translate(textToTranslate, {
        from: langSource,
        to: langDestiny,
      });

      spinner.success({ text: "Translation completed successfully!" });
      console.log("\nTranslation Result:");
      console.log(result.text);
    } catch (error) {
      spinner.error({ text: "Failed to translate the text!" });
      console.error(error);
    }
  }

  await Questions();
  await Translate();
}

App();
