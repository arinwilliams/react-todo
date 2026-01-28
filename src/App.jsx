import { useState, useEffect, useCallback } from "react";
import "./App.css";
import TodoForm from "./features/TodoForm";
import TodoList from "./features/TodoList/TodoList";
import TodosViewForm from "./features/TodosViewForm";

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
 // console.log("BASE_ID:", import.meta.env.VITE_BASE_ID);
  //console.log("TABLE_NAME:", import.meta.env.VITE_TABLE_NAME);
  //console.log("PAT exists:", !!import.meta.env.VITE_PAT);
  //console.log("Full token:", import.meta.env.VITE_PAT); // Check format
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] =useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [sortField, setSortField] = useState("createdTime")
  const [sortDirection, setSortDirection] = useState("desc")
  const [queryString, setQueryString] = useState("")
  const encodeUrl = useCallback (()=> {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH(LOWER("${queryString}"),LOWER({title}))`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, sortField, sortDirection, queryString]);
  //console.log("Authorization header:", token);
  //console.log("Full URL:", url);  //Addd this one too
  //console.log("Full token:", token);  // And this one


  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
      method: "GET",
      headers: {
        "Authorization": token
      }
    };
    
  try {

    const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
         throw new Error(resp.statusText)
      }
    const data = await resp.json();
      //console.log("Data from Airtable:", data); // See response in full
      //console.log("Records array:", data.records); // See records

    const todos = data.records.map((record) => ({
      id: record.id,
      title: record.fields.title,
      isCompleted: record.fields.isCompleted ?? false 
    }))
  //console.log("Transformed todos:", todos); // See mapped data

    setTodoList(todos);

} catch (error) {
    //console.error("Error fetching todos:", error); // See errors
  setErrorMessage(error.message)

} finally {
  setIsLoading(false);
}

 };

    fetchTodos();
}, [encodeUrl])

  const addTodo = async (title) => {
    const newTodo = {
      title,
      id: Date.now(),
      isCompleted: false,   
    };

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted
          } 
        }
      ]
    };
    
    const options = {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    };
    try {
      setIsSaving(true);
    
    const resp = await fetch(encodeUrl(), options);
    //console.log("Response:", resp);
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    
    const { records } = await resp.json();
    
    const savedTodo = {
      id: records[0].id, 
      ...records[0].fields
    };
    
      savedTodo.isCompleted = records[0].fields.isCompleted ?? false;

    setTodoList((prevList) => [...prevList, savedTodo]);
  } catch (error) {
    //console.error(error)
    setErrorMessage(error.message)
  } finally {
    setIsSaving(false);
  }
};

  const completeTodo = async (id) => {
  const originalTodo = todoList.find((todo) => todo.id === id);
  const optimisticTodos= todoList.map((todo) => {
    if (todo.id === id) {
      return {...todo, isCompleted: true }
    }
    return todo;
  });
  setTodoList(optimisticTodos);

  const payload = {
    records: [
      {
        id: id,
        fields: {
          title: originalTodo.title,
          isCompleted: true
        }
      }
    ]
  };

  const options = {
    method: "PATCH",
    headers: {
      "Authorization": token, 
      "Content-Type": "application/json"  
    },
      body: JSON.stringify(payload)

  };
  
  try {
    const resp = await fetch(encodeUrl(), options);
    
    if (!resp.ok) {
      throw new Error(resp.statusText)
    }
  } catch (error) {
    //console.error(error);
    setErrorMessage(`${error.message}. Could not complete todo.`);
    
    const revertedTodos = todoList.map((todo) => {
      if (todo.id === originalTodo.id) {
        return originalTodo;
      }
      return todo;
    });
    setTodoList(revertedTodos);
    }
};

  const updateTodo = async (editedTodo) => {
    setIsSaving(true);
  const originalTodo = todoList.find((todo) => todo.id === editedTodo.id); 

  const optimisticTodos = todoList.map((todo) => 
      todo.id === editedTodo.id ? editedTodo : todo 
  );
  setTodoList(optimisticTodos);

  const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          }
        }
      ]
    };
    const options = {
      method: "PATCH",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    };
    
    try {
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

  
  } catch (error) {
      //console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return originalTodo;
        }
        return todo;
      });

      setTodoList([...revertedTodos]);

  } finally {
    setIsSaving(false);
  }
  };

  return (
    <>
      <div>
        <h1>Todo List</h1>
        <TodoForm onAddTodo={addTodo} />
        <TodoList 
          todoList={todoList} 
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={isLoading} />

            <hr/>
            <TodosViewForm
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              sortField={sortField}
              setSortField={setSortField}
              queryString={queryString}
              setQueryString={setQueryString}
              />

          {errorMessage && (
            <div>
              <hr />
              <p>{errorMessage}</p>
              <button onClick={() => setErrorMessage("")}>Dismiss</button>
              </div>
          )}
      </div>
    </>
  );
}

export default App;
