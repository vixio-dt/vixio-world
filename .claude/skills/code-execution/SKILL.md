---
name: code-execution
description: Execute Python code locally for 90%+ token savings on bulk operations. Activates when user requests bulk operations (10+ files), complex multi-step workflows, iterative processing, or mentions efficiency/performance.
---

# Code Execution

Execute Python locally for **90-99% token savings** on bulk operations.

## When to Use

- Bulk operations (10+ files)
- Complex multi-step workflows
- Iterative processing across many files
- User mentions efficiency/performance
- Codebase-wide refactoring
- Mass renaming or pattern replacement

## How It Works

Instead of reading files into context, execute Python scripts that:
1. Analyze files locally (return metadata, not content)
2. Process changes locally (batch operations)
3. Return summaries (not raw data)

## Pattern

```
Traditional approach (expensive):
  Read file → Context → Process → Edit → Repeat
  Cost: ~500 tokens per file

Execution approach (efficient):
  Script processes all files locally → Return summary
  Cost: ~500 tokens TOTAL
```

## Example Scripts

### Bulk Rename (50+ files)

```python
import os
import re
from pathlib import Path

def rename_identifier(directory: str, old_name: str, new_name: str, pattern: str = "**/*.py"):
    """Rename an identifier across all matching files."""
    results = {"files_modified": 0, "total_replacements": 0, "errors": []}
    
    for filepath in Path(directory).glob(pattern):
        try:
            content = filepath.read_text()
            # Use word boundaries to avoid partial matches
            new_content = re.sub(rf'\b{old_name}\b', new_name, content)
            
            if content != new_content:
                count = len(re.findall(rf'\b{old_name}\b', content))
                filepath.write_text(new_content)
                results["files_modified"] += 1
                results["total_replacements"] += count
        except Exception as e:
            results["errors"].append({"file": str(filepath), "error": str(e)})
    
    return results

# Usage
result = rename_identifier('.', 'getUserData', 'fetchUserData', '**/*.ts')
print(f"Modified {result['files_modified']} files, {result['total_replacements']} replacements")
```

### Extract Functions to Module

```python
import ast
import re
from pathlib import Path

def find_functions(filepath: str, pattern: str = ".*"):
    """Find functions matching pattern. Returns METADATA only."""
    content = Path(filepath).read_text()
    tree = ast.parse(content)
    
    functions = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            if re.match(pattern, node.name):
                functions.append({
                    "name": node.name,
                    "start_line": node.lineno,
                    "end_line": node.end_lineno,
                    "args": [arg.arg for arg in node.args.args]
                })
    
    return functions  # Metadata only, not source code!

def extract_lines(filepath: str, start: int, end: int) -> str:
    """Extract specific lines from a file."""
    lines = Path(filepath).read_text().splitlines()
    return '\n'.join(lines[start-1:end])

def append_to_file(filepath: str, content: str):
    """Append content to file."""
    with open(filepath, 'a') as f:
        f.write('\n\n' + content)

# Usage: Move all utility functions to utils.py
functions = find_functions('app.py', pattern='.*_util$')
for func in functions:
    code = extract_lines('app.py', func['start_line'], func['end_line'])
    append_to_file('utils.py', code)

print(f"Moved {len(functions)} functions to utils.py")
```

### Code Quality Audit

```python
import ast
from pathlib import Path
from collections import defaultdict

def audit_codebase(directory: str, pattern: str = "**/*.py"):
    """Analyze codebase for common issues. Returns metrics only."""
    results = {
        "files_analyzed": 0,
        "total_lines": 0,
        "issues": defaultdict(list),
        "complexity_hotspots": []
    }
    
    for filepath in Path(directory).glob(pattern):
        try:
            content = filepath.read_text()
            lines = content.splitlines()
            results["files_analyzed"] += 1
            results["total_lines"] += len(lines)
            
            # Check for issues
            tree = ast.parse(content)
            for node in ast.walk(tree):
                # Long functions
                if isinstance(node, ast.FunctionDef):
                    length = (node.end_lineno or 0) - node.lineno
                    if length > 50:
                        results["issues"]["long_functions"].append({
                            "file": str(filepath),
                            "function": node.name,
                            "lines": length
                        })
                
                # Bare except
                if isinstance(node, ast.ExceptHandler) and node.type is None:
                    results["issues"]["bare_except"].append({
                        "file": str(filepath),
                        "line": node.lineno
                    })
                    
        except Exception as e:
            results["issues"]["parse_errors"].append({
                "file": str(filepath),
                "error": str(e)
            })
    
    return results

# Usage
audit = audit_codebase('src/')
print(f"Analyzed {audit['files_analyzed']} files ({audit['total_lines']} lines)")
print(f"Found {len(audit['issues']['long_functions'])} long functions")
print(f"Found {len(audit['issues']['bare_except'])} bare except clauses")
```

### Remove Debug Statements

```python
import re
from pathlib import Path

def remove_debug_statements(directory: str, pattern: str = "**/*.ts"):
    """Remove console.log and debugger statements."""
    results = {"files_modified": 0, "statements_removed": 0}
    
    debug_patterns = [
        r'console\.(log|debug|info|warn|error)\([^)]*\);?\n?',
        r'debugger;?\n?',
    ]
    
    for filepath in Path(directory).glob(pattern):
        content = filepath.read_text()
        original = content
        
        for dp in debug_patterns:
            matches = len(re.findall(dp, content))
            results["statements_removed"] += matches
            content = re.sub(dp, '', content)
        
        if content != original:
            filepath.write_text(content)
            results["files_modified"] += 1
    
    return results

# Usage
result = remove_debug_statements('src/')
print(f"Removed {result['statements_removed']} debug statements from {result['files_modified']} files")
```

## Token Savings Comparison

| Operation | Files | Traditional | Execution | Savings |
|-----------|-------|-------------|-----------|---------|
| Rename identifier | 10 | 5,000 | 500 | 90% |
| Rename identifier | 50 | 25,000 | 600 | 97.6% |
| Code audit | 100 | 150,000 | 1,000 | 99.3% |
| Extract functions | 20 | 10,000 | 800 | 92% |

## Best Practices

### DO:
- Return summaries, not raw data
- Use metadata (line numbers, counts) instead of content
- Batch operations in single scripts
- Handle errors gracefully, return error counts
- Use pathlib for cross-platform paths

### DON'T:
- Return all file contents to context
- Read files you don't need to modify
- Process files one by one
- Ignore errors silently

## When NOT to Use

- Single file edits (use Edit tool)
- Files requiring semantic understanding
- Complex refactors needing human review
- When you need to show code to user

## Integration

Works with other skills:
- **code-auditor**: Run quality checks via execution
- **systematic-debugging**: Bulk log analysis
- **test-driven-development**: Run test suites efficiently
