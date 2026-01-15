import { useState } from "react";
import "./App.css";
import TodoForm from "./features/TodoForm";
import TodoList from "./features/TodoList/TodoList";

function App() {
  const [todoList, setTodoList] = useState([]);

  const addTodo = (title) => {
    const newTodo = {
      title,
      id: Date.now(),
      isCompleted: false,   
    };
    setTodoList((prevList) => [...prevList, newTodo]);
  };

  const completeTodo = (id) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };

  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return {...editedTodo};
      }
      return todo;
    } )
    setTodoList(updatedTodos);
  }

  return (
    <>
      <div>
        <h1>Todo List</h1>
        <TodoForm onAddTodo={addTodo} />
        <TodoList 
          todoList={todoList} 
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo} />
      </div>
    </>
  );
}

export default App;
