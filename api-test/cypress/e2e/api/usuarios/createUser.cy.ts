/// <reference types="cypress" />
import { payload } from '../../fixtures/user';

describe('GET e DELETE', () => {
  let idUser: string;

  before(() => {
    cy.getUserByName('Ericton Brito').then((user) => {
      idUser = user._id;
    });
  });

  it('Deve excluir o usuário existente', () => {
    cy.deleteUserById(idUser);
  });
});

describe('POST', () => {
  it('Deve cadastrar um novo usuário', () => {
    cy.createUser(payload.dataUser, 201);
  });

  it('Tentar cadastrar um usuário já existente', () => {
    cy.createUser(payload.dataUser, 400).then((res) => {
      expect(res.body.message).to.eq('Este email já está sendo usado');
    });
  });

  it('Tentar cadastrar sem nome', () => {
    cy.createUser(payload.emptyName, 400).then((res) => {
      expect(res.body.nome).to.eq('nome é obrigatório');
    });
  });

  it('Tentar cadastrar sem email', () => {
    cy.createUser(payload.emptyEmail, 400).then((res) => {
      expect(res.body.email).to.eq('email é obrigatório');
    });
  });

  it('Tentar cadastrar sem password', () => {
    cy.createUser(payload.emptyPassword, 400).then((res) => {
      expect(res.body.password).to.eq('password é obrigatório');
    });
  });

  it('Tentar cadastrar sem administrador', () => {
    cy.createUser(payload.emptyAdmin, 400).then((res) => {
      expect(res.body.administrador).to.deep.equal("administrador deve ser 'true' ou 'false'");
    });
  });

  it('Tentar cadastrar com dados totalmente vazios', () => {
    cy.createUser(payload.emptyDataUser, 400).then((res) => {
      expect(res.body.nome).to.eq('nome não pode ficar em branco');
      expect(res.body.email).to.eq('email não pode ficar em branco');
      expect(res.body.password).to.eq('password não pode ficar em branco');
      expect(res.body.administrador).to.eq("administrador deve ser 'true' ou 'false'");
    });
  });
});
