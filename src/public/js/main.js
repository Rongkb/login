

function loadPage(page) {
    $.ajax({
        url: './api/user?page=' + page,
        type: "GET"
    })
        .then(data => {
            console.log(data)
            for (i = 0; i < data.length; i++) {
                const element = data[i]
                var item = $(`<h1>${element.username} : ${element.password}</h1>`)
                $('#content').append(item)

            }
        })
        .catch(err => {
            console.log(err)
        })
}
