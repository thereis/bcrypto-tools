import React from "react";

/**
 * Dependencies
 */
import classnames from "classnames";

type Props = {
  message: string;
  type: "success" | "error" | "info" | "warning";
} & React.HTMLAttributes<HTMLDivElement>;

const Alert: React.FC<Props> = ({ type, message, className, ...props }) => {
  const cn = classnames(
    {
      "text-green-700 bg-green-100 dark:bg-green-200 dark:text-green-800":
        type === "success",
      "text-red-700 bg-red-100 dark:bg-red-200 dark:text-red-800":
        type === "error",
      "text-yellow-700 bg-yellow-100 dark:bg-yellow-200 dark:text-yellow-800":
        type === "warning",
      "text-blue-700 bg-blue-100 dark:bg-blue-200 dark:text-blue-800":
        type === "info",
    },
    className,
    "flex p-4 mb-4 text-sm rounded-lg"
  );

  return (
    <div className={cn} role="alert" {...props}>
      <svg
        className="inline flex-shrink-0 mr-3 w-5 h-5"
        fillRule={"inherit" as any}
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        ></path>
      </svg>
      <div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Alert;
