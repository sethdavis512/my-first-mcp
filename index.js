#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { glob } from 'glob';

// Create a new MCP server
const server = new Server(
    {
        name: 'my-first-mcp',
        version: '1.0.0'
    },
    {
        capabilities: {
            tools: {}
        }
    }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'codify',
                description:
                    'Read a file and return its content for AI analysis and codification of patterns/practices',
                inputSchema: {
                    type: 'object',
                    properties: {
                        filePath: {
                            type: 'string',
                            description: 'Path to the file to analyze'
                        },
                        analysisPrompt: {
                            type: 'string',
                            description:
                                'Optional: Specific analysis instructions (defaults to general pattern extraction)'
                        }
                    },
                    required: ['filePath']
                }
            },
            {
                name: 'write_codified_patterns',
                description:
                    'Write analyzed patterns and practices to .github/copilot-instructions.md (GitHub Copilot standard location)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        patterns: {
                            type: 'string',
                            description:
                                'The analyzed patterns and practices in markdown format'
                        },
                        fileName: {
                            type: 'string',
                            description: 'Name of the file that was analyzed'
                        },
                        projectRoot: {
                            type: 'string',
                            description:
                                'Root directory of the project (optional)'
                        }
                    },
                    required: ['patterns', 'fileName']
                }
            },
            {
                name: 'code_roaster',
                description:
                    'Provide humorous (but constructive) code review comments',
                inputSchema: {
                    type: 'object',
                    properties: {
                        filePath: {
                            type: 'string',
                            description: 'Path to the file to roast'
                        },
                        roastStyle: {
                            type: 'string',
                            description:
                                'Style of roast: "gentle", "spicy", or "savage" (defaults to "gentle")'
                        }
                    },
                    required: ['filePath']
                }
            },
            {
                name: 'find_todos',
                description:
                    'Scan codebase for TODO, FIXME, HACK comments and prioritize them',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectRoot: {
                            type: 'string',
                            description:
                                'Root directory to scan (defaults to current directory)'
                        },
                        filePattern: {
                            type: 'string',
                            description:
                                'Glob pattern for files to scan (defaults to "**/*.{js,ts,jsx,tsx,md,py,java,c,cpp,h}")'
                        }
                    }
                }
            },
            {
                name: 'generate_prd',
                description:
                    'Generate a comprehensive Project Requirements Document using industry-standard template and output to /docs folder',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectName: {
                            type: 'string',
                            description: 'Name of the project for the PRD'
                        },
                        projectDescription: {
                            type: 'string',
                            description:
                                'Brief description of what the project does'
                        },
                        projectRoot: {
                            type: 'string',
                            description:
                                'Root directory of the project (defaults to current directory)'
                        },
                        customRequirements: {
                            type: 'string',
                            description:
                                'Optional: Additional specific requirements or context for the project'
                        }
                    },
                    required: ['projectName', 'projectDescription']
                }
            },
            {
                name: 'save_prd',
                description: 'Save generated PRD content to /docs folder',
                inputSchema: {
                    type: 'object',
                    properties: {
                        prdContent: {
                            type: 'string',
                            description:
                                'The complete PRD content in Markdown format'
                        },
                        projectName: {
                            type: 'string',
                            description:
                                'Name of the project (used for filename)'
                        },
                        projectRoot: {
                            type: 'string',
                            description:
                                'Root directory of the project (optional)'
                        }
                    },
                    required: ['prdContent', 'projectName']
                }
            },
            {
                name: 'bug_predictor',
                description:
                    'Identify code patterns that commonly lead to bugs',
                inputSchema: {
                    type: 'object',
                    properties: {
                        filePath: {
                            type: 'string',
                            description:
                                'Path to the file to analyze for bug-prone patterns'
                        },
                        analysisDepth: {
                            type: 'string',
                            description:
                                'Analysis depth: "quick", "thorough", or "comprehensive" (defaults to "thorough")'
                        }
                    },
                    required: ['filePath']
                }
            },
            {
                name: 'complexity_analyzer',
                description:
                    'Measure cyclomatic complexity and suggest refactoring opportunities',
                inputSchema: {
                    type: 'object',
                    properties: {
                        filePath: {
                            type: 'string',
                            description:
                                'Path to the file to analyze for complexity metrics'
                        },
                        complexityThreshold: {
                            type: 'number',
                            description:
                                'Complexity threshold for flagging functions (defaults to 10)'
                        },
                        includeRefactoringTips: {
                            type: 'boolean',
                            description:
                                'Include specific refactoring suggestions (defaults to true)'
                        }
                    },
                    required: ['filePath']
                }
            }
        ]
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        case 'codify':
            try {
                const filePath = args.filePath;

                // Read the target file
                if (!existsSync(filePath)) {
                    throw new Error(`File not found: ${filePath}`);
                }

                const fileContent = readFileSync(filePath, 'utf-8');
                const fileName = filePath.split('/').pop();
                const fileExtension = fileName.split('.').pop();

                // Return file content with analysis instructions for the LLM
                const analysisPrompt =
                    args.analysisPrompt ||
                    `
Analyze this ${fileExtension.toUpperCase()} file and extract:

1. **Code Patterns**: Architectural patterns, design choices, and structural conventions
2. **Best Practices**: Coding standards, naming conventions, and quality practices  
3. **Style Guidelines**: Formatting, organization, and documentation approaches
4. **Technical Decisions**: Library choices, configuration patterns, and implementation strategies

Focus on extractable, teachable patterns that could guide future development in this codebase.

File: ${fileName}
`;

                return {
                    content: [
                        {
                            type: 'text',
                            text: `${analysisPrompt}

\`\`\`${fileExtension}
${fileContent}
\`\`\`

After analyzing this file, use the 'write_codified_patterns' tool to save your findings to .github/copilot-instructions.md.`
                        }
                    ]
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ CODIFY ERROR: ${error.message}`
                        }
                    ]
                };
            }

        case 'write_codified_patterns':
            try {
                const { patterns, fileName, projectRoot } = args;
                const projectRootPath = projectRoot || process.cwd();
                const githubDir = join(projectRootPath, '.github');
                const instructionsPath = join(
                    githubDir,
                    'copilot-instructions.md'
                );
                const timestamp = new Date().toISOString().split('T')[0];

                // Create .github directory if it doesn't exist
                if (!existsSync(githubDir)) {
                    mkdirSync(githubDir, { recursive: true });
                }

                // Read existing instructions if they exist
                let existingInstructions = '';
                if (existsSync(instructionsPath)) {
                    existingInstructions = readFileSync(
                        instructionsPath,
                        'utf-8'
                    );
                }

                // Create header if file doesn't exist
                if (!existingInstructions.trim()) {
                    existingInstructions = `# GitHub Copilot Instructions

This file contains coding patterns and practices extracted from project files.
Auto-generated and updated by the CODIFY tool.

GitHub Copilot will use these instructions to provide context-aware code suggestions
that align with this project's established patterns and conventions.

---

`;
                }

                // Add new section with LLM analysis
                const newSection = `
## Analysis of ${fileName} (${timestamp})

${patterns}

---

`;

                // Append new section
                const updatedInstructions = existingInstructions + newSection;

                // Write to .github/copilot-instructions.md
                writeFileSync(instructionsPath, updatedInstructions, 'utf-8');

                return {
                    content: [
                        {
                            type: 'text',
                            text: `✅ CODIFIED: Successfully analyzed ${fileName} and updated .github/copilot-instructions.md with AI-extracted patterns and practices.`
                        }
                    ]
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ WRITE ERROR: ${error.message}`
                        }
                    ]
                };
            }

        case 'code_roaster':
            try {
                const filePath = args.filePath;
                const roastStyle = args.roastStyle || 'gentle';

                // Read the target file
                if (!existsSync(filePath)) {
                    throw new Error(`File not found: ${filePath}`);
                }

                const fileContent = readFileSync(filePath, 'utf-8');
                const fileName = filePath.split('/').pop();
                const fileExtension = fileName.split('.').pop();

                // Create roast prompt based on style
                const roastPrompts = {
                    gentle: `Please provide gentle, encouraging code review comments with light humor for this ${fileExtension.toUpperCase()} file. Focus on constructive suggestions while keeping things fun and friendly.`,
                    spicy: `Please provide witty and moderately sarcastic code review comments for this ${fileExtension.toUpperCase()} file. Be clever and humorous, but still constructive and helpful.`,
                    savage: `Please provide brutally honest but hilariously savage code review comments for this ${fileExtension.toUpperCase()} file. Roast it like a professional comedian, but make sure every criticism comes with actionable advice.`
                };

                const roastPrompt =
                    roastPrompts[roastStyle] || roastPrompts['gentle'];

                return {
                    content: [
                        {
                            type: 'text',
                            text: `${roastPrompt}

File: ${fileName}

\`\`\`${fileExtension}
${fileContent}
\`\`\`

Please provide your roast as a bulleted list of humorous but constructive code review comments.`
                        }
                    ]
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ ROAST ERROR: ${error.message}`
                        }
                    ]
                };
            }

        case 'find_todos':
            try {
                const projectRoot = args.projectRoot || process.cwd();
                const filePattern =
                    args.filePattern ||
                    '**/*.{js,ts,jsx,tsx,md,py,java,c,cpp,h}';

                // Find all matching files
                const files = await glob(filePattern, {
                    cwd: projectRoot,
                    ignore: [
                        'node_modules/**',
                        '.git/**',
                        'dist/**',
                        'build/**'
                    ]
                });

                const todos = [];
                const todoRegex = /(TODO|FIXME|HACK|NOTE|BUG|XXX)[:|\s]*(.*)/gi;

                // Scan each file for TODO comments
                for (const file of files) {
                    try {
                        const fullPath = join(projectRoot, file);
                        const content = readFileSync(fullPath, 'utf-8');
                        const lines = content.split('\n');

                        lines.forEach((line, lineNumber) => {
                            let match;
                            while ((match = todoRegex.exec(line)) !== null) {
                                todos.push({
                                    file: file,
                                    line: lineNumber + 1,
                                    type: match[1].toUpperCase(),
                                    comment: match[2].trim(),
                                    fullLine: line.trim()
                                });
                            }
                        });
                    } catch (readError) {
                        // Skip files that can't be read (binary, permissions, etc.)
                        continue;
                    }
                }

                // Format results for AI analysis
                const todoSummary = todos
                    .map(
                        (todo) =>
                            `**${todo.type}** in \`${todo.file}:${
                                todo.line
                            }\` - ${todo.comment || todo.fullLine}`
                    )
                    .join('\n');

                const analysisPrompt = `
Please analyze these TODO/FIXME/HACK comments found in the codebase and provide:

1. **Priority Assessment**: Categorize each item as High, Medium, or Low priority
2. **Effort Estimation**: Estimate effort (Small, Medium, Large) for each item
3. **Grouping**: Group related items that could be tackled together
4. **Quick Wins**: Identify items that could be completed quickly
5. **Action Plan**: Suggest a prioritized order for addressing these items

Found ${todos.length} items across ${files.length} files:

${todoSummary}

Please provide a comprehensive analysis and action plan.`;

                return {
                    content: [
                        {
                            type: 'text',
                            text: analysisPrompt
                        }
                    ]
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ TODO SCAN ERROR: ${error.message}`
                        }
                    ]
                };
            }

        case 'generate_prd':
            try {
                const {
                    projectName,
                    projectDescription,
                    projectRoot,
                    customRequirements
                } = args;
                const projectRootPath = projectRoot || process.cwd();
                const docsDir = join(projectRootPath, 'docs');
                const timestamp = new Date().toISOString().split('T')[0];
                const prdPath = join(docsDir, `prd-${timestamp}.md`);

                // Create docs directory if it doesn't exist
                if (!existsSync(docsDir)) {
                    mkdirSync(docsDir, { recursive: true });
                }

                // Generate PRD content with AI analysis
                const prdPrompt = `
Please generate a comprehensive Project Requirements Document (PRD) for this project:

**Project Name**: ${projectName}
**Project Description**: ${projectDescription}
${
    customRequirements
        ? `**Additional Requirements**: ${customRequirements}`
        : ''
}

Create a professional PRD that includes:

1. **Executive Summary** - High-level overview and business justification
2. **Product Overview** - Detailed description of what the product does
3. **Target Audience** - Who will use this product
4. **User Stories** - Key user scenarios and use cases
5. **Functional Requirements** - Detailed feature specifications with requirement IDs
6. **Non-Functional Requirements** - Performance, security, scalability requirements
7. **Technical Constraints** - Platform, technology, and integration constraints
8. **Success Metrics** - How success will be measured
9. **Timeline and Milestones** - High-level project phases
10. **Assumptions and Dependencies** - Key assumptions and external dependencies
11. **Risk Assessment** - Potential risks and mitigation strategies

Use the following professional template structure and format it as clean, well-organized Markdown:

# Project Requirements Document: ${projectName}

**Document Version**: 1.0  
**Date**: ${timestamp}  
**Project**: ${projectName}

## Table of Contents
[Generate appropriate table of contents]

## 1. Executive Summary
[Provide executive summary]

## 2. Product Overview
[Detailed product description]

## 3. Target Audience
[Define target users]

## 4. User Stories
[List user stories in "As a [user], I want [goal] so that [benefit]" format]

## 5. Functional Requirements
[Create detailed functional requirements table with ID, Description, User Story, Expected Behavior]

## 6. Non-Functional Requirements
[Performance, security, scalability requirements]

## 7. Technical Constraints
[Platform, technology, integration constraints]

## 8. Success Metrics
[Define measurable success criteria]

## 9. Timeline and Milestones
[High-level project phases]

## 10. Assumptions and Dependencies
[Key assumptions and dependencies]

## 11. Risk Assessment
[Potential risks and mitigation strategies]

Please make this comprehensive, professional, and actionable.`;

                return {
                    content: [
                        {
                            type: 'text',
                            text: `${prdPrompt}

After generating this PRD, I'll save it to: \`${prdPath}\`

Please provide the complete PRD content in Markdown format.`
                        }
                    ]
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ PRD GENERATION ERROR: ${error.message}`
                        }
                    ]
                };
            }

        case 'save_prd':
            try {
                const { prdContent, projectName, projectRoot } = args;
                const projectRootPath = projectRoot || process.cwd();
                const docsDir = join(projectRootPath, 'docs');
                const timestamp = new Date().toISOString().split('T')[0];
                const sanitizedProjectName = projectName
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '-');
                const prdPath = join(
                    docsDir,
                    `prd-${sanitizedProjectName}-${timestamp}.md`
                );

                // Create docs directory if it doesn't exist
                if (!existsSync(docsDir)) {
                    mkdirSync(docsDir, { recursive: true });
                }

                // Write PRD content to file
                writeFileSync(prdPath, prdContent, 'utf-8');

                return {
                    content: [
                        {
                            type: 'text',
                            text: `✅ PRD SAVED: Successfully generated and saved Project Requirements Document to \`${prdPath}\`

The PRD includes:
- Executive Summary
- Product Overview  
- Target Audience
- User Stories
- Functional Requirements
- Non-Functional Requirements
- Technical Constraints
- Success Metrics
- Timeline and Milestones
- Risk Assessment

Your comprehensive PRD is now ready for stakeholder review!`
                        }
                    ]
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ PRD SAVE ERROR: ${error.message}`
                        }
                    ]
                };
            }

        case 'bug_predictor':
            try {
                const filePath = args.filePath;
                const analysisDepth = args.analysisDepth || 'thorough';

                // Read the target file
                if (!existsSync(filePath)) {
                    throw new Error(`File not found: ${filePath}`);
                }

                const fileContent = readFileSync(filePath, 'utf-8');
                const fileName = filePath.split('/').pop();
                const fileExtension = fileName.split('.').pop();

                // Create analysis prompt based on depth
                const analysisPrompts = {
                    quick: `Please perform a quick scan of this ${fileExtension.toUpperCase()} file and identify the most obvious bug-prone patterns. Focus on:
- Null/undefined access patterns
- Async/await misuse
- Error handling gaps
- Resource leaks

Provide a concise list of potential issues with line references where possible.`,

                    thorough: `Please perform a thorough analysis of this ${fileExtension.toUpperCase()} file to identify patterns that commonly lead to bugs. Analyze:

1. **Memory & Resource Management**: Potential memory leaks, unclosed resources
2. **Error Handling**: Missing try-catch blocks, unhandled promises, silent failures
3. **Async Patterns**: Race conditions, callback hell, promise chains
4. **Type Safety**: Null/undefined access, type coercion issues
5. **Logic Errors**: Off-by-one errors, infinite loops, edge cases
6. **Security Vulnerabilities**: Input validation, injection risks
7. **Performance Issues**: Inefficient algorithms, blocking operations

For each issue found, provide:
- Severity level (Critical, High, Medium, Low)
- Line number or code section
- Explanation of why it's problematic
- Suggested fix or improvement`,

                    comprehensive: `Please perform a comprehensive deep-dive analysis of this ${fileExtension.toUpperCase()} file to identify all patterns that could lead to bugs. Include:

1. **Static Analysis**: Code smells, anti-patterns, complexity metrics
2. **Runtime Risks**: Memory leaks, race conditions, deadlocks
3. **Error Scenarios**: Exception handling, edge cases, failure modes
4. **Security Audit**: Injection risks, data validation, access control
5. **Performance Analysis**: Bottlenecks, inefficient patterns
6. **Maintainability**: Code duplication, tight coupling, low cohesion
7. **Testing Gaps**: Hard-to-test code, missing assertions
8. **Documentation**: Missing comments for complex logic

For each finding:
- Risk assessment with probability and impact
- Root cause analysis
- Multiple solution approaches
- Prevention strategies for similar issues
- Testing recommendations`
                };

                const analysisPrompt =
                    analysisPrompts[analysisDepth] ||
                    analysisPrompts['thorough'];

                return {
                    content: [
                        {
                            type: 'text',
                            text: `${analysisPrompt}

File: ${fileName}

\`\`\`${fileExtension}
${fileContent}
\`\`\`

Please provide your bug prediction analysis as a structured report with clear sections and actionable recommendations.`
                        }
                    ]
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ BUG PREDICTION ERROR: ${error.message}`
                        }
                    ]
                };
            }

        case 'complexity_analyzer':
            try {
                const filePath = args.filePath;
                const complexityThreshold = args.complexityThreshold || 10;
                const includeRefactoringTips =
                    args.includeRefactoringTips !== false;

                // Read the target file
                if (!existsSync(filePath)) {
                    throw new Error(`File not found: ${filePath}`);
                }

                const fileContent = readFileSync(filePath, 'utf-8');
                const fileName = filePath.split('/').pop();
                const fileExtension = fileName.split('.').pop();

                // Create complexity analysis prompt
                const analysisPrompt = `Please analyze the cyclomatic complexity of this ${fileExtension.toUpperCase()} file and provide refactoring suggestions. Focus on:

1. **Complexity Metrics**: 
   - Identify functions/methods with complexity > ${complexityThreshold}
   - Calculate or estimate cyclomatic complexity for key functions
   - Highlight deeply nested code blocks
   - Count decision points (if/else, switch, loops, try/catch)

2. **Code Structure Analysis**:
   - Long functions that should be broken down
   - Nested conditional logic that could be simplified
   - Repeated patterns that could be extracted
   - Complex Boolean expressions that could be refactored

3. **Maintainability Issues**:
   - Functions doing too many things (SRP violations)
   - Deep nesting levels (> 3-4 levels)
   - Long parameter lists
   - Complex switch statements

${
    includeRefactoringTips
        ? `
4. **Refactoring Suggestions**:
   - Extract method opportunities
   - Replace conditional with polymorphism
   - Introduce explaining variables
   - Simplify conditional expressions
   - Use guard clauses to reduce nesting
   - Strategy pattern for complex conditionals

For each complex function, provide:
- Current estimated complexity score
- Specific refactoring steps
- Expected complexity after refactoring
- Code examples where helpful`
        : ''
}

Please structure your analysis with:
- **Summary**: Overall complexity assessment
- **High Complexity Functions**: Functions exceeding threshold
- **Refactoring Opportunities**: Specific improvement suggestions
- **Priority**: Which refactorings would have the biggest impact

File: ${fileName}`;

                return {
                    content: [
                        {
                            type: 'text',
                            text: `${analysisPrompt}

\`\`\`${fileExtension}
${fileContent}
\`\`\`

Please provide a detailed complexity analysis with actionable refactoring recommendations.`
                        }
                    ]
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ COMPLEXITY ANALYSIS ERROR: ${error.message}`
                        }
                    ]
                };
            }

        default:
            throw new Error(`Unknown tool: ${name}`);
    }
});

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('MCP server running on stdio');
}

main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
