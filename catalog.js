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

function getTemplate(classElem){
    let template = document.getElementsByClassName(classElem)[0];
    if (template){
        console.log(template.className);
        console.log(template.children)
    }

    return template;
}

function initProductElement(item, template, parent) {
    let node = template.cloneNode(true);
    let image = node.getElementsByTagName("img")[0];
    let pName = node.getElementsByClassName("product-name")[0];
    let pPrice = node.getElementsByClassName("product-price")[0];

    node.id = item.id;
    image.src = item.image;
    pName.innerText = item.name;
    pPrice.innerText = `${item.description} / ${item.price} Р`;

    node.style.display = "block";
    parent.append(node);
}

function initCategoryElement(item, template, parent) {
    let classColor = ["light-green", "yellow", "light-purple", "gray", "red", "yellow", "light-brown"];

    let node = template.cloneNode(true);
    let image = node.getElementsByTagName("img")[0];
    let p = node.getElementsByTagName("p")[0];

    node.id = "category_" + item.id;
    image.src = item.image;
    image.alt = item.name;
    p.innerText = item.name;
    p.classList.add(classColor[item.id]);

    node.style.display = "block";
    parent.append(node);
}

function initSelectedCategory(elem, category_id){
        elem.innerText = data_json.categories.
            find(item => item.id == category_id).
            name;
}

function initFromTo(elem, from, to, total){
        elem.innerText = `${from}-${to} из ${total}`;
}

function addCounter(template, parent, text) {
    let node;
    node = template.cloneNode(true);
    node.innerText = text;
    node.style.display = "block";
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
    addCounter(template, parent, ">")

}

function allResponseDOM() {
    let template, parent;


    template = getTemplate("category-box");
    parent = template.parentNode;
    if (parent){
        data_json.categories.forEach(item => initCategoryElement(item, template, parent));
    }

    template = getTemplate("one-product-container");
    parent = template.parentNode;

    if (parent){
        data_json.data.filter((item, index) => index < data_json.per_page).
        forEach(item => initProductElement(item, template, parent));
    }

    initSelectedCategory(document.getElementById("caption"), 0);

    let total = (data_json.per_page <= data_json.total) ? data_json.per_page : data_json.total;
    initFromTo(document.getElementById("counter"), 1, data_json.per_page, data_json.total);

    let fullPage = Math.trunc(data_json.total / data_json.per_page);
    let countPage = (data_json.total % data_json.per_page == 0) ? fullPage : ++fullPage;
    template = document.getElementsByClassName("page-box")[0];
    parent = template.parentNode;
    initPageCounters(template, countPage, parent);
}

// function getRGB(img) {
//     img = "./images/Catalog/Produce_icons/turkey.png";
//
//     let context = document.createElement('canvas').getContext('2d');
//     if (typeof img == 'string') {
//         let src = img;
//         img = new Image;
//         img.setAttribute('crossOrigin', '');
//         img.src = src;
//     }
//
//     context.imageSmoothingEnabled = true;
//     context.drawImage(img, 0, 0, 120, 120);
//
//     let width = context.canvas.width;
//     let y = context.canvas.height / 2;
//     let color;
//
//     for(let x = 0; x < width; x++){
//         color = context.getImageData(x, y, 1, 1).data.slice(0, 3);
//         if (color[0] != 0 || color[1] != 0 || color[2] != 0)      break;
//     }
//     return color;
// }