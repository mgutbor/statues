import { Router } from "@vaadin/router";
import "./components/home/HomeView.js";
import "./components/game/GameView.js";
import "./components/ranking/RankingView.js";

export const initRouter = () => {
  const outlet = document.querySelector("#app");
  const router = new Router(outlet);

  router.setRoutes([
    { path: "/", component: "home-view" },
    { path: "/game", component: "game-view" },
    { path: "/ranking", component: "ranking-view" },
    { path: "(.*)", redirect: "/" }
  ]);
};