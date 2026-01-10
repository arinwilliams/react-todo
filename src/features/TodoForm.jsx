import { useState, useRef } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel.jsx";

function TodoForm({ onAddTodo }) {
    const todoTitleInput = useRef("");
    const [workingTodoTitle, setWorkingTodoTitle] = useState ("");
 
  
  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
    todoTitleInput.current?.focus();
    //const title = event.target.title.value
   // event.target.title.value = ""

   }
  
  return (
    <form onSubmit={handleAddTodo}>
        <TextInputWithLabel 
            inputRef={todoTitleInput} // changed from ref, which is reserved
            elementId="todoTitle"
            label="Todo"
            value ={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
            //note to self: I could also write this as (e) and e.target.value
        />
        <button 
            type="submit"
            disabled={!workingTodoTitle}
            >Add Todo</button>
    </form>
    );

}

export default TodoForm;