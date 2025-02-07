export function clean(str: string) {
  return capitalize(str.replace(/_|-/g, " "));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
