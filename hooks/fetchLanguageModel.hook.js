const { writeFileSync } = require("fs");
const { BaseApp } = require("jovo-framework");
const { Task, printUserInput, Log } = require("@jovotech/cli-core");
const { AirtableCMS } = require("jovo-cms-airtable");

async function fetchLanguageModel() {
  const task = new Task(
    printUserInput("Getting language model from Airtable CMS"),
    async () => {
      const cms = new AirtableCMS({
        apiKey: process.env.AIRTABLE_API_KEY,
        baseId: process.env.AIRTABLE_BASE_ID,
      });
      const app = new BaseApp();
      cms.install(app);

      const entries = await cms.loadTableData({
        table: "en",
        order: ["name", "type", "phrases/values"],
      });
      entries.shift();

      const languageModel = {
        invocation: "my test app",
        intents: [],
      };
      for (const entry of entries) {
        const [name, type, values] = entry;

        if (type === "intent") {
          const intent = { name, phrases: [] };
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
            values: values.map((value) => ({ value })),
          });
        }
      }
      writeFileSync("./models/en.json", JSON.stringify(languageModel, null, 2));
    }
  );
  await task.run();
  Log.spacer();
}

module.exports = { fetchLanguageModel };
