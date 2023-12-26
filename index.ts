const root = document.getElementsByClassName('main_to-do')[0] as HTMLElement;
const inputText = document.getElementsByClassName('input_text')[0] as HTMLInputElement
const inputTime = document.getElementsByClassName('input_time')[0] as HTMLInputElement
const clearButton = document.getElementsByClassName("clear")[0] as HTMLButtonElement
const addButton = document.getElementsByClassName("add")[0] as HTMLButtonElement

type toDoItemType = {
  text: string,
  time: string,
}

type tasksType = {
  active: toDoItemType[],
  inactive: toDoItemType[],
}

const createToDoItem = (text: string, time: string) : toDoItemType => {
  return {
    text: text,
    time: time,
  };
}

const tasks: tasksType = {
  active: [],
  inactive: [],
}

if (localStorage.getItem('active') !== null)
  tasks.active = JSON.parse(localStorage.getItem('active') as string)
if (localStorage.getItem('inactive') !== null)
  tasks.inactive = JSON.parse(localStorage.getItem('inactive') as string)

clearButton.onclick = () => {
  tasks.active = []
  tasks.inactive = []
  render(tasks.active, tasks.inactive)
}

addButton.onclick = () => {
  const text = inputText.value;
  const time = inputTime.value;

  if (text.length >= 1 && time.length >= 1)
    tasks.active.push(createToDoItem(text, time))
  else
    alert('Невозможно добавить пустое поле')

  render(tasks.active, tasks.inactive)
}

const render = (active : toDoItemType[], inactive : toDoItemType[]) => {
  active.sort(compareByTime)
  root.innerHTML = ''

  if (active.length !== 0) {
    const activeHeader = document.createElement('h2')
    activeHeader.innerText = 'Активные'
    root.appendChild(activeHeader)
    active.map(i => {
      const item = createItem(i)

      item.addEventListener('click', (event) => {
        active.splice(active.indexOf(i), 1)
        inactive.push(i)
        render(active, inactive)
        event.stopPropagation()
      })

      const bucket = item.querySelector('img') as HTMLElement
      bucket.addEventListener('click', (event) => {
        active.splice(active.indexOf(i), 1)
        render(active, inactive)
        event.stopPropagation()
      })
    })
  }

  if (inactive.length !== 0) {
    const inactiveHeader = document.createElement('h2')
    inactiveHeader.innerText = 'Завершенные'
    root.appendChild(inactiveHeader)
    inactive.map(j => {
      const item = createItem(j)
      item.className += ' item_succses'

      const bucket = item.querySelector('img') as HTMLElement
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

const createItem = (toDo : toDoItemType) => {
  const item = document.createElement('div')
  const time = document.createElement('p')
  const text = document.createElement('p')
  const delButton = document.createElement('button')
  const delIcon = document.createElement('img')

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

const compareByTime = (a: toDoItemType, b: toDoItemType) => {
  const timeA: Date = new Date(`2000-01-01T${a.time}`);
  const timeB: Date = new Date(`2000-01-01T${b.time}`);
  if (timeA < timeB)
    return -1;
  if (timeA > timeB)
    return +1;

  return 0;
}

render(tasks.active, tasks.inactive)