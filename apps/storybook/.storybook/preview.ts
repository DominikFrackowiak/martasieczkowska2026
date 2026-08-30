/// <reference path="./css.d.ts" />

import "../../front/src/styles/global.css";

const preview = {
 parameters: {
  controls: {
   matchers: {
    color: /(background|color)$/i,
    date: /Date$/i,
   },
  },
 },
};

export default preview;
