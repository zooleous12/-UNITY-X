#!/usr/bin/env python3
"""
Generate a Node.js migration script from Drizzle SQL migration files.

Usage:
  python apply_migrations.py <project_path>

Reads all .sql files in <project_path>/drizzle/, extracts CREATE TABLE IF NOT EXISTS
and ALTER TABLE statements, and writes an apply-migrations.mjs script to <project_path>.

Run the generated script with: cd <project_path> && node apply-migrations.mjs
"""

import sys
import os
import re
import glob

def main():
    if len(sys.argv) < 2:
        print("Usage: python apply_migrations.py <project_path>")
        sys.exit(1)

    project_path = sys.argv[1]
    drizzle_dir = os.path.join(project_path, "drizzle")

    if not os.path.isdir(drizzle_dir):
        print(f"Error: {drizzle_dir} not found")
        sys.exit(1)

    sql_files = sorted(glob.glob(os.path.join(drizzle_dir, "*.sql")))
    if not sql_files:
        print("No .sql migration files found in drizzle/")
        sys.exit(0)

    # Collect all SQL from migration files
    all_sql = []
    for f in sql_files:
        with open(f) as fh:
            content = fh.read()
            # Replace drizzle statement breakpoints with semicolons
            content = content.replace("--> statement-breakpoint", ";")
            all_sql.append(content)

    combined = "\n".join(all_sql)

    # Extract CREATE TABLE statements
    creates = re.findall(
        r'(CREATE TABLE\s+(?:IF NOT EXISTS\s+)?`\w+`\s*\([^;]+\))',
        combined, re.DOTALL | re.IGNORECASE
    )

    # Extract ALTER TABLE statements
    alters = re.findall(
        r'(ALTER TABLE\s+`\w+`\s+(?:ADD|MODIFY|DROP|CHANGE)[^;]+)',
        combined, re.DOTALL | re.IGNORECASE
    )

    print(f"Found {len(creates)} CREATE TABLE statements")
    print(f"Found {len(alters)} ALTER TABLE statements")

    # Write the migration runner
    output_path = os.path.join(project_path, "apply-migrations.mjs")
    with open(output_path, "w") as out:
        out.write('import mysql from "mysql2/promise";\n\n')
        out.write('const url = process.env.DATABASE_URL;\n')
        out.write('if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }\n\n')
        out.write('const conn = await mysql.createConnection(url);\n\n')

        # Write CREATE TABLE statements
        out.write("const creates = [\n")
        for stmt in creates:
            # Ensure IF NOT EXISTS
            if "IF NOT EXISTS" not in stmt.upper():
                stmt = stmt.replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS", 1)
            escaped = stmt.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
            out.write(f"  `{escaped}`,\n")
        out.write("];\n\n")

        # Write ALTER TABLE statements
        out.write("const alters = [\n")
        for stmt in alters:
            escaped = stmt.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
            out.write(f"  `{escaped}`,\n")
        out.write("];\n\n")

        out.write('console.log("Creating tables...");\n')
        out.write("for (const sql of creates) {\n")
        out.write("  try {\n")
        out.write("    await conn.execute(sql);\n")
        out.write('    console.log("  OK:", sql.substring(0, 60) + "...");\n')
        out.write("  } catch (e) {\n")
        out.write('    console.log("  SKIP:", e.message.substring(0, 80));\n')
        out.write("  }\n")
        out.write("}\n\n")

        out.write('console.log("\\nApplying ALTER statements...");\n')
        out.write("for (const sql of alters) {\n")
        out.write("  try {\n")
        out.write("    await conn.execute(sql);\n")
        out.write('    console.log("  OK:", sql.substring(0, 60) + "...");\n')
        out.write("  } catch (e) {\n")
        out.write('    console.log("  SKIP:", e.message.substring(0, 80));\n')
        out.write("  }\n")
        out.write("}\n\n")

        out.write('const [tables] = await conn.execute("SHOW TABLES");\n')
        out.write('console.log("\\nFinal tables:", tables.map(t => Object.values(t)[0]).join(", "));\n')
        out.write("await conn.end();\n")
        out.write('console.log("Done!");\n')

    print(f"Generated: {output_path}")
    print(f"Run with: cd {project_path} && node apply-migrations.mjs")

if __name__ == "__main__":
    main()
