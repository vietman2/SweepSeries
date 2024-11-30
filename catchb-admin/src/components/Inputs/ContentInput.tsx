import { forwardRef } from "react";
import ReactQuill from "react-quill";
import styled from "styled-components";
import "react-quill/dist/quill.snow.css";

interface Props {
  content: string;
  setContent: (content: string) => void;
}

export const ContentInput = forwardRef<ReactQuill, Props>(
  ({ content, setContent }, ref) => {
    return (
      <Container>
        <ReactQuill
          theme="snow"
          modules={{
            toolbar: [],
          }}
          ref={ref}
          value={content}
          onChange={setContent}
          style={{ height: "90%" }}
        />
      </Container>
    );
  }
);

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 8px;

  color: ${({ theme }) => theme.colors.foreground700};
`;
