import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

// Define the 5 key metrics structure
export interface BenchmarkMetrics {
  successRate: number; // 1 or 0 per run
  stepEfficiency: number; // Number of turns/tools used
  tokenUsage: number; // Total tokens (input + output)
  duration: number; // Wall clock time in ms
  reliabilityScore: number; // 0-100 based on errors/hallucinations
}

export interface BenchmarkResult {
  testId: string;
  scenarioId: string;
  status: 'passed' | 'failed' | 'timedOut' | 'skipped';
  metrics: BenchmarkMetrics;
  error?: string;
}

class BenchmarkReporter implements Reporter {
  private results: BenchmarkResult[] = [];
  private startTime: number = 0;

  onBegin(config: any, suite: any) {
    this.startTime = Date.now();
    console.log(`Starting Benchmark Suite: ${suite.allTests().length} scenarios found.`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const annotations = test.annotations;
    
    // Extract metrics from annotations added during the test
    const metricsAnnotation = annotations.find(a => a.type === 'benchmark-metrics');
    const rawMetrics = metricsAnnotation ? JSON.parse(metricsAnnotation.description!) : {};

    const metrics: BenchmarkMetrics = {
      successRate: result.status === 'passed' ? 1 : 0,
      stepEfficiency: rawMetrics.stepEfficiency || 0,
      tokenUsage: rawMetrics.tokenUsage || 0,
      duration: result.duration,
      reliabilityScore: rawMetrics.reliabilityScore || (result.status === 'passed' ? 100 : 0)
    };

    // Parse scenario ID from title or annotation
    const scenarioId = annotations.find(a => a.type === 'scenario-id')?.description || test.title;

    this.results.push({
      testId: test.id,
      scenarioId,
      status: result.status,
      metrics,
      error: result.error?.message
    });

    console.log(`Finished ${scenarioId}: ${result.status} (${metrics.duration}ms) - Steps: ${metrics.stepEfficiency}`);
  }

  async onEnd(result: FullResult) {
    console.log(`
Benchmark Completed in ${(Date.now() - this.startTime) / 1000}s`);
    
    // Generate Summary Table
    console.table(this.results.map(r => ({
      Scenario: r.scenarioId,
      Status: r.status,
      'Success': r.metrics.successRate,
      'Steps': r.metrics.stepEfficiency,
      'Tokens': r.metrics.tokenUsage,
      'Time(s)': (r.metrics.duration / 1000).toFixed(1),
      'Score': r.metrics.reliabilityScore
    })));

    // Write JSON Report
    const reportPath = path.resolve(process.cwd(), 'benchmark-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      summary: result,
      results: this.results,
      timestamp: new Date().toISOString()
    }, null, 2));
    console.log(`Detailed report saved to: ${reportPath}`);
  }
}

export default BenchmarkReporter;
