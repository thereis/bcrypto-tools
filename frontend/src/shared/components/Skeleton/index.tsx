import React from "react";

/**
 * Dependencies
 */
import classname from "classnames";

/**
 * Components
 */
import NavigationHeader from "../NavigationHeader";

type Props = {} & React.HTMLAttributes<HTMLDivElement>;

const Skeleton: React.FC<Props> = ({ children, ...props }) => {
  const cn = classname(props.className);

  return (
    <div className="container mx-auto">
      <NavigationHeader />

      <div {...props} className={cn}>
        {children}
      </div>
    </div>
  );
};

export default Skeleton;
