import React from 'react';

// Array to store todo list
const todoList = [
  { id: 1, title: 'Learn React in the Fall' },
  { id: 2, title: 'Learn Node in the Spring' },
  { id: 3, title: 'Learn Python in the Summer' }
];



function App() {
  return (
    <div className="App">
      <h1>Todo List</h1>
      <ul>
        {/* Loop through the todoList array to display each item */}
        {todoList.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
