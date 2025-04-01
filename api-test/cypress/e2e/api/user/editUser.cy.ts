/// <reference types="cypress" />
import { payload } from '../../fixtures/user';
import { invalidIds } from '../../fixtures/invalidID';

describe('PUT - Edição de usuário com sucesso', () => {
  let idUser: string;

  before(() => {
    cy.getRandomUserId().then((id) => (idUser = id));
  });

  it('Deve alterar um cadastro com sucesso', () => {
    cy.getFakeEmail().then((emailGerado) => {
      const payloadEdit = { ...payload.dataEdit, email: emailGerado };
      cy.editUser(idUser, payloadEdit, 200, {
        message: 'Registro alterado com sucesso',
      });
    });
  });
});

describe('PUT - Edição com ID válidos e Body Inválidos', () => {
  let idUser: string;
  before(() => {
    cy.getRandomUserId().then((id) => (idUser = id));
  });

  it('Sem nome', () => {
    cy.editUser(idUser, payload.emptyName, 400, { nome: 'nome é obrigatório' });
  });

  it('Sem email', () => {
    cy.editUser(idUser, payload.emptyEmail, 400, { email: 'email é obrigatório' });
  });

  it('Sem senha', () => {
    cy.editUser(idUser, payload.emptyPassword, 400, { password: 'password é obrigatório' });
  });

  it('Sem administrador', () => {
    cy.editUser(idUser, payload.emptyAdmin, 400, {
      administrador: "administrador deve ser 'true' ou 'false'",
    });
  });

  it('Sem dados', () => {
    cy.editUser(idUser, payload.emptyDataUser, 400, {
      nome: 'nome não pode ficar em branco',
      email: 'email não pode ficar em branco',
      password: 'password não pode ficar em branco',
      administrador: "administrador deve ser 'true' ou 'false'",
    });
  });

  it('Body vazio', () => {
    cy.editUser(idUser, payload.isEmpty, 400, {
      nome: 'nome é obrigatório',
      email: 'email é obrigatório',
      password: 'password é obrigatório',
      administrador: 'administrador é obrigatório',
    });
  });
});

describe('PUT - Edição com ID inválidos e Body Válidos', () => {
  const ids = [
    { id: invalidIds.empty, expectedStatus: 405, expectedMessage: 'Não é possível realizar PUT em /usuarios/.' },
    { id: invalidIds.nullValue, expectedStatus: 400 },
    { id: invalidIds.number, expectedStatus: 400 },
    { id: invalidIds.boolean, expectedStatus: 400 },
    { id: invalidIds.specialChars, expectedStatus: 400 },
    { id: invalidIds.tooShort, expectedStatus: 400 },
    { id: invalidIds.tooLong, expectedStatus: 400 },
    { id: invalidIds.malformed, expectedStatus: 400 },
    { id: invalidIds.undefinedValue, expectedStatus: 400 },
    { id: invalidIds.deletedId, expectedStatus: 400 },
  ];

  ids.forEach(({ id, expectedStatus, expectedMessage }) => {
    it(`Deve falhar ao editar com ID inválido: ${id}`, () => {
      cy.getFakeEmail().then((email) => {
        const payloadEdit = { ...payload.dataEdit, email };
        cy.api({
          method: 'PUT',
          url: `/usuarios/${id}`,
          body: payloadEdit,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.not.eq(201); // nunca deve ser sucesso
          expect(res.status).to.eq(expectedStatus);

          if (expectedMessage) {
            expect(res.body.message).to.include(expectedMessage);
          }
        });
      });
    });
  });
});

describe('PUT - Edição com ID Inválidos e Body Inválidos', () => {
  it('ID vazio + body sem nome', () => {
    cy.editUser(invalidIds.empty, payload.emptyName, 405, {
      message: 'Não é possível realizar PUT em /usuarios/. Acesse https://serverest.dev para ver as rotas disponíveis e como utilizá-las.',
    });
  });

  it('ID nulo + sem email', () => {
    cy.editUser(invalidIds.nullValue, payload.emptyEmail, 400, {
      email: 'email é obrigatório',
    });
  });

  it('ID número + sem password', () => {
    cy.editUser(invalidIds.number, payload.emptyPassword, 400, {
      password: 'password é obrigatório',
    });
  });

  it('ID boolean + sem admin', () => {
    cy.editUser(invalidIds.boolean, payload.emptyAdmin, 400, {
      administrador: "administrador deve ser 'true' ou 'false'",
    });
  });

  it('ID excluído + sem dados', () => {
    cy.editUser(invalidIds.deletedId, payload.emptyDataUser, 400, {
      nome: 'nome não pode ficar em branco',
      email: 'email não pode ficar em branco',
      password: 'password não pode ficar em branco',
      administrador: "administrador deve ser 'true' ou 'false'",
    });
  });

  it('ID undefined + body vazio', () => {
    cy.editUser(invalidIds.undefinedValue, payload.isEmpty, 400, {
      nome: 'nome é obrigatório',
      email: 'email é obrigatório',
      password: 'password é obrigatório',
      administrador: 'administrador é obrigatório',
    });
  });
});
