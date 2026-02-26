import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import TodoForm from "../features/TodoForm";
import TodoList from "../features/TodoList/TodoList";
import TodosViewForm from "../features/TodosViewForm";
import styles from './TodosPage.module.css';

function TodosPage ({
    onAddTodo,
    isSaving,
    todoList,
    onCompleteTodo,
    onUpdateTodo,
    isLoading,
    sortDirection,
    setSortDirection,
    sortField,
    setSortField,
    queryString,
    setQueryString,
}) 
{
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // pagination calcs below

    const itemsPerPage = 15;
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
    const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);
    const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
    const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfFirstTodo + itemsPerPage);

    // handlers

    const handlePreviousPage = () => {
        setSearchParams({ page: Math.max(currentPage - 1, 1)} );
    };

    const handleNextPage = () => {
        setSearchParams({ page: Math.min(currentPage + 1, totalPages)} );
    };

    // ensure valid URL prarms
    useEffect(() => {
        if (totalPages > 0) {
            if (!Number.isFinite(currentPage) || currentPage < 1 || currentPage > totalPages) {
                navigate('/');
            }
        }
    }, [currentPage, totalPages, navigate])

    return (
        <>
        <TodoForm onAddTodo={onAddTodo} isSaving={isSaving} />
        <TodosViewForm
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            sortField={sortField}
            setSortField={setSortField}
            queryString={queryString}
            setQueryString={setQueryString}
        />
        <TodoList
        todoList={currentTodos}
        onCompleteTodo={onCompleteTodo}
        onUpdateTodo={onUpdateTodo}
        isLoading={isLoading}
        />

        {/* controls pagination below */}
        <div className={styles.paginationControls}>
        <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            >
                Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                >
                Next
            </button>
            </div>
        </>
    );

}

export default TodosPage;