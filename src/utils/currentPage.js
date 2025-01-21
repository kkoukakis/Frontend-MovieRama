let currentPage = 1;

export function increaseCurrentPage() {
  currentPage += 1;
}

export function getCurrentPage() {
  return currentPage;
}

export function resetCurrentPage() {
  currentPage = 1;
}
