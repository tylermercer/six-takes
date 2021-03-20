export const pointsFromNumber = (num) => {
  if (num === 55) {
    return 7
  }
  if (num % 11 === 0) {
    return 5
  }
  if (num % 10 === 0) {
    return 3
  }
  if (num % 5 === 0) {
    return 2
  }
  else return 1
}