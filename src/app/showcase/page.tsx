"use client"; // Required because we're using useState and useCallback

import React, { useState, useCallback, useMemo } from "react";
import Calculator from "./components/Calculator";
import CustomDatePicker from "./components/DatePicker";
import ShowcaseSidebar from "./components/ShowcaseSidebar";
import Checkbox from "./components/Checkbox";
import CodeViewer from "./components/CodeViewer";
import MathQuiz from "./components/MathQuiz";
// Remove unused MathQuestion type import
// import { MathQuestion } from "./components/types/quiz";
// Uncomment the import for the data
// import { sampleMathQuestions } from "./components/types/quiz"; // Remove this incorrect import
import { sampleMathQuestions } from "../data/quiz"; // Correct import path
// Only import the data, not the type if it's unused here
// import { sampleMathQuestions } from "./components/types/quiz";
// Assuming you have this component or similar for fallback
// import Placeholder from './components/Placeholder';

// --- Type Definitions ---

// Define the structure for each item in the showcase
interface ShowcaseItem {
  id: string;
  name: string;
  // Store the component *type* (constructor/function), not an instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>; // Suppressing rule due to dynamic component nature
  // Optional props specific to a component
  props?: Record<string, unknown>;
}

// --- Sample Quiz Data ---
// const sampleMathQuestions: MathQuestion[] = [...]; // Removed this section

// --- Component Configuration ---

// Define the components to showcase (outside the component function)
// Note: component is now the component type (e.g., Calculator), not <Calculator />
const showcaseItems: ShowcaseItem[] = [
  { id: "calculator", name: "Calculator", component: Calculator },
  { id: "date-picker", name: "Date Picker", component: CustomDatePicker },
  {
    id: "checkbox",
    name: "Checkbox",
    component: Checkbox,
    props: { label: "Dynamic Checkbox", defaultChecked: true },
  },
  {
    id: "math-quiz",
    name: "Math Quiz",
    component: MathQuiz,
    props: { questions: sampleMathQuestions },
  },
  // Add more components here in the future
  // { id: 'another-component', name: 'Another Component', component: AnotherComponent },
];

// --- Showcase Page Component ---

export default function ShowcasePage() {
  // State to track the selected component ID, defaulting to the first item
  const [selectedItemId, setSelectedItemId] = useState<string>(
    showcaseItems[0]?.id ?? "" // Use nullish coalescing for safety
  );

  // Memoized function to update the selected component ID
  // Prevents recreating the function on each render
  const handleSelectItem = useCallback((id: string) => {
    setSelectedItemId(id);
  }, []); // No dependencies, so it's created only once

  // Find the full item object based on the selected ID
  const selectedItem = useMemo(() => {
    return showcaseItems.find((item) => item.id === selectedItemId);
  }, [selectedItemId]); // Recalculate only when selectedItemId changes

  // Extract the component type and its props from the selected item
  const ComponentToRender = selectedItem?.component;
  const componentProps = selectedItem?.props ?? {}; // Use default empty object for props

  // Prepare items for the sidebar (memoized)
  const sidebarItems = useMemo(() => {
    return showcaseItems.map(({ id, name }) => ({ id, name }));
  }, []); // showcaseItems is stable, so this runs only once

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title and Description */}
      <h1 className="text-4xl font-bold mb-6 text-center text-white title-komikax" style={{ fontFamily: "KOMIKAX, sans-serif" }}>
        Showcase
      </h1>
      <p className="text-lg text-center mb-8">
        Select a component from the sidebar to view it and its code.
      </p>

      {/* Layout: Sidebar and Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <ShowcaseSidebar
          items={sidebarItems}
          activeItemId={selectedItemId}
          onSelectItem={handleSelectItem}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Component Display Area */}
          <main
            className="
              w-full
              min-h-[300px] md:min-h-[400px]
              flex items-center justify-center
              p-4 md:p-8
              bg-gray-50 dark:bg-gray-800/50
              rounded-lg
              shadow
            "
            aria-live="polite" // Announce changes when component swaps
            aria-labelledby="showcase-heading" // Relate to a potential heading if needed
          >
            {ComponentToRender ? (
              // Dynamically render the selected component type with its props
              <ComponentToRender {...componentProps} />
            ) : (
              // Fallback if no component matches the ID (e.g., initial state issue)
              <p className="text-gray-500">
                Component not found. Please select one from the sidebar.
                {/* Or render a dedicated Placeholder component */}
                {/* <Placeholder message="Select a component" /> */}
              </p>
            )}
          </main>

          {/* Code Viewer */}
          {/* Render CodeViewer only if an item is selected */}
          {selectedItem && <CodeViewer componentId={selectedItem.id} />}
        </div>
      </div>
    </div>
  );
}
