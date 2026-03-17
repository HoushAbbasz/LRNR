import { useEffect, useRef, useState } from "react";

export default function FlyingLeroy() {
  const [visible, setVisible] = useState(false);
  const [startTop, setStartTop] = useState(40);
  const [endTop, setEndTop] = useState(40);
  const [direction, setDirection] = useState("right");

  const timeoutsRef = useRef([]);

  // Helper function to clear all active timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    let cancelled = false; // prevents state updates if component unmounts

    // Function that schedules the turtle to fly across the screen
    const schedule = () => {
      if (cancelled) return;

      const randomDelay = Math.random() * 20000 + 10000; // 10–30 sec

      const t1 = setTimeout(() => {
        if (cancelled) return;

        // Random starting and ending vertical positions
        // This creates a diagonal flight path
        const sTop = Math.random() * 85; // start Y
        const eTop = Math.random() * 85; // end Y (different => diagonal)

        setStartTop(sTop);
        setEndTop(eTop);
        
        // Randomly choose whether the turtle flies left or right
        setDirection(Math.random() > 0.5 ? "right" : "left");

        //Show turtle
        setVisible(true);

        // Hide the turtle after it finishes flying
        const t2 = setTimeout(() => {
          if (cancelled) return;
          setVisible(false);

        // Schedule the next appearance
          schedule();
        }, 4500);

        timeoutsRef.current.push(t2);
      }, randomDelay);

      timeoutsRef.current.push(t1);
    };

    schedule();

     // Cleanup: stop all timeouts if component unmounts
    return () => {
      cancelled = true;
      clearAllTimeouts();
    };
  }, []);

  // If not visible, render nothing
  if (!visible) return null;

  return (
    <img
      src="/images/flyingturtle.png"
      alt="Flying Leroy"
      className={`flying-leroy ${direction}`}

      // CSS variables used in animations for starting/ending positions
      style={{
        "--start-top": `${startTop}vh`,
        "--end-top": `${endTop}vh`,
      }}
    />
  );
}