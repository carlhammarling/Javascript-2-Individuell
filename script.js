const BASE_URL = 'https://jsonplaceholder.typicode.com/todos/'
const todos = []

const output = document.querySelector('#output');

//Funktion som hämtar API och gör om till JS-object. Datan som hämtas sparas i den lokala arrayen todo.
const getPosts = async () => { 
    const res = await fetch(BASE_URL + '?_limit=7')                                   // limit efter BASE_URL är antalet som hämtas.
    const data = await res.json()

    data.forEach(todo => {
        todos.push(todo)
    })

    //Här finns datan och kör här en funktion som skapar ett html-element med forEach för varje todo i arrayen.
    postTodo()
}
getPosts()

//En funktion som förtst tömmer DOMen, tar varje objekt från den lokala arrayen och kör en funktion som skapar HTML innehållet. 
// Sen lägger den till det i output. Körs i funktionen över.
const postTodo = () => {
    output.innerHTML = ''
    todos.forEach(todo => {
        const item = createTodo(todo);
        output.appendChild(item)
    });
}


//den här funktionen skapar HTML-innehållet av datan. Körs i funktionen över
const createTodo = (todo) => {

     const item = document.createElement('div');
     item.classList.add('item');
     item.id = todo.id;

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
const form = document.querySelector('.card form');
const addBtn = document.querySelector('.card button');
const input = document.querySelector('#form > input');

const handleSubmit = e => {
    e.preventDefault()

     if(input.value.trim() === '') {
         document.querySelector('.modal p').innerText = `Your todo can't be empty! Please write something.`
        document.querySelector('.modalWrapper').classList.toggle('hidden');
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
    .then((res) => {
        if(!res.ok) {
            throw new Error('Request failed!');
        }
        return res.json()
    })
  .then((data) => {
    data.id = crypto.randomUUID()
    todos.push(data)

    const item = createTodo(data);
    output.appendChild(item)
  })
  .catch(error => {
    console.error(error);
  });
  console.log(todos)

  form.reset();
}


form.addEventListener('submit', handleSubmit)


//en edventlistener som hanterar både delete och färdigmarkering
output.addEventListener('click', (e) => {

    if(e.target.innerText === 'delete' && e.target.parentElement.className === 'item done') {
        
        fetch(BASE_URL + e.target.parentElement.id, {
            method: 'DELETE'
        })
        .then(res => {
            if(res.ok) {
                e.target.parentElement.remove();
                const index = todos.findIndex(todo => todo.id == e.target.parentElement.id)
                todos.splice(index, 1)
            }
        })
    }
    else if(e.target.innerText === 'delete' && e.target.parentElement.className !== 'item done') {
        //här ska modalen öppnas
        document.querySelector('.modal p').innerText = 'You have to finnish the task before you can delete it! To mark a task as done, simply click on it.'
        document.querySelector('.modalWrapper').classList.toggle('hidden');
    }




    //Hantering av completed/styling

    else if(e.target.nodeName === 'P') {
        //hitta id genom att trycka
        const todo = todos.find(_todo => _todo.id == e.target.parentElement.id)
        //Uppdatera databasen
        fetch(BASE_URL + todo.id, {
            method: 'PATCH',
            body: JSON.stringify({
              completed: !todo.completed,      //det det inte är
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
        })
        //Kolla svar från databasen, när svaret är ok så gör vi nåt
        .then((res) => {
            console.log(res)
            if(!res.ok) {
                throw new Error('Request failed!');   
            }
            return res.json()
            
        })
        .then((data) => {
            console.log(data)
            e.target.classList.toggle('line')
            e.target.parentElement.classList.toggle('done')
            todo.completed = data.completed
        })
        .catch(error => {
            console.error(error);
          });
    }
    else if(e.target.nodeName === 'DIV') {
        const todo = todos.find(_todo => _todo.id == e.target.id)
        //Uppdatera databasen
        fetch(BASE_URL + todo.id, {
            method: 'PATCH',
            body: JSON.stringify({
              completed: !todo.completed,      //det det inte är
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
        })
        //Kolla svar från databasen, när svaret är ok så gör vi nåt
        .then((res) => {
            if(!res.ok) {
                throw new Error('Request failed!');
            }
            return res.json()
        })
        .then((data) => {
            console.log(data)
            e.target.querySelector('p').classList.toggle('line')
            e.target.classList.toggle('done')
            todo.completed = data.completed
        })
        .catch(error => {
            console.error(error);
          });   
    }  
})




//För att stänga modal
document.addEventListener('click', e => {
    
    if(e.target === document.querySelector('.modalWrapper') || e.target === document.querySelector('.modal button')){
        document.querySelector('.modalWrapper').classList.toggle('hidden');
    }
})




