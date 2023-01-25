const BASE_URL = 'https://jsonplaceholder.typicode.com/todos'



const form = document.querySelector('.card form');
const addBtn = document.querySelector('.card button');
const output = document.querySelector('#output');
const input = document.querySelector('#form > input');

const todos = []

const getPosts = async () => {
    
    
    //Laddar och gör om från json till js
    const res = await fetch(BASE_URL + '?_limit=5')
    const json = await res.json()

    json.forEach(todo => {
        todos.push(todo)
    })

    //Här finns datan och kör här en funktion som skapar ett html-element med forEach för varje todo i arrayen.
    postTodos()
}

getPosts()

const postTodos = () => {
    todos.forEach(todo => {
        const item = createTodo(todo);
        output.appendChild(item)
    });
}


//den här funktionen skapar en ny Item i listan.
const createTodo = (todo) => {

     const item = document.createElement('div');
     item.classList.add('item');

     const p = document.createElement('p');
     
     if(todo.completed === true) {
        item.className = 'item done'
        p.className = 'line'
        p.innerText = todo.title;
     }
    //  Om den är längre än 30 tecken, slicea o lägg på punkter, ananrs skiv ut hela
     if(todo.title.length > 30) {
         p.innerText = todo.title.slice(0,30) + ' ...';
     }
    
     else {
        p.innerText = todo.title;
     }

     const button = document.createElement('button');
     button.innerText = 'delete';
 

     //lägg till child
     item.appendChild(p)
     item.appendChild(button)

     

    return item;

}

const handleSubmit = e => {
    e.preventDefault()

     if(input.value.trim() === '') {
        return;
    }

    newTodo = {
        userId: '',
        id: '',
        title: input.value,
        completed: false
    }

//HÄR SKER POSTEN, INFO FINNS PÅ JSONPLACEHOLDER....

fetch(BASE_URL, {
  method: 'POST',
  body: JSON.stringify(newTodo),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => {
    todos.push(json)

    const item = createTodo(json);
    output.appendChild(item)
  });
  

  form.reset();
}


form.addEventListener('submit', handleSubmit)



output.addEventListener('click', (e) => {

    //om innertecten på knappen e delete
    if(e.target.innerText === 'delete' && e.target.parentElement.className === 'item done') {
        e.target.parentElement.remove();
    }

    else if(e.target.innerText === 'delete' && e.target.parentElement.className !== 'item done') {
        //här ska modalen öppnas
        document.querySelector('.modalWrapper').classList.toggle('hidden');
    }

    else if(e.target.nodeName === 'P') {
        e.target.classList.toggle('line')
        e.target.parentElement.classList.toggle('done')
    }
    else if(e.target.nodeName === 'DIV') {
        console.log(e.target)
        e.target.querySelector('p').classList.toggle('line')
        e.target.classList.toggle('done')
    }

    
})

//För att stänga modal
document.addEventListener('click', e => {
    //Om den träffar modalWrapper eller button i modal
    if(e.target === document.querySelector('.modalWrapper') || e.target === document.querySelector('.modal button')){
        document.querySelector('.modalWrapper').classList.toggle('hidden');
    }
})












   


//Efter frågetecken verkar bli som att gå in i ett objekt. På det här sättet under kommer jag att få ut alla med userId 2. 
// const query = 'https://jsonplaceholder.typicode.com/todos?userId=2'

//Här ligger 3 olika statements samtidigt. Ett sätt att göra egna querys är direkt via ett formullär
// const query2 = 'https://jsonplaceholder.typicode.com/todos?userId=2&_page=1&_limit=3'







