import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: 'cypress/support/e2e.ts', // ou .js se for JS
    baseUrl: 'https://serverest.dev',
    setupNodeEvents(on, config) {},
  },
  video: true,
  screenshotOnRunFailure: true,
  env: {
    fakeBaseUrl:
      'https://fakerapi.it/api/v2/persons?_quantity=1&_gender=female&_birthday_start=2005-01-01%27',
  },
});
