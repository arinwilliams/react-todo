function TextInputWithLabel ({
    elementId,
    label,
    onChange,
    inputRef, 
    value,
}) {
    return (
        <>
         <label htmlFor={elementId}>{label}</label>
            <input 
                type="text"
                id={elementId} 
                ref={inputRef}
                value={value}
                onChange={onChange}
            />
        </>
    )
};

export default TextInputWithLabel;