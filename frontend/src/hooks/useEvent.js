import { useEffect } from "react";

export default function useEvent(event, handler, passive = false) {
  useEffect(() => {
    const options = { passive };
    window.addEventListener(event, handler, options);

    return () => {
      window.removeEventListener(event, handler, options);
    };
  }, [event, handler, passive]);
}
