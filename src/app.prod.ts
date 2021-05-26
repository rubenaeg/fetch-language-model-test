import { FileDb } from '@jovotech/db-filedb'
import { app } from './app';

/*
|--------------------------------------------------------------------------
| STAGE CONFIGURATION
|--------------------------------------------------------------------------
|
| This configuration gets merged into the default app config
| Learn more here: www.jovo.tech/docs/staging
|
*/
app.use({
  plugins: [
    // Add Jovo plugins here.
		new FileDb(),
  ],
});

export * from './server.express';
