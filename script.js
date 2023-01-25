const BASE_URL = 'https://jsonplaceholder.typicode.com/todos'



const form = document.querySelector('.card form');
const addBtn = document.querySelector('.card button');
const output = document.querySelector('#output');
const input = document.querySelector('#form > input');

const todos = []

const getPosts = async () => {
    
    
    //Laddar och gör om från json till js
    const res = await fetch(BASE_URL + '?_limit=7')
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
        output.appendChild(createTodo(todo));
    });
}


//den här funktionen skapar en ny Item i listan.
const createTodo = (todo) => {


     //bygg ihop ett nytt element, skapa själva elementen var för sig. först en div med class item
     const item = document.createElement('div');
     item.classList.add('item');

    // en p med todo som text
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

     //Förhindra att lägga till tomma rader
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
    //körs inne här, om under så kommer den att köras först när nästa läggs till.
    postTodos();
  });
  

  form.reset();
}


form.addEventListener('submit', handleSubmit)



//MODAL

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












   

//     const item = createTodo(todo);
//     console.log(item)

//    document.querySelector('#output').appendChild(item);

//     //för att nollställa inputen inför nästa
//     // input.value = ""; eller
//     form.reset();
// })


//Efter frågetecken verkar bli som att gå in i ett objekt. På det här sättet under kommer jag att få ut alla med userId 2. 
// const query = 'https://jsonplaceholder.typicode.com/todos?userId=2'

//Här ligger 3 olika statements samtidigt. Ett sätt att göra egna querys är direkt via ett formullär
// const query2 = 'https://jsonplaceholder.typicode.com/todos?userId=2&_page=1&_limit=3'







