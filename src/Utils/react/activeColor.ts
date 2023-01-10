export function activeColor(start?: boolean, pause?: boolean, init?: string) {
  return start ? '#DC3E22' : pause ? '#A8B64F' : init;
}

export function colorTheme(procent: number) {
  return `hsl(0,0%,${procent}%)`;
}
