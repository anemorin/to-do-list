const root = document.getElementsByClassName('main_to-do')[0] as HTMLElement;
const inputText = document.getElementsByClassName('input_text')[0] as HTMLInputElement
const inputTime = document.getElementsByClassName('input_time')[0] as HTMLInputElement
const clearButton = document.getElementsByClassName("clear")[0] as HTMLButtonElement
const addButton = document.getElementsByClassName("add")[0] as HTMLButtonElement

class toDoItem {
    text: string;
    time: string;

    constructor(text : string, time : string) {
        this.text = text,
        this.time = time
    }
}

let toDos : string | null = localStorage.getItem('active');
let activeTasks : toDoItem[]  = toDos !== null ? JSON.parse(toDos) : []

toDos = localStorage.getItem('inactive')
let inactiveTasks : toDoItem[] = toDos !== null ? JSON.parse(toDos) : []


render(activeTasks, inactiveTasks)

clearButton.onclick = () => {
    activeTasks = []
    inactiveTasks = []
    render(activeTasks, inactiveTasks)
}

addButton.onclick = () => {
    let text = inputText.value;
    let time = inputTime.value;

    if (text.length >= 1 && time.length >= 1)
        activeTasks.push(new toDoItem(text, time))
    else
        alert('Невозможно добавить пустое поле')

    render(activeTasks, inactiveTasks)
}

function render(active : toDoItem[], inactive : toDoItem[]) {
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

            let bucket = item.querySelector('img') as HTMLElement
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

            let bucket = item.querySelector('img') as HTMLElement
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

function createItem(toDo : toDoItem) {
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

function compareByTime(a:toDoItem, b:toDoItem) {
    const timeA: Date = new Date(`2000-01-01T${a.time}`);
    const timeB: Date = new Date(`2000-01-01T${b.time}`);
    if (timeA < timeB) return -1;
    if (timeA > timeB) return +1;

    return 0; // dates are equal
  }