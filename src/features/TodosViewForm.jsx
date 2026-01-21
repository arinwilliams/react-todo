function TodosViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {

    const preventRefresh = (event) => {
        event.preventDefault();
    };

return (
    <form onSubmit={preventRefresh}>
        <div>
            <label htmlFor="searchTodos">Search todos</label>
            <input
                id="searchTodos"
                type="text"
                value={queryString}
                onChange={(event) => setQueryString(event.target.value)}
            />
            <button type="button" onClick={() => setQueryString("")}>
                Clear
            </button>
        </div>

        <div>
            <label htmlFor="sortField">Sort by</label>
            <select
                id="sortField"
                value={sortField}
                onChange={(event) => setSortField(event.target.value)}
                >
                
                <option value="title">Title</option>
                <option value="createdTime">Time added</option>
            </select>

            <label htmlFor="sortDirection">Direction</label>
            <select
            id="sortDirection"
            value={sortDirection}
            onChange={(event) => setSortDirection(event.target.value)}
            >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>

            </select>
        </div>
    </form>
);

}

export default TodosViewForm;