"use client"; // This is a Client Component

import React, { useState, useRef, useEffect, useCallback } from "react";

// --- Types and Constants ---

type ButtonType =
  | "number"
  | "operator"
  | "equals"
  | "clear"
  | "delete"
  | "decimal";

interface Button {
  value: string;
  type: ButtonType;
  className?: string;
  keyboardKey?: string | string[]; // Add keyboard key mapping
}

interface CalculatorState {
  currentOperand: string | null;
  previousOperand: string | null;
  operation: string | null;
  overwrite: boolean; // Flag to overwrite currentOperand after operation/equals
}

const INITIAL_STATE: CalculatorState = {
  currentOperand: "0",
  previousOperand: null,
  operation: null,
  overwrite: false,
};

// --- Button Definitions (with Keyboard Keys) ---

const buttons: Button[] = [
  {
    value: "C",
    type: "clear",
    className: "col-span-2",
    keyboardKey: ["Escape", "Delete"],
  }, // AC/Clear
  {
    value: "DEL",
    type: "delete",
    className: "col-span-2",
    keyboardKey: "Backspace",
  }, // Delete
  { value: "7", type: "number", keyboardKey: "7" },
  { value: "8", type: "number", keyboardKey: "8" },
  { value: "9", type: "number", keyboardKey: "9" },
  { value: "/", type: "operator", keyboardKey: "/" },
  { value: "4", type: "number", keyboardKey: "4" },
  { value: "5", type: "number", keyboardKey: "5" },
  { value: "6", type: "number", keyboardKey: "6" },
  { value: "*", type: "operator", keyboardKey: "*" },
  { value: "1", type: "number", keyboardKey: "1" },
  { value: "2", type: "number", keyboardKey: "2" },
  { value: "3", type: "number", keyboardKey: "3" },
  { value: "-", type: "operator", keyboardKey: "-" },
  { value: "0", type: "number", className: "col-span-2", keyboardKey: "0" },
  { value: ".", type: "decimal", keyboardKey: "." },
  { value: "=", type: "equals", keyboardKey: ["Enter", "="] },
  { value: "+", type: "operator", keyboardKey: "+" },
];

// --- Helper Functions ---

const getButtonClasses = (type: ButtonType): string => {
  const base =
    "font-bold rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 active:opacity-80";
  switch (type) {
    case "number":
    case "decimal":
      return `${base} bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 dark:focus:ring-gray-500 focus:ring-gray-400`;
    case "operator":
      return `${base} bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 focus:ring-blue-400`;
    case "equals":
      return `${base} bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-500 focus:ring-green-400`;
    case "clear":
      return `${base} bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-500 focus:ring-red-400`;
    case "delete":
      return `${base} bg-gray-400 hover:bg-gray-500 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:focus:ring-gray-500 focus:ring-gray-400`;
    default:
      return base;
  }
};

// Format operand for display (e.g., add commas) - Optional enhancement
const formatOperand = (operand: string | null): string => {
  if (operand == null) return "";
  // Basic formatting, could be enhanced (e.g., locale-specific)
  // Avoid formatting during entry if it complicates things
  // For now, just return the operand, maybe limit length if needed
  const MAX_DISPLAY_LENGTH = 16; // Example limit
  if (operand.length > MAX_DISPLAY_LENGTH) {
    try {
      return parseFloat(operand).toExponential(8); // Use scientific notation if too long
    } catch {
      return "Error"; // Fallback if conversion fails
    }
  }
  return operand;
};

// --- Calculation Logic ---
const calculate = (
  prev: string | null,
  curr: string | null,
  op: string | null
): string => {
  const previous = parseFloat(prev ?? "0");
  const current = parseFloat(curr ?? "0");

  if (isNaN(previous) || isNaN(current)) return "Error"; // Invalid input

  let result: number;
  switch (op) {
    case "+":
      result = previous + current;
      break;
    case "-":
      result = previous - current;
      break;
    case "*":
      result = previous * current;
      break;
    case "/":
      if (current === 0) return "Cannot divide by zero";
      result = previous / current;
      break;
    default:
      return curr ?? "0"; // Should not happen if logic is correct
  }

  // Handle potential floating point inaccuracies for display
  // This is a basic approach; libraries like Decimal.js are more robust
  const resultString = parseFloat(result.toPrecision(12)).toString(); // Limit precision

  return resultString;
};

// --- Calculator Component ---

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Feedback Handling ---
  const showFeedback = useCallback((message: string, duration = 2000) => {
    setFeedbackMessage(message);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackMessage("");
      feedbackTimeoutRef.current = null;
    }, duration);
  }, []); // useCallback as it doesn't depend on changing state

  // Clear feedback timeout on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  // --- Input Handlers ---

  // Wrap handlers in useCallback
  const handleNumber = useCallback((value: string) => {
    setState((prevState) => {
      // If overwrite is true, start new number
      if (prevState.overwrite) {
        return {
          ...prevState,
          currentOperand: value === "0" ? "0" : value, // Handle starting with 0
          overwrite: false,
        };
      }
      // Prevent multiple leading zeros
      if (prevState.currentOperand === "0" && value === "0") {
        return prevState;
      }
      // Replace leading zero if current is '0' and new value isn't '.'
      if (prevState.currentOperand === "0" && value !== ".") {
        return { ...prevState, currentOperand: value };
      }

      // Append number (limit length if desired)
      const nextOperand = (prevState.currentOperand ?? "") + value;
      // Optional: Add length check here
      // if (nextOperand.length > MAX_LENGTH) return prevState;

      return { ...prevState, currentOperand: nextOperand };
    });
  }, []); // Depends only on stable setState

  const handleDecimal = useCallback(() => {
    setState((prevState) => {
      // If overwriting, start with "0."
      if (prevState.overwrite) {
        return {
          ...prevState,
          currentOperand: "0.",
          overwrite: false,
        };
      }
      // If already contains decimal, do nothing
      if (prevState.currentOperand?.includes(".")) {
        showFeedback("Decimal already exists");
        return prevState;
      }
      // If current operand is null or empty, start with "0."
      if (prevState.currentOperand == null || prevState.currentOperand === "") {
        return { ...prevState, currentOperand: "0." };
      }

      // Append decimal
      return {
        ...prevState,
        currentOperand: prevState.currentOperand + ".",
      };
    });
  }, [showFeedback]); // Depends on showFeedback

  const handleOperator = useCallback(
    (op: string) => {
      setState((prevState) => {
        const { currentOperand, previousOperand, operation } = prevState;

        // If current operand is empty or just '-', invalid operation start
        if (
          currentOperand == null ||
          (currentOperand === "-" && previousOperand == null)
        ) {
          // Allow starting with minus
          if (op === "-" && currentOperand == null) {
            return { ...prevState, currentOperand: "-" };
          }
          showFeedback("Enter a number first");
          return prevState;
        }

        // Handle changing operator if pressed consecutively
        if (
          (previousOperand != null && currentOperand === "0") ||
          currentOperand === null
        ) {
          // Changed logic: if previous operand exists but current is effectively empty
          if (op === "-" && operation !== "-") {
            // Allow changing to minus for negative numbers
            // Don't change state operation yet, just modify current input
            return { ...prevState, currentOperand: "-" };
          } else if (op !== "-") {
            // Replace the operation
            showFeedback("Operator changed");
            return {
              ...prevState,
              operation: op,
              currentOperand: null,
              overwrite: true,
            }; // Expect next number
          }
          // If trying to press the same op or another non-minus after a number+op sequence, do nothing yet.
        }

        // If there's a pending operation, calculate it first
        let result = currentOperand; // Default to current if no calculation needed yet
        if (
          previousOperand != null &&
          operation != null &&
          !prevState.overwrite
        ) {
          // Added !prevState.overwrite check
          result = calculate(previousOperand, currentOperand, operation);
          if (result === "Cannot divide by zero" || result === "Error") {
            showFeedback(result);
            return { ...INITIAL_STATE, currentOperand: "Error" }; // Reset on error
          }
        }

        // Prepare for next input
        return {
          previousOperand: result, // Store the result (or the first number) as previous
          operation: op,
          currentOperand: result, // Show result temporarily until next input
          overwrite: true, // Next number input will overwrite the display
        };
      });
    },
    [showFeedback]
  ); // Depends on showFeedback

  const handleEquals = useCallback(() => {
    setState((prevState) => {
      const { currentOperand, previousOperand, operation } = prevState;

      // Need all parts to calculate
      if (
        previousOperand == null ||
        operation == null ||
        currentOperand == null
      ) {
        // If only currentOperand exists, pressing equals does nothing or maybe sets it as result?
        // Let's do nothing for now.
        return prevState;
      }

      // Prevent calculation if equals pressed right after an operator without a second operand entered
      if (prevState.overwrite) {
        // Maybe repeat last operation? (Common calculator feature)
        // For simplicity now, let's do nothing.
        return prevState;
      }

      const result = calculate(previousOperand, currentOperand, operation);
      if (result === "Cannot divide by zero" || result === "Error") {
        showFeedback(result);
        return { ...INITIAL_STATE, currentOperand: "Error" }; // Reset on error
      }

      // Calculation successful, reset state for next independent calculation
      return {
        ...INITIAL_STATE, // Reset previousOp and operation
        currentOperand: result, // Display the result
        overwrite: true, // Next number input will start fresh
      };
    });
  }, [showFeedback]); // Depends on showFeedback

  const handleClear = useCallback(() => {
    setState(INITIAL_STATE);
    setFeedbackMessage(""); // Clear feedback too
  }, []); // Depends only on stable setters

  const handleDelete = useCallback(() => {
    setState((prevState) => {
      // Cannot delete if result is shown/overwriting or if it's an Error state
      if (prevState.overwrite || prevState.currentOperand === "Error") {
        return prevState;
      }
      if (
        prevState.currentOperand === "0" ||
        prevState.currentOperand == null ||
        prevState.currentOperand.length === 1
      ) {
        // If deleting the last digit (or it's 0), reset to "0"
        return { ...prevState, currentOperand: "0" };
      }
      // Delete last character
      return {
        ...prevState,
        currentOperand: prevState.currentOperand.slice(0, -1),
      };
    });
  }, []); // Depends only on stable setState

  // Wrap handleButtonClick in useCallback
  const handleButtonClick = useCallback(
    (value: string, type: ButtonType) => {
      // Clear non-error feedback on any button press except equals
      if (
        type !== "equals" &&
        feedbackMessage !== "Cannot divide by zero" &&
        feedbackMessage !== "Error" &&
        feedbackMessage !== "Invalid input"
      ) {
        setFeedbackMessage("");
        if (feedbackTimeoutRef.current) {
          clearTimeout(feedbackTimeoutRef.current);
          feedbackTimeoutRef.current = null;
        }
      }

      // Reset Error state on number or clear press
      if (
        state.currentOperand === "Error" &&
        (type === "number" || type === "clear" || type === "decimal")
      ) {
        handleClear();
        // If it was a number or decimal press, continue processing it after clear
        if (type === "number") handleNumber(value);
        if (type === "decimal") handleDecimal();
        return; // Stop further processing for the Error-clearing click itself
      } else if (state.currentOperand === "Error") {
        showFeedback("Press C or enter a number to clear Error");
        return; // Don't process other buttons when in Error state
      }

      switch (type) {
        case "number":
          handleNumber(value);
          break;
        case "decimal":
          handleDecimal();
          break;
        case "operator":
          handleOperator(value);
          break;
        case "equals":
          handleEquals();
          break;
        case "clear":
          handleClear();
          break;
        case "delete":
          handleDelete();
          break;
        default:
          // Should not happen with defined types
          console.error("Unknown button type:", type);
      }
    },
    [
      state,
      feedbackMessage,
      showFeedback,
      handleNumber,
      handleDecimal,
      handleOperator,
      handleEquals,
      handleClear,
      handleDelete,
    ] // Update dependencies
  ); // Add dependencies

  // --- Keyboard Support ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      // Find the button corresponding to the pressed key
      const button = buttons.find((btn) =>
        Array.isArray(btn.keyboardKey)
          ? btn.keyboardKey.includes(key)
          : btn.keyboardKey === key
      );

      if (button) {
        event.preventDefault(); // Prevent default browser actions (like '/' opening search)
        handleButtonClick(button.value, button.type);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleButtonClick]); // Re-attach if handleButtonClick changes (due to dependencies) - added handleButtonClick

  // --- Render ---
  const displayValue = formatOperand(state.currentOperand);
  // Optionally, show the full expression being built:
  // const fullExpression = `${formatOperand(state.previousOperand) ?? ''} ${state.operation ?? ''} ${state.overwrite ? '' : formatOperand(state.currentOperand) ?? ''}`;

  return (
    <div className="w-full max-w-full sm:max-w-md md:max-w-lg mx-auto rounded-xl bg-white p-4 sm:p-6 shadow-2xl dark:bg-gray-800 transition-all duration-300">
      {/* Display Area */}
      <div
        className="mb-2 h-16 sm:h-20 md:h-24 flex flex-col items-end justify-end overflow-hidden rounded-lg bg-gray-200 p-3 sm:p-4 text-right font-mono shadow-inner dark:bg-gray-700"
        aria-live="polite" // Announce changes to screen readers
      >
        {/* Optional: Small display for previous operand and operator */}
        <div className="text-xs sm:text-sm opacity-60 truncate">
          {state.previousOperand && state.operation
            ? `${formatOperand(state.previousOperand)} ${state.operation}`
            : ""}
        </div>
        {/* Main Display */}
        <div className="text-3xl sm:text-4xl md:text-5xl break-all">
          {displayValue}
        </div>
      </div>

      {/* Feedback Area */}
      <div
        className="mb-4 h-6 text-center text-sm text-red-500 dark:text-red-400"
        aria-live="assertive" // Announce errors immediately
      >
        {feedbackMessage}
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {buttons.map((button) => {
          const buttonClasses = getButtonClasses(button.type);
          return (
            <button
              key={button.value} // Use value as key assuming they are unique
              onClick={() => handleButtonClick(button.value, button.type)}
              className={`${buttonClasses} ${
                button.className ?? ""
              } text-sm sm:text-base md:text-xl py-2 sm:py-3 md:py-4`}
            >
              {button.value}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calculator;
