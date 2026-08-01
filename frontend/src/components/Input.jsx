const Input = ({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded-lg outline-none"
    />
  );
};

export default Input;