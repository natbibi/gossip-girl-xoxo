
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
            expect(head.textContent).toContain('Gossip Girl');
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
            let switchBttn = document.querySelector('.dark-mode-button');
            expect(switchBttn).toBeTruthy();
        })

        test('it has a hot button', () => {
            let hotBttn = document.querySelector('#hot-sort');
            expect(hotBttn).toBeTruthy();
        })

        test('it has a new button', () => {
            let newBttn = document.querySelector('#new-sort');
            expect(newBttn).toBeTruthy();
        })

        test('it has a header', () => {
            let header = document.querySelector('h1')
            expect(header).toBeTruthy()
        })

        test('it has a nav bar', () => {
            let navbar = document.querySelector('.topnav');
            expect(navbar).toBeTruthy()
        })
    })
})