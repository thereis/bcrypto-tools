import React from "react";

/**
 * Dependencies
 */
import classnames from "classnames";

type Props = {
  checked: boolean;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "onChange">;

const Checkbox: React.FC<Props> = ({
  checked,
  className,
  onChange,
  label,
  ...props
}) => {
  const cn = classnames(className, "inline-flex items-center mb-4");

  return (
    <label {...props} className={cn}>
      <input
        type="checkbox"
        className="rounded h-5 w-5 text-indigo-600"
        onChange={onChange}
        checked={checked}
      />

      <span className="ml-2 text-white">{label}</span>
    </label>
  );
};

export default Checkbox;
