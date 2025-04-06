import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const defaultCode = `#include <iostream>
using namespace std;

int main() {
    // Your solution here
    
    return 0;
}`;

const CodeEditor = ({ onCodeChange, onRun, onSubmit, isProcessing }) => {
  const [code, setCode] = useState(defaultCode);
  
  const handleEditorChange = (value) => {
    setCode(value);
    onCodeChange(value);
  };
  
  return (
    <div className="code-editor-container">
      <div className="editor-header d-flex justify-content-between align-items-center mb-2">
        <div className="language-selector">
          <select className="form-select" defaultValue="cpp" disabled>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div className="editor-actions">
          <button 
            className="btn btn-primary me-2" 
            onClick={() => onRun(code)}
            disabled={isProcessing}
          >
            {isProcessing ? 'Running...' : 'Run'}
          </button>
          <button 
            className="btn btn-success" 
            onClick={() => onSubmit(code)}
            disabled={isProcessing}
          >
            {isProcessing ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
      <Editor
        height="500px"
        defaultLanguage="cpp"
        defaultValue={defaultCode}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;