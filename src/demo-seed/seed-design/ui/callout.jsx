/**
 * @file ui:callout
 * @requires @seed-design/react@^2.0.0 || ^3.0.0
 **/

import { PrefixIcon, Callout as SeedCallout, SuffixIcon } from "@seed-design/react";
import * as React from "react";

import { IconChevronRightLine, IconXmarkLine } from "@karrotmarket/react-monochrome-icon"; // "@daangn/react-monochrome-icon"과 동일합니다.

/**
 * @see https://seed-design.io/react/components/callout
 */
export const Callout = React.forwardRef(({ prefixIcon, title, description, linkProps, ...otherProps }, ref) => {
  return (
    <SeedCallout.Root ref={ref} {...otherProps}>
      {prefixIcon && <PrefixIcon svg={prefixIcon} />}
      <SeedCallout.Content>
        {title && <SeedCallout.Title>{title}</SeedCallout.Title>}
        <SeedCallout.Description>{description}</SeedCallout.Description>
        {linkProps && <SeedCallout.Link {...linkProps} />}
      </SeedCallout.Content>
    </SeedCallout.Root>
  );
});
Callout.displayName = "Callout";

/**
 * @see https://seed-design.io/react/components/callout
 */
export const ActionableCallout = React.forwardRef(({ prefixIcon, title, description, ...otherProps }, ref) => {
  return (
    <SeedCallout.Root ref={ref} {...otherProps} asChild>
      <button type="button">
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedCallout.Content>
          {title && <SeedCallout.Title>{title}</SeedCallout.Title>}
          <SeedCallout.Description>{description}</SeedCallout.Description>
        </SeedCallout.Content>
        <SuffixIcon svg={<IconChevronRightLine />} />
      </button>
    </SeedCallout.Root>
  );
});
ActionableCallout.displayName = "ActionableCallout";

/**
 * @see https://seed-design.io/react/components/callout
 */
export const DismissibleCallout = React.forwardRef(({ prefixIcon, title, description, linkProps, ...otherProps }, ref) => {
  return (
    <SeedCallout.Root ref={ref} {...otherProps}>
      {prefixIcon && <PrefixIcon svg={prefixIcon} />}
      <SeedCallout.Content>
        {title && <SeedCallout.Title>{title}</SeedCallout.Title>}
        <SeedCallout.Description>{description}</SeedCallout.Description>
        {linkProps && <SeedCallout.Link {...linkProps} />}
      </SeedCallout.Content>
      {/* You may implement your own i18n for dismiss label */}
      <SeedCallout.CloseButton aria-label="닫기">
        <SuffixIcon svg={<IconXmarkLine />} />
      </SeedCallout.CloseButton>
    </SeedCallout.Root>
  );
});
DismissibleCallout.displayName = "DismissibleCallout";

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
