import { type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// Define the context type containing params
type Context = {
  params: { componentId: string };
};

export async function GET(
  req: NextRequest,
  context: Context // Use the defined Context type
) {
  const { componentId } = context.params; // Access params via context
  const mapping: Record<string, string> = {
    calculator: "Calculator.tsx",
    "date-picker": "DatePicker.tsx",
    checkbox: "Checkbox.tsx",
  };
  const fileName = mapping[componentId];
  if (!fileName) {
    return new Response("Component not found", { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "src",
    "app",
    "showcase",
    "components",
    fileName
  );

  try {
    const code = fs.readFileSync(filePath, "utf-8");
    return new Response(code, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response("Unable to read file", { status: 500 });
  }
}
