'use strict';

// --- Custom styles ---
import './scss/main.scss';

import Splittr from './js/Splittr'

let pattInp = document.querySelector('#pattern')
let separat = document.querySelector('#separator')
let testInp = document.querySelector('#test-pattern')
let alert = document.querySelector('#alert')

function handleErr(err) {
    alert.innerText = err;

    setTimeout(() => {
        alert.innerText = ''
    }, 1000)
}

testInp.addEventListener('focus', (event) => {
    if (pattInp.value && separat.value) {
        new Splittr({
           'input': event.target,
           'delimiter': separator.value,
           'pattern': pattInp.value,
           'errCallback': handleErr
       })
   } else {
       handleErr('Please fill in the pattern and separator fields')
   }
})
