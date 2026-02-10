import React, { useState, useCallback, useMemo } from 'react';
import { Editor } from './components/Editor';
import { simulateApiRequest } from './services/apiSimulator';
import { HttpMethod, SimulatedResponse } from './types';

// Predefined examples
const EXAMPLES: Record<string, string> = {
  'fibonacci': '{\n  "fibonacci": 7\n}',
  'prime': '{\n  "prime": [2, 4, 7, 9, 11]\n}',
  'lcm': '{\n  "lcm": [12, 18, 24]\n}',
  'hcf': '{\n  "hcf": [24, 36, 60]\n}',
  'AI': '{\n  "AI": "What is the capital city of Maharashtra?"\n}',
  'Invalid Multiple Keys': '{\n  "fibonacci": 5,\n  "prime": [2, 3]\n}',
};

const App: React.FC = () => {
  const [method, setMethod] = useState<HttpMethod>(HttpMethod.POST);
  const [endpoint, setEndpoint] = useState<string>('/bfhl');
  const [requestBody, setRequestBody] = useState<string>(EXAMPLES['fibonacci']);
  
  const [response, setResponse] = useState<SimulatedResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isValidJson = useMemo(() => {
    if (method === HttpMethod.GET) return true;
    try {
      JSON.parse(requestBody);
      return true;
    } catch (e) {
      return false;
    }
  }, [requestBody, method]);

  const handleSend = useCallback(async () => {
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await simulateApiRequest(method, endpoint, requestBody);
      setResponse(res);
    } catch (err) {
      // Fallback for unhandled simulator crashes
      setResponse({
        status: 500,
        statusText: 'Simulator Crash',
        body: {
          is_success: false,
          error: "A fatal error occurred within the simulator."
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, [method, endpoint, requestBody]);

  const handleExampleSelect = (exKey: string) => {
    setMethod(HttpMethod.POST);
    setEndpoint('/bfhl');
    setRequestBody(EXAMPLES[exKey]);
  };

  const setHealthCheck = () => {
    setMethod(HttpMethod.GET);
    setEndpoint('/health');
    setRequestBody('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white px-6 py-4 shadow-md z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">BFHL API Simulator</h1>
          <p className="text-indigo-200 text-sm mt-1">
            Frontend sandbox for testing backend logic requirements
          </p>
        </div>
        <div className="bg-indigo-700 px-3 py-1 rounded text-xs font-mono text-indigo-100 border border-indigo-500">
           Simulated Environment
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-slate-100 border-r border-slate-200 overflow-y-auto hidden md:block flex-shrink-0">
          <div className="p-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Endpoints</h2>
            <ul className="space-y-1 mb-6">
              <li>
                <button
                  onClick={setHealthCheck}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${method === HttpMethod.GET && endpoint === '/health' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <span className="text-green-600 font-mono text-xs mr-2">GET</span> /health
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleExampleSelect('fibonacci')}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${method === HttpMethod.POST && endpoint === '/bfhl' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <span className="text-blue-600 font-mono text-xs mr-2">POST</span> /bfhl
                </button>
              </li>
            </ul>

            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">POST Payload Examples</h2>
            <ul className="space-y-1">
              {Object.keys(EXAMPLES).map((key) => (
                <li key={key}>
                  <button
                    onClick={() => handleExampleSelect(key)}
                    className="w-full text-left px-3 py-2 rounded text-sm text-slate-600 hover:bg-slate-200 transition-colors truncate"
                  >
                    {key}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Workspace */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden gap-4">
          
          {/* Request Bar */}
          <div className="flex gap-2">
            <div className="flex bg-white border border-slate-300 rounded shadow-sm overflow-hidden w-full max-w-2xl">
              <select 
                value={method} 
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className={`px-4 py-2 bg-slate-100 font-mono font-bold outline-none border-r border-slate-300 appearance-none cursor-pointer ${method === 'GET' ? 'text-green-600' : 'text-blue-600'}`}
              >
                <option value={HttpMethod.GET}>GET</option>
                <option value={HttpMethod.POST}>POST</option>
              </select>
              <input 
                type="text" 
                value={`https://api.example.com${endpoint}`} 
                readOnly
                className="flex-1 px-4 py-2 text-slate-700 font-mono bg-white outline-none"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || (!isValidJson && method !== HttpMethod.GET)}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded shadow transition-colors flex items-center gap-2 flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : 'Send Request'}
            </button>
          </div>

          {/* Editors Grid */}
          <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0">
            {/* Request Body */}
            <div className="flex-1 flex flex-col min-h-0 opacity-100 transition-opacity">
              <div className="mb-2 flex justify-between items-end">
                <h3 className="font-semibold text-slate-700">Request Body</h3>
                {method === HttpMethod.GET && <span className="text-xs text-slate-500">Not used for GET</span>}
              </div>
              <div className={`flex-1 min-h-0 ${method === HttpMethod.GET ? 'opacity-50 pointer-events-none' : ''}`}>
                 <Editor 
                   title="JSON" 
                   value={requestBody} 
                   onChange={setRequestBody} 
                   isValid={isValidJson}
                 />
              </div>
            </div>

            {/* Response Body */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="mb-2 flex justify-between items-end">
                <h3 className="font-semibold text-slate-700">Response</h3>
                {response && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono">Status:</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${response.status >= 200 && response.status < 300 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {response.status} {response.statusText}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <Editor 
                  title={response ? "Response JSON" : "Waiting for request..."} 
                  value={response ? JSON.stringify(response.body, null, 2) : ""} 
                  readOnly 
                />
              </div>
            </div>
          </div>
          
          {/* Note about API key */}
          <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded border border-blue-200 flex gap-2 items-start mt-2">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p>
              <strong>Note on AI Endpoint:</strong> The AI endpoint requires <code>process.env.API_KEY</code> to be configured in the environment running this code. As per system constraints, it is assumed to be injected and valid.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;
