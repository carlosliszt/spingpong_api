export function getRatingBand(rating: number): string {
  if (rating >= 3300) return 'A';
  if (rating >= 2800) return 'B';
  if (rating >= 2300) return 'C';
  if (rating >= 1900) return 'D';
  if (rating >= 1600) return 'E';
  if (rating >= 1300) return 'F';
  if (rating >= 1000) return 'G';
  if (rating >= 850) return 'H';
  if (rating >= 700) return 'I';
  if (rating >= 550) return 'J';
  if (rating >= 400) return 'L';
  if (rating >= 350) return 'M';
  if (rating >= 251) return 'N';
  return 'O';
}

