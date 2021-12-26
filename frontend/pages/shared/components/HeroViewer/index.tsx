import React from "react";

/**
 * Dependencies
 */
import { Hero, Rarity } from "../../../../core/models/hero";
import { Column, useSortBy, useTable } from "react-table";

/**
 * Components
 */
import Alert from "../Alert";

const translateRarity = (rarity: Rarity) => {
  switch (rarity) {
    case Rarity.Common:
      return "Common";
    case Rarity.Rare:
      return "Rare";
    case Rarity.Super_Rare:
      return "Super Rare";
    case Rarity.Epic:
      return "Epic";
    case Rarity.Legend:
      return "Legend";
    case Rarity.Super_Legend:
      return "Super Legend";
    default:
      return "Unknown";
  }
};

type Props = {
  heroes: Hero[];
};

const HeroViewer: React.FC<Props> = ({ heroes }) => {
  const columns: Column<Hero>[] = React.useMemo(
    () => [
      {
        Header: "Data",
        columns: [
          {
            Header: "ID",
            accessor: "id",
          },
          {
            Header: "Index",
            accessor: "index",
          },
        ],
      },
      {
        Header: "Hero Stats",
        columns: [
          {
            Header: "Rarity",
            accessor: "rarity",
            Cell: ({ cell: { value } }: any) => translateRarity(value),
          },
          {
            Header: "Level",
            accessor: "level",
          },
          {
            Header: "Stamina",
            accessor: "stamina",
          },
          {
            Header: "Speed",
            accessor: "speed",
          },
          {
            Header: "Bomb Count",
            accessor: "bombCount",
          },
          {
            Header: "Bomb Power",
            accessor: "bombPower",
          },
          {
            Header: "Bomb Range",
            accessor: "bombRange",
          },
          {
            Header: "Abilities",
            accessor: "abilities",
          },
        ],
      },
    ],
    []
  );

  const generateData = (heroes: Hero[]) => {
    return heroes.map((hero: Hero) => {
      return hero;
    });
  };

  const data = React.useMemo(() => generateData(heroes), [heroes]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  if (!heroes.length)
    return (
      <Alert
        className="mt-6"
        type="warning"
        message="This account has no Heroes"
      />
    );

  return (
    <>
      <div className="flex flex-col mt-6">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-md">
              <table className="min-w-full" {...getTableProps()}>
                <thead className="bg-gray-50 dark:bg-gray-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column: any) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className=" py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                        >
                          {column.render("Header")}

                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);

                    const className =
                      row.index % 2 === 0
                        ? "bg-white border-b dark:bg-gray-800 dark:border-gray-600"
                        : "bg-gray-50 border-b dark:bg-gray-700 dark:border-gray-600";

                    return (
                      <tr className={className} {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroViewer;
