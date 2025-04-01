/// <reference types="cypress" />

//CUSTOM COMMANDS CRIANDO O USUÁRIO
Cypress.Commands.add('getUserByName', (name) => {
  cy.api({
    method: 'GET',
    url: '/usuarios',
  }).then((res) => {
    expect(res.status).to.eq(200);
    const user = res.body.usuarios.find((u) => u.nome === name);
    expect(user, `Usuário ${name} encontrado`).to.not.be.undefined;
    return user;
  });
});

Cypress.Commands.add('deleteUserById', (id) => {
  cy.api({
    method: 'DELETE',
    url: `/usuarios/${id}`,
  }).then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body.message).to.eq('Registro excluído com sucesso');
  });
});

Cypress.Commands.add('createUser', (userData, expectedStatus = 201) => {
  cy.api({
    method: 'POST',
    url: '/usuarios',
    body: userData,
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(expectedStatus);
    return res;
  });
});

// DELETANDO USUÁRIO
Cypress.Commands.add('getRandomUser', () => {
  cy.api({
    method: 'GET',
    url: '/usuarios',
  }).then((res) => {
    expect(res.status).to.eq(200);

    const usuarios = res.body.usuarios;
    const usuarioAleatorio = usuarios[Math.floor(Math.random() * usuarios.length)];
    expect(usuarioAleatorio).to.not.be.undefined;

    return usuarioAleatorio;
  });
});

Cypress.Commands.add('deleteUserById', (id: string, expectedStatus: number = 200, expectedMessage?: string) => {
  cy.api({
    method: 'DELETE',
    url: `/usuarios/${id}`,
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(expectedStatus);
    if (expectedMessage) {
      expect(res.body.message).to.eq(expectedMessage);
    }
    return res;
  });
});

// EDITANDO USUÁRIOS
Cypress.Commands.add('getRandomUserId', () => {
  cy.api({ method: 'GET', url: '/usuarios' }).then((res) => {
    expect(res.status).to.eq(200);
    const usuarios = res.body.usuarios;
    const usuarioAleatorio = usuarios[Math.floor(Math.random() * usuarios.length)];
    expect(usuarioAleatorio).to.exist;
    return usuarioAleatorio._id;
  });
});

Cypress.Commands.add('getFakeEmail', () => {
  cy.api(Cypress.env('fakeBaseUrl')).then((res) => {
    return res.body.data[0].email;
  });
});

Cypress.Commands.add('editUser', (id, body, expectedStatus, expectedFields = {}) => {
  cy.api({
    method: 'PUT',
    url: `/usuarios/${id}`,
    body,
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(expectedStatus);
    for (const [key, value] of Object.entries(expectedFields)) {
      expect(res.body[key]).to.eq(value);
    }
    return res;
  });
});




// CRIANDO PRODUTOS
// FLUXO DE CRIAÇÃO DO CARRINHO