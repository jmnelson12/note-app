import { createMuiTheme } from "@material-ui/core/styles";

function useAppTheme({ isDarkTheme }) {
  return createMuiTheme({
    palette: {
      type: isDarkTheme ? "dark" : "light"
    },
    overrides: {
      MuiAppBar: {
        root: {
          "box-shadow": "none"
        }
      },
      MuiSvgIcon: {
        root: {
          "font-size": "1.9rem",
          color: isDarkTheme ? "#FEFEFE" : "#068acf"
        }
      },
      MuiIconButton: {
        root: {
          padding: "8px"
        }
      },
      MuiPaper: {
        root: {
          "background-color": isDarkTheme ? "#1C2022" : "var(--white)"
        },
        elevation1: {
          "border-color": isDarkTheme
            ? "rgba(255,255,255,0.9)"
            : "rgba(150,150,150,1)",
          boxShadow: "unset"
        }
      },
      MuiList: {
        root: {
          height: "100%"
        }
      },
      MuiListItemText: {
        root: {
          color: isDarkTheme ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.9)"
        }
      }
    }
  });
}

export default useAppTheme;
