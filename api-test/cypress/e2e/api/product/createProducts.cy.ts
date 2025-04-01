/// <reference types="cypress" />
import { payload } from '../../fixtures/user';
import { carProduct } from '../../fixtures/products';

// describe('Fluxo completo: Cadastro de usuário, login e dois produtos', () => {
//   let token: string;
//   let idUser: string;

//   before(() => {
//     cy.api({
//       method: 'GET',
//       url: '/usuarios',
//       failOnStatusCode: false,
//     }).then((res) => {
//       expect(res.status).to.eq(200);

//       const users = res.body.usuarios;

//       const usuarioExistente = users.find(
//         (u) => u.email.toLowerCase() === payload.CarUser.email.toLowerCase(),
//       );

//       if (usuarioExistente) {
//         idUser = usuarioExistente._id;
//         cy.log(`Usuário existente encontrado: ${idUser}`);

//         cy.api({
//           method: 'DELETE',
//           url: `/usuarios/${idUser}`,
//           failOnStatusCode: false,
//         }).then((resDelete) => {
//           if (resDelete.status === 200) {
//             cy.log('Usuário deletado com sucesso.');
//           } else if (resDelete.status === 400) {
//             cy.log('Usuário não pode ser deletado. Talvez tenha carrinho ativo ou outro vínculo.');
//           } else {
//             cy.log(`Erro inesperado ao deletar usuário. Status: ${resDelete.status}`);
//           }
//         });
//       } else {
//         cy.log('Usuário não existe. Nenhuma exclusão necessária.');
//       }
//     });
//   });

//   it('Deve cadastrar um novo usuário com sucesso', () => {
//     cy.api({
//       method: 'POST',
//       url: '/usuarios',
//       body: payload.CarUser,
//       failOnStatusCode: false,
//     }).then((res) => {
//       console.log('RESPOSTA CADASTRO USUÁRIO:', res.status, res.body);
//       expect(res.status).to.eq(201);
//       expect(res.body.message).to.eq('Cadastro realizado com sucesso');
//     });
//   });

//   describe('Cadastro de produtos dois Produtos', () => {
//     before(() => {
//       // LOGIN PARA OBTER TOKEN
//       cy.api({
//         method: 'POST',
//         url: '/login',
//         body: {
//           email: payload.CarUser.email,
//           password: payload.CarUser.password,
//         },
//         failOnStatusCode: false,
//       }).then((res) => {
//         expect(res.status).to.eq(200);
//         token = res.body.authorization;
//         cy.log('Login realizado com sucesso.');
//       });
//     });

//     before(() => {
//       // DELETANDO PRODUTOS SE JÁ EXISTIREM
//       cy.api({
//         method: 'GET',
//         url: '/produtos',
//       }).then((res) => {
//         const produtos = res.body.produtos;

//         const produto1 = produtos.find(
//           (p) => p.nome.toLowerCase() === carProduct.dataProduct_1.nome.toLowerCase(),
//         );

//         const produto2 = produtos.find(
//           (p) => p.nome.toLowerCase() === carProduct.dataProduct_2.nome.toLowerCase(),
//         );

//         if (produto1) {
//           cy.log(`Produto 1 encontrado: ${produto1._id}`);
//           // EXCLUINDO O PRIMEIRO PRODUTO
//           cy.api({
//             method: 'DELETE',
//             url: `/produtos/${produto1._id}`,
//             headers: { Authorization: token },
//           }).then((res) => {
//             expect(res.status).to.eq(200);
//             cy.log('Produto 1 excluído.');
//           });
//         }

//         if (produto2) {
//           cy.log(`Produto 2 encontrado: ${produto2._id}`);
//           // EXCLUINDO O PRIMEIRO PRODUTO
//           cy.api({
//             method: 'DELETE',
//             url: `/produtos/${produto2._id}`,
//             headers: { Authorization: token },
//             failOnStatusCode: false,
//           }).then((res) => {
//             expect(res.status).to.eq(200);
//             cy.log('Produto 2 excluído.');
//           });
//         }
//       });
//     });

//     it('Deve cadastrar o produto 1 com sucesso', () => {
//       // CADASTRANDO O PRIMEIRO PRODUTO
//       cy.api({
//         method: 'POST',
//         url: '/produtos',
//         headers: { Authorization: token },
//         body: carProduct.dataProduct_1,
//         failOnStatusCode: false,
//       }).then((res) => {
//         console.log('RESPOSTA PRODUTO 1:', res.body);
//         expect(res.status).to.eq(201);
//         expect(res.body.message).to.eq('Cadastro realizado com sucesso');
//       });
//     });

//     it('Deve cadastrar o produto 2 com sucesso', () => {
//       // CADASTRANDO O SEGUNDO PRODUTO
//       cy.api({
//         method: 'POST',
//         url: '/produtos',
//         headers: { Authorization: token },
//         body: carProduct.dataProduct_2,
//         failOnStatusCode: false,
//       }).then((res) => {
//         expect(res.status).to.eq(201);
//         expect(res.body.message).to.eq('Cadastro realizado com sucesso');
//       });
//     });
//   });
// });

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
