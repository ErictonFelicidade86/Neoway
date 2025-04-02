/// <reference types="cypress" />
import { payload } from '../../fixtures/user';
import { carProduct } from '../../fixtures/products';

describe('Fluxo completo: Cadastro de usuário, login e dois produtos', () => {
  let token: string;

  before(() => {
    cy.deleteUserIfExists(payload.CarUser.email);
  });

  it('Deve cadastrar um novo usuário com sucesso', () => {
    cy.createUserProduct(payload.CarUser);
  });

  describe('Cadastro de dois Produtos', () => {
    before(() => {
      cy.loginUser(payload.CarUser.email, payload.CarUser.password).then((tkn) => {
        token = tkn;
      });
    });

    before(() => {
      cy.deleteProductIfExists(carProduct.dataProduct_1.nome, token);
      cy.deleteProductIfExists(carProduct.dataProduct_2.nome, token);
    });

    it('Deve cadastrar o produto 1 com sucesso', () => {
      cy.createProduct(carProduct.dataProduct_1, token);
    });

    it('Deve cadastrar o produto 2 com sucesso', () => {
      cy.createProduct(carProduct.dataProduct_2, token);
    });
  });
});
