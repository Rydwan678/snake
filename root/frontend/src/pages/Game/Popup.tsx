import React, { useEffect, useRef } from "react";
import { Settings } from "../../types";
import { AppContext, AppContextType } from "../../context/app";
import {
  Grid,
  Button,
  Stack,
  Typography,
  createTheme,
  ThemeProvider,
  Fade,
} from "@mui/material";
interface PopupProps {
  settings: Settings;
  bestScore: number | null;
}

export default function Popup(props: PopupProps) {
  const { fn, game, popup } = React.useContext(AppContext) as AppContextType;

  let styles = {
    backgroundColor: "",
    boxShadow: "",
  };

  switch (popup.type) {
    case "win":
      styles.backgroundColor =
        "linear-gradient(90deg, #fcff9e 0%, #c67700 100%)";
      styles.boxShadow = "4px 4px 15px #ff9900";
      break;
    case "lose":
      styles.backgroundColor =
        "linear-gradient(90deg, #EB3349 0%, #F45C43 51%, #EB3349  100%)";
      styles.boxShadow = "4px 4px 15px #ed5568";
      break;
    case "pause":
      styles.backgroundColor =
        "linear-gradient(90deg, #9ebd13 0%, #008552 100%)";
      styles.boxShadow = "1px 1px 15px  #bbe014";
      break;
    case "level":
      styles.backgroundColor =
        "linear-gradient(90deg, #1CB5E0 0%, #2e70ff 100%)";
      styles.boxShadow = "1px 1px 15px  #1CB5E0";
      break;
    default:
      styles.backgroundColor = "#FFFFFF"; // Default color
      styles.boxShadow = "#FFFFFF"; // Default color
  }

  const theme = createTheme({
    components: {
      MuiGrid: {
        styleOverrides: {
          root: {
            background: styles.backgroundColor,
            boxShadow: styles.boxShadow,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            background: styles.backgroundColor,
            boxShadow: styles.boxShadow,
            color: "white",
          },
        },
      },
    },
  });

  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    focusRef.current && focusRef.current.focus();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Fade in={true} timeout={1000}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            position: "absolute",
            height: "100%",
            width: "100%",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <Grid sx={{ position: "absolute", padding: 5 }}>
            <Stack spacing={2}>
              {popup.type === "win" && (
                <Typography variant="h3">YOU WON</Typography>
              )}
              {popup.type === "lose" && (
                <Typography variant="h3">YOU LOST</Typography>
              )}
              {popup.type === "pause" && (
                <Typography variant="h3">GAME PAUSED</Typography>
              )}
              {popup.type === "level" && (
                <Typography variant="h3">LEVEL COMPLETED</Typography>
              )}

              <Stack direction="row" spacing={2}>
                {game.mode !== "pvp" ? (
                  <Button
                    onClick={() => {
                      fn.startGame(game.mode);
                      fn.leaveGame();
                    }}
                  >
                    PLAY AGAIN
                  </Button>
                ) : (
                  <Button href="/lobby" onClick={() => fn.leaveGame()}>
                    BACK TO LOBBY
                  </Button>
                )}
                {(popup.type === "win" || popup.type === "lose") && (
                  <Button href="/" onClick={() => fn.leaveGame()}>
                    BACK TO MENU
                  </Button>
                )}
                {popup.type === "pause" && <Button>RESUME</Button>}
                {popup.type === "level" && (
                  <Button onClick={() => fn.nextLevel()}>NEXT LEVEL</Button>
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Fade>
    </ThemeProvider>
  );
}
