// fetch('https://dev-admin.fullstack.courses/api/v1/open/e-shop/v1', {
//     method: "GET"
// })
//     .then(response => {
//         if (response.status === 200) {
//             console.log(response.status)
//             return response.json()
//         } else
//             throw Error(response.statusText)
//     })
//     .then(json => {
//         console.log(json)
//     })
//     .catch(err => {
//         console.error(err)
//     })


let data_json;

fetch('./data.json', {})
    .then(response => {
        if (response.status === 200) {
            console.log(response.status)
            return response.json()
        } else
            throw Error(response.statusText)
    })
    .then(json => {
        data_json = json;
        allResponseDOM();
    })
    .catch(err => {
        console.error(err)
    })

function getTemplate(idElem) {
    let template = document.getElementById(idElem);
    return template;
}

function initProductElement(item, template, parent) {
    let node = template.cloneNode(true);

    node.id = item.id;

    node.children[0].firstElementChild.src = item.image;
    node.children[1].innerText = item.name;
    node.children[2].innerText = `${item.description} / ${item.price} Р`;

    node.style.display = "block";
    parent.append(node);
}

function initCategoryElement(item, template, parent) {
    let classColor = ["light-green", "yellow", "light-purple", "gray", "red", "yellow", "light-brown"];

    let node = template.cloneNode(true);
    node.id = "category_" + item.id;

    node.children[0].src = item.image;
    node.children[0].alt = item.name;

    node.children[1].innerText = item.name;
    node.children[1].classList.add(classColor[item.id]);


    node.style.display = "block";
    parent.append(node);
}

function initSelectedCategory(elem, category_id) {
    elem.innerText = data_json.categories.find(item => item.id == category_id).name;
}

function initFromTo(elem, from, to, total) {
    elem.innerText = `${from}-${to} из ${total}`;
}

function addCounter(template, parent, text) {
    let node;
    node = template.cloneNode(true);
    node.innerText = text;
    node.style.display = "block";

    // if (Number.isInteger(text))
    node.id = "page" + text;

    if (node.classList.contains('current'))
        node.classList.remove("current");
    if (text == data_json.current_page)
        node.classList.add('current');

    parent.append(node);
}

function initPageCounters(template, count, parent) {

    let count1 = count > 7 ? 5 : count;

    for (let i = 1; i <= count1; i++) {
        addCounter(template, parent, i);
    }

    if (count > 7) {
        addCounter(template, parent, "...");
        addCounter(template, parent, count);
    }
    addCounter(template, parent, ">");
}

function allResponseDOM() {
    let template, parent;


    template = getTemplate("category-box");
    parent = template.parentNode;
    if (parent) {
        data_json.categories.forEach(item => initCategoryElement(item, template, parent));
    }

    template = getTemplate("one-product");
    parent = template.parentNode;

    if (parent) {
        data_json.data.filter((item, index) => index < data_json.per_page).forEach(item => initProductElement(item, template, parent));
    }

    template = getTemplate("caption");
    initSelectedCategory(template, 0);
    // initSelectedCategory(document.getElementById("caption"), 0);

    template = getTemplate("counter");
    let total = (data_json.per_page <= data_json.total) ? data_json.per_page : data_json.total;
    initFromTo(template, 1, data_json.per_page, data_json.total);
    // initFromTo(document.getElementById("counter"), 1, data_json.per_page, data_json.total);

    template = getTemplate("page-box1");
    parent = template.parentNode;
    let fullPage = Math.trunc(data_json.total / data_json.per_page);
    let countPage = (data_json.total % data_json.per_page == 0) ? fullPage : ++fullPage;
    initPageCounters(template, countPage, parent);

    template = getTemplate("page-box2");
    parent = template.parentNode;
    initPageCounters(template, countPage, parent);

}
