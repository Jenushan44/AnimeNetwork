import { useRef } from "react";


export default function useHorizontalScroll() {
  const gridRef = useRef(null);

  const scrollLeft = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  return { gridRef, scrollLeft, scrollRight };
}
