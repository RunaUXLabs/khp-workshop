/**
 * @file ui:radio-group
 * @requires @seed-design/react@^2.0.0 || ^3.0.0
 * @requires @seed-design/css@^2.0.0 || ^3.0.0
 **/

import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import {
  RadioGroup as SeedRadioGroup,
  RadioGroupField as SeedRadioGroupField,
  PrefixIcon,
  VisuallyHidden,
} from "@seed-design/react";
import { radioGroup } from "@seed-design/css/recipes/radio-group";
import * as React from "react";

/**
 * @see https://seed-design.io/react/components/radio-group
 */
export const RadioGroup = React.forwardRef((
  {
    label,
    labelWeight,
    indicator,
    showRequiredIndicator,

    description,
    errorMessage,

    children,

    ...props
  },
  ref,
) => {
  const [variantProps, restProps] = radioGroup.splitVariantProps(props);

  if (
    process.env.NODE_ENV !== "production" &&
    !label &&
    !restProps["aria-label"] &&
    !restProps["aria-labelledby"]
  ) {
    console.warn(
      "RadioGroup component requires a `label`, `aria-label` or `aria-labelledby` attribute.",
    );
  }

  const renderErrorMessage = errorMessage && restProps.invalid;
  const renderFooter = description || renderErrorMessage;

  return (
    <SeedRadioGroupField.Root ref={ref} {...restProps}>
      {(label || indicator) && (
        <SeedRadioGroupField.Header>
          <SeedRadioGroupField.Label weight={labelWeight}>
            {label}
            {showRequiredIndicator && <SeedRadioGroupField.RequiredIndicator />}
            {indicator && (
              <SeedRadioGroupField.IndicatorText>{indicator}</SeedRadioGroupField.IndicatorText>
            )}
          </SeedRadioGroupField.Label>
        </SeedRadioGroupField.Header>
      )}
      <SeedRadioGroup.Root {...variantProps}>{children}</SeedRadioGroup.Root>
      {renderFooter && (
        <SeedRadioGroupField.Footer>
          {description &&
            (renderErrorMessage ? (
              <VisuallyHidden asChild>
                <SeedRadioGroupField.Description>{description}</SeedRadioGroupField.Description>
              </VisuallyHidden>
            ) : (
              <SeedRadioGroupField.Description>{description}</SeedRadioGroupField.Description>
            ))}
          {renderErrorMessage && (
            <SeedRadioGroupField.ErrorMessage>
              <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
              {errorMessage}
            </SeedRadioGroupField.ErrorMessage>
          )}
        </SeedRadioGroupField.Footer>
      )}
    </SeedRadioGroupField.Root>
  );
});
RadioGroup.displayName = "RadioGroup";

/**
 * @see https://seed-design.io/react/components/radio-group
 */
export const RadioGroupItem = React.forwardRef(({ label, inputProps, rootRef, ...otherProps }, ref) => {
  return (
    <SeedRadioGroup.Item ref={rootRef} {...otherProps}>
      <SeedRadioGroup.ItemControl>
        <SeedRadioGroup.ItemIndicator
          checked={
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="currentColor" />
            </svg>
          }
        />
      </SeedRadioGroup.ItemControl>
      {label && <SeedRadioGroup.ItemLabel>{label}</SeedRadioGroup.ItemLabel>}
      <SeedRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
    </SeedRadioGroup.Item>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

/**
 * @see https://seed-design.io/react/components/radio-group
 */
export const Radiomark = React.forwardRef((props, ref) => {
  return (
    <SeedRadioGroup.ItemControl ref={ref} {...props}>
      <SeedRadioGroup.ItemIndicator
        checked={
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
          </svg>
        }
      />
    </SeedRadioGroup.ItemControl>
  );
});
Radiomark.displayName = "Radiomark";

/**
 * @deprecated Use `Radiomark` instead. Will be removed in @seed-design/react@2.0.0.
 */
export const RadioMark = Radiomark;
