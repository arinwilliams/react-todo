import { useState, useRef } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel.jsx";
import styled from "styled-components";


  const StyledForm = styled.form`
    display: flex;
    gap: 10px;
    padding: 8px 0;
    align-items: flex-end;
  `;
  const StyledButton = styled.button`
    &:disabled {
    font-style: italic; 
    }
  `;

function TodoForm({ onAddTodo, isSaving }) {
    const todoTitleInput = useRef(null);
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
    <StyledForm onSubmit={handleAddTodo}>
        <TextInputWithLabel 
            inputRef={todoTitleInput} // changed from ref, which is reserved
            elementId="todoTitle"
            label="Todo"
            value ={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
            //note to self: I could also write this as (e) and e.target.value
        />
        <StyledButton 
            //type="submit"
            disabled={workingTodoTitle.trim() === ''}>
            {isSaving ? 'Saving...' : 'Add Todo'}
          </StyledButton>
    </StyledForm>
    );

}

export default TodoForm;