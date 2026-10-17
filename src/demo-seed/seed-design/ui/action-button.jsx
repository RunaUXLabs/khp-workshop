/**
 * @file ui:action-button
 * @requires @seed-design/react@^2.0.0 || ^3.0.0
 **/

import { ActionButton as SeedActionButton } from "@seed-design/react";
import * as React from "react";
import { LoadingIndicator } from "./loading-indicator";

/**
 * @see https://seed-design.io/react/components/action-button
 * If `asChild` is enabled, manual handling of `LoadingIndicator` is required.
 */
export const ActionButton = React.forwardRef(({ loading = false, children, ...otherProps }, ref) => {
  return (
    <SeedActionButton ref={ref} loading={loading} {...otherProps}>
      {loading && !otherProps.asChild ? <LoadingIndicator>{children}</LoadingIndicator> : children}
    </SeedActionButton>
  );
});
ActionButton.displayName = "ActionButton";

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
