// Supabase caps every select at 1,000 rows per request. With 1,400+ places in
// the dataset, any unpaged .select() silently truncates — the map, course
// candidates, and admin tables would all see a partial database. This helper
// pages through .range() windows until a short page signals the end.
//
// Usage:
//   const rows = await fetchAllRows<RowType>((from, to) =>
//     supabase.from("places").select(COLUMNS).order("name_ko").range(from, to)
//   );

const PAGE = 1000;

export async function fetchAllRows<T>(
  page: (
    from: number,
    to: number
  ) => PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>
): Promise<T[]> {
  const all: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await page(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as T[];
    all.push(...rows);
    if (rows.length < PAGE) break;
  }
  return all;
}
