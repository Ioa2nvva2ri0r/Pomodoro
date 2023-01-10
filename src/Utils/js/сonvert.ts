export function convertInString(...lines: any[]) {
  return lines.filter((el) => typeof el === 'string').join(' ');
}

export function capitalizedString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function convertTime(time: number, abbr: boolean = false): string {
  const hour = Math.floor(time / 3600);
  const minut = Math.floor((time % 3600) / 60);
  const second = Math.floor(time % 3600);

  const lastSymbol = (number: number) => Number(number.toString().slice(-1));
  const ending = (number: number) =>
    lastSymbol(number) === 0 ||
    lastSymbol(number) >= 5 ||
    (number >= 10 && number <= 20)
      ? ''
      : lastSymbol(number) >= 2 && lastSymbol(number) <= 4
      ? 'ы'
      : 'а';

  const hourDesc = abbr
    ? 'ч'
    : ` час${
        lastSymbol(hour) >= 2 && lastSymbol(hour) <= 4
          ? 'а'
          : lastSymbol(hour) >= 5
          ? 'ов'
          : ''
      }`;
  const minutDesc = abbr ? 'м' : ` минут${ending(minut)}`;
  const secondDesc = abbr ? 'с' : ` секунд${ending(second)}`;

  return (
    (hour !== 0 ? `${hour}${hourDesc} ` : '') +
    (minut !== 0 ? `${minut}${minutDesc}` : '') +
    (hour === 0 && minut === 0 ? ` ${second}${secondDesc}` : '')
  );
}
