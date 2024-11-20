import styled from "styled-components";

interface Props {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  password?: boolean;
}

export function TextInput({
  placeholder,
  value,
  onChange,
  password = false,
}: Readonly<Props>) {
  return (
    <InputWrapper>
      <Input
        type={password ? "password" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="text-input"
      />
    </InputWrapper>
  );
}

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 25vw;
`;

const Input = styled.input`
  border: ${({ theme }) => `1.5px solid ${theme.colors.borderDark}`};
  outline: none;
  border-radius: 4px;
  padding: 12px 8px 8px 16px;
  width: 100%;

  font-size: 18px;
`;
