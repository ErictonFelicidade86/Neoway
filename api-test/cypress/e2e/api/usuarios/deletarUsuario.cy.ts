/// <reference types="cypress" />
import { invalidIds } from '../../fixtures/invalidID';

describe('DELETE com Sucesso', () => {
  let idUser: string;
  let nomeUsuario: string;

  before(() => {
    cy.api({
      method: 'GET',
      url: '/usuarios',
    }).then((res) => {
      expect(res.status).to.eq(200);

      const usuarios = res.body.usuarios;

      // Seleciona um usuário aleatório da lista
      const usuarioAleatorio = usuarios[Math.floor(Math.random() * usuarios.length)];

      expect(usuarioAleatorio).to.not.be.undefined;
      idUser = usuarioAleatorio._id;
      nomeUsuario = usuarioAleatorio.nome;

      console.log(`Usuário selecionado: ${nomeUsuario}`);
      console.log(`ID capturado: ${idUser}`);
    });
  });

  it('Deve excluir o usuário selecionado aleatoriamente com sucesso', () => {
    expect(idUser).to.not.be.undefined;

    cy.api({
      method: 'DELETE',
      url: `/usuarios/${idUser}`,
      failOnStatusCode: false,
    }).then((res) => {
      console.log(`Usuário excluído: ${nomeUsuario} (ID: ${idUser})`);
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Registro excluído com sucesso');
    });
  });
});

describe('DELETE id invalidos', () => {
  it('Tentar excluir sem passar o id', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${invalidIds.empty}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(405);
      expect(res.body.message).to.eq(
        'Não é possível realizar DELETE em /usuarios/. Acesse https://serverest.dev para ver as rotas disponíveis e como utilizá-las.',
      );
    });
  });
  it('Tentar excluir um id tipo Nulo', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${invalidIds.nullValue}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Nenhum registro excluído');
    });
  });

  it('Tentar excluir um id do tipo Number', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${invalidIds.number}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Nenhum registro excluído');
    });
  });
  it('Tentar excluir um id do tipo boolean', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${invalidIds.boolean}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Nenhum registro excluído');
    });
  });

  it('Tentar excluir um id do tipo Caracter Especial', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${invalidIds.specialChars}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Nenhum registro excluído');
    });
  });

  it('Tentar excluir um id do tipo curto', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${invalidIds.tooShort}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Nenhum registro excluído');
    });
  });
  it('Tentar excluir um id do tipo extra grande', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${invalidIds.tooLong}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Nenhum registro excluído');
    });
  });
  it('Tentar excluir um id do tipo alfanumerico', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${invalidIds.malformed}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Nenhum registro excluído');
    });
  });
  it('Tentar excluir um id do tipo underfined', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${invalidIds.undefinedValue}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Nenhum registro excluído');
    });
  });
  it('Tentar excluir um id já excluido', () => {
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${invalidIds.deletedId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Nenhum registro excluído');
    });
  });
});
