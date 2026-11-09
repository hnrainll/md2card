import type { LayoutConfig } from "../../../domain/document";

type UpdateConfig = <Key extends keyof LayoutConfig>(key: Key, value: LayoutConfig[Key]) => void;

export function ContentSettings({ config, onConfigChange, onReadingConfigChange }: {
  config: LayoutConfig;
  onConfigChange: UpdateConfig;
  onReadingConfigChange: (key: "codeFontSize", value: number) => void;
}) {
  return <section class="settings-category-content">
    <h3>内容样式</h3>
    <p class="field-help">分别调整表格、公式、代码和图片的显示效果。</p>
    <h4>表格</h4>
    <div class="setting-control-grid">
      <label class="range-label">表格字号 <output>{config.tableFontSize}px</output><input type="range" min="20" max="25" value={config.tableFontSize} onInput={(event) => onConfigChange("tableFontSize", Number(event.currentTarget.value))} /></label>
    </div>
    <h4>公式</h4>
    <div class="setting-control-grid">
      <label class="range-label">公式缩放 <output>{config.mathScale.toFixed(2)}×</output><input type="range" min="0.72" max="1" step="0.02" value={config.mathScale} onInput={(event) => onConfigChange("mathScale", Number(event.currentTarget.value))} /></label>
    </div>
    <h4>代码</h4>
      <div class="segmented code-block-appearance-control">
        <button
          type="button"
          class={config.codeBlockAppearance === "macos" ? "selected" : ""}
          aria-pressed={config.codeBlockAppearance === "macos"}
          onClick={() => onConfigChange("codeBlockAppearance", "macos")}
        >
          macOS 浅色
          <br />
          <small>默认 · 窗口栏与白色代码区</small>
        </button>
        <button
          type="button"
          class={config.codeBlockAppearance === "theme" ? "selected" : ""}
          aria-pressed={config.codeBlockAppearance === "theme"}
          onClick={() => onConfigChange("codeBlockAppearance", "theme")}
        >
          跟随主题
          <br />
          <small>使用当前主题的代码配色</small>
        </button>
      </div>

    <div class="setting-control-grid">
      <label class="range-label">代码字号 <output>{config.codeFontSize}px</output><input type="range" min="20" max="26" value={config.codeFontSize} onInput={(event) => onReadingConfigChange("codeFontSize", Number(event.currentTarget.value))} /></label>
    </div>
    <label class="check-label"><input type="checkbox" checked={config.codeLineNumbers} onChange={(event) => onConfigChange("codeLineNumbers", event.currentTarget.checked)} /> 代码行号</label>
    <h4>图片</h4>
    <p class="field-help">最大高度按整张卡片高度的比例计算，图片会保持原始比例缩放。</p>
    <div class="setting-control-grid"><label class="range-label">图片最大高度 <output>{config.imageMaxHeightPercent}%</output><input type="range" min="35" max="68" value={config.imageMaxHeightPercent} onInput={(event) => onConfigChange("imageMaxHeightPercent", Number(event.currentTarget.value))} /></label></div>
  </section>;
}
