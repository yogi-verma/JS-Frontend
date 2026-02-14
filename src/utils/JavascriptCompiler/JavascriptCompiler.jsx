import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../WhiteDarkMode/useTheme';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import colors from '../color';

const JavascriptCompiler = () => {
  const { isDark } = useTheme();
  const textareaRef = useRef(null);
  const [code, setCode] = useState('// Write your JavaScript code here\nconsole.log("Hello, World!");');
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Warn user before leaving page or refreshing
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Chrome requires returnValue to be set
      return ''; // For older browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const captureConsole = () => {
    const logs = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      logs.push({ type: 'log', content: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ') });
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      logs.push({ type: 'error', content: args.map(arg => String(arg)).join(' ') });
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      logs.push({ type: 'warn', content: args.map(arg => String(arg)).join(' ') });
      originalWarn.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      return logs;
    };
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);

    const restoreConsole = captureConsole();

    try {
      // Create a function from the code string and execute it
      const func = new Function(code);
      const result = func();

      const logs = restoreConsole();

      // Add result if it's not undefined
      if (result !== undefined) {
        logs.push({ 
          type: 'result', 
          content: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)
        });
      }

      setOutput(logs.length > 0 ? logs : [{ type: 'log', content: 'Code executed successfully (no output)' }]);
    } catch (error) {
      restoreConsole();
      
      // Extract line number from error stack
      let lineNumber = null;
      let errorMessage = error.message;
      
      if (error.stack) {
        // Try to parse line number from stack trace
        const stackLines = error.stack.split('\n');
        for (let line of stackLines) {
          // Look for patterns like "at <anonymous>:line:column" or "at eval:line:column"
          const match = line.match(/:(\d+):(\d+)/);
          if (match) {
            lineNumber = parseInt(match[1], 10);
            break;
          }
        }
      }
      
      // Format error message with line number
      const formattedError = lineNumber 
        ? `${error.name}: ${errorMessage}\n📍 Line ${lineNumber}`
        : `${error.name}: ${errorMessage}`;
      
      setOutput([{ type: 'error', content: formattedError }]);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const clearCode = () => {
    setCode('');
  };

  const handleKeyDown = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;

    // Handle Ctrl+/ or Cmd+/ for commenting
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      toggleComment();
      return;
    }

    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
      return;
    }

    // Handle Enter key after opening brace for smart formatting
    if (e.key === 'Enter') {
      const beforeCursor = code.substring(0, start);
      const afterCursor = code.substring(end);
      
      // Check if cursor is between paired braces
      if (beforeCursor.endsWith('{') && afterCursor.startsWith('}')) {
        e.preventDefault();
        const newCode = beforeCursor + '\n  \n' + afterCursor;
        setCode(newCode);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 3; // Position cursor at indented line
        }, 0);
        return;
      }
    }

    // Auto-pairing for braces, brackets, parentheses, and quotes
    const pairs = {
      '{': '}',
      '[': ']',
      '(': ')',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    if (pairs[e.key]) {
      e.preventDefault();
      const newCode = code.substring(0, start) + e.key + pairs[e.key] + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
    }
  };

  const toggleComment = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Get the current line or selected lines
    const beforeSelection = code.substring(0, start);
    const afterSelection = code.substring(end);
    
    // Find line boundaries
    const startLineBegin = beforeSelection.lastIndexOf('\n') + 1;
    const endLineEnd = afterSelection.indexOf('\n');
    const endLineEndPos = endLineEnd === -1 ? code.length : end + endLineEnd;
    
    const fullSelection = code.substring(startLineBegin, endLineEndPos);
    const lines = fullSelection.split('\n');
    
    // Check if all lines are commented
    const allCommented = lines.every(line => line.trim().startsWith('//') || line.trim() === '');
    
    let newLines;
    if (allCommented) {
      // Uncomment: remove // from the beginning of each line
      newLines = lines.map(line => {
        const trimmedStart = line.search(/\S/);
        if (trimmedStart === -1) return line; // Empty line
        const beforeComment = line.substring(0, trimmedStart);
        const afterTrimmed = line.substring(trimmedStart);
        if (afterTrimmed.startsWith('//')) {
          // Remove // and one space if present
          return beforeComment + afterTrimmed.substring(2).replace(/^ /, '');
        }
        return line;
      });
    } else {
      // Comment: add // at the beginning of each line
      newLines = lines.map(line => {
        if (line.trim() === '') return line; // Don't comment empty lines
        const trimmedStart = line.search(/\S/);
        const beforeContent = line.substring(0, trimmedStart);
        const content = line.substring(trimmedStart);
        return beforeContent + '// ' + content;
      });
    }
    
    const newSelection = newLines.join('\n');
    const newCode = code.substring(0, startLineBegin) + newSelection + code.substring(endLineEndPos);
    setCode(newCode);
    
    // Restore selection
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + (newSelection.length - fullSelection.length) + (end - start);
    }, 0);
  };

  const handleScroll = (e) => {
    const lineNumbers = e.target.parentElement.previousElementSibling;
    const syntaxOverlay = e.target.previousElementSibling;
    
    if (lineNumbers) {
      lineNumbers.scrollTop = e.target.scrollTop;
    }
    if (syntaxOverlay) {
      syntaxOverlay.scrollTop = e.target.scrollTop;
      syntaxOverlay.scrollLeft = e.target.scrollLeft;
    }
  };

  const getLineNumbers = () => {
    const lineCount = code.split('\n').length;
    return Array.from({ length: lineCount }, (_, i) => i + 1);
  };

  const highlightSyntax = (code) => {
    return code.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if line is a comment
      if (trimmedLine.startsWith('//')) {
        return (
          <div key={index} style={{ minHeight: '1.44em' }}>
            <span style={{ color: '#86efac' }}>{line}</span>
          </div>
        );
      }
      
      // Regular code
      return (
        <div key={index} style={{ minHeight: '1.44em' }}>
          {line || ' '}
        </div>
      );
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <Header />
      
      {/* Main Container - Aligned with Header */}
      <div className="max-w-6xl mx-auto px-6 pt-4">
        
        {/* Page Title */}
        <div className="text-center mb-6">
          <h2 className={`text-4xl font-bold mb-2 ${colors.blueTextGradient}`}>
            JavaScript Compiler
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Write, execute and test your JavaScript code in real-time
          </p>
        </div>

        {/* Compiler Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Code Editor Section */}
          <div 
            className={`rounded-xl shadow-xl overflow-hidden transition-all duration-300 h-[600px] flex flex-col ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            {/* Editor Header */}
            <div 
              className={`px-5 py-3.5 flex justify-between items-center border-b ${
                isDark 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                    Code Editor
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={clearCode}
                    className={`px-3 py-1.5 rounded-lg hover:cursor-pointer font-medium text-xs transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    🗑️ Clear
                  </button>
                  <button 
                    onClick={runCode}
                    disabled={isRunning}
                    className="px-4 py-1.5 hover:cursor-pointer bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white rounded-lg font-semibold text-xs transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isRunning ? '⏳ Running...' : '▶️ Run'}
                  </button>
                </div>
              </div>
              
              <span className={`text-xs px-2.5 py-1 rounded-full ${
                isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600 shadow-sm'
              }`}>
                {code.split('\n').length} lines
              </span>
            </div>

            {/* Editor Body */}
            <div className="flex flex-1 overflow-hidden relative">
              {/* Line Numbers */}
              <div 
                className={`py-4 px-3 text-right select-none overflow-hidden text-sm font-mono ${
                  isDark ? 'bg-gray-900 text-gray-600 border-r border-gray-700' : 'bg-gray-50 text-gray-400 border-r border-gray-200'
                }`}
                style={{ 
                  lineHeight: '1.6',
                  minWidth: '3.5rem'
                }}
              >
                {getLineNumbers().map((num) => (
                  <div key={num} style={{ minHeight: '1.44em' }}>
                    {num}
                  </div>
                ))}
              </div>

              {/* Syntax Highlighting Overlay */}
              <div className="flex-1 relative">
                <pre
                  className={`absolute inset-0 p-4 font-mono text-sm pointer-events-none overflow-auto ${
                    isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
                  }`}
                  style={{ 
                    lineHeight: '1.6',
                    tabSize: 2,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {highlightSyntax(code)}
                </pre>

                {/* Text Area */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onScroll={handleScroll}
                  spellCheck="false"
                  placeholder="// Write your JavaScript code here&#10;// Press Ctrl+/ to comment&#10;// Tab for indentation&#10;console.log('Hello, World!');"
                  className={`relative flex-1 w-full h-full p-4 font-mono text-sm resize-none outline-none bg-transparent caret-${isDark ? 'white' : 'black'}`}
                  style={{ 
                    lineHeight: '1.6',
                    tabSize: 2,
                    color: 'transparent',
                    caretColor: isDark ? 'white' : 'black'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Output Console Section */}
          <div 
            className={`rounded-xl shadow-xl overflow-hidden transition-all duration-300 h-[600px] flex flex-col ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            {/* Console Header */}
            <div 
              className={`px-5 py-3.5 flex justify-between items-center border-b ${
                isDark 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                  Console Output
                </span>
              </div>
              <button
                onClick={clearOutput}
                className={`text-xs px-3 hover:cursor-pointer py-1.5 rounded-lg font-medium transition-all ${
                  isDark 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                Clear
              </button>
            </div>

            {/* Console Body */}
            <div 
              className={`flex-1 p-4 overflow-y-auto font-mono text-sm ${
                isDark ? 'bg-gray-900' : 'bg-gray-950'
              }`}
              style={{ lineHeight: '1.6' }}
            >
              {output.length === 0 ? (
                <div className="text-gray-500 italic text-center py-8">
                  <div className="text-4xl mb-3">🚀</div>
                  <div>Run your code to see output here...</div>
                  <div className="text-xs mt-2 opacity-75">Supports console.log, console.error & console.warn</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {output.map((log, index) => (
                    <div 
                      key={index}
                      className={`flex gap-3 p-2.5 rounded-lg ${
                        log.type === 'error' 
                          ? 'bg-red-900/20 border-l-4 border-red-500'
                          : log.type === 'warn'
                          ? 'bg-yellow-900/20 border-l-4 border-yellow-500'
                          : log.type === 'result'
                          ? 'bg-green-900/20 border-l-4 border-green-500'
                          : 'bg-blue-900/20 border-l-4 border-blue-500'
                      }`}
                    >
                      <span className="text-base flex-shrink-0">
                        {log.type === 'error' ? '❌' : log.type === 'warn' ? '⚠️' : log.type === 'result' ? '✅' : '💬'}
                      </span>
                      <pre 
                        className={`flex-1 whitespace-pre-wrap break-words text-sm ${
                          log.type === 'error' 
                            ? 'text-red-300'
                            : log.type === 'warn'
                            ? 'text-yellow-300'
                            : log.type === 'result'
                            ? 'text-green-300'
                            : 'text-blue-300'
                        }`}
                      >
                        {log.content}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default JavascriptCompiler;
