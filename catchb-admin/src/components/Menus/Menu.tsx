import { useEffect, useRef } from "react";
import styled from "styled-components";

import { AppIcon } from "@components/Icons";
import { MenuOptionType } from "@models/app";

interface Prop {
  options: MenuOptionType[];
  isOpen: boolean;
  toggleDropdown: () => void;
  small?: boolean;
}

export function Menu({
  options,
  isOpen,
  toggleDropdown,
  small = false,
}: Readonly<Prop>) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        toggleDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <DropdownContainer ref={dropdownRef}>
      <button onClick={toggleDropdown} data-testid="menu">
        <AppIcon icon="dots" size={small ? 14 : 20} color="#252525" />
      </button>
      <DropdownMenu $isOpen={isOpen}>
        {options.map((option) => (
          <DropdownItem key={option.label} onClick={option.onClick}>
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
}

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  align-self: center;
`;

const DropdownMenu = styled.ul<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  list-style: none;
  padding: 10px 0;
  margin: 0;
  width: 160px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;

  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

const DropdownItem = styled.li`
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #f0f0f0;
  }
`;
