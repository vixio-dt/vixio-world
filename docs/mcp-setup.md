# MCP Server Setup for vixio-world

This document explains the MCP (Model Context Protocol) servers configured for this project.

## Configured Servers

| Server | Purpose | Requires Setup |
|--------|---------|----------------|
| **Serena** | Symbol-level code retrieval and editing | ✅ Needs `uv` installed |
| **Context7** | Up-to-date docs for libraries | ❌ Works out of box |
| **Sequential Thinking** | Structured problem-solving | ❌ Works out of box |
| **Supabase** | Database access | ✅ Needs env vars |
| **GitHub** | PR/issue management | ✅ Needs token |
| **Memory** | Persistent context | ❌ Works out of box |
| **Fetch** | Web content retrieval | ❌ Works out of box |

## Prerequisites

### 1. Node.js (Required)
All MCP servers use npx. Ensure you have Node.js 18+:
```bash
node --version  # Should be 18.x or higher
```

### 2. UV Package Manager (For Serena)
Serena uses Python and requires `uv`:
```bash
# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or with pip
pip install uv
```

## Environment Variables

Add these to your `.env.local` or system environment:

### Supabase MCP
```env
# Already have NEXT_PUBLIC_SUPABASE_URL in .env.local
# Add the service role key for full access:
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
Get from: Supabase Dashboard → Project Settings → API → service_role key

### GitHub MCP
```env
GITHUB_TOKEN=ghp_your_personal_access_token
```
Create at: https://github.com/settings/tokens
Required scopes: `repo`, `read:org`, `read:user`

## How MCP Tool Selection Works

When you make a request, the AI sees all available tools from all MCP servers:

```
Your request: "Find all functions that reference createCharacter"

Available tools (AI sees descriptions):
├── Serena.find_referencing_symbols: "Find symbols that reference a given symbol"  ← BEST MATCH
├── GitHub.search_code: "Search code in repositories"
├── Supabase.query: "Execute SQL queries"
└── Context7.get_docs: "Get library documentation"

AI selects: Serena.find_referencing_symbols
```

**Key points:**
- AI chooses based on tool descriptions and your request
- Most specific tool wins
- You can guide it: "use Serena to..." or "query Supabase for..."

## Tool Categories

### Code Intelligence (Serena)
- `find_symbol` - Find a symbol by name
- `find_referencing_symbols` - Find what references a symbol
- `insert_after_symbol` - Insert code after a specific symbol
- `get_symbol_definition` - Get full definition of a symbol

### Documentation (Context7)
- `get_library_docs` - Get docs for a specific library
- `search_docs` - Search across all library documentation

### Reasoning (Sequential Thinking)
- `create_thought_sequence` - Break down complex problems step by step

### Database (Supabase)
- `query` - Execute SQL queries
- `list_tables` - List all tables
- `describe_table` - Get table schema

### Version Control (GitHub)
- `create_issue` - Create GitHub issue
- `create_pull_request` - Create PR
- `get_pull_request` - Get PR details
- `search_code` - Search code in repos

### Memory
- `store_memory` - Save information
- `retrieve_memory` - Recall stored information
- `search_memories` - Search knowledge graph

## Troubleshooting

### Server not connecting
1. Check Node.js version: `node --version` (need 18+)
2. Check if package exists: `npx -y @package/name --help`
3. Restart Cursor after config changes

### Serena not working
1. Check uv installed: `uv --version`
2. Try manual start: `uvx --from git+https://github.com/oraios/serena serena start-mcp-server --help`

### Missing tools
- Some servers need authentication (GitHub, Supabase)
- Check environment variables are set correctly
- Restart Cursor to reload MCP configuration

## Verifying Setup

After restarting Cursor, the MCP servers should appear in:
- Settings → Rules, Skills, Subagents → vixio-world tab

You can test by asking:
- "What MCP tools are available?" 
- "Use Context7 to get Next.js 16 documentation"
- "Use Serena to find all functions in CharacterForm.tsx"
