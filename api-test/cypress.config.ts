import { defineConfig } from 'cypress';
const { allureCypress } = require("allure-cypress/reporter")


export default defineConfig({
  e2e: {
    baseUrl: 'https://serverest.dev',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      allureCypress(on, config);
      return config;
    },
  },
  video: true,
  screenshotOnRunFailure: true,
  env: {
    fakeBaseUrl: 'https://fakerapi.it/api/v2/persons?_quantity=1&_gender=female&_birthday_start=2005-01-01'
  }
});
