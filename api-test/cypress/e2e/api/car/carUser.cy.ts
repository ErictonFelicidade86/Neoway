/// <reference types="cypress" />

describe('Fluxo de carrinho via custom command', () => {
  it('Deve executar todo o fluxo com sucesso', () => {
    cy.criarFluxoCarrinhoCompleto();
  });
});
