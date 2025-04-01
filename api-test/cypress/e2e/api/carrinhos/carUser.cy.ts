/// <reference types="cypress" />
import { payload } from '../../fixtures/user';
import { carProduct } from '../../fixtures/products';

describe('Cenário 2: Fluxo de criação de um carrinho', () => {
  let token: string;
  let produto1Id: string;
  let produto2Id: string;

  it('Deve realizar todo o fluxo de carrinho com sucesso', () => {
    // Etapa 1: Verificar se o usuário já existe
    cy.api({ method: 'GET', url: '/usuarios' })
      .then((resGetUsers) => {
        const usuarioExistente = resGetUsers.body.usuarios.find(
          (u) => u.email.toLowerCase() === payload.CarUser.email.toLowerCase(),
        );

        if (usuarioExistente) {
          cy.log(`Usuário já existe. ID: ${usuarioExistente._id}`);

          // Login para obter o token e cancelar o carrinho se existir
          return cy
            .api({
              method: 'POST',
              url: '/login',
              body: {
                email: payload.CarUser.email,
                password: payload.CarUser.password,
              },
              failOnStatusCode: false,
            })
            .then((resLogin) => {
              token = resLogin.body.authorization;

              // Cancela carrinho antes de excluir usuário
              return cy
                .api({
                  method: 'DELETE',
                  url: '/carrinhos/cancelar-compra',
                  headers: { Authorization: token },
                  failOnStatusCode: true,
                })
                .then(() => {
                  cy.log('Carrinho cancelado com sucesso');

                  // Agora exclui o usuário
                  return cy
                    .api({
                      method: 'DELETE',
                      url: `/usuarios/${usuarioExistente._id}`,
                      failOnStatusCode: false,
                    })
                    .then((resDeleteUser) => {
                      expect(resDeleteUser.status).to.eq(200);
                      cy.log('Usuário excluído com sucesso');
                    });
                });
            });
        }
      })
      .then(() => {
        // Etapa 2: Cadastrar novo usuário
        cy.api({
          method: 'POST',
          url: '/usuarios',
          body: payload.CarUser,
          failOnStatusCode: false,
        }).then((resUser) => {
          expect(resUser.status).to.eq(201);
          expect(resUser.body.message).to.eq('Cadastro realizado com sucesso');
          cy.log('Usuário cadastrado com sucesso');

          // Etapa 3: Login para obter token
          cy.api({
            method: 'POST',
            url: '/login',
            body: {
              email: payload.CarUser.email,
              password: payload.CarUser.password,
            },
            failOnStatusCode: false,
          }).then((resLogin) => {
            expect(resLogin.status).to.eq(200);
            expect(resLogin.body.message).to.eq('Login realizado com sucesso');
            token = resLogin.body.authorization;
            cy.log('Login realizado com sucesso');

            // Etapa 4: Verifica se os produtos já existem e remove, depois cadastra
            cy.api({
              method: 'GET',
              url: '/produtos',
              failOnStatusCode: false,
            }).then((resProdutos) => {
              const produtos = resProdutos.body.produtos;

              const existente1 = produtos.find(
                (p) => p.nome.toLowerCase() === carProduct.dataProduct_1.nome.toLowerCase(),
              );
              const existente2 = produtos.find(
                (p) => p.nome.toLowerCase() === carProduct.dataProduct_2.nome.toLowerCase(),
              );

              const deletarSeExistir = (produto, label) => {
                if (produto) {
                  cy.log(`Produto \"${label}\" já existe. Excluindo ID: ${produto._id}`);
                  return cy
                    .api({
                      method: 'DELETE',
                      url: `/produtos/${produto._id}`,
                      headers: { Authorization: token },
                      failOnStatusCode: false,
                    })
                    .then((resDel) => {
                      expect(resDel.status).to.eq(200);
                      expect(resDel.body.message).to.eq('Registro excluído com sucesso');
                      cy.log(`Produto \"${label}\" removido com sucesso`);
                    });
                }
                return cy.wrap(null);
              };

              deletarSeExistir(existente1, carProduct.dataProduct_1.nome).then(() => {
                cy.api({
                  method: 'POST',
                  url: '/produtos',
                  headers: { Authorization: token },
                  body: carProduct.dataProduct_1,
                  failOnStatusCode: false,
                }).then((resProd1) => {
                  expect(resProd1.status).to.eq(201);
                  expect(resProd1.body.message).to.eq('Cadastro realizado com sucesso');

                  produto1Id = resProd1.body._id;
                  cy.log('Produto 1 cadastrado: ' + produto1Id);

                  deletarSeExistir(existente2, carProduct.dataProduct_2.nome).then(() => {
                    cy.api({
                      method: 'POST',
                      url: '/produtos',
                      headers: { Authorization: token },
                      body: carProduct.dataProduct_2,
                      failOnStatusCode: false,
                    }).then((resProd2) => {
                      expect(resProd2.status).to.eq(201);
                      expect(resProd2.body.message).to.eq('Cadastro realizado com sucesso');

                      produto2Id = resProd2.body._id;
                      cy.log('Produto 2 cadastrado: ' + produto2Id);

                      // Etapa 5: Criar carrinho
                      const bodyCarrinho = {
                        produtos: [
                          { idProduto: produto1Id, quantidade: 1 },
                          { idProduto: produto2Id, quantidade: 1 },
                        ],
                      };

                      cy.api({
                        method: 'POST',
                        url: '/carrinhos',
                        headers: { Authorization: token },
                        body: bodyCarrinho,
                        failOnStatusCode: false,
                      }).then((resCarrinho) => {
                        expect(resCarrinho.status).to.eq(201);
                        expect(resCarrinho.body.message).to.eq('Cadastro realizado com sucesso');

                        cy.log('Produtos adicionados no carrinho');

                        // Etapa 6: Finalizar compra (concluir o carrinho)
                        cy.api({
                          method: 'DELETE',
                          url: '/carrinhos/concluir-compra',
                          headers: { Authorization: token },
                          failOnStatusCode: false,
                        }).then((resFinalizar) => {
                          expect(resFinalizar.status).to.eq(200);
                          expect(resFinalizar.body.message).to.include(
                            'Registro excluído com sucesso',
                          );
                          cy.log('Compra finalizada com sucesso');

                          // Etapa extra: Validar que o carrinho foi realmente excluído
                          cy.api({
                            method: 'GET',
                            url: '/carrinhos',
                            headers: { Authorization: token },
                            failOnStatusCode: false,
                          }).then((resCarrinhoGet) => {
                            expect(resCarrinhoGet.status).to.eq(200);
                          });

                          // Etapa 7: Validar que o estoque foi reduzido
                          cy.api({
                            method: 'GET',
                            url: '/produtos',
                            failOnStatusCode: false,
                          }).then((resGet) => {
                            const produtos = resGet.body.produtos;

                            const prod1 = produtos.find((p) => p._id === produto1Id);
                            const prod2 = produtos.find((p) => p._id === produto2Id);

                            expect(prod1.quantidade).to.eq(carProduct.dataProduct_1.quantidade - 1);
                            expect(prod2.quantidade).to.eq(carProduct.dataProduct_2.quantidade - 1);

                            cy.log('Estoque atualizado corretamente');
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
      }); //then
  });
});
