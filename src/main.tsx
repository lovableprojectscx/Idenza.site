import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

// SpotlightBackground moved into App.tsx — lazy-loaded and only mounted
// on marketing routes. Keeping main.tsx as lean as possible so the initial
// JS parse/eval is minimal and React can hydrate the shell immediately.

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
