import React, { useEffect, useState } from 'react';

export function useClickExept(
  el: HTMLElement | null,
  funAction: () => void = () => {},
  mounted: boolean = false
) {
  const [isMounted, setMounted] = useState(mounted);

  useEffect(() => {
    setMounted(!isMounted);
    const handleClick = (event: MouseEvent) =>
      event.target instanceof Node &&
      !el?.contains(event.target) &&
      funAction();

    isMounted && document.body.addEventListener('click', handleClick);
    return () => document.body.removeEventListener('click', handleClick);
  }, [el, mounted]);
}
