import React from 'react';

const TextInput = (props) => {
  return (
    <input
      type="text"
      className="bg-zinc-200 text-zinc-600 font-sans ring-1 ring-zinc-400 focus:ring-2 focus:ring-blue-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-blue-300 hover:shadow-blue-400 hover:shadow-lg"
      {...props}
    />
  );
};

export default TextInput;
