const labelBtn = document.querySelector('#label-btn')
const nlabelBtn = document.querySelector('#nlabel-btn')
const labelList = document.querySelector('#label-comment')
const nlabelList = document.querySelector('#nlabel-comment')



const NoCommentItem = document.createElement('li')
NoCommentItem.className = "list-group-item"


if(labelList.children.length === 0){
    NoCommentItem.innerText = "No Labeled Comments"
    labelList.append(NoCommentItem)
}
nlabelList.style.display = "none"
const labelBtnClick = () =>{
    NoCommentItem.remove()
    if(labelList.children.length === 0){
        NoCommentItem.innerText = "No Labeled Comments"
        labelList.append(NoCommentItem)
    }
    labelList.style.display = "block"
    nlabelList.style.display = "none"
    labelBtn.className = "btn btn-primary"
    nlabelBtn.className = "btn btn-outline-primary mx-3"
}

labelBtn.addEventListener("click", labelBtnClick)

const nlabelBtnClick = () =>{
    NoCommentItem.remove()
    if(nlabelList.children.length === 0){
        NoCommentItem.innerText = "No Not Labeled Comments"
        nlabelList.append(NoCommentItem)
    }
    labelList.style.display = "none"
    nlabelList.style.display = "block"
    labelBtn.className = "btn btn-outline-primary"
    nlabelBtn.className = "btn btn-primary mx-3"
}

nlabelBtn.addEventListener("click", nlabelBtnClick)