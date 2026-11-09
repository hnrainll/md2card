import { useState } from 'preact/hooks';
import type { LayoutConfig } from '../../../domain/document';
import { authorDate } from '../../../domain/author';

type UpdateConfig = <Key extends keyof LayoutConfig>(key: Key, value: LayoutConfig[Key]) => void;

export function AuthorSettings({ config, onConfigChange }: { config: LayoutConfig; onConfigChange: UpdateConfig }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const importAvatar = async (file?: File) => {
    if (!file) return;
    setError('');
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('请选择 PNG、JPG、WebP 或 GIF 图片。');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('头像不能超过 5 MB，请选择较小的图片。');
      return;
    }
    setBusy(true);
    try {
      const source = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('无法读取图片，请重新选择。'));
        reader.readAsDataURL(file);
      });
      const image = new Image();
      image.src = source;
      await image.decode();
      onConfigChange('authorAvatar', source);
    } catch {
      setError('图片无法读取或解码，请选择其他图片。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h4>作者信息</h4>
      <label class="check-label"><input type="checkbox" checked={config.showAuthor} onChange={(event) => onConfigChange('showAuthor', event.currentTarget.checked)} /> 在首张卡片顶部显示头像、用户名与日期</label>
      {config.showAuthor && (
        <>
          <p class="field-help">仅第一张图片显示，头像与文字区域会为正文预留空间；使用独立封面时显示在封面上。</p>
          <div class="author-avatar-control">
            {config.authorAvatar && <img src={config.authorAvatar} alt="当前作者头像" />}
            <label class="file-button">{busy ? '正在读取…' : config.authorAvatar ? '更换头像' : '上传头像'}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" aria-label="上传作者头像" disabled={busy} onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = '';
                void importAvatar(file);
              }} />
            </label>
            {config.authorAvatar && <button type="button" class="secondary-button" disabled={busy} onClick={() => { onConfigChange('authorAvatar', ''); setError(''); }}>移除头像</button>}
          </div>
          <p class="field-help">支持 PNG、JPG、WebP、GIF，最大 5 MB；头像以圆形居中裁切，仅保存在当前浏览器。</p>
          {error && <p class="author-avatar-error" role="alert">{error}</p>}
          <div class="cover-copy-fields">
            <label class="text-field">用户名（可选）<input value={config.authorName} maxLength={40} placeholder="输入要显示的用户名，例如：小盖" onInput={(event) => onConfigChange('authorName', event.currentTarget.value)} /></label>
            <label class="text-field">日期<input type="date" value={authorDate(config.authorDate)} onInput={(event) => onConfigChange('authorDate', event.currentTarget.value)} /></label>
          </div>
          <p class="field-help">{config.authorDate ? '当前使用指定日期。' : '默认使用打开页面时的当天日期，按年 / 月 / 日显示。'}</p>
          {config.authorDate && <button type="button" class="secondary-button" onClick={() => onConfigChange('authorDate', '')}>恢复为当天日期</button>}
        </>
      )}
    </>
  );
}
