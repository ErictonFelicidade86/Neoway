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
