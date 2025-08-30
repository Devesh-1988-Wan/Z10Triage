'use client';
import WidgetShell from '../WidgetShell';

export default function MarkdownWidget({
  title = 'Notes',
  content = `**Hello** Leadership!\n\nUse this space for context.`,
}: {
  title?: string;
  content?: string;
}) {
  // very light markdown: bold & line breaks
  const html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  return (
    <WidgetShell title={title}>
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </WidgetShell>
  );
}