import { writeFileSync } from "fs";
import { BaseApp } from "jovo-framework";
import { Task } from "@jovotech/cli-core";
import { AirtableCMS } from "jovo-cms-airtable";

export interface Intent {
  name: string;
  phrases: string[];
  inputs?: { name: string; type: string }[];
}

export interface LanguageModel {
  invocation: string;
  intents: Intent[];
  inputTypes?: { name: string; values: { value: string } }[];
}

export async function fetchLanguageModel() {
  const task: Task = new Task(
    "Getting language model from Airtable CMS",
    async () => {
      const cms: AirtableCMS = new AirtableCMS({
        apiKey: process.env.AIRTABLE_API_KEY,
        baseId: process.env.AIRTABLE_BASE_ID,
      });
      const app: BaseApp = new BaseApp();
      cms.install(app);

      const entries: any[] = (await cms.loadTableData({
        table: "en",
        order: ["name", "type", "phrases/values"],
      })) as any[];
      entries.shift();

      const languageModel: LanguageModel = {
        invocation: "my test app",
        intents: [],
      };
      for (const entry of entries) {
        const [name, type, values] = entry;

        if (type === "intent") {
          const intent: Intent = { name, phrases: [] };
          for (let phrase of values) {
            const match = phrase.match(/{ ([a-zA-Z]*?): ([a-zA-Z]*?) }/);
            if (match) {
              const [input, inputName, inputType] = match;
              phrase = phrase.replace(input, `{${inputName}}`);
              if (!intent.inputs) {
                intent.inputs = [];
              }
              if (!intent.inputs.find((el) => el.name === inputName)) {
                intent.inputs.push({ name: inputName, type: inputType });
              }
            }
            intent.phrases.push(phrase);
          }
          languageModel.intents.push(intent);
        }

        if (type === "inputType") {
          if (!languageModel.inputTypes) {
            languageModel.inputTypes = [];
          }

          languageModel.inputTypes.push({
            name,
            values: values.map((value: string) => ({ value })),
          });
        }
      }
      writeFileSync("./models/en.json", JSON.stringify(languageModel, null, 2));
    }
  );
  await task.run();
}
