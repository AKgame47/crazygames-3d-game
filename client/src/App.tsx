import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GameMenuPage from "./pages/GameMenu";
import GameOverEnhanced from "./pages/GameOverEnhanced";
import { GameEnhanced } from "./components/game/GameEnhanced";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/menu"} component={GameMenuPage} />
      <Route path={"/game"} component={() => {
        const mode = new URLSearchParams(window.location.search).get('mode') as any;
        return <GameEnhanced mode={mode || 'noob'} />;
      }} />
      <Route path={"/game-over"} component={GameOverEnhanced} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
