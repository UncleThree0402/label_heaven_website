const addClassBtn = document.querySelector('#add_class_btn')
const submitBtn = document.querySelector('#submit-btn')
const list = document.querySelector('#class')
const className = document.querySelector('#class-name')
const datasetForm = document.querySelector('#datasets-form')
const classAlert = document.querySelector('#class-alert')

const title = document.querySelector("#title")
const description = document.querySelector("#description")


datasetForm.addEventListener('submit', (e) => {
    e.preventDefault()
})

//Submit
const submit = () => {
    const titleElement = title.value
    const descriptionElement = description.value
    const listElement = [...list.children].map(x => x.children[0].innerText)
    const dataset = {title: titleElement, description: descriptionElement, class: listElement}

    fetch('/datasets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataset),
    }).then((res) => {
        window.location.replace(res.url)
    }).catch((err) =>{
        alert("Error!")
    })

}

submitBtn.addEventListener('click', submit)

//Add New Class
const addNewItem = () => {
    const newLi = document.createElement('li')
    newLi.className = "list-group-item d-flex flex-row justify-content-between align-items-center"

    const newSpan = document.createElement('span')
    newSpan.append(className.value)
    newLi.append(newSpan)

    const newBtn = document.createElement('button')
    newBtn.className = "btn btn-sm"
    newBtn.innerHTML = binSvgHTML
    newBtn.addEventListener("click", deleteListItem)
    newLi.append(newBtn)

    list.appendChild(newLi)
    className.value = ""
    checkListLength()
}

addClassBtn.addEventListener('click', addNewItem)


//Check List Length
const checkListLength = () => {
    if (list.children.length === 0) {
        classAlert.style.display = "block"
        list.style.display = "none"
    } else {
        classAlert.style.display = "none"
        list.style.display = "block"
    }
}

checkListLength()

//Delete list item
const deleteListItem = (event) => {
    event.currentTarget.parentNode.remove()
    checkListLength()
}

//Trash icon
const binSvgHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\"\n" +
    "                                 class=\"bi bi-trash-fill\" viewBox=\"0 0 16 16\">\n" +
    "                                <path d=\"M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z\"/>\n" +
    "                            </svg>"


