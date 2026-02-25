export const actions = {
    fetchTodos: "fetchTodos",
    loadTodos:"loadTodos",
    setLoadError: "setLoadError",
    startRequest: "startRequest",
    addTodo: "addTodo",
    endRequest: "endRequest",
    updateTodo: "updateTodo",
    completeTodo: "completeTodo",
    revertTodo: "revertTodo",
    clearError: "clearError",
};

export const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: "",
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.fetchTodos:
            return {
                ...state,
                isLoading: true,
            };

        case actions.loadTodos: {
            const todos = (action.records ?? []).map((record) => ({
                id: record.id,
                title: record.fields?.title ?? "",
                isCompleted: record.fields?.isCompleted ?? false,
            }
        ));

            return {
                ...state,
                todoList: todos,
                isLoading: false,
            };
        }
        
        case actions.setLoadError:
            return {
                ...state,
                errorMessage: action.error?.message ?? "Request Failed",
                isLoading: false,
                isSaving: false,
            };
        
        case actions.startRequest:
            return {
                ...state,
                isSaving: true,
            };
        
        case actions.addTodo: {
            const record = action.records?.[0];
            if (!record) return { ...state, isSaving: false };

            const savedTodo = { id: record.id, ...record.fields };
            savedTodo.isCompleted = record.fields.isCompleted ?? false;

            return {
                ...state,
                todoList: [...state.todoList, savedTodo],
                isSaving: false,
            };
        }

        case actions.endRequest:
            return {
                ...state,
                isLoading: false,
                isSaving: false,
            };
        
        case actions.completeTodo: {
            const updatedTodos = state.todoList.map((todo) => 
                todo.id === action.id ? { ...todo, isCompleted: true} : todo
            );

            return {
                ...state,
                todoList: updatedTodos,
            };
        }

        case actions.revertTodo:
        case actions.updateTodo: {
            const editedTodo = action.editedTodo ?? action.originalTodo;
            if (!editedTodo) return { ...state };

            const updatedTodos = state.todoList.map((todo) => 
            todo.id === editedTodo.id ? editedTodo: todo
            );

            const updatedState = {
                ...state,
                todoList: updatedTodos,
            };
            if (action.error) {
                updatedState.errorMessage = action.error.message;
            }
            
            return updatedState;
        }
        case actions.clearError:
            return {
                ...state,
                errorMessage: "",
            };
        
        default:
            return state;
    }
}