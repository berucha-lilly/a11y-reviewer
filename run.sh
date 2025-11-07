#!/bin/sh
# GitHub Accessibility Reviewer MCP Server startup script
set -e

# Change to script directory
cd "$(dirname "$0")"

# Helper: print usage
print_usage() {
	echo "Usage: $0 [file1] [file2] ..."
	echo "  Analyze one or more files for accessibility violations."
	echo "  If no files are provided, starts the MCP server."
	echo "  Example: $0 test.html src/App.js"
}

# Check for help flag
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
	print_usage
	exit 0
fi

# Check for Node.js
if ! command -v node >/dev/null 2>&1; then
	echo "Error: Node.js is not installed or not in PATH." >&2
	exit 1
fi

# If file arguments are provided, analyze each
if [ "$#" -gt 0 ]; then
	for file in "$@"; do
		if [ ! -f "$file" ]; then
			echo "Error: File not found: $file" >&2
			exit 2
		fi
		echo "Analyzing file: $file" >&2
		node demo-violations.js "$file"
		status=$?
		if [ $status -ne 0 ]; then
			echo "Error: Analysis failed for $file (exit code $status)" >&2
			exit $status
		fi
	done
	exit 0
else
	# Start the simplified JavaScript server for testing
	echo "Starting GitHub Accessibility Reviewer MCP Server (JavaScript version)..." >&2
	exec node simple-server.js
fi