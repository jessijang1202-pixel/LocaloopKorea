// Module 200 logic — run the keyword dictionary over collected web text.
//
// Deterministic, dictionary/rule-based only (no external NLP). Every rule that
// matches the combined text yields one KeywordHit carrying its total occurrence
// count. Latin patterns match case-insensitively; RegExp rules are matched with
// the global + ignoreCase flags forced on so the dictionary need not repeat them.

import { KEYWORD_RULES } from "./keywords";
import type { KeywordHit, KeywordRule, ScoreCategory } from "./types";

// Force `g` (needed to count all matches) and `i` (case-insensitive) onto a rule
// RegExp without mutating the shared source object.
function withGlobalIgnoreCase(re: RegExp): RegExp {
  let flags = re.flags;
  if (!flags.includes("g")) flags += "g";
  if (!flags.includes("i")) flags += "i";
  return new RegExp(re.source, flags);
}

// Count non-overlapping, case-insensitive occurrences of a literal substring.
function countSubstring(haystackLower: string, needleLower: string): number {
  if (needleLower.length === 0) return 0;
  let count = 0;
  let from = 0;
  for (;;) {
    const idx = haystackLower.indexOf(needleLower, from);
    if (idx === -1) break;
    count += 1;
    from = idx + needleLower.length;
  }
  return count;
}

function matchRule(
  rule: KeywordRule,
  combined: string,
  combinedLower: string,
): { count: number; matched: string } {
  if (typeof rule.pattern === "string") {
    const needle = rule.pattern.toLowerCase();
    return { count: countSubstring(combinedLower, needle), matched: rule.pattern };
  }
  const re = withGlobalIgnoreCase(rule.pattern);
  const matches = [...combined.matchAll(re)];
  return {
    count: matches.length,
    matched: matches.length > 0 ? matches[0][0] : "",
  };
}

// module 200: extractKeywords — combine texts, apply every rule, return hits
// (rules with zero matches are dropped).
export function extractKeywords(texts: string[]): KeywordHit[] {
  const combined = texts.join("\n");
  const combinedLower = combined.toLowerCase();

  const hits: KeywordHit[] = [];
  for (const rule of KEYWORD_RULES) {
    const { count, matched } = matchRule(rule, combined, combinedLower);
    if (count <= 0) continue;
    hits.push({
      category: rule.category,
      polarity: rule.polarity,
      weight: rule.weight ?? 1,
      label: rule.label,
      matched,
      count,
    });
  }
  return hits;
}

// module 200 (claim 2): categories in which any negative keyword fired — these
// activate a risk flag on the final result.
export function riskFlags(hits: KeywordHit[]): ScoreCategory[] {
  const order: ScoreCategory[] = ["LS", "AR", "PD", "LF"];
  const flagged = new Set<ScoreCategory>();
  for (const hit of hits) {
    if (hit.polarity === "negative") flagged.add(hit.category);
  }
  return order.filter((c) => flagged.has(c));
}
