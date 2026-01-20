import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  enabled?: boolean;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  suffix = "",
  prefix = "",
  decimals = 0,
  enabled = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!enabled || hasStarted) return;

    const timeout = setTimeout(() => {
      setHasStarted(true);
      const startTime = performance.now();
      const startValue = start;
      const endValue = end;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (endValue - startValue) * easeOutCubic;
        setCount(Number(currentValue.toFixed(decimals)));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, hasStarted, start, end, duration, delay, decimals]);

  const formattedValue = `${prefix}${count.toLocaleString()}${suffix}`;

  return { count, formattedValue, hasStarted };
}
