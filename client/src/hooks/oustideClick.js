import { useEffect } from "react";

export default function OutsideClick(ref, func) {
  useEffect(() => {
    function handleClickOutside(event) {
      // console.log(ref.current.className);
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        ref.current.className !== "hidden"
      ) {
        const asd = () => func();
        asd();
        
        // ref.current.className = "hidden";
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
