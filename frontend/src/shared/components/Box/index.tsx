import React from "react";

/**
 * Dependencies
 */
import classnames from "classnames";

type Props = React.HTMLAttributes<HTMLDivElement>;

const Box: React.FC<Props> = ({ children, className }) => {
  const cn = classnames(
    className,
    "p-4 max-w bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
  );

  return <div className={cn}>{children}</div>;
};

export default Box;
