#!/usr/bin/env python3
import json
import re
from collections import defaultdict

# Read JSON report
with open('reports/json/results.json', 'r') as f:
    data = json.load(f)

# Extract failed tests (structure: suites[].suites[].specs[].tests[].results[])
def extract_tests(suite_or_spec, path=''):
    tests = []
    if 'tests' in suite_or_spec:
        for test in suite_or_spec['tests']:
            if test.get('results') and test['results'][0].get('status') == 'failed':
                error_msg = test['results'][0].get('error', {}).get('message', 'No error')
                # Get test title from path or test title
                test_title = test.get('title', 'Unknown')
                full_path = f"{path}/{test_title}" if path else test_title
                tests.append({
                    'title': test_title,
                    'file': suite_or_spec.get('file', 'Unknown'),
                    'path': full_path,
                    'error': error_msg
                })
    if 'specs' in suite_or_spec:
        for spec in suite_or_spec['specs']:
            tests.extend(extract_tests(spec, f"{path}/{spec.get('title', '')}"))
    if 'suites' in suite_or_spec:
        for sub_suite in suite_or_spec['suites']:
            tests.extend(extract_tests(sub_suite, f"{path}/{sub_suite.get('title', '')}"))
    return tests

failed_tests = []
for suite in data.get('suites', []):
    failed_tests.extend(extract_tests(suite, suite.get('title', '')))

# Group by error type
error_groups = defaultdict(list)
for test in failed_tests:
    error = test['error']
    # Extract error type
    if 'TimeoutError' in error or 'Timeout' in error:
        error_type = 'TimeoutError'
    elif 'toContainText' in error or 'toContain' in error:
        error_type = 'toContainText/toContain failed'
    elif 'toBe' in error and 'Object.is equality' in error:
        error_type = 'toBe failed'
    elif 'element(s) not found' in error:
        error_type = 'element(s) not found'
    elif 'No current check found' in error:
        error_type = 'No current check found'
    elif 'HTTPError' in error or 'Response code' in error:
        error_type = 'HTTP Error'
    elif 'toHaveAttribute' in error:
        error_type = 'toHaveAttribute failed'
    else:
        error_type = 'Other'
    
    error_groups[error_type].append(test)

# Print summary
print(f"Total failed tests: {len(failed_tests)}\n")
print("=" * 80)
for error_type, tests in sorted(error_groups.items(), key=lambda x: -len(x[1])):
    print(f"\n{error_type}: {len(tests)} tests")
    print("-" * 80)
    for test in tests[:5]:  # Show first 5 examples
        print(f"  - {test['path']}")
        error_preview = test['error'][:150].replace('\n', ' ')
        print(f"    Error: {error_preview}...")
    if len(tests) > 5:
        print(f"  ... and {len(tests) - 5} more")

