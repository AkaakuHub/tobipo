import { Button } from "@mui/material";
import styled from '@emotion/styled';

interface CustomButtonProps {
  children: React.ReactNode;
  href?: string;
  target?: string;
}

const CustomButton = styled(Button) <CustomButtonProps>`
  color: #1976d2;
  font-family: var(--m-plus-rounded-1c);
  text-transform: none;
  ${({ href }) => href && `
    text-decoration: none;
  `}
`;

const CustomLink: React.FC<CustomButtonProps> = ({ children, href, target }) => {
  return (
    <CustomButton href={href} target={target ? target : "_self"}>
      <p style={{ margin: 0 }}>
        {children}
      </p>
    </CustomButton>
  );
};

export default CustomLink;