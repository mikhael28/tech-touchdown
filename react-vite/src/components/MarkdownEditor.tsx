import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Eye, Edit, Save, X } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  showPreview?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content in Markdown...',
  height = '500px',
  showPreview: initialShowPreview = false,
  onSave,
  onCancel,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  className = '',
}) => {
  const [showPreview, setShowPreview] = useState(initialShowPreview);

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant={showPreview ? 'outline' : 'default'}
            size="sm"
            onClick={() => setShowPreview(false)}
            className="flex items-center space-x-1"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            type="button"
            variant={showPreview ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>
        </div>

        {(onSave || onCancel) && (
          <div className="flex items-center space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>{cancelLabel}</span>
              </Button>
            )}
            {onSave && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={onSave}
                className="flex items-center space-x-1"
              >
                <Save className="h-4 w-4" />
                <span>{saveLabel}</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Editor/Preview Content */}
      <div className="relative">
        {showPreview ? (
          <Card className="overflow-auto" style={{ height }}>
            <CardContent className="p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                >
                  {value || '*No content to preview*'}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
            style={{ height, resize: 'vertical' }}
          />
        )}
      </div>

      {/* Markdown Help */}
      {!showPreview && (
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
          <p className="font-semibold">Markdown Quick Reference:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <code># Heading 1</code> - Main heading
            </div>
            <div>
              <code>## Heading 2</code> - Sub heading
            </div>
            <div>
              <code>**bold**</code> - Bold text
            </div>
            <div>
              <code>*italic*</code> - Italic text
            </div>
            <div>
              <code>[link](url)</code> - Hyperlink
            </div>
            <div>
              <code>![alt](url)</code> - Image
            </div>
            <div>
              <code>`code`</code> - Inline code
            </div>
            <div>
              <code>```language```</code> - Code block
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;

