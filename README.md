# Streaming Markdown Parser

A real-time, streaming Markdown parser that processes text as it arrives (similar to how AI assistants stream responses). The parser handles code blocks and inline code with optimistic styling.

## Features

- **Real-time parsing**: Text is parsed and styled as it streams in
- **Optimistic styling**: Code blocks and inline code are styled immediately when detected
- **Non-destructive updates**: Existing HTML is not replaced, allowing text selection and copying
- **Markdown support**:
  - ✅ Code blocks (triple backticks: ` ``` `)
  - ✅ Inline code (single backticks: ` `` `)
  - Basic text streaming

## Project Structure

```
src/
├── MarkdownParser.ts     # Main parser implementation
dist/
├── index.html           # HTML with styling
├── MarkdownParser.js    # Compiled JavaScript
```

## How It Works

### Parsing Logic
The parser maintains state to track:
- `inCodeBlock`: Whether currently inside a triple-backtick code block
- `inInlineCode`: Whether currently inside single-backtick inline code
- `pendingBackticks`: Count of consecutive backticks waiting to be processed
- `buffer`: Temporary storage for characters before determining their context

### Streaming Process
1. Markdown text is split into random-length tokens (2-20 characters)
2. Tokens are processed one at a time with a 20ms delay between them
3. Each character is examined and added to the appropriate HTML span element
4. Backticks trigger state transitions between normal text, inline code, and code blocks

### State Transitions
- **Triple backticks (` ``` `)**: Toggle code block mode
- **Single backtick (` ` `)**: Toggle inline code mode (only outside code blocks)
- **Other backtick counts**: Treated as literal backtick characters

## Demo

Here's a visual example of the streaming markdown parser in action:

![Streaming Markdown Parser Demo](https://raw.githubusercontent.com/jaycodes2/Formi_Assignment/fad7db29419c8df607479550c6661a7d80493604/Screenshot%202026-01-12%20211910.png)

*Example output showing code blocks and inline code being parsed in real-time*

## Getting Started

### Prerequisites
- Node.js and npm installed

### Installation
```bash
npm install
```

### Development
```bash
# Build the project
npm run build

# Start development server with hot reload
npm run dev
```

### Usage
1. Open `dist/index.html` in your browser
2. Click the "STREAM" button
3. Watch the markdown parse in real-time

## Implementation Details

### Key Functions

#### `addToken(token: string)`
Processes each token character by character:
- Accumulates backticks until a non-backtick character is encountered
- Processes accumulated backticks to determine state transitions
- Buffers regular text until context is clear

#### `processBackticks(count: number)`
Handles backtick processing:
- 3+ backticks: Toggle code block state
- 1 backtick (outside code block): Toggle inline code state
- Other counts: Add as literal backtick characters

#### `flushBuffer()`
Outputs buffered text to the current active span element.

### Styling
- **Code blocks**: Dark background with green text, left border accent
- **Inline code**: Light gray background with monospace font
- **Normal text**: System font with proper spacing

## Limitations & Future Improvements

### Current Limitations
- Only handles code blocks and inline code
- Basic text parsing without headings, lists, bold, italic
- Simplified code block detection (doesn't check for language tags)
- No error recovery for malformed markdown

### Potential Enhancements
1. **Add more Markdown elements**:
   - Headings (`#`, `##`, etc.)
   - Bold/italic (`**text**`, `*text*`)
   - Lists (`-`, `1.`, `*`)
   - Links and images

2. **Improved parsing**:
   - Language detection for code blocks
   - Nested formatting support
   - Better error handling

3. **Performance optimizations**:
   - Batch DOM updates
   - Virtualization for long documents

4. **User experience**:
   - Pause/resume streaming
   - Speed controls
   - Copy formatted text

## Testing

The parser includes a debug panel that shows:
- Current parser state (`inCodeBlock`, `inInlineCode`)
- Pending backticks count
- Current buffer content

To test with custom markdown, modify the `blogpostMarkdown` constant in `MarkdownParser.ts`.

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- `textContent` property
- `setInterval` for streaming simulation

## Contributing

1. Focus on core parsing logic first (code blocks and inline code)
2. Ensure optimistic styling (immediate visual feedback)
3. Maintain ability to select/copy text during streaming
4. Keep it simple - prefer working code over perfect code

## Notes

- The parser is designed to be "optimistic" - it styles elements as soon as it detects the start of a code block or inline code
- DOM elements are created incrementally to allow text selection during streaming
- Random token lengths simulate real-world streaming behavior

---

**Project Status**: Active development  
**Last Updated**: $(date +%Y-%m-%d)
