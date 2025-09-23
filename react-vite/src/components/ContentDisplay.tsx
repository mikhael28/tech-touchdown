import React from 'react';
import { ExternalLink, Calendar, User, Globe, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { marked } from 'marked';

interface ContentDisplayProps {
  content: {
    title: string;
    url: string;
    publishedDate?: string;
    author?: string;
    text?: string;
    highlights?: string[];
    summary?: string;
  };
  isLoading?: boolean;
  error?: string | null;
  onOpenInIframe?: () => void;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  isLoading = false,
  error = null,
  onOpenInIframe,
}) => {
  const [showRawContent, setShowRawContent] = React.useState(false);
  const getDomainFromUrl = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  const cleanContent = (text: string): string => {
    if (!text) return '';
    
    // Remove excessive whitespace and normalize line breaks
    let cleaned = text
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple line breaks with double
      .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
      .trim();
    
    // Basic markdown link detection and conversion
    cleaned = cleaned.replace(
      /(https?:\/\/[^\s]+)/g, 
      '[$1]($1)'
    );
    
    return cleaned;
  };

  const hasRawContent = content.text && content.text.length > 500;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Content</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.open(content.url, '_blank')} variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Original Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {content.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span>{getDomainFromUrl(content.url)}</span>
          </div>
          
          {content.publishedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(content.publishedDate)}</span>
            </div>
          )}
          
          {content.author && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{content.author}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => window.open(content.url, '_blank')}
            variant="outline"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Original
          </Button>
          {onOpenInIframe && (
            <Button
              onClick={onOpenInIframe}
              variant="default"
              size="sm"
            >
              View in Frame
            </Button>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {content.summary && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">AI Summary</Badge>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {content.summary}
          </p>
        </div>
      )}

      {/* Key Highlights */}
      {content.highlights && content.highlights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Badge variant="outline">Key Highlights</Badge>
          </h3>
          <ul className="space-y-2">
            {content.highlights.map((highlight, idx) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="text-blue-500 mt-1 font-bold">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      {content.text && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Article Content</h3>
          
          {/* Rendered Markdown Content */}
          <div 
            className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700"
            dangerouslySetInnerHTML={{ 
              __html: marked(cleanContent(content.text), {
                breaks: true,
                gfm: true
              })
            }}
          />

          {/* Raw Content Toggle (only show if content is long) */}
          {hasRawContent && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRawContent(!showRawContent)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                {showRawContent ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide Raw Content
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show Raw Content
                  </>
                )}
              </Button>
              
              {showRawContent && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Raw Content</h4>
                  <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-x-auto">
                    {content.text}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!content.text && !content.summary && !content.highlights && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No content available for this article.</p>
          <Button
            onClick={() => window.open(content.url, '_blank')}
            variant="outline"
            className="mt-4"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Read Original Article
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentDisplay;
