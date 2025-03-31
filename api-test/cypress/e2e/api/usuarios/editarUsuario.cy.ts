/// <reference types="cypress" />
import { payload } from "../../fixtures/user";
import { invalidIds } from "../../fixtures/invalidID"

describe('PUT - Edição de usuário com sucesso', () => {
  let idUser: string;

  before(() => {
    cy.api({
      method: 'GET',
      url: '/usuarios',
    }).then((res) => {
      expect(res.status).to.eq(200);

      const usuarios = res.body.usuarios;
      const usuarioAleatorio = usuarios[Math.floor(Math.random() * usuarios.length)];

      expect(usuarioAleatorio).to.exist;
      idUser = usuarioAleatorio._id;

      cy.log(`ID selecionado para edição: ${idUser}`);
    });
  });

  it('Deve alterar um cadastro com sucesso', () => {
    expect(idUser).to.be.a('string');

    cy.api(`${Cypress.env('fakeBaseUrl')}`).then((response) => {
      const emailGerado = response.body.data[0].email;

      // Atualiza apenas o e-mail no payload existente
      const payloadEdit = {
        ...payload.dataEdit,
        email: emailGerado
      };

      cy.log(`Email gerado: ${emailGerado}`);

      cy.api({
        method: 'PUT',
        url: `/usuarios/${idUser}`,
        body: payloadEdit,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('Registro alterado com sucesso');
      });
    });
  });
});

describe('PUT - Edição com ID válidos e Body Inválidos', () => {
    let idUser: string;
    before(() => {
      cy.api({
        method: 'GET',
        url: '/usuarios',
      }).then((res) => {
        expect(res.status).to.eq(200);

        const usuarios = res.body.usuarios;
        const usuarioAleatorio = usuarios[Math.floor(Math.random() * usuarios.length)];

        expect(usuarioAleatorio).to.exist;
        idUser = usuarioAleatorio._id;

        cy.log(`ID selecionado para edição: ${idUser}`);
      });
  });
  it('Tentar Alterar um ID válido e um body sem nome', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${idUser}`,
      body: payload.emptyName,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.nome).to.eq("nome é obrigatório")
    })
  })
  it('Tentar Alterar um ID válido e um body sem email', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${idUser}`,
      body: payload.emptyEmail,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.email).to.eq("email é obrigatório")
    })
  })
  it('Tentar Alterar um ID válido e um body sem password', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${idUser}`,
      body: payload.emptyPassword,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.password).to.eq("password é obrigatório")
    })
  })
  it('Tentar Alterar um ID válido e um body sem o Administrador', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${idUser}`,
      body: payload.emptyAdmin,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.administrador).to.eq("administrador deve ser 'true' ou 'false'")
    })
  })
  it('Tentar Alterar um ID válido e um body sem dados', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${idUser}`,
      body: payload.emptyDataUser,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.nome).to.eq("nome não pode ficar em branco")
      expect(res.body.email).to.eq("email não pode ficar em branco")
      expect(res.body.password).to.eq("password não pode ficar em branco")
      expect(res.body.administrador).to.eq("administrador deve ser 'true' ou 'false'")
    })
  });
  it('Tentar Alterar um ID válido e um body vazio', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${idUser}`,
      body: payload.isEmpty,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.nome).to.eq("nome é obrigatório")
      expect(res.body.email).to.eq("email é obrigatório")
      expect(res.body.password).to.eq("password é obrigatório")
      expect(res.body.administrador).to.eq("administrador é obrigatório")
    })
  });
});

describe('PUT - Edição com ID inválidos e Body Válidos', () => {

  it('Tentar Alterar um ID vazio e um body válido', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${invalidIds.empty}`,
      body: payload.dataUser,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(405)
      expect(res.body.message).to.eq("Não é possível realizar PUT em /usuarios/. Acesse https://serverest.dev para ver as rotas disponíveis e como utilizá-las.")
    })
  })
  it('Tentar Alterar um ID nulo e um body válido', ()=> {

    cy.api(`${Cypress.env('fakeBaseUrl')}`).then((response) => {
      const emailGerado = response.body.data[0].email;

      // Atualiza apenas o e-mail no payload existente
      const payloadEdit = {
        ...payload.dataEdit,
        email: emailGerado
      };

      cy.log(`Email gerado: ${emailGerado}`);

      cy.api({
        method: 'PUT',
        url: `/usuarios/${invalidIds.nullValue}`,
        body: payloadEdit,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq("Este email já está sendo usado")
      });
    });
  });
  it('Tentar Alterar um ID tipo número e um body válido', ()=> {

    cy.api(`${Cypress.env('fakeBaseUrl')}`).then((response) => {
      const emailGerado = response.body.data[0].email;

      // Atualiza apenas o e-mail no payload existente
      const payloadEdit = {
        ...payload.dataEdit,
        email: emailGerado
      };

      cy.log(`Email gerado: ${emailGerado}`);

      cy.api({
        method: 'PUT',
        url: `/usuarios/${invalidIds.number}`,
        body: payloadEdit,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq("Este email já está sendo usado")
      });
    });
  });
  it('Tentar Alterar um ID do tipo boolean e um body válido', ()=> {

    cy.api(`${Cypress.env('fakeBaseUrl')}`).then((response) => {
      const emailGerado = response.body.data[0].email;

      // Atualiza apenas o e-mail no payload existente
      const payloadEdit = {
        ...payload.dataEdit,
        email: emailGerado
      };

      cy.log(`Email gerado: ${emailGerado}`);

      cy.api({
        method: 'PUT',
        url: `/usuarios/${invalidIds.boolean}`,
        body: payloadEdit,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq("Este email já está sendo usado")
      });
    });
  });
  it('Tentar Alterar um ID tipo caracter especial e um body válido', ()=> {

    cy.api(`${Cypress.env('fakeBaseUrl')}`).then((response) => {
      const emailGerado = response.body.data[0].email;

      // Atualiza apenas o e-mail no payload existente
      const payloadEdit = {
        ...payload.dataEdit,
        email: emailGerado
      };

      cy.log(`Email gerado: ${emailGerado}`);

      cy.api({
        method: 'PUT',
        url: `/usuarios/${invalidIds.specialChars}`,
        body: payloadEdit,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq("Este email já está sendo usado")
      });
    });
  });
  it('Tentar Alterar um ID tipo curto e um body válido', ()=> {

    cy.api(`${Cypress.env('fakeBaseUrl')}`).then((response) => {
      const emailGerado = response.body.data[0].email;

      // Atualiza apenas o e-mail no payload existente
      const payloadEdit = {
        ...payload.dataEdit,
        email: emailGerado
      };

      cy.log(`Email gerado: ${emailGerado}`);

      cy.api({
        method: 'PUT',
        url: `/usuarios/${invalidIds.tooShort}`,
        body: payloadEdit,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq("Este email já está sendo usado")
      });
    });
  });
  it('Tentar Alterar um ID tipo extra grande e um body válido', ()=> {

    cy.api(`${Cypress.env('fakeBaseUrl')}`).then((response) => {
      const emailGerado = response.body.data[0].email;

      // Atualiza apenas o e-mail no payload existente
      const payloadEdit = {
        ...payload.dataEdit,
        email: emailGerado
      };

      cy.log(`Email gerado: ${emailGerado}`);

      cy.api({
        method: 'PUT',
        url: `/usuarios/${invalidIds.tooLong}`,
        body: payloadEdit,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq("Este email já está sendo usado")
      });
    });
  });
  it('Tentar Alterar um ID tipo alfanumerico e um body válido', ()=> {

    cy.api(`${Cypress.env('fakeBaseUrl')}`).then((response) => {
      const emailGerado = response.body.data[0].email;

      // Atualiza apenas o e-mail no payload existente
      const payloadEdit = {
        ...payload.dataEdit,
        email: emailGerado
      };

      cy.log(`Email gerado: ${emailGerado}`);

      cy.api({
        method: 'PUT',
        url: `/usuarios/${invalidIds.malformed}`,
        body: payloadEdit,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq("Este email já está sendo usado")
      });
    });
  });
  it('Tentar Alterar um ID tipo underfined e um body válido', ()=> {

    cy.api(`${Cypress.env('fakeBaseUrl')}`).then((response) => {
      const emailGerado = response.body.data[0].email;

      // Atualiza apenas o e-mail no payload existente
      const payloadEdit = {
        ...payload.dataEdit,
        email: emailGerado
      };

      cy.log(`Email gerado: ${emailGerado}`);

      cy.api({
        method: 'PUT',
        url: `/usuarios/${invalidIds.undefinedValue}`,
        body: payloadEdit,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq("Este email já está sendo usado")
      });
    });
  });
  it('Tentar Alterar um ID já deletado e um body válido', ()=> {

    cy.api(`${Cypress.env('fakeBaseUrl')}`).then((response) => {
      const emailGerado = response.body.data[0].email;

      // Atualiza apenas o e-mail no payload existente
      const payloadEdit = {
        ...payload.dataEdit,
        email: emailGerado
      };

      cy.log(`Email gerado: ${emailGerado}`);

      cy.api({
        method: 'PUT',
        url: `/usuarios/${invalidIds.deletedId}`,
        body: payloadEdit,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq("Este email já está sendo usado")
      });
    });
  });
});

describe('PUT - Edição com ID Inválidos e Body Inválidos', () => {

  it('Tentar Alterar um ID vazio e um body sem nome', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${invalidIds.empty}`,
      body: payload.emptyName,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(405)
      expect(res.body.message).to.eq( "Não é possível realizar PUT em /usuarios/. Acesse https://serverest.dev para ver as rotas disponíveis e como utilizá-las.")
    })
  })
  it('Tentar Alterar um ID nulo e um body sem email', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${invalidIds.nullValue}`,
      body: payload.emptyEmail,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.email).to.eq("email é obrigatório")
    })
  })
  it('Tentar Alterar um ID tipo número e um body sem password', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${invalidIds.number}`,
      body: payload.emptyPassword,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.password).to.eq("password é obrigatório")
    })
  })
  it('Tentar Alterar um ID do tipo boolean um body sem o Administrador', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${invalidIds.boolean}`,
      body: payload.emptyAdmin,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.administrador).to.eq("administrador deve ser 'true' ou 'false'")
    })
  })
  it('Tentar Alterar um ID excluido e um body sem dados', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${invalidIds.deletedId}`,
      body: payload.emptyDataUser,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.nome).to.eq("nome não pode ficar em branco")
      expect(res.body.email).to.eq("email não pode ficar em branco")
      expect(res.body.password).to.eq("password não pode ficar em branco")
      expect(res.body.administrador).to.eq("administrador deve ser 'true' ou 'false'")
    })
  });
  it('Tentar Alterar um ID do tipo underfined e um body vazio', ()=> {
    cy.api({
      method: 'PUT',
      url: `/usuarios/${invalidIds.undefinedValue}`,
      body: payload.isEmpty,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.nome).to.eq("nome é obrigatório")
      expect(res.body.email).to.eq("email é obrigatório")
      expect(res.body.password).to.eq("password é obrigatório")
      expect(res.body.administrador).to.eq("administrador é obrigatório")
    })
  });
});