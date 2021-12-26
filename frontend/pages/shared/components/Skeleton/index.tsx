import React from "react";
import NavigationHeader from "../NavigationHeader";

const Skeleton: React.FC = ({ children }) => {
  return (
    <div className="container mx-auto">
      <NavigationHeader />

      {children}
    </div>
  );
};

export default Skeleton;
