import { Button } from "@mui/material";
import styled from '@emotion/styled';
import exp from "constants";

const SpotifyColorButton = styled(Button)`
    background-color: #1fdf64;
    color: white;

    &:hover {
        background-color: #179645;
    }
`;

export default SpotifyColorButton;