/** AsyncStorage key for one user's saved word ids, so accounts don't share lists. */
export const savedWordsKey = (uid: string | undefined) =>
  `@drukword/savedWordIds/${uid ?? 'guest'}`;
