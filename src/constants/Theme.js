import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
export const COLORS = {
  textColors: "#313131",
  textColorsBlue: "#4284f3",
  colorYellow: "#fabc05",
  colorGreen: "#33a852",
  textGrayColor: "#828282",
  lightGray3: "#ABABAB",
  transparent: "transparent",
  grayBtnColor: "gray",
  placeHolderColor: "rgba(0,0,0,0.4)",
  blueDark: "#3B45FF",
  background: "white",
  darkGary: "#454545",
  orange: "#FE615A",
  white: "#FFFFFF",
  blue: "#009de0",
  colorText: "#384754",
  bgBlueColor: "#E3ECFF",
  bluecolrHead: "#4292ff",
  bgTielsColor: "#E4EBFF",
  darkBlue: "#111A2C",
  darkGray2: "#757D85",
  gray: "#747474",
  gray2: "#BBBDC1",
  gray3: "#CFD0D7",
  lightGray1: "#E7E7E7",
  lightGray2: "#C4C4C4",
  white2: "#FBFBFB",
  white: "#FFFFFF",
  black: "#000000",
  lightBlue: "#E3EEF9",
  lightGrey: "#97A4B8",
  lineColor: "#EBEBEB",
  skyBlueCOlor: "#007DCC",
  line2COlor: "#828282",
};
export const SIZES = {
  // global sizes
  size16: 16,
  size15: 15,
  size22: 22,
  size18: 18,
  size26: 26,
  iconSize: 22,

  iconArrowSize: 15,
  base: 10,
  font: 14,
  radius: 12,
  padding: 10,
  searchIconsize: 25,
  size35: 35,
  size100: 100,
  // font sizes
  h1: 24,
  h2: 18,
  h3: 18,
  h26: 22,
  h4: 16,
  h5: 12,

  body3: 16,
  body4: 14,
  body5: 12,
  h6: 10,
  topIconHeight: 25,
  topIconWidth: 23,
  width,
  height,
  tomargin: 47,
};
export const FONTS = {
  latoRegularFontOnly: {
    fontFamily: "Lato-Regular",
  },
  fontFamily: "Lato-Regular",
  latoRegularFont: {
    fontFamily: "Lato-Regular",
    fontSize: SIZES.h4,
    lineHeight: 20,
  },

  h1: { fontFamily: "Lato-Regular", fontSize: SIZES.h1, lineHeight: 35 },
  h2: { fontFamily: "Lato-Regular", fontSize: SIZES.h2, lineHeight: 27 },
  h3: { fontFamily: "Lato-Regular", fontSize: SIZES.h3, lineHeight: 20 },
  h2bold: { fontFamily: "Lato-Bold", fontSize: SIZES.h26, lineHeight: 25 },
  h5: { fontFamily: "Lato-Regular", fontSize: SIZES.h5, lineHeight: 17 },
  h6: { fontFamily: "Lato-Regular", fontSize: SIZES.h6, lineHeight: 15 },
  h28: { fontFamily: "Lato-Regular", fontSize: SIZES.h5 },

  h4roboto: {
    fontFamily: "Lato-Regular",
    fontSize: SIZES.h4,
    lineHeight: 20,
  },
  robotoItalic: {
    fontFamily: "Lato-Regular",
  },
  h4robotoLight: {
    fontFamily: "Lato-Regular",
    fontSize: SIZES.h4,
    lineHeight: 20,
  },
  robotoMedium: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
};
export const ConfigColor = {
  white: "#FFFFFF",
  pinkColor: "#C74171",
  fontSize: 9
};
const appTheme = { COLORS, SIZES, FONTS };
export default appTheme;
