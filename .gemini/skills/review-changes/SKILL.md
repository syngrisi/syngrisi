---
name: review-changes
description: Analysis of unstaged changes for dangerous application logic modifications (Safety Gatekeeper)
---

# Review Changes Skill

This skill is designed to identify dangerous code changes that could violate the application's business logic. It is especially useful after automated test fixes by an AI agent.

## When to use

- After test fixes by an AI agent
- Before committing changes
- When code reviewing large diffs

## Instructions

### Step 1: Get changes

Run the command to get unstaged changes:

```bash
git diff
```

Or for staged changes:

```bash
git diff --staged
```

### Step 2: Analyze changes

Switch to the role of **Senior Code Reviewer / Safety Gatekeeper**.

Analyze the obtained diff according to the following criteria:

#### Critical Checks (CRITICAL RISK)

1. **Relaxing Constraints**
   - Removed checks, validations, or `if` conditions
   - Removed `throw` statements for errors
   - Expanded allowable input parameter values

2. **Logic Alteration**
   - Changed control flow
   - Modified state transition logic
   - Changed side effects

3. **Contract Breaking**
   - Changed function signatures
   - Changed return types
   - Broken API backward compatibility

4. **Hardcoding**
   - Added values specific only to test data
   - Replaced dynamic values with constants

5. **Cheating Fixes**
   - Changed return value to match specific test expectations
   - Removed validation that prevents the test from passing

#### Exceptions from check

- Files in `test/`, `spec/`, `__tests__/`, `e2e/` directories — these are test files
- Test configuration changes (jest.config, wdio.conf, etc.)

#### Allowed changes (OK)

- Fixing off-by-one errors
- Adding null/undefined checks
- Fixing typos
- Refactoring without changing behavior

### Step 3: Report Generation (Structured & Concise)

Your goal is to provide a report that can be read in 10 seconds. Use tables and Emoji Scores.

#### 1. Overall Score (Score Meter)
At the very beginning, display the overall status and safety "traffic light":

- 🟢 **SAFETY SCORE: 10/10** (All changes are safe)
- 🟡 **SAFETY SCORE: 6/10** (There are suspicious areas)
- 🔴 **SAFETY SCORE: 0/10** (Critical vulnerabilities detected)

#### 2. Detailed Changes Table
Group changes into a table. No fluff, just facts.

| 📄 File | 📊 Risk | ⚠️ Type | 🔍 Change Essence & Risk |
|---|---|---|---|
| `auth.ts` | 🔴 High | Logic | ❌ Token check removed.<br>🛑 Anyone can login without password. |
| `utils.js` | 🟡 Med | Refactor | 🔧 `formatDate` signature changed.<br>⚠️ Check all function calls. |
| `config.json` | 🟢 Low | Config | 📝 New flag added.<br>✅ Safe. |

#### 3. Recommendations (Action Items)
Brief list of actions (if there are issues):
- [ ] 🔴 **Restore check** in `auth.ts` (line 45)
- [ ] 🟡 **Run tests** for `utils.js`

### Step 4: Final Verdict

Finish the report with one of the status commands:

- `> ✅ STATUS: SAFE (Ready to merge)`
- `> ⚠️ STATUS: WARN (Requires careful review)`
- `> 🛑 STATUS: BLOCK (Unacceptable changes, fix needed)`

## Usage Example

User writes:
```
/review-changes
```

or

```
Check unstaged changes for dangerous logic changes
```

The Agent must:
1. Run `git diff`
2. Analyze changes according to the criteria above
3. Generate a report with found issues
4. Output the final status

## Key Self-Check Question

> **"Does this change fix a legitimate bug, or does it redefine how the feature works?"**

If the answer is "redefines how the feature works" — it is a BLOCK.
