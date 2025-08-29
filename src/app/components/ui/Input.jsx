function Input({
    label,
    textarea,
    type = "text",
}) {
  return (
    <div className="flex flex-col w-full">
        { textarea ? 
            <textarea placeholder={label} rows={3} className="py-3 text-black border-primary focus:bg-primary/10 px-2 focus:outline-0 border-b" id={label} type={type} />
            :
            <input placeholder={label} className="py-3 text-black border-primary focus:bg-primary/10 px-2 focus:outline-0 border-b " id={label} type={type} />
        }
    </div>
  );
}

export default Input;