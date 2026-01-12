"use strict";
// src/MarkdownParser.ts
const blogpostMarkdown = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!

Some less important folders:

1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.

## Miscellaneous things that may or may not be useful

##### Where to find rust-proto definitions

They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.

## Releasing

Within \`vscode/\`:

- Bump the version
- Then:

\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`

- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`;
let currentContainer = null;
let debugInfo = null;
// parser state
let inInlineCode = false;
let inCodeBlock = false;
let pendingBackticks = 0;
let activeNode = null;
let buffer = '';
function createSpan(className) {
    const el = document.createElement('span');
    if (className)
        el.className = className;
    currentContainer.appendChild(el);
    return el;
}
function updateDebugInfo() {
    if (!debugInfo)
        debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
        debugInfo.innerHTML = `
            <p>inCodeBlock: ${inCodeBlock}</p>
            <p>inInlineCode: ${inInlineCode}</p>
            <p>pendingBackticks: ${pendingBackticks}</p>
            <p>buffer: "${buffer}"</p>
        `;
    }
}
// Do not edit this method
function runStream() {
    currentContainer = document.getElementById('markdownContainer');
    // Clear previous content
    currentContainer.innerHTML = '';
    // Reset state
    inInlineCode = false;
    inCodeBlock = false;
    pendingBackticks = 0;
    activeNode = createSpan();
    buffer = '';
    const tokens = [];
    let remainingMarkdown = blogpostMarkdown;
    while (remainingMarkdown.length > 0) {
        const tokenLength = Math.floor(Math.random() * 18) + 2;
        const token = remainingMarkdown.slice(0, tokenLength);
        tokens.push(token);
        remainingMarkdown = remainingMarkdown.slice(tokenLength);
    }
    const toCancel = setInterval(() => {
        const token = tokens.shift();
        if (token) {
            addToken(token);
            updateDebugInfo();
        }
        else {
            clearInterval(toCancel);
            // Process any remaining buffer at the end
            flushBuffer();
        }
    }, 20);
}
function addText(text) {
    if (!activeNode) {
        activeNode = createSpan();
    }
    activeNode.textContent += text;
}
function flushBuffer() {
    if (buffer.length > 0) {
        addText(buffer);
        buffer = '';
    }
}
function processBackticks(count) {
    // Handle triple backticks for code blocks
    if (count >= 3) {
        // First flush any text in buffer
        flushBuffer();
        // Toggle code block state
        inCodeBlock = !inCodeBlock;
        // If we were in inline code, end it
        if (inInlineCode) {
            inInlineCode = false;
        }
        // Create new span with appropriate class
        activeNode = createSpan(inCodeBlock ? 'code-block' : undefined);
        // Use exactly 3 backticks for the toggle
        const usedBackticks = 3;
        const remainingBackticks = count - usedBackticks;
        // If there are remaining backticks, they're part of the content
        if (remainingBackticks > 0) {
            addText('`'.repeat(remainingBackticks));
        }
        return;
    }
    // Handle single backtick for inline code (but only if not in a code block)
    if (count === 1 && !inCodeBlock) {
        flushBuffer();
        inInlineCode = !inInlineCode;
        activeNode = createSpan(inInlineCode ? 'inline-code' : undefined);
        return;
    }
    // For other counts or when in code block, just add as text
    if (inCodeBlock) {
        // Inside code block, all backticks are just text
        buffer += '`'.repeat(count);
    }
    else {
        // Outside code block, 2 backticks or mismatched counts are just text
        flushBuffer();
        addText('`'.repeat(count));
    }
}
function addToken(token) {
    if (!currentContainer)
        return;
    for (let i = 0; i < token.length; i++) {
        const char = token[i];
        if (char === '`') {
            // If we have non-backtick text in buffer, flush it first
            if (buffer.length > 0 && !buffer.includes('`')) {
                flushBuffer();
            }
            // Add to pending backticks
            pendingBackticks++;
            buffer += '`';
        }
        else {
            // If we have pending backticks and encounter a non-backtick
            if (pendingBackticks > 0) {
                // Process the accumulated backticks
                processBackticks(pendingBackticks);
                pendingBackticks = 0;
                buffer = '';
            }
            // Add the non-backtick character to buffer
            buffer += char;
        }
    }
    // If the token ended with backticks, we might need to process them
    // But we'll wait for the next non-backtick or next token
}
// Add this to debug the markdown source
console.log("Markdown source preview:", blogpostMarkdown.substring(0, 200));
console.log("Backtick char code:", '`'.charCodeAt(0));
//# sourceMappingURL=MarkdownParser.js.map