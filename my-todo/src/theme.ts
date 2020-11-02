import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
export const theme = createMuiTheme({
  // https://material-ui.com/customization/spacing/
  // spacing: (factor) => [0, 2, 3, 5, 8][factor],
  palette: {
    error: {
      main: red.A400,
    },
  },
});
