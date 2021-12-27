import React from "react";

/**
 * Dependencies
 */
import classnames from "classnames";

type Props = {} & React.HTMLAttributes<HTMLDivElement>;

const ListGroup: React.FC<Props> = ({ children, className, ...props }) => {
  const cn = classnames(
    "w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-b-0 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
  );

  return (
    <div {...props} className={className}>
      <ul className={cn}>{children}</ul>
    </div>
  );
};

export default ListGroup;
