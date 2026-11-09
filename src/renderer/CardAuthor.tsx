import type { LayoutConfig } from '../domain/document';
import { authorDate } from '../domain/author';

export function CardAuthor({ config }: { config: LayoutConfig }) {
  if (!config.showAuthor) return null;
  const date = authorDate(config.authorDate);
  return (
    <header class="card-author">
      {config.authorAvatar && <img class="card-author-avatar" src={config.authorAvatar} alt="作者头像" />}
      <div class="card-author-info">
        {config.authorName.trim() && <div class="card-author-name">{config.authorName}</div>}
        <time class="card-author-date" dateTime={date}>{date.replaceAll('-', '/')}</time>
      </div>
    </header>
  );
}
