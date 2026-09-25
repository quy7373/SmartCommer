describe('Landing Page (Cypress System Test)', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('renders header, brand, and categories', () => {
        cy.get('header').should('be.visible');
        cy.contains('span', 'Smart Commerce').should('be.visible');

        // Check category buttons
        cy.contains('button', 'Lighting').should('be.visible');
        cy.contains('button', 'Apparel').should('be.visible');
        cy.contains('button', 'Kitchen').should('be.visible');

        // Check featured product
        cy.contains('Ash Table Lamp').should('be.visible');
    });

    it('navigates from landing page to login page', () => {
        cy.contains('a', 'Login').click();
        cy.url().should('include', '/login');
        cy.contains('h1', 'Sign in').should('be.visible');
    });
});

