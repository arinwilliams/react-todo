import { useState, useEffect, useCallback, useReducer } from "react";
import { Routes, Route, useLocation } from "react-router";
import Header from "./shared/Header";
import TodosPage from "./pages/TodosPage";
import "./App.css";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
//import TodoForm from "./features/TodoForm";
//import TodoList from "./features/TodoList/TodoList";
//import TodosViewForm from "./features/TodosViewForm";
import styles from "./App.module.css";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
 // console.log("BASE_ID:", import.meta.env.VITE_BASE_ID);
  //console.log("TABLE_NAME:", import.meta.env.VITE_TABLE_NAME);
  //console.log("PAT exists:", !!import.meta.env.VITE_PAT);
  //console.log("Full token:", import.meta.env.VITE_PAT); // Check format
  // const [todoList, setTodoList] = useState([]);
  // const [isLoading, setIsLoading] =useState(false);
  // const [errorMessage, setErrorMessage] = useState("")
  // const [isSaving, setIsSaving] = useState(false)
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const { todoList, isLoading, isSaving, errorMessage } = todoState;
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
  }, [sortField, sortDirection, queryString]);
  //console.log("Authorization header:", token);
  //console.log("Full URL:", url);  //Addd this one too
  //console.log("Full token:", token);  // And this one

  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/') {
      document.title = 'Todo List'; 
    } else if (location.pathname === '/about') {
      document.title = 'About';
    } else {
      document.title = 'Not Found';
    } 
  }, [location])

  useEffect(() => {
    const fetchTodos = async () => {
      //setIsLoading(true);
      dispatch({ type: todoActions.fetchTodos })

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

    dispatch({
      type: todoActions.loadTodos,
      records: data.records,
    });

    // const todos = data.records.map((record) => ({
    //   id: record.id,
    //   title: record.fields.title,
    //   isCompleted: record.fields.isCompleted ?? false 
    // }))
  //console.log("Transformed todos:", todos); // See mapped data

    // setTodoList(todos);

} catch (error) {
  dispatch({
    type: todoActions.setLoadError,
    error,
  });
    //console.error("Error fetching todos:", error); // See errors
  //setErrorMessage(error.message)

} 

// finally {
//   setIsLoading(false);
// }

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
      //setIsSaving(true);
      dispatch({ 
        type: todoActions.startRequest });

    const resp = await fetch(encodeUrl(), options);
    //console.log("Response:", resp);
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    
    const { records } = await resp.json();
    
    // const savedTodo = {
    //   id: records[0].id, 
    //   ...records[0].fields
    // };
    
    //   savedTodo.isCompleted = records[0].fields.isCompleted ?? false;

    // setTodoList((prevList) => [...prevList, savedTodo]);
    dispatch({
      type: todoActions.addTodo,
      records,
    }); 

  } catch (error) {
    //console.error(error)
    //setErrorMessage(error.message)
    dispatch({ type: todoActions.setLoadError, error });
  } finally {
    //setIsSaving(false);
    dispatch({ type:todoActions.endRequest });
  }
};

  const completeTodo = async (id) => {
  const originalTodo = todoList.find((todo) => todo.id === id);

  dispatch({
    type: todoActions.completeTodo,
    id,
  });
  // const optimisticTodos= todoList.map((todo) => {
  //   if (todo.id === id) {
  //     return {...todo, isCompleted: true }
  //   }
  //   return todo;
  // });
  // setTodoList(optimisticTodos);

  const payload = {
    records: [
      {
        id,
        fields: {
          title: originalTodo.title,
          isCompleted: true
        },
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
    dispatch({
      type: todoActions.revertTodo,
      originalTodo,
      error: new Error(`${error.message}. Could not complete todo.`)
    });
    //console.error(error);
    //setErrorMessage(`${error.message}. Could not complete todo.`);
    
    // const revertedTodos = todoList.map((todo) => {
    //   if (todo.id === originalTodo.id) {
    //     return originalTodo;
    //   }
    //   return todo;
    // });
    // setTodoList(revertedTodos);
    }
};

  const updateTodo = async (editedTodo) => {
    //setIsSaving(true);
    dispatch({ type: todoActions.startRequest });
  const originalTodo = todoList.find((todo) => todo.id === editedTodo.id); 

  // const optimisticTodos = todoList.map((todo) => 
  //     todo.id === editedTodo.id ? editedTodo : todo 
  // );
  // setTodoList(optimisticTodos);
  dispatch({
    type: todoActions.updateTodo,
    editedTodo,
  });

  const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
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
      //setErrorMessage(`${error.message}. Reverting todo...`);
      dispatch({
        type: todoActions.revertTodo,
        originalTodo,
        error: new Error(`${error.message}. Reverting todo...`)
      });

      // const revertedTodos = todoList.map((todo) => {
      //   if (todo.id === originalTodo.id) {
      //     return originalTodo;
      //   }
      //   return todo;
      // });

      // setTodoList([...revertedTodos]);

  } finally {
    //setIsSaving(false);
    dispatch({ type: todoActions.endRequest });
  }
  };

  return (
  <>
    <div className={styles.container}>
      <Header title="My Todo App" />
      {errorMessage && <p>{errorMessage}</p>}
      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              onAddTodo={addTodo}
              isSaving={isSaving}
              todoList={todoList}
              onCompleteTodo={completeTodo}
              onUpdateTodo={updateTodo}
              isLoading={isLoading}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              sortField={sortField}
              setSortField={setSortField}
              queryString={queryString}
              setQueryString={setQueryString}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </>
);
}

export default App;
