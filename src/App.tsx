import "./App.css";
import router from "./router";
import { RouterProvider } from "react-router";
import { useEffect, useState, Suspense } from "react";
import { initTheme } from "@/store/theme";
import AppSkeleton from "./components/AppSkeleton";

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 初始化主题
    initTheme();
    setReady(true);
  }, []);

  if (!ready) return <AppSkeleton />;

  return (
    <Suspense fallback={<AppSkeleton />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
