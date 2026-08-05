import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, XCircle, Terminal, RefreshCw, Layers } from 'lucide-react';

interface Spec {
  id: string;
  name: string;
  category: string;
  count: number;
}

export const TestRunnerPage: React.FC = () => {
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [testResult, setTestResult] = useState<{
    passed: boolean;
    output: string;
    command: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/test-runner/specs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSpecs(data.specs);
      })
      .catch(() => {});
  }, []);

  const runTest = async (specId?: string) => {
    setRunning(true);
    setSelectedSpec(specId || null);
    setTestResult(null);

    try {
      const res = await fetch('/api/test-runner/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specId })
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({
        passed: false,
        command: `npx playwright test ${specId || ''}`,
        output: 'Failed to communicate with test runner backend.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div class="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div class="space-y-1">
            <div class="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Terminal class="w-4 h-4" />
              <span>Playwright Automated Testing Engine</span>
            </div>
            <h1 class="text-3xl font-extrabold font-serif text-white">
              CompassionCare Test Automation Dashboard
            </h1>
            <p class="text-sm text-slate-400">
              Execute E2E Page Object Model & API Contract assertions live in Cloud Run.
            </p>
          </div>

          <button
            onClick={() => runTest()}
            disabled={running}
            class="px-6 py-3.5 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-500 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg transition-all"
          >
            {running ? (
              <>
                <RefreshCw class="w-4 h-4 animate-spin" />
                <span>Executing Full Suite...</span>
              </>
            ) : (
              <>
                <Play class="w-4 h-4 fill-white" />
                <span>Run All Specs</span>
              </>
            )}
          </button>
        </div>

        {/* Specs Grid */}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div class="lg:col-span-5 space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Layers class="w-4 h-4 text-purple-400" />
              <span>Test Specs ({specs.length})</span>
            </h3>

            <div class="space-y-2.5 max-h-[600px] overflow-y-auto pr-2">
              {specs.map((spec) => (
                <div
                  key={spec.id}
                  class={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    selectedSpec === spec.id
                      ? 'border-purple-500 bg-purple-950/40'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div class="space-y-1">
                    <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {spec.category}
                    </span>
                    <h4 class="text-sm font-bold text-white">{spec.name}</h4>
                    <span class="text-xs font-mono text-slate-400">{spec.id}</span>
                  </div>

                  <button
                    onClick={() => runTest(spec.id)}
                    disabled={running}
                    class="p-2.5 rounded-lg bg-slate-800 text-purple-300 hover:bg-purple-600 hover:text-white transition-colors disabled:opacity-50"
                    title={`Run ${spec.id}`}
                  >
                    <Play class="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Test Execution Output Console */}
          <div class="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <span class="text-xs font-mono font-bold text-slate-400">Terminal Console Output</span>
                {testResult && (
                  <span class={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
                    testResult.passed ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    {testResult.passed ? <CheckCircle2 class="w-3.5 h-3.5" /> : <XCircle class="w-3.5 h-3.5" />}
                    <span>{testResult.passed ? 'PASSED' : 'EXECUTED WITH RESULTS'}</span>
                  </span>
                )}
              </div>

              {running && (
                <div class="p-4 bg-slate-950 rounded-xl font-mono text-xs text-purple-300 flex items-center space-x-3">
                  <RefreshCw class="w-4 h-4 animate-spin text-purple-400" />
                  <span>Running Playwright test process in background...</span>
                </div>
              )}

              {testResult ? (
                <div class="space-y-3">
                  <div class="font-mono text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    $ {testResult.command}
                  </div>
                  <pre class="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto max-h-[450px] whitespace-pre-wrap leading-relaxed border border-slate-800/80">
                    {testResult.output}
                  </pre>
                </div>
              ) : !running && (
                <div class="py-24 text-center text-slate-500 font-mono text-xs">
                  Select a test spec on the left or click "Run All Specs" to execute automated test validation.
                </div>
              )}
            </div>

            {testResult && (
              <div class="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                Executed at: {new Date(testResult.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
