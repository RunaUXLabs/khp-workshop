/**
 * @file ui:select-box
 * @requires @seed-design/react@^2.0.0 || ^3.0.0
 * @requires @seed-design/css@^2.0.0 || ^3.0.0
 **/

import {
  IconCheckmarkFatFill,
  IconExclamationmarkCircleFill,
} from "@karrotmarket/react-monochrome-icon";
import {
  RadioSelectBox as SeedRadioSelectBox,
  CheckSelectBox as SeedCheckSelectBox,
  RadioGroupField as SeedRadioGroupField,
  Fieldset as SeedFieldset,
  PrefixIcon,
  VisuallyHidden,
} from "@seed-design/react";
import { selectBoxGroup } from "@seed-design/css/recipes/select-box-group";
import { Radiomark } from "./radio-group";
import * as React from "react";

/**
 * @see https://seed-design.io/react/components/select-box
 */
export const RadioSelectBoxRoot = React.forwardRef((
  {
    label,
    labelWeight,
    indicator,
    showRequiredIndicator,

    description,
    errorMessage,

    columns = 1,
    children,

    ...props
  },
  ref,
) => {
  const [variantProps, restProps] = selectBoxGroup.splitVariantProps(props);

  if (
    process.env.NODE_ENV !== "production" &&
    !label &&
    !restProps["aria-label"] &&
    !restProps["aria-labelledby"]
  ) {
    console.warn(
      "RadioSelectBoxRoot component requires a `label`, `aria-label` or `aria-labelledby` attribute.",
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
          {/* You might want to put your custom element here */}
        </SeedRadioGroupField.Header>
      )}
      <SeedRadioSelectBox.Group {...variantProps} columns={columns}>
        {children}
      </SeedRadioSelectBox.Group>
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
RadioSelectBoxRoot.displayName = "RadioSelectBoxRoot";

export const RadioSelectBoxItem = React.forwardRef(
  ({ label, description, prefixIcon, suffix, inputProps, rootRef, footer, ...otherProps }, ref) => {
    return (
      <SeedRadioSelectBox.Item ref={rootRef} {...otherProps}>
        <SeedRadioSelectBox.Trigger>
          <SeedRadioSelectBox.HiddenInput ref={ref} {...inputProps} />
          <SeedRadioSelectBox.Content>
            {prefixIcon && <PrefixIcon svg={prefixIcon} />}
            <SeedRadioSelectBox.Body>
              <SeedRadioSelectBox.Label>{label}</SeedRadioSelectBox.Label>
              {description && (
                <SeedRadioSelectBox.Description>{description}</SeedRadioSelectBox.Description>
              )}
            </SeedRadioSelectBox.Body>
          </SeedRadioSelectBox.Content>
          {suffix}
        </SeedRadioSelectBox.Trigger>
        {footer && <SeedRadioSelectBox.Footer>{footer}</SeedRadioSelectBox.Footer>}
      </SeedRadioSelectBox.Item>
    );
  }
);
RadioSelectBoxItem.displayName = "RadioSelectBoxItem";

export const RadioSelectBoxRadiomark = React.forwardRef((props, ref) => {
  return <Radiomark ref={ref} size="medium" tone="neutral" {...props} />;
});
RadioSelectBoxRadiomark.displayName = "RadioSelectBoxRadiomark";

export const CheckSelectBoxGroup = React.forwardRef((
  {
    label,
    labelWeight,
    indicator,
    showRequiredIndicator,

    description,
    errorMessage,

    columns = 1,
    children,

    ...props
  },
  ref,
) => {
  const [variantProps, restProps] = selectBoxGroup.splitVariantProps(props);

  if (
    process.env.NODE_ENV !== "production" &&
    !label &&
    !restProps["aria-label"] &&
    !restProps["aria-labelledby"]
  ) {
    console.warn(
      "CheckSelectBoxGroup component is recommended to have a `label`, `aria-label` or `aria-labelledby` attribute.",
    );
  }

  return (
    <SeedFieldset.Root ref={ref} {...restProps}>
      {(label || indicator) && (
        <SeedFieldset.Header>
          <SeedFieldset.Label weight={labelWeight}>
            {label}
            {showRequiredIndicator && <SeedFieldset.RequiredIndicator />}
            {indicator && <SeedFieldset.IndicatorText>{indicator}</SeedFieldset.IndicatorText>}
          </SeedFieldset.Label>
          {/* You might want to put your custom element here */}
        </SeedFieldset.Header>
      )}
      <SeedCheckSelectBox.Group {...variantProps} columns={columns}>
        {children}
      </SeedCheckSelectBox.Group>
      {(description || errorMessage) && (
        <SeedFieldset.Footer>
          {description &&
            (errorMessage ? (
              <VisuallyHidden asChild>
                <SeedFieldset.Description>{description}</SeedFieldset.Description>
              </VisuallyHidden>
            ) : (
              <SeedFieldset.Description>{description}</SeedFieldset.Description>
            ))}
          {errorMessage && (
            <SeedFieldset.ErrorMessage>
              <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
              {errorMessage}
            </SeedFieldset.ErrorMessage>
          )}
        </SeedFieldset.Footer>
      )}
    </SeedFieldset.Root>
  );
});

/**
 * @see https://seed-design.io/react/components/select-box
 */
export const CheckSelectBox = React.forwardRef(
  ({ label, description, prefixIcon, suffix, inputProps, rootRef, footer, ...otherProps }, ref) => {
    return (
      <SeedCheckSelectBox.Root ref={rootRef} {...otherProps}>
        <SeedCheckSelectBox.Trigger>
          <SeedCheckSelectBox.HiddenInput ref={ref} {...inputProps} />
          <SeedCheckSelectBox.Content>
            {prefixIcon && <PrefixIcon svg={prefixIcon} />}
            <SeedCheckSelectBox.Body>
              <SeedCheckSelectBox.Label>{label}</SeedCheckSelectBox.Label>
              {description && (
                <SeedCheckSelectBox.Description>{description}</SeedCheckSelectBox.Description>
              )}
            </SeedCheckSelectBox.Body>
          </SeedCheckSelectBox.Content>
          {suffix}
        </SeedCheckSelectBox.Trigger>
        {footer && <SeedCheckSelectBox.Footer>{footer}</SeedCheckSelectBox.Footer>}
      </SeedCheckSelectBox.Root>
    );
  }
);
CheckSelectBox.displayName = "CheckSelectBox";

export const CheckSelectBoxCheckmark = React.forwardRef((props, ref) => {
  return (
    <SeedCheckSelectBox.CheckmarkControl ref={ref} {...props}>
      <SeedCheckSelectBox.CheckmarkIcon svg={<IconCheckmarkFatFill />} />
    </SeedCheckSelectBox.CheckmarkControl>
  );
});
CheckSelectBoxCheckmark.displayName = "CheckSelectBoxCheckmark";

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
