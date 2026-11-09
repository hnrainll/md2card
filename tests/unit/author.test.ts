import { describe, expect, it } from 'vitest';
import { authorDate, localDate } from '../../src/domain/author';
import { DEFAULT_CONFIG } from '../../src/domain/document';
import { createPagePlan } from '../../src/layout/paginate';
import { parseMarkdown } from '../../src/parser/parse-markdown';

describe('卡片作者信息', () => {
  it('按本地年月日生成默认日期，并保留用户指定日期', () => {
    expect(localDate(new Date(2026, 0, 2, 0, 1))).toBe('2026-01-02');
    expect(authorDate('')).toBe(localDate());
    expect(authorDate('2025-12-31')).toBe('2025-12-31');
  });

  it('仅第一页为作者信息预留空间，后续页恢复完整容量', () => {
    const article = parseMarkdown('第一段。\n\n第二段。\n\n第三段。\n\n第四段。\n\n第五段。\n\n第六段。');
    const measurements = Object.fromEntries(article.blocks.map((block) => [block.id, 380]));
    const config = { ...DEFAULT_CONFIG, coverMode: 'none' as const };
    const withoutAuthor = createPagePlan(article, config, measurements);
    const withAuthor = createPagePlan(article, { ...config, showAuthor: true }, measurements);
    expect(withoutAuthor.pages.map((page) => page.fragments.length)).toEqual([3, 3]);
    expect(withAuthor.pages.map((page) => page.fragments.length)).toEqual([2, 3, 1]);
    expect(withAuthor.pages.flatMap((page) => page.fragments).map((fragment) => fragment.sourceId))
      .toEqual(article.blocks.map((block) => block.id));
  });

  it('独立封面显示作者时，正文第一页也保留完整容量', () => {
    const article = parseMarkdown('第一段。\n\n第二段。\n\n第三段。');
    const measurements = Object.fromEntries(article.blocks.map((block) => [block.id, 380]));
    const plan = createPagePlan(article, { ...DEFAULT_CONFIG, showAuthor: true }, measurements,
      { id: 'cover', mode: 'standalone', title: '封面' });
    expect(plan.pages.map((page) => page.fragments.length)).toEqual([0, 3]);
  });
});
