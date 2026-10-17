/**
 * @file ui:list
 * @requires @seed-design/react@^3.0.0
 * @requires @seed-design/css@^3.0.0
 **/

import { List as SeedList, Checkbox, RadioGroup, Switch, Divider as SeedDivider } from "@seed-design/react";
import { listItem } from "@seed-design/css/recipes/list-item";
import * as React from "react";

/**
 * @see https://seed-design.io/react/components/list
 */
export const List = SeedList.Root;

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListItem = React.forwardRef(({ title, detail, prefix, suffix, ...otherProps }, ref) => {
  return (
    <SeedList.Item ref={ref} {...otherProps}>
      {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
      <SeedList.Content>
        <SeedList.Title>{title}</SeedList.Title>
        {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
      </SeedList.Content>
      {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
    </SeedList.Item>
  );
});
ListItem.displayName = "ListItem";

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListButtonItem = React.forwardRef(
  ({ title, detail, prefix, suffix, alignItems, rootRef, rootProps, ...props }, ref) => {
    const [variantProps, otherProps] = listItem.splitVariantProps(props);

    const stateProps = React.useMemo(
      () => ({ "data-disabled": otherProps.disabled ? "" : undefined }),
      [otherProps.disabled],
    );

    return (
      <SeedList.Item ref={rootRef} alignItems={alignItems} {...variantProps} {...rootProps}>
        {prefix && <SeedList.Prefix {...stateProps}>{prefix}</SeedList.Prefix>}
        <SeedList.Content asChild>
          <button type="button" ref={ref} {...otherProps}>
            <SeedList.Title {...stateProps}>{title}</SeedList.Title>
            {detail && <SeedList.Detail {...stateProps}>{detail}</SeedList.Detail>}
          </button>
        </SeedList.Content>
        {suffix && <SeedList.Suffix {...stateProps}>{suffix}</SeedList.Suffix>}
      </SeedList.Item>
    );
  }
);
ListButtonItem.displayName = "ListButtonItem";

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListLinkItem = React.forwardRef(
  ({ title, detail, prefix, suffix, alignItems, rootRef, rootProps, ...props }, ref) => {
    const [variantProps, otherProps] = listItem.splitVariantProps(props);

    return (
      <SeedList.Item ref={rootRef} alignItems={alignItems} {...variantProps} {...rootProps}>
        {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
        <SeedList.Content asChild>
          <a ref={ref} {...otherProps}>
            <SeedList.Title>{title}</SeedList.Title>
            {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
          </a>
        </SeedList.Content>
        {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      </SeedList.Item>
    );
  }
);
ListLinkItem.displayName = "ListLinkItem";

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListSwitchItem = React.forwardRef(
  ({ title, detail, prefix, suffix, inputProps, rootRef, ...props }, ref) => (
    <SeedList.SwitchItem ref={rootRef} {...props}>
      {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
      <SeedList.Content>
        <SeedList.Title>{title}</SeedList.Title>
        {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
      </SeedList.Content>
      {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      <Switch.HiddenInput ref={ref} {...inputProps} />
    </SeedList.SwitchItem>
  )
);
ListSwitchItem.displayName = "ListSwitchItem";

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListCheckItem = React.forwardRef(
  ({ title, detail, prefix, suffix, inputProps, rootRef, ...props }, ref) => (
    <SeedList.CheckItem ref={rootRef} {...props}>
      {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
      <SeedList.Content>
        <SeedList.Title>{title}</SeedList.Title>
        {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
      </SeedList.Content>
      {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      <Checkbox.HiddenInput ref={ref} {...inputProps} />
    </SeedList.CheckItem>
  )
);
ListCheckItem.displayName = "ListCheckItem";

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListRadioItem = React.forwardRef(
  ({ title, detail, prefix, suffix, inputProps, rootRef, ...props }, ref) => (
    <SeedList.RadioItem ref={rootRef} {...props}>
      {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
      <SeedList.Content>
        <SeedList.Title>{title}</SeedList.Title>
        {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
      </SeedList.Content>
      {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      <RadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
    </SeedList.RadioItem>
  )
);
ListRadioItem.displayName = "ListRadioItem";

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListDivider = React.forwardRef(({ as = "li", "aria-hidden": ariaHidden = true, ...props }, ref) => {
  return (
    <SeedDivider
      as={as}
      aria-hidden={ariaHidden}
      ref={ref}
      {...props}
    />
  );
});
ListDivider.displayName = "ListDivider";

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
