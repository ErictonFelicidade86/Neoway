declare namespace Cypress {
    interface Chainable {
      getUserByName(name: string): Chainable<any>
      deleteUserById(id: string): Chainable<any>
      createUser(userData: any, expectedStatus?: number): Chainable<any>
    }
  }
  