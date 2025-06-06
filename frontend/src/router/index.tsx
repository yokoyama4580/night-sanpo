import type { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import MapView from "../pages/MapView";
import NewDiary from "../pages/NewDiary";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <NewDiary />
    },
    {
        path: "/map",
        element: <MapView />
    },
    {
        path: "/new",
        element: <Home />
    }
];

export default routes;
