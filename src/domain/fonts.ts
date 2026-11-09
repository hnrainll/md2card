export const CARD_FONTS = [
  {
    id: 'classic',
    name: '默认混排',
    description: '中文黑体 · 英文衬线',
    family: '"Times New Roman", "Nimbus Roman No9 L", "Liberation Serif", "Noto Sans SC Variable", "Noto Sans SC", "Microsoft YaHei", serif',
  },
  {
    id: 'sans',
    name: '思源黑体',
    description: '清晰简洁 · 适合知识卡片',
    family: '"Noto Sans SC Variable", "Noto Sans SC", sans-serif',
  },
  {
    id: 'serif',
    name: '思源宋体',
    description: '书籍质感 · 适合阅读摘录',
    family: '"Noto Serif SC Variable", "Noto Serif SC", serif',
  },
] as const;

export type CardFont = typeof CARD_FONTS[number]['id'];

export function normalizeCardFont(value: unknown): CardFont {
  return CARD_FONTS.find((font) => font.id === value)?.id ?? 'classic';
}

export function cardFontFamily(value: unknown): string {
  return CARD_FONTS.find((font) => font.id === normalizeCardFont(value))!.family;
}
