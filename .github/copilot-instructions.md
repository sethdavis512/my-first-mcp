# GitHub Copilot Instructions

This file contains coding patterns and practices extracted from project files.
Auto-generated and updated by the CODIFY tool.

GitHub Copilot will use these instructions to provide context-aware code suggestions
that align with this project's established patterns and conventions.

---

## Analysis of index.js (2025-07-10)

### **Code Patterns**

1. **MCP Server Architecture**: Implements the Model Context Protocol using a clean separation between tool definition and tool execution handlers
2. **Tool-Based Extension Pattern**: Uses discrete, well-defined tools (codify, write_codified_patterns) that can be composed together
3. **Two-Phase Tool Pattern**: Separates tool listing (`ListToolsRequestSchema`) from tool execution (`CallToolRequestSchema`)
4. **Async Request Handling**: All request handlers are async functions for non-blocking I/O operations
5. **Switch-Case Tool Routing**: Uses a switch statement to route tool calls to appropriate handlers
6. **JSON Schema Validation**: Tools define strict input schemas for type safety and validation

### **Best Practices**

1. **ES6 Module Imports**: Uses modern ES6 import syntax with explicit file extensions
2. **Destructuring Assignment**: Consistently uses destructuring for cleaner parameter extraction (`const { name, arguments: args } = request.params`)
3. **Const Over Let/Var**: Prefers `const` declarations for immutable bindings
4. **Comprehensive Error Handling**: Wraps tool execution in try-catch blocks with descriptive error messages
5. **File System Safety**: Checks file existence before operations using `existsSync()`
6. **Directory Creation**: Uses `mkdirSync` with `recursive: true` for safe directory creation
7. **Descriptive Variable Names**: Uses clear, intention-revealing names (`projectRootPath`, `instructionsPath`, `analysisPrompt`)

### **Style Guidelines**

1. **4-Space Indentation**: Consistent use of 4 spaces for code indentation
2. **Multi-Line Object Formatting**: Objects and arrays formatted across multiple lines for readability
3. **Trailing Commas**: No trailing commas in object/array literals
4. **Quote Consistency**: Uses single quotes for strings consistently
5. **Template Literals**: Uses template literals for string interpolation and multi-line strings
6. **Comment Placement**: Inline comments used to explain non-obvious logic and sections

### **Technical Decisions**

1. **MCP SDK Framework**: Built on `@modelcontextprotocol/sdk` for standardized AI tool integration
2. **StdioServerTransport**: Uses standard input/output for communication (suitable for subprocess-based tools)
3. **Node.js File System**: Leverages native `fs` module for file operations rather than external libraries
4. **Path Module**: Uses Node.js `path` module for cross-platform file path handling
5. **GitHub Integration**: Targets `.github/copilot-instructions.md` as the standard location for GitHub Copilot configuration
6. **UTF-8 Encoding**: Explicitly specifies UTF-8 encoding for file read/write operations
7. **Process Error Handling**: Uses `process.exit(1)` for proper error signaling to the parent process
8. **Timestamp Generation**: Uses ISO date format for consistent timestamping
9. **Self-Referential Analysis**: The tool can analyze itself, creating a meta-programming capability

### **Architectural Insights**

- **Plugin-Style Architecture**: The server acts as a host that can easily be extended with new tools
- **File-Based Persistence**: Uses file system for storing analysis results rather than in-memory or database storage
- **AI-Human Collaboration**: Designed to work with AI assistants, bridging human intent and automated analysis
- **Documentation-as-Code**: Automatically generates documentation that becomes part of the development workflow

---
