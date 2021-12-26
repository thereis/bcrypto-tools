import React from "react";
import { Hero, Rarity } from "../../../../core/models/hero";
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
  const headers = [
    "ID",
    "Index",
    "Rarity",
    "Level",
    "Color",
    "Skin",
    "Stamina",
    "Speed",
    "Bomb Skin",
    "Bomb Count",
    "Bomb Power",
    "Bomb Range",
    "Ability",
    "Abilities",
  ];

  const rows = heroes.map((hero) => {
    return [
      hero.id,
      hero.index,
      translateRarity(hero.rarity),
      hero.level,
      hero.color,
      hero.skin,
      hero.stamina,
      hero.speed,
      hero.bombSkin,
      hero.bombCount,
      hero.bombPower,
      hero.bombRange,
      hero.ability,
      hero.abilities,
    ];
  });

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
            <div className="overflow-hidden shadow-md sm:rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {headers.map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      {row.map((item, index) => (
                        <td
                          key={`item_${index}`}
                          className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item}
                        </td>
                      ))}
                    </tr>
                  ))}
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
