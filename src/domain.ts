export const lastActiveYear = (new Date()).getFullYear();
export const firstActiveYear = 2013;

export const activeYears = (() => {
  const activeYears = []
  for(let year = lastActiveYear; year >= firstActiveYear; year -= 1) {
    activeYears.push(year);
  }

  return activeYears;
})()

export const archiveStartingPath = `/archiv/${lastActiveYear}`

export const projectDetailPath = (slug: string) => `/projekt/${slug}`
