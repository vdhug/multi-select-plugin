import {
    init,
} from './modules/functions.js';
document.addEventListener("DOMContentLoaded", () => {

    // get select that has the options available
    const select = document.querySelectorAll("[data-apicbase-select]");
    select.forEach(select => {
        init(select);
    })

});