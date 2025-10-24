import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: ${props => props.theme.colors.primary};
    --secondary: ${props => props.theme.colors.secondary};
    --bg: ${props => props.theme.colors.background};
    --text: ${props => props.theme.colors.text};
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background: var(--bg);
    color: var(--text);
  }
  a { color: var(--primary); text-decoration: none; }
  .container { max-width: 1100px; margin: 0 auto; padding: 16px; }
  .card {
    background: white;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }
`;

export default GlobalStyle;
