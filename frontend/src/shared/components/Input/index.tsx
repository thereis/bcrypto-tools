import React from "react";

/**
 * Dependencies
 */
import classnames from "classnames";

type Props = {
  id: string;
  value: string;
  primary: string;
  secondary?: string;
  placeholder: string;
  disabled?: boolean;
  regex?: RegExp;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

const Input: React.FC<Props> = ({
  id,
  value,
  primary,
  secondary,
  onChange,
  disabled = false,
  className,
  placeholder,
  ...props
}) => {
  const cn = classnames(className, "mb-6");

  const applyRegex = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    if (!props.regex) return value;

    const regex = new RegExp(props.regex);
    const isValid = regex.test(value);

    if (!isValid) return value.slice(0, -1);

    return value;
  };

  const _handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    return onChange(applyRegex(e));
  };

  return (
    <div {...props} className={cn}>
      <label
        htmlFor="account"
        className="block mb-2 font-medium text-gray-900 dark:text-gray-300"
      >
        <p className="text-base">{primary}</p>
        {secondary && <p className="text-xs">{secondary}</p>}
      </label>

      <input
        id={id}
        type="text"
        value={value}
        onChange={_handleChange}
        disabled={disabled}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
