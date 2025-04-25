import { type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// Define the expected structure of the params object
interface RouteContext {
  params: {
    componentId: string;
  };
}

export async function GET(
  req: NextRequest,
  { params }: RouteContext // Directly destructure params here
) {
  const { componentId } = params;

  const mapping: Record<string, string> = {
    calculator: "Calculator.tsx",
    "date-picker": "DatePicker.tsx",
    checkbox: "Checkbox.tsx",
    // Add other components here...
  };

  const fileName = mapping[componentId];

  if (!fileName) {
    return new Response(JSON.stringify({ error: "Component not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
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
    const code = await fs.promises.readFile(filePath, "utf-8");

    return new Response(code, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: unknown) {
    // <--- Changed from any to unknown
    // Log the error for debugging on the server
    console.error(`Error reading file for component ${componentId}:`, error);

    // Type guard to safely check for properties on the unknown error
    let errorCode: string | null = null;
    if (typeof error === "object" && error !== null && "code" in error) {
      // Check if 'code' property exists and cast safely
      // We assert `error` has a potential `code` property of type string
      errorCode = (error as { code?: string }).code ?? null;
    }
    // Alternatively, for just message:
    // let errorMessage = "An unknown error occurred";
    // if (error instanceof Error) {
    //   errorMessage = error.message;
    // }

    // Check if the error code indicates the file doesn't exist (ENOENT)
    if (errorCode === "ENOENT") {
      return new Response(
        JSON.stringify({ error: "Component file not found on server" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return a generic server error response for other issues
    return new Response(
      JSON.stringify({ error: "Unable to read component file" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
