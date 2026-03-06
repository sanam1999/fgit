import { createRoot } from "react-dom/client";
import { initData } from "@/data/mockData";
import App from "./App.tsx";
import "./index.css";

initData().then(() => {
    createRoot(document.getElementById("root")!).render(<App />);
});