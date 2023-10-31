const root = document.getElementsByClassName('main_to-do')[0]
const inputText = document.getElementsByClassName('input_text')[0]
const inputTime = document.getElementsByClassName('input_time')[0]

let activeTasks = [];
let inactiveTasks = [];

class toDoItem {
    constructor(text, time) {
        this.text = text, 
        this.time = time
    }
}

if (localStorage.getItem('active') !== null) {
    activeTasks = JSON.parse(localStorage.getItem('active'))
}

if (localStorage.getItem('inactive') !== null) {
    inactiveTasks = JSON.parse(localStorage.getItem('inactive'))
}

render(activeTasks, inactiveTasks) 

document.getElementsByClassName("clear")[0].onclick = () => {
    activeTasks = []
    inactiveTasks = []
    render(activeTasks, inactiveTasks)
}

document.getElementsByClassName("add")[0].onclick = () => {
    let text = inputText.value;
    let time = inputTime.value;

    if (text.length >= 1 && time.length >= 1)
        activeTasks.push(new toDoItem(text, time))
    else
        alert('Невозможно добавить пустое поле')

    render(activeTasks, inactiveTasks)
}

function render(active, inactive) {
    active.sort(compareByTime)
    root.innerHTML = ''

    if (active.length !== 0) {
        let active_header = document.createElement('h2')
        active_header.innerText = 'Активные'
        root.appendChild(active_header)
        active.map(i => { 
            let item = createItem(i)

            item.addEventListener('click', (event) => {
                active.splice(active.indexOf(i), 1)
                inactive.push(i)
                render(active, inactive)
                event.stopPropagation()
            })

            let bucket = item.querySelector('img') 
            bucket.addEventListener('click', (event) => {
                active.splice(active.indexOf(i), 1)
                render(active, inactive)
                event.stopPropagation()
            })
        })
    }

    if (inactive.length !== 0) {
        let inactive_header = document.createElement('h2')
        inactive_header.innerText = 'Завершенные'
        root.appendChild(inactive_header)
        inactive.map(j => {
            let item = createItem(j)
            item.className += ' item_succses'

            let bucket = item.querySelector('img') 
            bucket.addEventListener('click', (event) => {
                inactive.splice(inactive.indexOf(j), 1)
                render(active, inactive)
                event.stopPropagation()
            })
        })
    }

    localStorage.setItem('active', JSON.stringify(active))
    localStorage.setItem('inactive', JSON.stringify(inactive))
}


function createItem(toDo) {
    let item = document.createElement('div')
    let time = document.createElement('p')
    let text = document.createElement('p')
    let delButton = document.createElement('button') 
    let delIcon = document.createElement('img')

    time.textContent = toDo.time
    text.textContent = toDo.text

    delIcon.src = './assets/ic_delete.svg'
    delIcon.alt = 'Удалить'

    delButton.appendChild(delIcon)

    item.className = 'item'
    item.appendChild(time)
    item.appendChild(text)
    item.appendChild(delButton)
    root.appendChild(item)
    return item
}

function compareByTime(a, b) {
    const timeA = new Date(`2000-01-01T${a.time}`);
    const timeB = new Date(`2000-01-01T${b.time}`);
    return timeA - timeB;
  }