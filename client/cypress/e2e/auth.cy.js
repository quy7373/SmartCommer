describe('Authentication Flows (Cypress System Test)', () => {
    it('validates empty inputs on login page', () => {
        cy.visit('/login');
        cy.get('h1').contains(/sign in/i).should('be.visible');

        cy.get('input[placeholder="name@email.com"]').should('be.visible');
        cy.get('input[placeholder="••••••••"]').should('be.visible');

        // Click submit
        cy.get('button[type="submit"]').click();
        cy.contains('Enter a valid email').should('be.visible');

        // Check forgot password link
        cy.contains('a', /forgot password\?/i).click();
        cy.url().should('include', '/forgot-password');
    });

    it('renders register form and allows navigating to login', () => {
        cy.visit('/register');
        cy.contains('Create your account').should('be.visible');

        cy.get('input[placeholder="Jordan Lee"]').should('be.visible');
        cy.get('input[placeholder="0901234567"]').should('be.visible');

        cy.contains('a', 'Sign in').click();
        cy.url().should('include', '/login');
    });

    it('submits forgot password request with email', () => {
        cy.visit('/forgot-password');
        cy.contains('h1', 'Forgot password').should('be.visible');

        cy.get('input[placeholder="name@email.com"]').type('cypress.test@example.com');
        cy.get('button[type="submit"]').should('be.visible');
    });
});

