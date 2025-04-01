/// <reference types="cypress" />
import { UserPayload, ProductPayload } from "./types/interface";
import { payload } from "../e2e/fixtures/user";
import { carProduct } from "../e2e/fixtures/products";

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
Cypress.Commands.add('deleteUserIfExists', (email: string) => {
  cy.api('GET', '/usuarios').then((res) => {
    const usuario = res.body.usuarios.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (usuario) {
      cy.api('DELETE', `/usuarios/${usuario._id}`, { failOnStatusCode: false });
    }
  });
});

Cypress.Commands.add('createUser', (user: UserPayload) => {
  cy.api('POST', '/usuarios', user).then((res) => {
    expect(res.status).to.eq(201);
    expect(res.body.message).to.eq('Cadastro realizado com sucesso');
  });
});

Cypress.Commands.add('loginUser', (email: string, password: string) => {
  return cy
    .api('POST', '/login', { email, password })
    .then((res) => {
      expect(res.status).to.eq(200);
      return res.body.authorization;
    });
});

Cypress.Commands.add('deleteProductIfExists', (nome: string, token: string) => {
  cy.api('GET', '/produtos').then((res) => {
    const produto = res.body.produtos.find(
      (p: any) => p.nome.toLowerCase() === nome.toLowerCase(),
    );

    if (produto) {
      cy.api({
        method: 'DELETE',
        url: `/produtos/${produto._id}`,
        headers: { Authorization: token },
        failOnStatusCode: false,
      });
    }
  });
});

Cypress.Commands.add('createProduct', (produto: ProductPayload, token: string) => {
  cy.api({
    method: 'POST',
    url: '/produtos',
    body: produto,
    headers: { Authorization: token },
  }).then((res) => {
    expect(res.status).to.eq(201);
    expect(res.body.message).to.eq('Cadastro realizado com sucesso');
  });
});

// FLUXO DE CRIAÇÃO DO CARRINHO

Cypress.Commands.add('criarFluxoCarrinhoCompleto', () => {
  let token: string;
  let produto1Id: string;
  let produto2Id: string;

  // Etapa 1: Verifica se usuário já existe
  cy.api({ method: 'GET', url: '/usuarios' }).then((resUsuarios) => {
    const usuario = resUsuarios.body.usuarios.find(
      (u) => u.email.toLowerCase() === payload.CarUser.email.toLowerCase()
    );

    const deletarUsuarioSeExistir = () => {
      if (!usuario) return cy.wrap(null);

      return cy.api({
        method: 'POST',
        url: '/login',
        body: {
          email: payload.CarUser.email,
          password: payload.CarUser.password
        }
      }).then((resLogin) => {
        token = resLogin.body.authorization;

        return cy.api({
          method: 'DELETE',
          url: '/carrinhos/cancelar-compra',
          headers: { Authorization: token }
        }).then(() => {
          return cy.api({
            method: 'DELETE',
            url: `/usuarios/${usuario._id}`
          }).then((resDelUser) => {
            expect(resDelUser.status).to.eq(200);
          });
        });
      });
    };

    deletarUsuarioSeExistir().then(() => {
      // Etapa 2: Cria usuário
      cy.api({
        method: 'POST',
        url: '/usuarios',
        body: payload.CarUser
      }).then((resCreate) => {
        expect(resCreate.status).to.eq(201);

        // Etapa 3: Login
        cy.api({
          method: 'POST',
          url: '/login',
          body: {
            email: payload.CarUser.email,
            password: payload.CarUser.password
          }
        }).then((resLogin) => {
          expect(resLogin.status).to.eq(200);
          token = resLogin.body.authorization;

          // Etapa 4: Verifica e remove produtos
          cy.api({ method: 'GET', url: '/produtos' }).then((resProdutos) => {
            const produtos = resProdutos.body.produtos;

            const existente1 = produtos.find((p) => p.nome.toLowerCase() === carProduct.dataProduct_1.nome.toLowerCase());
            const existente2 = produtos.find((p) => p.nome.toLowerCase() === carProduct.dataProduct_2.nome.toLowerCase());

            const deletarSeExistir = (produto) => {
              if (!produto) return cy.wrap(null);

              return cy.api({
                method: 'DELETE',
                url: `/produtos/${produto._id}`,
                headers: { Authorization: token }
              }).then((resDel) => {
                expect(resDel.status).to.eq(200);
              });
            };

            deletarSeExistir(existente1).then(() => {
              cy.api({
                method: 'POST',
                url: '/produtos',
                headers: { Authorization: token },
                body: carProduct.dataProduct_1
              }).then((resProd1) => {
                expect(resProd1.status).to.eq(201);
                produto1Id = resProd1.body._id;

                deletarSeExistir(existente2).then(() => {
                  cy.api({
                    method: 'POST',
                    url: '/produtos',
                    headers: { Authorization: token },
                    body: carProduct.dataProduct_2
                  }).then((resProd2) => {
                    expect(resProd2.status).to.eq(201);
                    produto2Id = resProd2.body._id;

                    // Etapa 5: Cria carrinho
                    cy.api({
                      method: 'POST',
                      url: '/carrinhos',
                      headers: { Authorization: token },
                      body: {
                        produtos: [
                          { idProduto: produto1Id, quantidade: 1 },
                          { idProduto: produto2Id, quantidade: 1 }
                        ]
                      }
                    }).then((resCarrinho) => {
                      expect(resCarrinho.status).to.eq(201);

                      // Etapa 6: Finaliza compra
                      cy.api({
                        method: 'DELETE',
                        url: '/carrinhos/concluir-compra',
                        headers: { Authorization: token }
                      }).then((resFinal) => {
                        expect(resFinal.status).to.eq(200);

                        // Etapa 7: Valida estoque atualizado
                        cy.api({ method: 'GET', url: '/produtos' }).then((resEstoque) => {
                          const produtos = resEstoque.body.produtos;
                          const prod1 = produtos.find((p) => p._id === produto1Id);
                          const prod2 = produtos.find((p) => p._id === produto2Id);

                          expect(prod1.quantidade).to.eq(carProduct.dataProduct_1.quantidade - 1);
                          expect(prod2.quantidade).to.eq(carProduct.dataProduct_2.quantidade - 1);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
