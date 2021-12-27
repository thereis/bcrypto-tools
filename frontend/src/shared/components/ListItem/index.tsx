import React from "react";

/**
 * Dependencies
 */
import classnames from "classnames";

type Props = {
  primary: string | number;
  secondary: string | number;
  isLast?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const ListItem: React.FC<Props> = ({
  primary,
  secondary,
  isLast,
  className,
}) => {
  const cn = classnames(
    className,
    {
      "border-b": !isLast,
    },
    "py-2 px-4 w-full rounded-t-lg border-gray-200 dark:border-gray-600 break-words"
  );

  return (
    <li className={cn}>
      <p className="text-base">{primary}</p>
      <p className="text-xs">{secondary}</p>
    </li>
  );
};

export default ListItem;
