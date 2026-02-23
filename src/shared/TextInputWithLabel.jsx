import styled from "styled-components";

const StyledField = styled.div`
    display: flex; 
    flex-direction: column;
    gap: 6px;
    padding: 6px 0;
    `;

const StyledLabel = styled.label`
    font-weight: 600;
    `;
const StyledInput = styled.input`
    padding: 8px 10px;
    border: 1px solid #ccc;
    `;

function TextInputWithLabel ({
    elementId,
    label,
    onChange,
    inputRef, 
    value,
}) {
    return (
        <StyledField>
         <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
            <StyledInput 
                //type="text"
                id={elementId} 
                ref={inputRef}
                value={value}
                onChange={onChange}
            />
        </StyledField>
    )
};

export default TextInputWithLabel;