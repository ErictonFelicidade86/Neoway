declare namespace Cypress {
    interface Chainable {
      // CRIANDO USUÁRIOS
      getUserByName(name: string): Chainable<any>
      deleteUserById(id: string): Chainable<any>
      createUser(userData: any, expectedStatus?: number): Chainable<any>

      //DELETAR USUÁRIOS
      getRandomUser(): Chainable<any>
      deleteUserById(id: string, expectedStatus?: number, expectedMessage?: string): Chainable<any>
    }
  }
  