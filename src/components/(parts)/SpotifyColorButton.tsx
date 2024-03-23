import { Button } from "@mui/material";
import styled from '@emotion/styled';

const SpotifyColorButton = styled(Button)`
    background-color: #1fdf64;
    color: #000;
    text-transform: none;

    &:hover {
        background-color: #16b54f;
    }
`;

export default SpotifyColorButton;