/**
 * @file ui:loading-indicator
 * @requires @seed-design/react@^2.0.0 || ^3.0.0
 **/

import { LoadingIndicator as SeedLoadingIndicator } from "@seed-design/react";
import * as React from "react";
import { ProgressCircle } from "./progress-circle";

/**
 * @see https://seed-design.io/react/components/loading-indicator
 */
export const LoadingIndicator = React.forwardRef((
  { children, indicator = <ProgressCircle size="inherit" tone="inherit" />, ...otherProps },
  ref,
) => {
  return (
    <SeedLoadingIndicator ref={ref} indicator={indicator} {...otherProps}>
      {children}
    </SeedLoadingIndicator>
  );
});
LoadingIndicator.displayName = "LoadingIndicator";

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
