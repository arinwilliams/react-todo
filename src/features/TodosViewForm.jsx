import { useState, useEffect} from "react";
import styled from "styled-components";

const StyledForm = styled.form`
    display: grid;
    gap: 10px;
    padding: 8px 0;
    `;
const StyledRow = styled.div`
    display: grid;
    gap: 6px;
    `;

const StyledLabel = styled.label`
    font-weight: 600;
    `;

const StyledInput = styled.input`
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    `;

const StyledSelect = styled.select`
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    `;


function TodosViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {
    const [localQueryString, setLocalQueryString] = useState(queryString);

    useEffect (()=> {
        setLocalQueryString(queryString);
    }, [queryString]);

    useEffect(() => {
    const debounce = setTimeout(() => {
        setQueryString(localQueryString);

    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);
    
    const preventRefresh = (event) => {
         event.preventDefault();
     };

return (
    <StyledForm onSubmit={preventRefresh}>
        <StyledRow>
            <StyledLabel htmlFor="searchTodos">Search todos</StyledLabel>
            <StyledInput
                id="searchTodos"
                type="text"
                value={localQueryString}
                onChange={(event) => setLocalQueryString(event.target.value)}
            />
            <button type="button" onClick={() => setLocalQueryString("")}>
                Clear
            </button>
        </StyledRow>

        <StyledRow>
            <StyledLabel htmlFor="sortField">Sort by</StyledLabel>
            <StyledSelect
                id="sortField"
                value={sortField}
                onChange={(event) => setSortField(event.target.value)}
                >
                
                <option value="title">Title</option>
                <option value="createdTime">Time added</option>
            </StyledSelect>

            <StyledLabel htmlFor="sortDirection">Direction</StyledLabel>
            <StyledSelect
            id="sortDirection"
            value={sortDirection}
            onChange={(event) => setSortDirection(event.target.value)}
            >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>

            </StyledSelect>
        </StyledRow>
    </StyledForm>
);

}

export default TodosViewForm;