
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');


describe('index.html', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    })

    describe('head', () => {
        test('it has a title', () => {
            const head = document.querySelector('head')
            expect(head).toBeTruthy();
            expect(head.textContent).toContain('Gossip Girls');
        });

        test('it is linked to a CSS stylesheet', () => {
            const head = document.querySelector('head')
            expect(head.innerHTML).toContain('link rel=\"stylesheet\"');
        })
    })

    describe('body', () => {
        test('header exists', () => {
            expect(document.querySelector('header')).toBeTruthy();
        });

        test('it has a logo', () => {
            let header = document.querySelector('header');
            expect(header.innerHTML).toContain('img src=');
        })

        test('it has an add post button', () => {
            let addPostBtn = document.querySelector('#popup-post');
            expect(addPostBtn).toBeTruthy();
            expect(addPostBtn.textContent).toContain('+');
        })

        test('it has a max character limit per entry of 300', () => {
            let postEntry = document.querySelector('#popup-postarea');
            expect(postEntry.innerHTML).toContain('300')
        })

        test('it has a dark/light mode switch button', () => {
            let switchBtn = document.querySelector('#switch-mode');
            expect(switchBtn).toBeTruthy();
        })
    })
})