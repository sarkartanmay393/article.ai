import type { Article, ArticleSection } from '~/types/article';

export default class ArticleFormatter {
  private article: Article;

  constructor(article: Article) {
    this.article = article;
  }

  toMarkdown(): string {
    return this.convertSectionsToMarkdown(this.article.content);
  }

  toHTML(): string {
    return this.convertSectionsToHTML(this.article.content);
  }

  toPlainText(): string {
    return this.convertSectionsToPlainText(this.article.content);
  }

  private convertSectionsToMarkdown(sections: ArticleSection[]): string {
    return sections.map(section => {
      switch (section.type) {
        case 'heading':
          return `${'#'.repeat(section.metadata?.level ?? 1)} ${section.content}\n\n`;
        case 'paragraph':
          return `${section.content}\n\n`;
        case 'list':
          return section.children?.map(item => 
            section.metadata?.listType === 'numbered' 
              ? `1. ${item.content}\n`
              : `- ${item.content}\n`
          ).join('') + '\n';
        case 'quote':
          return `> ${section.content}\n\n`;
        case 'code':
          return `\`\`\`${section.metadata?.language ?? ''}\n${section.content}\n\`\`\`\n\n`;
        case 'callout':
          return `> **Note:** ${section.content}\n\n`;
        default:
          return `${section.content}\n\n`;
      }
    }).join('');
  }

  private convertSectionsToHTML(sections: ArticleSection[]): string {
    return sections.map(section => {
      switch (section.type) {
        case 'heading':
          const level = section.metadata?.level ?? 1;
          return `<h${level}>${section.content}</h${level}>\n`;
        case 'paragraph':
          return `<p>${section.content}</p>\n`;
        case 'list':
          const listType = section.metadata?.listType === 'numbered' ? 'ol' : 'ul';
          const listItems = section.children?.map(item => `<li>${item.content}</li>`).join('\n') ?? '';
          return `<${listType}>\n${listItems}\n</${listType}>\n`;
        case 'quote':
          return `<blockquote>${section.content}</blockquote>\n`;
        case 'code':
          return `<pre><code class="language-${section.metadata?.language ?? ''}">${section.content}</code></pre>\n`;
        case 'callout':
          return `<div class="callout"><strong>Note:</strong> ${section.content}</div>\n`;
        default:
          return `<div>${section.content}</div>\n`;
      }
    }).join('');
  }

  private convertSectionsToPlainText(sections: ArticleSection[]): string {
    return sections.map(section => {
      switch (section.type) {
        case 'heading':
          return `${section.content}\n\n`;
        case 'paragraph':
          return `${section.content}\n\n`;
        case 'list':
          return section.children?.map((item, index) => 
            section.metadata?.listType === 'numbered'
              ? `${index + 1}. ${item.content}\n`
              : `• ${item.content}\n`
          ).join('') + '\n';
        case 'quote':
          return `"${section.content}"\n\n`;
        case 'code':
          return `[Code Block]\n${section.content}\n\n`;
        case 'callout':
          return `Note: ${section.content}\n\n`;
        default:
          return `${section.content}\n\n`;
      }
    }).join('');
  }
}