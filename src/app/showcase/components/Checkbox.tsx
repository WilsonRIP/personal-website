"use client";

import React, {
  useState,
  useId,
  forwardRef,
  useCallback,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { CheckIcon, MinusIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  /** Optional text label rendered to the right of the checkbox */
  label?: string;
  /** Visually show an indeterminate (mixed) state */
  indeterminate?: boolean;
  /** Controlled change handler — returns the next checked state */
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

/**
 * Accessible, theme-aware checkbox that supports **controlled / uncontrolled** usage,
 * an **indeterminate** state, and forwards refs for seamless form integration.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      indeterminate = false,
      id: providedId,
      disabled,
      ...rest
    },
    forwardedRef
  ) => {
    /* ------------------------------------------------------------------------------------------------- */
    /*  Internal state & refs                                                                            */
    /* ------------------------------------------------------------------------------------------------- */
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    const uniqueId = useId();
    const id = providedId ?? uniqueId;

    const inputRef = useRef<HTMLInputElement>(null);
    // Expose the input element to parent refs
    useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

    /* ------------------------------------------------------------------------------------------------- */
    /*  Effects                                                                                          */
    /* ------------------------------------------------------------------------------------------------- */
    // Keep the native indeterminate property in sync
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    /* ------------------------------------------------------------------------------------------------- */
    /*  Handlers                                                                                         */
    /* ------------------------------------------------------------------------------------------------- */
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.checked;
        if (!isControlled) setInternalChecked(next);
        onChange?.(next, e);
      },
      [isControlled, onChange]
    );

    /* ------------------------------------------------------------------------------------------------- */
    /*  Render                                                                                           */
    /* ------------------------------------------------------------------------------------------------- */
    return (
      <label
        htmlFor={id}
        className={clsx(
          "inline-flex items-center group",
          disabled && "cursor-not-allowed opacity-60",
          !disabled && "cursor-pointer",
          className
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          aria-checked={indeterminate ? "mixed" : checked}
          className="sr-only peer"
          {...rest}
        />

        <span
          aria-hidden="true"
          className={clsx(
            "relative inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors duration-200 ease-in-out",
            disabled
              ? "border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700",
            (checked || indeterminate) &&
              "border-teal-500 bg-teal-500 dark:border-teal-600 dark:bg-teal-600",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-teal-400 dark:peer-focus-visible:ring-teal-500 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-gray-800"
          )}
        >
          {indeterminate ? (
            <MinusIcon className="h-full w-full p-0.5 text-white" />
          ) : (
            <CheckIcon
              className={clsx(
                "h-full w-full p-0.5 text-white transition-all duration-200 ease-in-out",
                checked
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-90"
              )}
            />
          )}
        </span>

        {label && (
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
