import React,{useId} from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    ...props
            
    
}, ref) {
    const id=useId()
    return (
      <div className="w-full">
        {label && (
          <label className="inline-block mb-1 pl-1" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          id={id} // Associates input with the label
          type={type} // Sets the input type (text, email, password, etc.)
          ref={ref} // Very important for react-hook-form to work
          {...props} // Spreads all register props: name, onChange, value, etc.
          className={
            // Tailwind CSS classes for styling the input
            `px-3 py-2 rounded-lg bg-white text-black outline-none 
           focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`
          }
        />
      </div>
    );
})


export default Input
