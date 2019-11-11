export function init(element) {
    // Create div that wroaps all the elements inside (select, elements selected, search div) to put select inside
    const wrapper = document.createElement("div");
    wrapper.addEventListener("click", clickOnWrapper);
    wrapper.classList.add("multi-select-component");

    // Create elements of search
    const search_div = document.createElement("div");
    search_div.classList.add("search-container");
    const input = document.createElement("input");
    input.classList.add("selected-input");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("tabindex", "0");
    input.addEventListener("keyup", inputChange);

    const dropdown_icon = document.createElement("a");
    dropdown_icon.setAttribute("href", "#");
    dropdown_icon.classList.add("dropdown-icon");

    dropdown_icon.addEventListener("click", clickDropdown);
    const autocomplete_list = document.createElement("ul");

    search_div.appendChild(input);
    search_div.appendChild(autocomplete_list);
    search_div.appendChild(dropdown_icon);

    // set the wrapper as child (instead of the element)
    element.parentNode.replaceChild(wrapper, element);
    // set element as child of wrapper
    wrapper.appendChild(element);
    wrapper.appendChild(search_div);

    createInitialTokens(element);
}

// Function that create the initial set of tokens with the options selected by the users
export function createInitialTokens(select) {
    let {
        options_selected
    } = getOptions(select);
    const wrapper = select.parentNode;
    for (let i = 0; i < options_selected.length; i++) {
        createToken(wrapper, options_selected[i]);
    }
}

function inputChange(e) {
    const wrapper = e.target.parentNode.parentNode;
    const select = wrapper.querySelector("select");
    const dropdown = wrapper.querySelector(".dropdown-icon");


    const input_val = e.target.value;
    if (input_val) {
        dropdown.classList.add("active");
        populateAutocompleteList(select, input_val);
    } else {
        dropdown.classList.remove("active");
        const autocomplete_list = wrapper.querySelector("ul");
        autocomplete_list.innerHTML = "";
    }
}

function clickOnWrapper(e) {
    const wrapper = e.target;
    if (wrapper.tagName == "DIV") {
        const input_search = wrapper.querySelector("input");
        input_search.focus();
    }

}

function createToken(wrapper, value) {
    const select = wrapper.querySelector("select");
    // Create token wrapper
    const token = document.createElement("div");
    token.classList.add("selected-wrapper");
    const token_span = document.createElement("span");
    token_span.classList.add("selected-label");
    token_span.innerText = value;
    const close = document.createElement("a");
    close.classList.add("selected-close");
    close.setAttribute("tabindex", "-1");
    close.setAttribute("data-option", value);
    close.setAttribute("href", "#");
    close.innerText = "x";
    close.addEventListener("click", removeToken)
    token.appendChild(token_span);
    token.appendChild(close);
    wrapper.insertBefore(token, select);
}

function clickDropdown(e) {
    const dropdown = e.target;
    const wrapper = dropdown.parentNode.parentNode;
    const input_search = wrapper.querySelector("input");
    const select = wrapper.querySelector("select");
    dropdown.classList.toggle("active");

    input_search.focus();

    if (dropdown.classList.contains("active")) {

        if (!input_search.value) {
            populateAutocompleteList(select, "", true);
        } else {
            populateAutocompleteList(select, input_search.value);

        }
    } else {
        clearAutocompleteList(select);
    }
}

function clearAutocompleteList(select) {
    const wrapper = select.parentNode;

    const autocomplete_list = wrapper.querySelector("ul");
    autocomplete_list.innerHTML = "";
}

function populateAutocompleteList(select, query, dropdown = false) {
    const {
        autocomplete_options
    } = getOptions(select);

    let options_to_show;

    if (dropdown)
        options_to_show = autocomplete_options;
    else
        options_to_show = autocomplete(query, autocomplete_options);

    const wrapper = select.parentNode;
    const autocomplete_list = wrapper.querySelector("ul");
    autocomplete_list.innerHTML = "";

    const result_size = (options_to_show.length < 5) ? options_to_show.length : 5;

    if (result_size == 1) {
        const li = document.createElement("li");
        li.innerText = options_to_show[0];
        li.addEventListener("click", selectOption);
        autocomplete_list.appendChild(li);
        if (query.length > (options_to_show[0].length * 0.6)) {
            var event = new Event('click');
            li.dispatchEvent(event);

        }
    } else if (result_size > 1) {
        for (let i = 0; i < result_size; i++) {
            const li = document.createElement("li");
            li.innerText = options_to_show[i];
            li.addEventListener("click", selectOption);
            autocomplete_list.appendChild(li);
        }
    } else {
        const li = document.createElement("li");
        li.innerText = "No options found";
        autocomplete_list.appendChild(li);
    }
}

function selectOption(e) {
    const wrapper = e.target.parentNode.parentNode.parentNode;
    const input_search = wrapper.querySelector("input");
    const dropdown_icon = wrapper.querySelector(".dropdown-icon");
    const option = wrapper.querySelector(`select option[value=${e.target.innerText}]`);
    option.setAttribute("selected", "");
    createToken(wrapper, e.target.innerText);
    input_search.value = "";
    input_search.focus();
    var event = new Event('keyup');
    input_search.dispatchEvent(event);
    dropdown_icon.classList.remove("active");
    e.target.remove();
}


// functions
function autocomplete(query, options) {
    // No query passed, just return entire list
    if (!query) {
        return [];
    }
    let options_return = [];

    for (let i = 0; i < options.length; i++) {
        if (query.toLowerCase() === options[i].slice(0, query.length).toLowerCase()) {
            options_return.push(options[i]);
        }
    }
    return options_return;
}

export function getOptions(select) {
    // Select all the options available
    const all_options = Array.from(
        select.querySelectorAll("option")
    ).map(el => el.value);

    // Get the options that are selected from the user
    const options_selected = Array.from(
        select.querySelectorAll("option:checked")
    ).map(el => el.value);

    // Create an autocomplete options array with the options that are not selected by the user
    const autocomplete_options = [];
    all_options.forEach(option => {
        if (!options_selected.includes(option)) {
            autocomplete_options.push(option);
        }
    });

    autocomplete_options.sort();

    return {
        options_selected,
        autocomplete_options
    };

}


function removeToken(e) {
    // Get the value to remove
    const value_to_remove = e.target.dataset.option;
    const wrapper = e.target.parentNode.parentNode;
    const input_search = wrapper.querySelector("input");

    // Get the options in the select to be unselected
    const option_to_unselect = wrapper.querySelector(`select option[value="${value_to_remove}"]`);
    option_to_unselect.removeAttribute("selected");
    // Remove token attribute
    e.target.parentNode.remove();
    input_search.focus();
    var event = new Event('keyup');
    input_search.dispatchEvent(event);
}


export default {
    init,
}