let data_json;
let categories = [
    {
        "id": 0,
        "name": "Все",
        "image": "images/Catalog/Produce_icons/all.png"
    },
    {
        "id": 1,
        "name": "Курица",
        "image": "images/Catalog/Produce_icons/chicken.png"
    },
    {
        "id": 2,
        "name": "Индейка",
        "image": "images/Catalog/Produce_icons/turkey.png"
    },
    {
        "id": 3,
        "name": "Кролик",
        "image": "images/Catalog/Produce_icons/rabbit.png"
    },
    {
        "id": 4,
        "name": "Копчёности и колбасы",
        "image": "images/Catalog/Produce_icons/sausage.png"
    },
    {
        "id": 5,
        "name": "Яйца",
        "image": "images/Catalog/Produce_icons/egg.png"
    },
    {
        "id": 6,
        "name": "Полуфабрикаты",
        "image": "images/Catalog/Produce_icons/semiproduct.png"
    }
]

window.onload = () => responseData("https://admin.fullstack.courses/api/v1/open/e-shop/v1", () => createAllDOM());

const responseData = (http, callback) => {
    fetch(http, {
        method: "GET"
    })
        .then(response => {
            if (response.status === 200) {
                console.log(response.status)
                return response.json()
            } else
                throw Error(response.statusText)
        })
        .then(json => {
            data_json = json;
            callback();
        })
        .catch(err => {
            console.error(err)
        })

}

function responseProductsInCategory(categoryID) {
    let http = `https://admin.fullstack.courses/api/v1/open/e-shop/v1?category_id=${categoryID}`;
    responseData(http, () => createProducts(categoryID));
}

function responseProductsOnPage(pageNumber) {
    let http = `https://admin.fullstack.courses/api/v1/open/e-shop/v1?page=${pageNumber}`;
    responseData(http, () => createProducts(0));
}

function responseProductsOnNextPage(http) {
    if (http)
        responseData(http, () => createProducts(0));
}

function removeOldElements(elem) {
    let tmp;
    //пропускаем сам шаблон, остальные удаляем
    elem = elem.nextElementSibling;
    while (elem) {
        tmp = elem.nextElementSibling;
        elem.remove();
        elem = tmp;
    }
}

function getTemplate(idElem, removeSibling = false) {
    let template = document.getElementById(idElem);
    if(removeSibling)
        removeOldElements(template);
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
    // node.children[0].alt = item.name;

    node.children[1].innerText = item.name;
    node.children[1].classList.add(classColor[item.id]);

    node.style.display = "block";
    node.addEventListener("click", () => responseProductsInCategory(item.id));
    parent.append(node);
}

function initSelectedCategory(elem, category_id) {
    elem.innerText = data_json.categories.find(item => item.id == category_id).name;
}

function initFromTo(elem, from, to, total) {
    elem.innerText = `${from}-${to} из ${total}`;
}

function addCounter(template, parent, text, responseFunc) {
    let node;
    node = template.cloneNode(true);
    node.innerText = text;
    node.style.display = "block";

    node.id = "page" + text;

    if (node.classList.contains('current'))
        node.classList.remove("current");
    if (text == data_json.current_page)
        node.classList.add('current');

    node.addEventListener("click", responseFunc);
    parent.append(node);
}

function initPageCounters(template, maxPage, parent) {
    let maxVisible = 5;
    let dimension = maxVisible - 2;

    if (data_json.current_page <= maxVisible) {

        let count = maxPage <= maxVisible ? maxPage : maxVisible;

        for (let i = 1; i <= count; i++) {
            addCounter(template, parent, i, () => responseProductsOnPage(i));
        }

        if (maxPage > maxVisible) {
            addCounter(template, parent, "...", null);

            addCounter(template, parent, maxPage, () => responseProductsOnPage(maxPage));

            addCounter(template, parent, ">", () => responseProductsOnPage(data_json.current_page + 1));

        }
    } else {

        addCounter(template, parent, "<", () => responseProductsOnPage(data_json.current_page - 1));

        addCounter(template, parent, 1, () => responseProductsOnPage(1));

        addCounter(template, parent, "...", null);

        let arr = new Array();
        for(let i = -(dimension - 1); i <= 0; i++)
            arr.push(data_json.current_page + i);

        //проверяем, можем ли мы потсавить currentPage в центр для симметрии
        for( let i=0; i<Math.floor(dimension/2); i++){
            if ((data_json.current_page + i) < maxPage) {
                arr.shift();
                arr.push((data_json.current_page + i) + 1);
            } else
                break;
        }

        arr.forEach((item) => {
            addCounter(template, parent, item, () => responseProductsOnPage(item));

        })

        //проверяем, дошли ли мы до максисмума страниц
        if (arr[arr.length - 1] < maxPage) { //не дошли!
            addCounter(template, parent, "...", null);

            addCounter(template, parent, maxPage, () => responseProductsOnPage(maxPage));

            addCounter(template, parent, ">", () => responseProductsOnPage(data_json.current_page + 1));
        }
    }
}

function createCategories() {
    let template, parent;
    data_json.categories = categories;

    template = getTemplate("category-box", true);
    parent = template.parentNode;
    if (parent) {
        data_json.categories.forEach(item => initCategoryElement(item, template, parent));
    }
}

function createProducts(categoryID) {
    let template, parent;

    template = getTemplate("one-product", true);
    parent = template.parentNode;
    if (parent) {
        data_json.data.filter((item, index) => index < data_json.per_page).forEach(item => initProductElement(item, template, parent));
    }

    template = getTemplate("caption");
    initSelectedCategory(template, categoryID);

    template = getTemplate("counter");
    let total = (data_json.per_page <= data_json.total) ? data_json.per_page : data_json.total;
    initFromTo(template, data_json.from, data_json.to, data_json.total);

    template = getTemplate("page-box1", true);
    parent = template.parentNode;
    let fullPage = Math.trunc(data_json.total / data_json.per_page);
    let countPage = (data_json.total % data_json.per_page === 0) ? fullPage : ++fullPage;
    initPageCounters(template, countPage, parent);

    template = getTemplate("page-box2", true);
    parent = template.parentNode;
    initPageCounters(template, countPage, parent);
}

function createAllDOM() {
    createCategories();
    createProducts(0);
}
