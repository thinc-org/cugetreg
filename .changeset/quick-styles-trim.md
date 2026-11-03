---
'web': patch
'admin-web': patch
---

fix: review HTML sanitizer's margin-left style check no longer backtracks quadratically on long whitespace (ReDoS), and style values over 64 characters are dropped
