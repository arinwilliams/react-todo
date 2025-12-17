import { useState, useRef } from "react";

function TodoForm({ onAddTodo }) {
    const todoTitleInput = useRef("");
    const [title, setTitle] = useState("");    
  
  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(title);
    setTitle("");
    todoTitleInput.current.focus();
    //const title = event.target.title.value
   // event.target.title.value = ""


   }
  
  return (
    <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo</label>
        <input 
            ref={todoTitleInput}
            id="todoTitle"
            name="title" 
            value ={title}
            onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Add Todo</button>
    </form>
    );

}

export default TodoForm;