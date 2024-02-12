import {useEffect, useRef} from 'react';

export default function useCleanupEffect(callback, dependencies) {
  const effectRef = useRef();

  // Store the effect function in the ref
  effectRef.current = callback;

  // Clean up the effect when the component unmounts
  useEffect(() => {
    return () => {
      // Invoke the stored effect function to perform cleanup
      if (typeof effectRef.current === 'function') {
        effectRef.current();
      }
    };
  }, []);

  // Invoke the effect function when dependencies change
  useEffect(() => {
    if (typeof effectRef.current === 'function') {
      return effectRef.current();
    }
  }, dependencies);
}
