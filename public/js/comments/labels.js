const classBox = document.querySelector("#class-box")
const datasetIdSpan = document.querySelector("#datasetId")
const videoIdSpan = document.querySelector("#videoId")
const labelIdSpan = document.querySelector("#labelId")
const comment = document.querySelector("#comment")

const id_header = document.querySelector("#id-header")
const iframe = document.querySelector("#iframe")
const ttitle = document.querySelector("#ttitle")
const ccomment = document.querySelector("#ccomment")
const done = document.querySelector("#cdone")
const remove_btn = document.querySelector("#remove_btn")


done.classList.add("d-none")

const deleteComment = async () =>{
    const res_craw = await fetch(`/labels/${labelIdSpan.innerText}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({labelId: labelIdSpan.innerText}),
    })
    const res_json = await res_craw.json()
    if (res_json.status) {
        updateComment()
    }
}

remove_btn.addEventListener('click', deleteComment)

const updateComment = async () => {
    await fetch(`/labels/${datasetIdSpan.innerText}/${videoIdSpan.innerText}/one`)
        .then(async (data) => {
            return data.json()
        }).then((data) => {
            comment.innerText = data.comment
            labelIdSpan.innerText = data._id
        }).catch((err) => {
            id_header.classList.add("d-none")
            iframe.classList.add("d-none")
            ttitle.classList.add("d-none")
            ccomment.classList.add("d-none")
            classBox.classList.add("d-none")
            done.classList.remove("d-none")
        })
}

updateComment()

const appendButton = async () => {
    const {classes} = await fetch(`/datasets/${datasetIdSpan.innerText}/class`)
        .then(async (data) => {
            return data.json()
        })

    for (let i = 0; i < classes.length; i++) {
        let button = document.createElement('button')
        button.className = "btn btn-primary m-4"
        button.innerText = classes[i]
        button.value = classes[i]
        button.addEventListener('click', submitLabel)
        classBox.append(button)
    }

}

appendButton()

const submitLabel = async (event) => {
    const res_craw = await fetch(`/labels/${labelIdSpan.innerText}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({className: event.currentTarget.value}),
    })
    const res_json = await res_craw.json()
    if (res_json.status) {
        updateComment()
    }
}

