import { LexoRank } from "lexorank";

export const LexoRankService = {
  INITIAL_RANK: LexoRank.middle().toString(),

  getNextRank: (lastRank?: string) => {
    if (!lastRank) {
      return LexoRank.middle().toString();
    }
    return LexoRank.parse(lastRank).genNext().toString();
  },

  getBetweenRank: (prevRank?: string, nextRank?: string) => {
    if (!prevRank && !nextRank) {
      return LexoRank.middle().toString();
    }
    if (!prevRank) {
      return LexoRank.parse(nextRank!).genPrev().toString();
    }
    if (!nextRank) {
      return LexoRank.parse(prevRank!).genNext().toString();
    }
    return LexoRank.parse(prevRank)
      .between(LexoRank.parse(nextRank))
      .toString();
  },
};
