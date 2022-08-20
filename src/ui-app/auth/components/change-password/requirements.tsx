export default [
    { re: /[0-9]/, label: 'Includes number', id: 'include-numbers' },
    { re: /[a-z]/, label: 'Includes lowercase letter', id: 'include-lowercase' },
    { re: /[A-Z]/, label: 'Includes uppercase letter', id: 'include-uppercase' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol', id: 'include-special' },
];
