import { LexoRank } from "lexorank";

// Lexicographic ordering strings used for drag-and-drop reordering of carts and cart items.
// Ranks are stored as strings in DB; no index re-numbering needed when inserting between two items.
export const LexoRankService = {
  INITIAL_RANK: LexoRank.middle().toString(),

  // Append after the last item; starts at middle if the list is empty
  getNextRank: (lastRank?: string) => {
    if (!lastRank) {
      return LexoRank.middle().toString();
    }
    return LexoRank.parse(lastRank).genNext().toString();
  },

  // Insert between two existing items; falls back to before/after when one neighbour is absent
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
