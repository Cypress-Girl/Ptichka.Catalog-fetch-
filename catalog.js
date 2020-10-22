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


    fetch('./data.json', {})
    .then(response => {
        if (response.status === 200) {
            console.log(response.status)
            return response.json()
        } else
            throw Error(response.statusText)
    })
    .then(json => {
        createDOM(json);
    })
    .catch(err => {
        console.error(err)
    })

function createDOM(json) {
    console.log("createDOM")
    console.log(json.categories);

    let img = document.getElementById("category1");
    console.log(img.getAttribute('src'));

    // let color = get_average_rgb(img);
    // console.log(`color = ${color}`);
}

// function get_average_rgb(img) {
//     var context = document.createElement('canvas').getContext('2d');
//     if (typeof img == 'string') {
//         var src = img;
//         img = new Image;
//         // img.setAttribute('crossOrigin', '');
//         img.src = src;
//     }
//     context.imageSmoothingEnabled = true;
//     context.drawImage(img, 0, 0, 120, 120);
//
//     return context.getImageData(1, 1, 1, 1).data.slice(0, 3);
// }