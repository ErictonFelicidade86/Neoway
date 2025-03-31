/// <reference types="cypress" />
import { payload } from "../../fixtures/user"

describe('GET', () => {
    let idUser: string;

    before(() => {
        cy.api({
            method: 'GET',
            url: '/usuarios',
        }).then((res) => {
            expect(res.status).to.eq(200);
            const user = res.body.usuarios;
            const userEricton = user.find((u) => u.nome === 'Ericton Brito');
            expect(userEricton).to.not.be.undefined;

            if (userEricton) {
            idUser = userEricton._id;
            console.log(`ID capturado no before(): ${idUser}`);
            }
        });
    });
    it('Deve excluir o usuário com existente', () => {
        expect(idUser).to.not.be.undefined;

        cy.api({
            method: 'DELETE',
            url: `/usuarios/${idUser}`,
        }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.message).to.eq('Registro excluído com sucesso');
        });
    });
});


describe("POST", ()=> {
    it('Dev cadastrar um novo usuário', () => {
        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: payload.dataUser,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(201)
        })
    });
    it('Tentar cadastrar um usuário que já foi cadastrado', () => {
        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: payload.dataUser,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.message).to.eq('Este email já está sendo usado');
        })
    });
    it('Tentar cadastrar um usuário sem informar o nome', () => {
        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: payload.emptyName,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.nome).to.eq('nome é obrigatório');
        })
    });
    it('Tentar cadastrar um usuário sem informar o email', () => {
        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: payload.emptyEmail,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.email).to.eq('email é obrigatório');
        })
    });
    it('Tentar cadastrar um usuário sem informar o password', () => {
        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: payload.emptyPassword,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.password).to.eq('password é obrigatório');
        })
    });
    it('Tentar cadastrar um usuário sem informar o Administrador', () => {
        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: payload.emptyAdmin,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.administrador).to.deep.equal("administrador deve ser 'true' ou 'false'");
        })
    });
    it('Tentar cadastrar um usuário sem informar dados', () => {
        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: payload.emptyDataUser,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.nome).to.eq('nome não pode ficar em branco');
            expect(res.body.email).to.eq('email não pode ficar em branco');
            expect(res.body.password).to.eq('password não pode ficar em branco');
            expect(res.body.administrador).to.eq("administrador deve ser 'true' ou 'false'");
        })
    });
});