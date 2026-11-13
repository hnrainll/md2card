import { useEffect, useRef } from 'preact/hooks';
import type { ArticleDocument, LayoutConfig, PageCover } from '../domain/document';
import type { ImageResourceIndex } from '../resources/image-resources';
import { cardContentWidth, cardStyle } from './card-style';
import { CardCover } from './CardCover';
import { BlockView } from './RichText';

export function MeasureStage({ article, config, cover, resources, onMeasure }: {
  article: ArticleDocument;
  config: LayoutConfig;
  cover?: PageCover;
  resources?: ImageResourceIndex;
  onMeasure: (measurements: Record<string, number>, paragraphLines: Record<string, number[]>) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    const collect = async () => {
      if ('fonts' in document) await document.fonts.ready;
      await Promise.all(Array.from(stageRef.current?.querySelectorAll('img') ?? []).map(async (image) => {
        if (!image.complete) await new Promise<void>((resolve) => image.addEventListener('load', () => resolve(), { once: true }));
        try { await image.decode(); } catch { /* broken images retain their native fallback height */ }
      }));
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (cancelled || !stageRef.current) return;
      const next: Record<string, number> = {};
      const paragraphLines: Record<string, number[]> = {};
      stageRef.current.querySelectorAll<HTMLElement>('[data-measure-id]').forEach((element) => {
        const computed = getComputedStyle(element);
        const id = element.dataset.measureId ?? '';
        next[id] = element.getBoundingClientRect().height + Number.parseFloat(computed.marginBottom || '0');
        const paragraph = element.querySelector(':scope > .content-block.block-paragraph > p');
        if (!paragraph || paragraph.querySelector('.inline-math, br')) return;
        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        const starts = [0];
        const range = document.createRange();
        let offset = 0;
        let lastTop: number | undefined;
        while (walker.nextNode()) {
          const node = walker.currentNode;
          for (let index = 0; index < (node.textContent?.length ?? 0); index += 1) {
            range.setStart(node, index);
            range.setEnd(node, index + 1);
            const top = range.getBoundingClientRect().top;
            if (lastTop !== undefined && Math.abs(top - lastTop) > config.bodyFontSize * config.bodyLineHeight * 0.5) starts.push(offset);
            lastTop = top;
            offset += 1;
          }
        }
        if (offset > 0) paragraphLines[id] = starts;
      });
      onMeasure(next, paragraphLines);
    };
    void collect();
    return () => { cancelled = true; };
  }, [article, config, resources, onMeasure]);

  return (
    <aside ref={stageRef} class={`measure-stage theme-${config.cardTheme} density-${config.density} code-appearance-${config.codeBlockAppearance}`} style={{ ...cardStyle(config), width: `${cardContentWidth(config)}px` }} aria-hidden="true">
      {cover?.mode === 'integrated' && <div data-measure-id={cover.id} class="measure-cover"><CardCover cover={cover} /></div>}
      {article.blocks.filter((block) => block.kind !== 'pageBreak').map((block) => (
        <div key={block.id} data-measure-id={block.id} class="measure-block">
          <BlockView block={block} config={config} resources={resources} />
        </div>
      ))}
    </aside>
  );
}
