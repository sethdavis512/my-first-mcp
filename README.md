# My First MCP Server

This is a powerful Model Context Protocol (MCP) server that provides AI-driven development tools for code analysis, documentation, and project management.

## Features

-   **🔍 CODIFY**: AI-powered code pattern extraction and documentation
-   **🔥 Code Roaster**: Humorous but constructive code review comments
-   **📝 TODO Finder**: Comprehensive technical debt analysis and prioritization
-   **📋 PRD Generator**: Professional Project Requirements Document creation
-   **� Bug Predictor**: Identify code patterns that commonly lead to bugs
-   **🧮 Complexity Analyzer**: Measure cyclomatic complexity and suggest refactoring
-   **�💾 Document Persistence**: Automated saving to proper locations (.github/, /docs/)

## Setup

1. Install dependencies:

    ```bash
    npm install
    ```

2. Run the server:

    ```bash
    npm start
    ```

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that enables AI assistants to securely connect to data sources and tools. This server implements the basic MCP protocol with a simple echo tool.

## How it works

-   The server listens on stdio (standard input/output)
-   It provides 8 powerful tools for development workflow automation:
    -   **codify**: AI-driven code pattern extraction
    -   **write_codified_patterns**: Saves patterns to GitHub Copilot instructions
    -   **code_roaster**: Humorous code review with multiple styles
    -   **find_todos**: Technical debt scanning and prioritization
    -   **generate_prd**: Professional requirements document creation
    -   **save_prd**: Document persistence to /docs folder
    -   **bug_predictor**: Identify bug-prone code patterns
    -   **complexity_analyzer**: Measure complexity and suggest refactoring
-   Each tool uses AI analysis rather than hardcoded rules for intelligent insights
-   The server follows the MCP specification for tool discovery and execution

## Connecting to VS Code

### Method 1: Using Continue Extension

1. Install the **Continue** extension from the VS Code marketplace
2. Open Command Palette (`Cmd+Shift+P`)
3. Run "Continue: Open config.json"
4. Copy the contents from `continue-config.json` in this project
5. Replace `"your-api-key-here"` with your actual OpenAI API key
6. Save and restart VS Code

### Method 2: Using Copilot MCP Extension

1. Install the **Copilot MCP** extension
2. Open Command Palette (`Cmd+Shift+P`)
3. Run "MCP: Add Server"
4. Use these settings:
    - **Name**: my-first-mcp
    - **Command**: node
    - **Args**: ["index.js"]
    - **Working Directory**: /Users/sethdavis/Desktop/my-first-mcp

### Method 3: Manual Configuration

Copy the `mcp-config.json` to your VS Code settings directory and configure your AI extension to use it.

## Testing

Once connected, you can test the server with these tools:

### Available Tools

#### 🔍 CODIFY Tool

Analyzes code files and extracts patterns/practices to `.github/copilot-instructions.md`

**Usage:**

-   `"CODIFY this file"`
-   `"Analyze index.js and extract coding patterns"`

#### 🔥 Code Roaster Tool

Provides humorous but constructive code review comments

**Usage:**

-   `"Roast my index.js file"`
-   `"Give me spicy code review comments for this file"`
-   `"Savage roast of my terrible code"`

**Styles:** `gentle`, `spicy`, `savage`

#### 📝 TODO Finder Tool

Scans codebase for TODO, FIXME, HACK comments and creates action plans

**Usage:**

-   `"Find all TODOs in my project"`
-   `"Scan for technical debt and prioritize it"`
-   `"What FIXME comments need attention?"`

#### 📋 PRD Generator Tool

Creates comprehensive Project Requirements Documents

**Usage:**

-   `"Generate a PRD for my TaskMaster app which helps teams manage projects"`
-   `"Create project requirements for an e-commerce platform"`

#### 🐛 Bug Predictor Tool

Identifies code patterns that commonly lead to bugs

**Usage:**

-   `"Predict bugs in my index.js file"`
-   `"Analyze this file for bug-prone patterns with thorough analysis"`
-   `"Quick scan for obvious bug patterns"`

**Analysis Depths:**

-   `quick`: Fast scan for obvious issues
-   `thorough`: Comprehensive bug pattern analysis (default)
-   `comprehensive`: Deep-dive analysis with risk assessment

#### 🧮 Complexity Analyzer Tool

Measures cyclomatic complexity and suggests refactoring opportunities

**Usage:**

-   `"Analyze complexity of my index.js file"`
-   `"Check complexity with threshold 8 and include refactoring tips"`
-   `"Measure complexity and suggest simplification strategies"`

**Options:**

-   `complexityThreshold`: Flag functions above this complexity (default: 10)
-   `includeRefactoringTips`: Include detailed refactoring suggestions (default: true)

#### 💾 Document Persistence Tools

Automatically save analysis results to appropriate locations:

-   `write_codified_patterns` → `.github/copilot-instructions.md`
-   `save_prd` → `/docs/prd-[project]-[date].md`

### Example Test Commands

1. **Code Analysis**: `"CODIFY my index.js file"`
2. **Code Review**: `"Roast this file with a spicy style"`
3. **Technical Debt**: `"Find all TODOs and create an action plan"`
4. **Documentation**: `"Generate a PRD for my MCP server project"`
5. **Bug Prediction**: `"Predict bugs in my code with thorough analysis"`
6. **Complexity Analysis**: `"Analyze complexity and suggest refactoring"`

## Output Files & Structure

Your MCP server automatically creates and manages these files:

```text
project-root/
├── .github/
│   └── copilot-instructions.md    # AI-extracted coding patterns
├── docs/
│   └── prd-[project]-[date].md    # Generated requirements documents
├── index.js                       # Your MCP server
└── README.md                      # This file
```

### File Purposes

-   **`.github/copilot-instructions.md`**: Contains coding patterns extracted by the CODIFY tool. GitHub Copilot reads this file to provide context-aware code suggestions that match your project's conventions.

-   **`/docs/prd-*.md`**: Professional Project Requirements Documents generated by the PRD tool, timestamped and ready for stakeholder review.

## Advanced Usage

### Chaining Tools

You can chain multiple tools together:

1. `"CODIFY my entire project"` → Analyzes patterns
2. `"Find all TODOs and group by priority"` → Identifies technical debt
3. `"Generate a PRD for the next phase"` → Creates requirements doc
4. `"Roast my code and suggest improvements"` → Code review

### Custom Analysis

Most tools accept custom prompts for specialized analysis:

-   `"CODIFY this file but focus on security patterns"`
-   `"Find TODOs but only show high-priority items"`
-   `"Generate a PRD with emphasis on scalability requirements"`
