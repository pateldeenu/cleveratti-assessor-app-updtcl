import * as React from "react";
import Darktheme from "./Darktheme";
import Lighttheme from "./Lighttheme";
export const ThemeContext = React.createContext({
  isdarkTheme: false,
  colors: Lighttheme,
  setScheme: () => {},
});

export const ThemeProvider = (props) => {
  const [isdarkTheme, setIsDarktheme] = React.useState(null);
  const theme = {
    isdarkTheme,
    colors: isdarkTheme ? Lighttheme : Lighttheme,
    setScheme: (colorscheme) => setIsDarktheme(colorscheme === "dark"),
  };
  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);
