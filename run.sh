#!/bin/bash
# GitHub Accessibility Reviewer MCP Server startup script

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
	# Supported file extensions
	exts="html htm js jsx ts tsx css scss"
	files_to_analyze=()
	for arg in "$@"; do
		if [ -f "$arg" ]; then
			files_to_analyze+=("$arg")
		elif [ -d "$arg" ]; then
			# Find all supported files recursively in the directory
			for ext in $exts; do
				while IFS= read -r -d '' file; do
					files_to_analyze+=("$file")
				done < <(find "$arg" -type f -name "*.$ext" -print0)
			done
		else
			echo "Error: File or directory not found: $arg" >&2
			exit 2
		fi
	done
	if [ ${#files_to_analyze[@]} -eq 0 ]; then
		echo "No supported files found to analyze." >&2
		exit 0
	fi
	total_violations=0
	files_with_violations=0
	results_file="a11y-results-$(date +%Y%m%d-%H%M%S).txt"
	echo "Accessibility Scan Results" > "$results_file"
	echo "Scan started: $(date)" >> "$results_file"
	echo "Files scanned: ${#files_to_analyze[@]}" >> "$results_file"
	echo "----------------------------------------" >> "$results_file"
	for file in "${files_to_analyze[@]}"; do
		echo "Analyzing file: $file" >&2
		# Capture output and exit code using the proper CLI scanner
		output=$(node cli-scanner.js "$file" 2>&1)
		status=$?
		echo "$output" >> "$results_file"
		echo "----------------------------------------" >> "$results_file"
		if [ $status -eq 2 ]; then
			echo "Error: File not found or could not be read: $file" >> "$results_file"
		elif [ $status -eq 1 ]; then
			echo "Error: Invalid usage or unsupported file: $file" >> "$results_file"
		elif [ $status -ne 0 ]; then
			files_with_violations=$((files_with_violations+1))
			# Extract number of violations from output
			count=$(echo "$output" | grep -oE 'Found [0-9]+ accessibility violation' | grep -oE '[0-9]+' | head -1)
			if [ -n "$count" ]; then
				total_violations=$((total_violations+count))
			fi
		fi
	done
	echo "===== Accessibility Scan Summary =====" >> "$results_file"
	echo "Files analyzed: ${#files_to_analyze[@]}" >> "$results_file"
	echo "Files with violations: $files_with_violations" >> "$results_file"
	echo "Total violations found: $total_violations" >> "$results_file"
	echo "Scan finished: $(date)" >> "$results_file"

	# Print short summary in terminal
	echo "\n===== Accessibility Scan Summary ====="
	echo "Files analyzed: ${#files_to_analyze[@]}"
	echo "Files with violations: $files_with_violations"
	echo "Total violations found: $total_violations"
	echo "Full report saved to: $results_file"
	if [ $total_violations -gt 0 ]; then
		exit 3
	else
		exit 0
	fi
else
	# Start the proper MCP server
	echo "Starting GitHub Accessibility Reviewer MCP Server..." >&2
	exec node build/index.js
fi