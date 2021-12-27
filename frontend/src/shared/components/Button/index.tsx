import React from "react";

/**
 * Dependencies
 */
import classnames from "classnames";

const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, className, ...props }) => {
  const cn = classnames(
    className,
    "cursor-pointer inline-block px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
  );
  return (
    <button {...props} className={cn}>
      {children}
    </button>
  );
};

export default Button;
