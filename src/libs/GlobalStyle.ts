import "@fontsource/m-plus-rounded-1c/400.css";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'M PLUS Rounded 1c', sans-serif;
  }
  p, h1, h2, h3, h4, h5, h6, li, td, a, span {
    transform: rotate(0.028deg);
  }
`
// ジャギー対策で微回転させる
export default GlobalStyle;