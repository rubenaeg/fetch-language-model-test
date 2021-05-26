import { Alexa } from "@jovotech/platform-alexa";
import { App } from "@jovotech/framework";

import { MainComponent } from "./components/MainComponent/MainComponent";
import { LoveHatePizzaComponent } from "./components/MainComponent/LoveHatePizzaComponent";

/*
|--------------------------------------------------------------------------
| APP CONFIGURATION
|--------------------------------------------------------------------------
|
| All relevant components, plugins, and configurations for your Jovo app
| Learn more here: www.jovo.tech/docs/app-config
|
*/
const app = new App({
  /*
  |--------------------------------------------------------------------------
  | Components
  |--------------------------------------------------------------------------
  |
  | Components contain the Jovo app logic
  | Learn more here: www.jovo.tech/docs/components
  |
  */

  components: [MainComponent, LoveHatePizzaComponent],

  /*
  |--------------------------------------------------------------------------
  | Plugins
  |--------------------------------------------------------------------------
  |
  | Includes platforms, database integrations, third-party plugins, and more
  | Learn more here: www.jovo.tech/docs/plugins, www.jovo.tech/marketplace
  |
  */

  plugins: [
    // Add Jovo plugins here.
    new Alexa(),
  ],

  /*
  |--------------------------------------------------------------------------
  | Other options
  |--------------------------------------------------------------------------
  |
  | Includes all other configuration options like logging
  | Learn more here: www.jovo.tech/docs/app-config
  |
  */

  logging: true,

  intentMap: {
    "AMAZON.StopIntent": "END",
  },
});

export { app };
