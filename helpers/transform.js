export function stripMarkdown(code) {
    let text = code.replace(/`{3}[\s\S]*?`{3}/g, ''); // Remove triple backtick code blocks
    text = text.replace(/`[^`]+`/g, ''); // Remove inline code blocks
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, (match, label) => label);
  
    return text.trim();
  }