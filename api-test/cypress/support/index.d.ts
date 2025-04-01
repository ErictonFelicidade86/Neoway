// cypress/support/index.d.ts
/// <reference types="cypress" />
declare namespace Cypress {
    interface Chainable {
      // CRIANDO USUÁRIOS
      getUserByName(name: string): Chainable<any>
      deleteUserById(id: string): Chainable<any>
      createUser(userData: any, expectedStatus?: number): Chainable<any>

      //DELETAR USUÁRIOS
      getRandomUser(): Chainable<any>
      deleteUserById(id: string, expectedStatus?: number, expectedMessage?: string): Chainable<any>
      
      //EDITANDO O USUÁRIOS
      getRandomUserId(): Chainable<string>;

      getFakeEmail(): Chainable<string>;

      editUser(
          id: string,
          body: any,
          expectedStatus: number,
          expectedFields?: Record<string, string>
      ): Chainable<any>;
      
      // PRODUTOS PARA CADASTRAR
      
      deleteUserIfExists(email: string): Chainable<void>;
      createUser(user: UserPayload): Chainable<void>;
      loginUser(email: string, password: string): Chainable<string>;
      deleteProductIfExists(nome: string, token: string): Chainable<void>;
      createProduct(produto: ProductPayload, token: string): Chainable<void> 
    }
  }
  