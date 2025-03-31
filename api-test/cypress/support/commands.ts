/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// cypress/support/commands.ts
Cypress.Commands.add('criarUsuario', (admin = false) => {
    const usuario = {
      nome: 'Ton Teste',
      email: `ton_${Date.now()}@qa.com`,
      password: 'teste123',
      administrador: admin ? 'true' : 'false'
    };
  
    return cy.api({
      method: 'POST',
      url: '/usuarios',
      body: usuario
    }).then(res => {
      expect(res.status).to.eq(201);
      return { ...res.body, ...usuario };
    });
  });
  
  Cypress.Commands.add('login', (email, senha) => {
    return cy.api({
      method: 'POST',
      url: '/login',
      body: {
        email,
        password: senha
      }
    }).then(res => {
      expect(res.status).to.eq(200);
      return res.body.authorization;
    });
  });
  
  Cypress.Commands.add('criarProduto', (token) => {
    const produto = {
      nome: `Produto Teste ${Date.now()}`,
      preco: 100,
      descricao: 'Produto criado via API',
      quantidade: 5
    };
  
    return cy.api({
      method: 'POST',
      url: '/produtos',
      headers: { Authorization: token },
      body: produto
    }).then(res => {
      expect(res.status).to.eq(201);
      return { ...res.body, ...produto };
    });
  });
  
  Cypress.Commands.add('criarCarrinho', (token, produtos) => {
    const body = {
      produtos: produtos.map(p => ({
        idProduto: p._id,
        quantidade: 1
      }))
    };
  
    return cy.api({
      method: 'POST',
      url: '/carrinhos',
      headers: { Authorization: token },
      body
    }).then(res => {
      expect(res.status).to.eq(201);
      return res.body;
    });
  });
  
  Cypress.Commands.add('concluirCompra', (token) => {
    return cy.api({
      method: 'DELETE',
      url: '/carrinhos/concluir-compra',
      headers: { Authorization: token }
    }).then(res => {
      expect(res.status).to.eq(200);
      return res.body;
    });
  });
  