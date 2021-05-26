const { ProjectConfig } = require("@jovotech/cli-core");
const { AlexaCli } = require("@jovotech/platform-alexa/dist/cli");
const {
  fetchLanguageModel,
} = require("./dist/hooks/fetchLanguageModel.hook.js");

require("dotenv").config();

/*
|--------------------------------------------------------------------------
| JOVO PROJECT CONFIGURATION
|--------------------------------------------------------------------------
|
| Information used by the Jovo CLI to build and deploy projects
| Learn more here: www.jovo.tech/docs/project-config
|
*/
const project = new ProjectConfig({
  endpoint: "${JOVO_WEBHOOK_URL}",
  plugins: [
    // Add Jovo CLI plugins here.
    new AlexaCli({
      locales: {
        en: ["en-US"],
      },
    }),
  ],
  hooks: {
    "before.build": [fetchLanguageModel],
  },
});

module.exports = project;
