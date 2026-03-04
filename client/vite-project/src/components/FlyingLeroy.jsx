import { useEffect, useRef, useState } from "react";

export default function FlyingLeroy() {
  const [visible, setVisible] = useState(false);
  const [startTop, setStartTop] = useState(40);
  const [endTop, setEndTop] = useState(40);
  const [direction, setDirection] = useState("right");

  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    let cancelled = false;

    const schedule = () => {
      if (cancelled) return;

      const randomDelay = Math.random() * 20000 + 10000; // 10–30 sec

      const t1 = setTimeout(() => {
        if (cancelled) return;

        const sTop = Math.random() * 85; // start Y
        const eTop = Math.random() * 85; // end Y (different => diagonal)

        setStartTop(sTop);
        setEndTop(eTop);
        setDirection(Math.random() > 0.5 ? "right" : "left");
        setVisible(true);

        const t2 = setTimeout(() => {
          if (cancelled) return;
          setVisible(false);
          schedule();
        }, 4500);

        timeoutsRef.current.push(t2);
      }, randomDelay);

      timeoutsRef.current.push(t1);
    };

    schedule();

    return () => {
      cancelled = true;
      clearAllTimeouts();
    };
  }, []);

  if (!visible) return null;

  return (
    <img
      src="/images/flyingturtle.png"
      alt="Flying Leroy"
      className={`flying-leroy ${direction}`}
      style={{
        "--start-top": `${startTop}vh`,
        "--end-top": `${endTop}vh`,
      }}
    />
  );
}