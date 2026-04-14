import React from 'react';
import type { MenuOption, SubMenuOption } from '../types';

interface MenuOptionsProps {
  options: readonly MenuOption[] | readonly SubMenuOption[];
  onOptionClick: (option: MenuOption) => void;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ options, onOptionClick }) => {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          key={option.label}
          onClick={() => onOptionClick(option as MenuOption)}
          className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-left hover:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <p className="font-semibold text-emerald-800">{option.label}</p>
          <p className="text-sm text-gray-500">{option.description}</p>
        </button>
      ))}
    </div>
  );
};

export default MenuOptions;