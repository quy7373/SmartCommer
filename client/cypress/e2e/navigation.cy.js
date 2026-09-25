describe('Navigation & Route Guards (Cypress System Test)', () => {
    it('redirects unauthenticated users from protected cart to /login', () => {
        cy.visit('/cart');
        cy.url().should('include', '/login');
    });

    it('redirects unauthenticated users from protected profile to /login', () => {
        cy.visit('/profile');
        cy.url().should('include', '/login');
    });

    it('redirects unauthenticated users from protected checkout to /login', () => {
        cy.visit('/checkout');
        cy.url().should('include', '/login');
    });

    it('renders 404 page for nonexistent routes', () => {
        cy.visit('/random-route-404-test');
        cy.contains('404 - Page Not Found').should('be.visible');
        cy.contains('a', 'Go back home').should('be.visible');
    });

    it('allows public access to benchmark page', () => {
        cy.visit('/benchmark');
        cy.contains(/Benchmark/i).should('be.visible');
    });
});

