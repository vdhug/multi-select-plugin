document.addEventListener("DOMContentLoaded", () => {
  function createInitialElements(element) {
    // Create div that wroaps all the elements inside (select, elements selected, search div) to put select inside
    const wrapper = document.createElement("div");
    wrapper.classList.add("tokenfield");
    wrapper.classList.add("form-control");

    // Create elements of search
    const search_div = document.createElement("div");
    search_div.classList.add("search-container");
    const input = document.createElement("input");
    input.classList.add("token-input");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("tabindex", "0");

    const dropdown_icon = document.createElement("a");
    dropdown_icon.setAttribute("href", "#");
    dropdown_icon.classList.add("dropdown-icon");

    const autocomplete_list = document.createElement("ul");

    search_div.appendChild(input);
    search_div.appendChild(autocomplete_list);
    search_div.appendChild(dropdown_icon);

    // set the wrapper as child (instead of the element)
    element.parentNode.replaceChild(wrapper, element);
    // set element as child of wrapper
    wrapper.appendChild(element);
  }

  // get select that has the options available
  const select = document.querySelector("[data-apicbase-select]");

  // Select all the options available
  const all_options = Array.from(
    document.querySelectorAll("[data-apicbase-select] option")
  ).map(el => el.value);

  // Get the options that are selected from the user
  const options_selected = Array.from(
    document.querySelectorAll("[data-apicbase-select] option:checked")
  ).map(el => el.value);

  // Create an autocomplete options array with the options that are not selected by the user
  const autocomplete_options = [];
  all_options.forEach(option => {
    if (!options_selected.includes(option)) {
      autocomplete_options.push(option);
    }
  });

  // Create list of tokens based on selected elements
  options_selected.forEach(value => {
    // Create wroap to put select inside
    const token = document.createElement("div");
    token.classList.add("token");
    const token_span = document.createElement("span");
    token_span.classList.add("token-label");
    token_span.innerText = value;
    const close = document.createElement("a");
    close.classList.add("close");
    close.setAttribute("tabindex", "-1");
    close.setAttribute("data-option", value);
    close.setAttribute("href", "#");
    close.innerText = "x";
    close.addEventListener("click", e => {
      e.preventDefault();
      const option = wrapper.querySelector(
        `select option[value=${e.target.dataset.option}]`
      );
      if (option) {
        option.removeAttribute("selected");
        autocomplete_options.push(option.value);
      }
      const input_search = e.target.parentElement.parentElement.querySelector(
        "input"
      );
      const dropdown_is_active = e.target.parentElement.parentElement.querySelector(
        ".dropdown-icon.active"
      );
      debugger;
      e.target.parentElement.remove();
      if (input_search.value == "" && dropdown_is_active) {
        const new_option = document.createElement("li");
        new_option.innerText = option.value;
        autocomplete_list.appendChild(new_option);
      } else {
        input_search.onkeyup();
        input_search.focus();
      }
    });
    token.appendChild(token_span);
    token.appendChild(close);
    wrapper.appendChild(token);
  });

  wrapper.appendChild(search_div);

  dropdown_icon.onclick = function(e) {
    debugger;
    e.target.classList.toggle("active");
    // Dropdown clicked
    if (e.target.classList.contains("active")) {
      if (autocomplete_options.length > 0) {
        for (i = 0; i < autocomplete_options.length; i++) {
          const li = document.createElement("li");
          li.innerText = autocomplete_options[i];
          li.addEventListener("click", e => {
            const add_option = e.target.parentElement.parentElement.parentElement.querySelector(
              `select option[value=${e.target.innerText}]`
            );
            if (add_option) {
              add_option.setAttribute("selected", "");
            }

            // Create wroap to put select inside
            const token = document.createElement("div");
            token.classList.add("token");
            const token_span = document.createElement("span");
            token_span.classList.add("token-label");
            token_span.innerText = e.target.innerText;
            const close = document.createElement("a");
            close.classList.add("close");
            close.setAttribute("tabindex", "-1");
            close.setAttribute("data-option", e.target.innerText);
            close.setAttribute("href", "#");
            close.innerText = "x";
            close.addEventListener("click", e => {
              e.preventDefault();
              const option = wrapper.querySelector(
                `select option[value=${e.target.dataset.option}]`
              );
              if (option) {
                option.removeAttribute("selected");
                autocomplete_options.push(option.value);
              }
              e.target.parentElement.remove();
            });
            token.appendChild(token_span);
            token.appendChild(close);
            wrapper.insertBefore(token, search_div);
            // Remove from available options
            autocomplete_options.splice(
              autocomplete_options.indexOf(e.target.innerText),
              1
            );
            const input_search = e.target.parentElement.parentElement.querySelector(
              "input"
            );
            const dropdown_is_active = e.target.parentElement.parentElement.querySelector(
              ".dropdown-icon.active"
            );
            if (!dropdown_is_active) {
              debugger;
              input_search.value = "";
              input_search.focus();
              autocomplete_list.innerHTML = "";
            }
            e.target.remove();
          });
          autocomplete_list.appendChild(li);
        }
      } else {
        autocomplete_list.innerHTML = "<li>No option matches</li>";
      }
    } else {
      autocomplete_list.innerHTML = "";
    }
  };

  input.onkeyup = function(e) {
    input_val = this.value; // updates the variable on each ocurrence

    autocomplete_list.innerHTML = "";
    if (input_val.length > 0) {
      var options_to_show = [];
      options_to_show = autocomplete(input_val, autocomplete_options);

      autocomplete_list.innerHTML = "";
      if (options_to_show.length > 0) {
        for (i = 0; i < options_to_show.length; i++) {
          const li = document.createElement("li");
          li.innerText = options_to_show[i];
          li.addEventListener("click", e => {
            const add_option = e.target.parentElement.parentElement.parentElement.querySelector(
              `select option[value=${e.target.innerText}]`
            );
            if (add_option) {
              add_option.setAttribute("selected", "");
            }

            // Create wroap to put select inside
            const token = document.createElement("div");
            token.classList.add("token");
            const token_span = document.createElement("span");
            token_span.classList.add("token-label");
            token_span.innerText = e.target.innerText;
            const close = document.createElement("a");
            close.classList.add("close");
            close.setAttribute("tabindex", "-1");
            close.setAttribute("data-option", e.target.innerText);
            close.setAttribute("href", "#");
            close.innerText = "x";
            close.addEventListener("click", e => {
              e.preventDefault();
              const option = wrapper.querySelector(
                `select option[value=${e.target.dataset.option}]`
              );
              if (option) {
                option.removeAttribute("selected");
                autocomplete_options.push(option.value);
              }
              e.target.parentElement.remove();
            });
            token.appendChild(token_span);
            token.appendChild(close);
            wrapper.insertBefore(token, search_div);
            // Remove from available options
            autocomplete_options.splice(
              autocomplete_options.indexOf(e.target.innerText),
              1
            );
            const input_search = e.target.parentElement.parentElement.querySelector(
              "input"
            );
            if (!dropdown_is_active) {
              debugger;
              input_search.value = "";
              input_search.focus();
              autocomplete_list.innerHTML = "";
            }
          });
          autocomplete_list.appendChild(li);
        }
      } else {
        autocomplete_list.innerHTML = "<li>No option matches</li>";
      }
    } else {
      options_to_show = [];
      autocomplete_list.innerHTML = "";
    }
  };

  // // Select all custom selects
  // const select = document.querySelectorAll('[data-apicbase-select]');

  // // Query for each custom select
  // select.forEach(select => {
  //     const parent = select.parentNode;
  //     // Create wroap to put select inside
  //     const wrapper = document.createElement('div');
  //     wrapper.classList.add("autocomplete-container");

  //     const autocomplete_results = document.createElement('ul');
  //     autocomplete_results.classList.add("autocomplete-results");

  //     const selected_options = document.createElement('ul');
  //     selected_options.classList.add("selected-options");

  //     const input = document.createElement("input");
  //     input.classList.add("autocomplete-input");
  //     input.setAttribute("type", "text");

  //     // set the wrapper as child (instead of the element)
  //     parent.replaceChild(wrapper, select);

  //     // set element as child of wrapper
  //     wrapper.appendChild(select);
  //     wrapper.appendChild(selected_options);
  //     wrapper.appendChild(input);
  //     wrapper.appendChild(autocomplete_results);
  //     const options = [];
  //     Array.from(select.options).forEach(option => {
  //         options.push(option.value);
  //     });

  //     // events
  //     autocomplete_results.querySelectorAll("li").forEach(result => {
  //         result.addEventListener("click", event => {
  //             alert("Clicou");
  //         });
  //     });

  //     input.onkeyup = function (e) {
  //         input_val = this.value; // updates the variable on each ocurrence

  //         if (input_val.length > 0) {
  //             var options_to_show = [];
  //             autocomplete_results.innerHTML = '';
  //             options_to_show = autocomplete(input_val, options);

  //             if (options_to_show.length > 0) {
  //                 for (i = 0; i < options_to_show.length; i++) {
  //                     const li = document.createElement("li");
  //                     li.innerText = options_to_show[i];
  //                     li.addEventListener("click", removeOption);
  //                     autocomplete_results.appendChild(li);
  //                 }
  //             } else {
  //                 autocomplete_results.innerHTML = '<li>No option matches</li>';
  //             }

  //             autocomplete_results.style.display = 'block';
  //         } else {
  //             options_to_show = [];
  //             autocomplete_results.innerHTML = '';
  //         }
  //     }
  // });

  // functions
  function autocomplete(val, options) {
    var options_return = [];

    for (i = 0; i < options.length; i++) {
      if (val.toLowerCase() === options[i].slice(0, val.length).toLowerCase()) {
        options_return.push(options[i]);
      }
    }
    return options_return;
  }

  // function removeOption(e) {
  //     debugger
  // }
});
