/// <reference types="cypress" />
import { invalidIds } from '../../fixtures/invalidID';

describe('DELETE com Sucesso', () => {
  let idUser: string;
  let nomeUsuario: string;

  before(() => {
    cy.getRandomUser().then((user) => {
      idUser = user._id;
      nomeUsuario = user.nome;
      console.log(`Usuário selecionado: ${nomeUsuario}`);
      console.log(`ID capturado: ${idUser}`);
    });
  });

  it('Deve excluir o usuário selecionado aleatoriamente com sucesso', () => {
    cy.deleteUserById(idUser, 200, 'Registro excluído com sucesso');
  });
});

describe('DELETE com IDs inválidos', () => {
  it('Tentar excluir sem passar o id', () => {
    cy.deleteUserById(invalidIds.empty, 405, 'Não é possível realizar DELETE em /usuarios/. Acesse https://serverest.dev para ver as rotas disponíveis e como utilizá-las.');
  });

  const idsInvalidos = [
    { id: invalidIds.nullValue, mensagem: 'Nenhum registro excluído' },
    { id: invalidIds.number, mensagem: 'Nenhum registro excluído' },
    { id: invalidIds.boolean, mensagem: 'Nenhum registro excluído' },
    { id: invalidIds.specialChars, mensagem: 'Nenhum registro excluído' },
    { id: invalidIds.tooShort, mensagem: 'Nenhum registro excluído' },
    { id: invalidIds.tooLong, mensagem: 'Nenhum registro excluído' },
    { id: invalidIds.malformed, mensagem: 'Nenhum registro excluído' },
    { id: invalidIds.undefinedValue, mensagem: 'Nenhum registro excluído' },
    { id: invalidIds.deletedId, mensagem: 'Nenhum registro excluído' },
  ];

  idsInvalidos.forEach((item) => {
    it(`Tentar excluir ID inválido: ${item.id}`, () => {
      cy.deleteUserById(item.id, 200, item.mensagem);
    });
  });
});
