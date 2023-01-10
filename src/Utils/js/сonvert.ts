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

  const hourDesc = abbr
    ? 'ч'
    : ` час${hour >= 2 && hour <= 4 ? 'а' : hour >= 5 ? 'ов' : ''}`;

  const minutDesc = abbr
    ? 'м'
    : ` минут${minut === 1 ? 'а' : minut >= 2 && minut <= 4 ? 'ы' : ''}`;

  const secondDesc = abbr
    ? 'с'
    : ` секунд${second === 1 ? 'а' : second >= 2 && second <= 4 ? 'ы' : ''}`;

  return (
    (hour !== 0 ? `${hour}${hourDesc} ` : '') +
    (minut !== 0 ? `${minut}${minutDesc}` : '') +
    (hour === 0 && minut === 0 ? ` ${second}${secondDesc}` : '')
  );
}
