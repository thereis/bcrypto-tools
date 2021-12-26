import React from "react";

const ListGroup: React.FC = ({ children }) => {
  return (
    <ul className="w-48 text-sm font-medium text-gray-900 bg-white rounded-lg border border-b-0 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {children}
    </ul>
  );
};

export default ListGroup;
