import { useState, useEffect } from "react";

function getWindowHeight() {
  const { innerHeight: height } = window;
  return { height };
}

export default function useWindowHeight() {
  const [windowHeight, setWindowHeight] = useState(getWindowHeight());

  useEffect(() => {
    const handleResize = () => setWindowHeight(getWindowHeight());

    window.addEventListener("resize", handleResize);
  }, []);

  return windowHeight;
}
