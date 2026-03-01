import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../WhiteDarkMode/useTheme';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

// ─── Code Templates ───
const CODE_TEMPLATES = {
  'Hello World': '// Hello World\nconsole.log("Hello, World!");',
  'Variables & Types': `// Variables and Data Types
const name = "JavaScript";
let version = 2026;
const isAwesome = true;
const features = ["closures", "promises", "modules"];
const user = { name: "Dev", age: 25, role: "Engineer" };

console.log("Language:", name);
console.log("Version:", version);
console.log("Is Awesome:", isAwesome);
console.log("Features:", features);
console.log("User:", user);
console.log("Type of name:", typeof name);
console.log("Type of version:", typeof version);`,
  'Loops': `// Loop Examples
console.log("--- For Loop ---");
for (let i = 1; i <= 5; i++) {
  console.log("Iteration:", i);
}

console.log("\\n--- While Loop ---");
let count = 0;
while (count < 3) {
  console.log("Count:", count);
  count++;
}

console.log("\\n--- For...of Loop ---");
const fruits = ["Apple", "Banana", "Cherry"];
for (const fruit of fruits) {
  console.log("Fruit:", fruit);
}`,
  'Functions': `// Function Examples
function greet(name) {
  return "Hello, " + name + "!";
}

const multiply = (a, b) => a * b;

const factorial = (n) => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

console.log(greet("Developer"));
console.log("5 x 3 =", multiply(5, 3));
console.log("5! =", factorial(5));`,
  'Array Methods': `// Array Methods
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);

const found = numbers.find(n => n > 5);
console.log("First > 5:", found);

console.log("Every > 0:", numbers.every(n => n > 0));
console.log("Some > 8:", numbers.some(n => n > 8));`,
  'Objects & Classes': `// Classes and Objects
class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }

  speak() {
    return this.name + " says " + this.sound + "!";
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, "Woof");
    this.tricks = [];
  }

  learn(trick) {
    this.tricks.push(trick);
  }

  showTricks() {
    return this.name + " knows: " + this.tricks.join(", ");
  }
}

const dog = new Dog("Buddy");
console.log(dog.speak());
dog.learn("sit");
dog.learn("shake");
dog.learn("roll over");
console.log(dog.showTricks());`,
  'Error Handling': `// Error Handling
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

try {
  console.log("10 / 2 =", divide(10, 2));
  console.log("10 / 0 =", divide(10, 0));
} catch (error) {
  console.error("Caught:", error.message);
} finally {
  console.log("Division operation complete");
}

// Custom Error
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

try {
  throw new ValidationError("email", "Invalid email format");
} catch (e) {
  console.error(e.name + " [" + e.field + "]: " + e.message);
}`,
  'Promises & Async': `// Promises and Async Patterns
const delay = (ms) => new Promise(resolve => 
  setTimeout(resolve, ms)
);

// Promise chain  
const fetchUser = () => Promise.resolve({ id: 1, name: "Alice" });
const fetchPosts = (userId) => Promise.resolve([
  { id: 1, title: "Hello World", userId },
  { id: 2, title: "JavaScript Tips", userId }
]);

fetchUser()
  .then(user => {
    console.log("User:", user);
    return fetchPosts(user.id);
  })
  .then(posts => {
    console.log("Posts:", posts);
  })
  .catch(err => console.error(err));

// Promise.all
Promise.all([
  Promise.resolve("Result 1"),
  Promise.resolve("Result 2"),
  Promise.resolve("Result 3")
]).then(results => {
  console.log("All results:", results);
});`,
};

// ─── Syntax Highlighting Engine ───
const tokenize = (code) => {
  const tokens = [];
  let i = 0;

  const KEYWORDS = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class',
    'extends', 'super', 'import', 'export', 'default', 'from', 'try', 'catch',
    'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'async', 'await',
    'yield', 'delete', 'void', 'with', 'debugger', 'static', 'get', 'set',
  ]);

  const BUILTINS = new Set([
    'console', 'Math', 'JSON', 'Promise', 'Array', 'Object', 'String',
    'Number', 'Boolean', 'Date', 'RegExp', 'Map', 'Set', 'WeakMap',
    'WeakSet', 'Symbol', 'Error', 'TypeError', 'RangeError', 'SyntaxError',
    'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'setTimeout', 'setInterval',
    'clearTimeout', 'clearInterval', 'undefined', 'NaN', 'Infinity',
  ]);

  const CONSTANTS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);

  while (i < code.length) {
    // Single-line comment
    if (code[i] === '/' && code[i + 1] === '/') {
      let comment = '';
      while (i < code.length && code[i] !== '\n') {
        comment += code[i++];
      }
      tokens.push({ type: 'comment', value: comment });
      continue;
    }

    // Multi-line comment
    if (code[i] === '/' && code[i + 1] === '*') {
      let comment = '/*';
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) {
        comment += code[i++];
      }
      if (i < code.length) {
        comment += '*/';
        i += 2;
      }
      tokens.push({ type: 'comment', value: comment });
      continue;
    }

    // Template literal
    if (code[i] === '`') {
      let str = '`';
      i++;
      while (i < code.length && code[i] !== '`') {
        if (code[i] === '\\') {
          str += code[i++];
          if (i < code.length) str += code[i++];
        } else {
          str += code[i++];
        }
      }
      if (i < code.length) str += code[i++];
      tokens.push({ type: 'string', value: str });
      continue;
    }

    // String (single or double quote)
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      let str = quote;
      i++;
      while (i < code.length && code[i] !== quote && code[i] !== '\n') {
        if (code[i] === '\\') {
          str += code[i++];
          if (i < code.length) str += code[i++];
        } else {
          str += code[i++];
        }
      }
      if (i < code.length && code[i] === quote) str += code[i++];
      tokens.push({ type: 'string', value: str });
      continue;
    }

    // Numbers
    if (/\d/.test(code[i]) || (code[i] === '.' && i + 1 < code.length && /\d/.test(code[i + 1]))) {
      let num = '';
      // Hex
      if (code[i] === '0' && (code[i + 1] === 'x' || code[i + 1] === 'X')) {
        num += code[i++] + code[i++];
        while (i < code.length && /[0-9a-fA-F]/.test(code[i])) num += code[i++];
      } else {
        while (i < code.length && /[\d.]/.test(code[i])) num += code[i++];
        // Scientific notation
        if (i < code.length && (code[i] === 'e' || code[i] === 'E')) {
          num += code[i++];
          if (i < code.length && (code[i] === '+' || code[i] === '-')) num += code[i++];
          while (i < code.length && /\d/.test(code[i])) num += code[i++];
        }
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    // Identifiers / keywords
    if (/[a-zA-Z_$]/.test(code[i])) {
      let ident = '';
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) ident += code[i++];
      if (KEYWORDS.has(ident)) {
        tokens.push({ type: 'keyword', value: ident });
      } else if (CONSTANTS.has(ident)) {
        tokens.push({ type: 'constant', value: ident });
      } else if (BUILTINS.has(ident)) {
        tokens.push({ type: 'builtin', value: ident });
      } else if (i < code.length && code[i] === '(') {
        tokens.push({ type: 'function', value: ident });
      } else {
        tokens.push({ type: 'identifier', value: ident });
      }
      continue;
    }

    // Operators
    if ('+-*/%=<>!&|^~?:'.includes(code[i])) {
      let op = code[i++];
      // Handle multi-char operators
      while (i < code.length && '+-*/%=<>!&|^~?'.includes(code[i]) && op.length < 3) {
        op += code[i++];
      }
      tokens.push({ type: 'operator', value: op });
      continue;
    }

    // Brackets / punctuation
    if ('(){}[]'.includes(code[i])) {
      tokens.push({ type: 'bracket', value: code[i++] });
      continue;
    }

    // Everything else (whitespace, newlines, punctuation)
    tokens.push({ type: 'plain', value: code[i++] });
  }

  return tokens;
};

// ─── Color Themes for Syntax ───
const SYNTAX_COLORS = {
  dark: {
    keyword: '#c792ea',
    string: '#c3e88d',
    number: '#f78c6c',
    comment: '#546e7a',
    builtin: '#82aaff',
    function: '#82aaff',
    constant: '#f78c6c',
    operator: '#89ddff',
    bracket: '#ffd700',
    identifier: '#d6deeb',
    plain: '#d6deeb',
  },
  light: {
    keyword: '#7c3aed',
    string: '#16a34a',
    number: '#ea580c',
    comment: '#94a3b8',
    builtin: '#2563eb',
    function: '#2563eb',
    constant: '#ea580c',
    operator: '#0891b2',
    bracket: '#b45309',
    identifier: '#1e293b',
    plain: '#1e293b',
  },
};

const JavascriptCompiler = () => {
  const { isDark } = useTheme();
  const textareaRef = useRef(null);
  const lineNumberRef = useRef(null);
  const overlayRef = useRef(null);
  const outputRef = useRef(null);

  const [code, setCode] = useState(
    '// Welcome to JavaScript Compiler\n// Write your code and press Run (Ctrl+Enter)\n\nconsole.log("Hello, World!");\n'
  );
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [showTemplates, setShowTemplates] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [copied, setCopied] = useState(false);
  const [outputCopied, setOutputCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('output'); // 'output' or 'stdin'
  const [stdinValue, setStdinValue] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [executionStatus, setExecutionStatus] = useState(null); // 'success' | 'error' | null

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Close templates dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (showTemplates && !e.target.closest('.templates-dropdown')) {
        setShowTemplates(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showTemplates]);

  // Track cursor position
  const updateCursorPos = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = code.substring(0, pos);
    const line = textBefore.split('\n').length;
    const col = pos - textBefore.lastIndexOf('\n');
    setCursorPos({ line, col });
  }, [code]);

  // ─── Console Capture ───
  const captureConsole = () => {
    const logs = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;
    const originalTable = console.table;
    const originalTime = console.time;
    const originalTimeEnd = console.timeEnd;
    const timers = {};

    const formatArg = (arg) => {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    };

    console.log = (...args) => {
      logs.push({ type: 'log', content: args.map(formatArg).join(' '), timestamp: Date.now() });
      originalLog.apply(console, args);
    };
    console.error = (...args) => {
      logs.push({ type: 'error', content: args.map(formatArg).join(' '), timestamp: Date.now() });
      originalError.apply(console, args);
    };
    console.warn = (...args) => {
      logs.push({ type: 'warn', content: args.map(formatArg).join(' '), timestamp: Date.now() });
      originalWarn.apply(console, args);
    };
    console.info = (...args) => {
      logs.push({ type: 'info', content: args.map(formatArg).join(' '), timestamp: Date.now() });
      originalInfo.apply(console, args);
    };
    console.table = (data) => {
      logs.push({ type: 'log', content: formatArg(data), timestamp: Date.now() });
      originalTable.apply(console, [data]);
    };
    console.time = (label = 'default') => {
      timers[label] = performance.now();
    };
    console.timeEnd = (label = 'default') => {
      if (timers[label]) {
        const duration = (performance.now() - timers[label]).toFixed(3);
        logs.push({ type: 'log', content: `${label}: ${duration}ms`, timestamp: Date.now() });
        delete timers[label];
      }
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      console.table = originalTable;
      console.time = originalTime;
      console.timeEnd = originalTimeEnd;
      return logs;
    };
  };

  // ─── Run Code ───
  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput([]);
    setExecutionStatus(null);
    setActiveTab('output');

    const startTime = performance.now();
    const restoreConsole = captureConsole();

    try {
      const func = new Function(code);
      const result = func();
      const logs = restoreConsole();
      const elapsed = performance.now() - startTime;
      setExecutionTime(elapsed.toFixed(2));

      if (result !== undefined) {
        logs.push({
          type: 'result',
          content: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result),
          timestamp: Date.now(),
        });
      }

      if (logs.length > 0) {
        setOutput(logs);
      } else {
        setOutput([{ type: 'success', content: 'Program executed successfully (no output)', timestamp: Date.now() }]);
      }
      setExecutionStatus('success');
    } catch (error) {
      restoreConsole();
      const elapsed = performance.now() - startTime;
      setExecutionTime(elapsed.toFixed(2));

      // Extract detailed error info
      let lineNumber = null;
      let columnNumber = null;

      if (error.stack) {
        const stackLines = error.stack.split('\n');
        for (const sLine of stackLines) {
          const match = sLine.match(/<anonymous>:(\d+):(\d+)/);
          if (match) {
            lineNumber = parseInt(match[1], 10) - 2; // Adjust for Function wrapper
            columnNumber = parseInt(match[2], 10);
            break;
          }
          const match2 = sLine.match(/Function:(\d+):(\d+)/);
          if (match2) {
            lineNumber = parseInt(match2[1], 10) - 2;
            columnNumber = parseInt(match2[2], 10);
            break;
          }
        }
      }

      // Build structured error
      const errorLines = [];
      errorLines.push(`${error.name}: ${error.message}`);
      if (lineNumber && lineNumber > 0) {
        errorLines.push('');
        errorLines.push(`  at line ${lineNumber}${columnNumber ? `, column ${columnNumber}` : ''}`);

        // Show the offending line if possible
        const codeLines = code.split('\n');
        if (lineNumber <= codeLines.length) {
          errorLines.push('');
          // Show surrounding context (up to 2 lines before/after)
          const start = Math.max(0, lineNumber - 2);
          const end = Math.min(codeLines.length, lineNumber + 1);
          for (let i = start; i < end; i++) {
            const marker = i === lineNumber - 1 ? ' >' : '  ';
            const lineNum = String(i + 1).padStart(3, ' ');
            errorLines.push(`${marker} ${lineNum} | ${codeLines[i]}`);
            if (i === lineNumber - 1 && columnNumber) {
              const pointer = '  ' + ' '.repeat(3) + ' | ' + ' '.repeat(Math.max(0, columnNumber - 1)) + '^';
              errorLines.push(pointer);
            }
          }
        }
      }

      setOutput([{ type: 'error', content: errorLines.join('\n'), timestamp: Date.now() }]);
      setExecutionStatus('error');
    } finally {
      setIsRunning(false);
      // Auto-scroll output
      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [code]);

  const clearOutput = () => {
    setOutput([]);
    setExecutionTime(null);
    setExecutionStatus(null);
  };

  const clearCode = () => {
    setCode('');
    setOutput([]);
    setExecutionTime(null);
    setExecutionStatus(null);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const copyOutput = async () => {
    const text = output.map((l) => l.content).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setOutputCopied(true);
      setTimeout(() => setOutputCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const loadTemplate = (name) => {
    setCode(CODE_TEMPLATES[name]);
    setOutput([]);
    setExecutionTime(null);
    setExecutionStatus(null);
    setShowTemplates(false);
  };

  // ─── Keyboard Shortcuts ───
  const handleKeyDown = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;

    // Ctrl+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
      return;
    }

    // Ctrl+/ to toggle comment
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      toggleComment();
      return;
    }

    // Ctrl+S to prevent default
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      return;
    }

    // Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift+Tab: outdent
        const beforeCursor = code.substring(0, start);
        const lineStart = beforeCursor.lastIndexOf('\n') + 1;
        const lineContent = code.substring(lineStart);
        if (lineContent.startsWith('  ')) {
          const newCode = code.substring(0, lineStart) + lineContent.substring(2);
          setCode(newCode);
          setTimeout(() => {
            e.target.selectionStart = e.target.selectionEnd = Math.max(lineStart, start - 2);
          }, 0);
        }
      } else {
        const newCode = code.substring(0, start) + '  ' + code.substring(end);
        setCode(newCode);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 2;
        }, 0);
      }
      return;
    }

    // Enter — smart indent
    if (e.key === 'Enter') {
      const beforeCursor = code.substring(0, start);
      const afterCursor = code.substring(end);

      // Current line indent
      const currentLineStart = beforeCursor.lastIndexOf('\n') + 1;
      const currentLine = beforeCursor.substring(currentLineStart);
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';

      // Between braces
      if (beforeCursor.endsWith('{') && afterCursor.startsWith('}')) {
        e.preventDefault();
        const newIndent = currentIndent + '  ';
        const newCode = beforeCursor + '\n' + newIndent + '\n' + currentIndent + afterCursor;
        setCode(newCode);
        setTimeout(() => {
          const pos = start + 1 + newIndent.length;
          e.target.selectionStart = e.target.selectionEnd = pos;
        }, 0);
        return;
      }

      // Between brackets or parens
      if (
        (beforeCursor.endsWith('[') && afterCursor.startsWith(']')) ||
        (beforeCursor.endsWith('(') && afterCursor.startsWith(')'))
      ) {
        e.preventDefault();
        const newIndent = currentIndent + '  ';
        const newCode = beforeCursor + '\n' + newIndent + '\n' + currentIndent + afterCursor;
        setCode(newCode);
        setTimeout(() => {
          const pos = start + 1 + newIndent.length;
          e.target.selectionStart = e.target.selectionEnd = pos;
        }, 0);
        return;
      }

      // Auto-indent after opening brace
      if (beforeCursor.trimEnd().endsWith('{') || beforeCursor.trimEnd().endsWith('(') || beforeCursor.trimEnd().endsWith('[')) {
        e.preventDefault();
        const newIndent = currentIndent + '  ';
        const newCode = beforeCursor + '\n' + newIndent + afterCursor;
        setCode(newCode);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 1 + newIndent.length;
        }, 0);
        return;
      }

      // Maintain indent
      if (currentIndent) {
        e.preventDefault();
        const newCode = beforeCursor + '\n' + currentIndent + afterCursor;
        setCode(newCode);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 1 + currentIndent.length;
        }, 0);
        return;
      }
    }

    // Backspace — remove paired bracket/quote
    if (e.key === 'Backspace' && start === end && start > 0) {
      const charBefore = code[start - 1];
      const charAfter = code[start];
      const pairMap = { '{': '}', '[': ']', '(': ')', '"': '"', "'": "'", '`': '`' };
      if (pairMap[charBefore] === charAfter) {
        e.preventDefault();
        const newCode = code.substring(0, start - 1) + code.substring(start + 1);
        setCode(newCode);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start - 1;
        }, 0);
        return;
      }
    }

    // Auto-pairing
    const pairs = { '{': '}', '[': ']', '(': ')', '"': '"', "'": "'", '`': '`' };
    const closers = new Set(['}', ']', ')']);

    // Skip closing bracket if next char is that closer
    if (closers.has(e.key) && code[start] === e.key) {
      e.preventDefault();
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
      return;
    }

    if (pairs[e.key]) {
      // For quotes, don't auto-pair if we're inside a word
      if ('"\'`'.includes(e.key)) {
        if (start > 0 && /[a-zA-Z0-9_$]/.test(code[start - 1])) return;
      }
      e.preventDefault();
      const selected = code.substring(start, end);
      const newCode = code.substring(0, start) + e.key + selected + pairs[e.key] + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (selected.length > 0) {
          e.target.selectionStart = start + 1;
          e.target.selectionEnd = end + 1;
        } else {
          e.target.selectionStart = e.target.selectionEnd = start + 1;
        }
      }, 0);
    }
  };

  // ─── Toggle Comment ───
  const toggleComment = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const beforeSelection = code.substring(0, start);
    const afterSelection = code.substring(end);
    const startLineBegin = beforeSelection.lastIndexOf('\n') + 1;
    const endLineEnd = afterSelection.indexOf('\n');
    const endLineEndPos = endLineEnd === -1 ? code.length : end + endLineEnd;

    const fullSelection = code.substring(startLineBegin, endLineEndPos);
    const lines = fullSelection.split('\n');
    const allCommented = lines.every((l) => l.trim().startsWith('//') || l.trim() === '');

    let newLines;
    if (allCommented) {
      newLines = lines.map((line) => {
        const trimmedStart = line.search(/\S/);
        if (trimmedStart === -1) return line;
        const beforeComment = line.substring(0, trimmedStart);
        const afterTrimmed = line.substring(trimmedStart);
        if (afterTrimmed.startsWith('// ')) return beforeComment + afterTrimmed.substring(3);
        if (afterTrimmed.startsWith('//')) return beforeComment + afterTrimmed.substring(2);
        return line;
      });
    } else {
      newLines = lines.map((line) => {
        if (line.trim() === '') return line;
        const trimmedStart = line.search(/\S/);
        return line.substring(0, trimmedStart) + '// ' + line.substring(trimmedStart);
      });
    }

    const newSelection = newLines.join('\n');
    const newCode = code.substring(0, startLineBegin) + newSelection + code.substring(endLineEndPos);
    setCode(newCode);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + (newSelection.length - fullSelection.length) + (end - start);
    }, 0);
  };

  // ─── Scroll Sync ───
  const handleScroll = (e) => {
    if (lineNumberRef.current) {
      lineNumberRef.current.scrollTop = e.target.scrollTop;
    }
    if (overlayRef.current) {
      overlayRef.current.scrollTop = e.target.scrollTop;
      overlayRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  // ─── Line Numbers ───
  const getLineNumbers = () => {
    const lineCount = code.split('\n').length;
    return Array.from({ length: lineCount }, (_, i) => i + 1);
  };

  // ─── Render Highlighted Code ───
  const theme = isDark ? SYNTAX_COLORS.dark : SYNTAX_COLORS.light;

  const renderHighlightedCode = useCallback(
    (src) => {
      const tokens = tokenize(src);
      return tokens.map((token, i) => {
        if (token.type === 'plain') return <span key={i}>{token.value}</span>;
        return (
          <span key={i} style={{ color: theme[token.type] || theme.plain }}>
            {token.value}
          </span>
        );
      });
    },
    [theme]
  );

  // ─── Output type label/icon ───
  const getOutputMeta = (type) => {
    switch (type) {
      case 'error':
        return { icon: '✕', label: 'Error', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40', iconBg: 'bg-red-500/20 text-red-400' };
      case 'warn':
        return { icon: '!', label: 'Warning', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', iconBg: 'bg-yellow-500/20 text-yellow-400' };
      case 'result':
        return { icon: '←', label: 'Return', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', iconBg: 'bg-emerald-500/20 text-emerald-400' };
      case 'success':
        return { icon: '✓', label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', iconBg: 'bg-emerald-500/20 text-emerald-400' };
      case 'info':
        return { icon: 'i', label: 'Info', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', iconBg: 'bg-cyan-500/20 text-cyan-400' };
      default:
        return { icon: '›', label: 'Log', color: 'text-gray-300', bg: 'bg-gray-500/5', border: 'border-gray-600/30', iconBg: 'bg-gray-500/20 text-gray-400' };
    }
  };

  const lineHeight = fontSize * 1.6;

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-slate-50 text-gray-800'}`}>
      <Header />

      {/* ─── Main IDE Container ─── */}
      <div className={`flex-1 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${isDark && isFullscreen ? 'bg-gray-950' : !isDark && isFullscreen ? 'bg-slate-50' : ''}`}>
        {/* Top Toolbar */}
        <div
          className={`border-b px-4 py-2 flex items-center justify-between flex-wrap gap-2 ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          {/* Left: Language & Templates */}
          <div className="flex items-center gap-3">
            {/* Language Badge */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                isDark ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.405-.6-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.09c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.81 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
              </svg>
              JavaScript
            </div>

            {/* Templates Dropdown */}
            <div className="relative templates-dropdown">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Templates
                <svg className={`w-3 h-3 transition-transform ${showTemplates ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showTemplates && (
                <div
                  className={`absolute top-full left-0 mt-1 w-56 rounded-xl shadow-2xl z-50 overflow-hidden border ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500 bg-gray-800/50' : 'text-gray-400 bg-gray-50'}`}>
                    Code Examples
                  </div>
                  {Object.keys(CODE_TEMPLATES).map((name) => (
                    <button
                      key={name}
                      onClick={() => loadTemplate(name)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        isDark ? 'text-gray-300 hover:bg-gray-700/80' : 'text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Run Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${
                isRunning
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/30 active:scale-95'
              }`}
            >
              {isRunning ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Run Code
                </>
              )}
            </button>

            {/* Keyboard shortcut hint */}
            <span className={`text-xs hidden sm:inline ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              Ctrl+Enter
            </span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* Font Size */}
            <div className={`flex items-center gap-1 rounded-lg px-2 py-1 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <button
                onClick={() => setFontSize((s) => Math.max(10, s - 1))}
                className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                }`}
              >
                A-
              </button>
              <span className={`text-xs w-7 text-center tabular-nums ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{fontSize}</span>
              <button
                onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                }`}
              >
                A+
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ─── Editor + Output Split ─── */}
        <div className={`flex-1 grid grid-cols-1 lg:grid-cols-2 ${isFullscreen ? 'min-h-0' : 'min-h-150'}`}>
          {/* ─── Code Editor Panel ─── */}
          <div className={`flex flex-col border-r ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            {/* File Tab */}
            <div className={`flex items-center justify-between px-1 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <div className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 text-sm border-b-2 ${
                    isDark
                      ? 'bg-gray-800 text-gray-200 border-blue-500'
                      : 'bg-white text-gray-800 border-blue-500'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.405-.6-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.09c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.81 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
                  </svg>
                  main.js
                </div>
              </div>

              {/* Editor Actions */}
              <div className="flex items-center gap-1 pr-2">
                <button
                  onClick={copyCode}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`}
                  title="Copy Code"
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={clearCode}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`}
                  title="Clear Code"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className={`flex flex-1 overflow-hidden ${isDark ? 'bg-[#1e1e2e]' : 'bg-white'}`}>
              {/* Line Numbers */}
              <div
                ref={lineNumberRef}
                className="py-3 pr-3 pl-2 text-right select-none overflow-hidden font-mono"
                style={{
                  fontSize,
                  lineHeight: `${lineHeight}px`,
                  minWidth: '3.5rem',
                  color: isDark ? '#4a4a6a' : '#b0b0c0',
                  backgroundColor: isDark ? '#1a1a2e' : '#f8f8fc',
                  borderRight: `1px solid ${isDark ? '#2a2a3e' : '#e8e8f0'}`,
                }}
              >
                {getLineNumbers().map((num) => (
                  <div key={num} style={{ height: lineHeight + 'px' }}>
                    {num}
                  </div>
                ))}
              </div>

              {/* Code Area */}
              <div className="flex-1 relative overflow-hidden">
                {/* Syntax Highlight Overlay */}
                <pre
                  ref={overlayRef}
                  className="absolute inset-0 py-3 px-4 font-mono pointer-events-none overflow-hidden"
                  style={{
                    fontSize,
                    lineHeight: `${lineHeight}px`,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    color: isDark ? '#d6deeb' : '#1e293b',
                    backgroundColor: 'transparent',
                  }}
                  aria-hidden="true"
                >
                  {renderHighlightedCode(code)}
                </pre>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onScroll={handleScroll}
                  onClick={updateCursorPos}
                  onKeyUp={updateCursorPos}
                  spellCheck="false"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  className="relative w-full h-full py-3 px-4 font-mono resize-none outline-none bg-transparent"
                  style={{
                    fontSize,
                    lineHeight: `${lineHeight}px`,
                    tabSize: 2,
                    color: 'transparent',
                    caretColor: isDark ? '#60a5fa' : '#2563eb',
                  }}
                />
              </div>
            </div>

            {/* Status Bar */}
            <div
              className={`flex items-center justify-between px-4 py-1.5 text-xs font-mono border-t ${
                isDark ? 'bg-gray-900 border-gray-800 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-4">
                <span>
                  Ln {cursorPos.line}, Col {cursorPos.col}
                </span>
                <span>{code.split('\n').length} lines</span>
                <span>{code.length} chars</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Spaces: 2</span>
                <span>UTF-8</span>
                <span>JavaScript</span>
              </div>
            </div>
          </div>

          {/* ─── Output Panel ─── */}
          <div className={`flex flex-col ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
            {/* Output Tabs */}
            <div className={`flex items-center justify-between px-1 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <div className="flex items-center">
                <button
                  onClick={() => setActiveTab('output')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'output'
                      ? isDark
                        ? 'text-gray-200 bg-gray-800 border-emerald-500'
                        : 'text-gray-800 bg-white border-emerald-500'
                      : isDark
                      ? 'text-gray-500 border-transparent hover:text-gray-300'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Output
                  {executionStatus && (
                    <span
                      className={`w-2 h-2 rounded-full ${executionStatus === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('stdin')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'stdin'
                      ? isDark
                        ? 'text-gray-200 bg-gray-800 border-blue-500'
                        : 'text-gray-800 bg-white border-blue-500'
                      : isDark
                      ? 'text-gray-500 border-transparent hover:text-gray-300'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Input
                </button>
              </div>

              {/* Output Actions */}
              <div className="flex items-center gap-1 pr-2">
                {executionTime && (
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {executionTime}ms
                  </span>
                )}
                <button
                  onClick={copyOutput}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`}
                  title="Copy Output"
                >
                  {outputCopied ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={clearOutput}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'}`}
                  title="Clear Output"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Output / Input Content */}
            {activeTab === 'output' ? (
              <div
                ref={outputRef}
                className={`flex-1 overflow-y-auto p-4 font-mono ${isDark ? 'bg-[#0d1117]' : 'bg-[#1a1b26]'}`}
                style={{ fontSize: fontSize - 1, lineHeight: '1.7' }}
              >
                {output.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-600 select-none">
                    <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium mb-1">No output yet</p>
                    <p className="text-xs opacity-60">Click "Run Code" or press Ctrl+Enter to execute</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Execution header */}
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
                      <span className={`w-2 h-2 rounded-full ${executionStatus === 'error' ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      <span className="text-gray-500 text-xs">
                        Execution {executionStatus === 'error' ? 'failed' : 'completed'} in {executionTime}ms
                      </span>
                    </div>

                    {output.map((log, index) => {
                      const meta = getOutputMeta(log.type);
                      return (
                        <div key={index} className={`flex items-start gap-2 px-3 py-1.5 rounded-md ${meta.bg} border ${meta.border}`}>
                          <span
                            className={`flex items-center justify-center w-5 h-5 rounded text-xs font-bold shrink-0 mt-0.5 ${meta.iconBg}`}
                          >
                            {meta.icon}
                          </span>
                          <pre className={`flex-1 whitespace-pre-wrap wrap-break-word ${meta.color}`}>
                            {log.content}
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className={`flex-1 flex flex-col ${isDark ? 'bg-[#0d1117]' : 'bg-[#1a1b26]'}`}>
                <div className="px-4 pt-3 pb-1">
                  <p className="text-gray-500 text-xs mb-2">
                    Provide input data for your program (stdin). Each line will be available as needed.
                  </p>
                </div>
                <textarea
                  value={stdinValue}
                  onChange={(e) => setStdinValue(e.target.value)}
                  placeholder="Enter input here..."
                  className="flex-1 p-4 font-mono text-sm resize-none outline-none bg-transparent text-gray-300 placeholder-gray-700"
                  style={{ fontSize: fontSize - 1 }}
                />
              </div>
            )}

            {/* Output Status Bar */}
            <div
              className={`flex items-center justify-between px-4 py-1.5 text-xs font-mono border-t ${
                isDark ? 'bg-gray-900 border-gray-800 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                {executionStatus === 'success' && (
                  <span className="flex items-center gap-1 text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Exit Code: 0
                  </span>
                )}
                {executionStatus === 'error' && (
                  <span className="flex items-center gap-1 text-red-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Exit Code: 1
                  </span>
                )}
                {!executionStatus && <span>Ready</span>}
              </div>
              <div className="flex items-center gap-3">
                <span>{output.filter((l) => l.type === 'log' || l.type === 'info').length} log{output.filter((l) => l.type === 'log' || l.type === 'info').length !== 1 ? 's' : ''}</span>
                <span>{output.filter((l) => l.type === 'warn').length} warning{output.filter((l) => l.type === 'warn').length !== 1 ? 's' : ''}</span>
                <span>{output.filter((l) => l.type === 'error').length} error{output.filter((l) => l.type === 'error').length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Keyboard Shortcuts Bar ─── */}
        <div
          className={`border-t px-4 py-2 flex items-center justify-center gap-6 text-xs flex-wrap ${
            isDark ? 'bg-gray-900/50 border-gray-800 text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-400'
          }`}
        >
          {[
            ['Ctrl+Enter', 'Run'],
            ['Ctrl+/', 'Comment'],
            ['Tab', 'Indent'],
            ['Shift+Tab', 'Outdent'],
            ['Ctrl+S', 'Save'],
          ].map(([key, action]) => (
            <div key={key} className="flex items-center gap-1.5">
              <kbd
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  isDark ? 'bg-gray-800 text-gray-500 border border-gray-700' : 'bg-white text-gray-500 border border-gray-300 shadow-sm'
                }`}
              >
                {key}
              </kbd>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {!isFullscreen && <Footer />}
    </div>
  );
};

export default JavascriptCompiler;
