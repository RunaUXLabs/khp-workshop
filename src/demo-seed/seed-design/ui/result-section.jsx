/**
 * @file ui:result-section
 * @requires @seed-design/react@^2.0.0 || ^3.0.0
 **/

import * as React from "react";
import { Text, VStack } from "@seed-design/react";
import { ActionButton } from "./action-button";

const textStyles = {
  title: {
    large: "t8Bold",
    medium: "t5Bold",
  },

  description: {
    large: "t5Regular",
    medium: "t4Regular",
  }
};

const textContainerProperties = {
  large: {
    gap: "x3",
    pb: "x7",
  },

  medium: {
    gap: "x2",
    pb: "x6",
  }
};

/**
 * @see https://seed-design.io/react/components/result-section
 */
export const ResultSection = React.forwardRef((props, ref) => {
  const {
    size = "large",
    asset,
    title,
    description,
    primaryActionProps,
    secondaryActionProps,
    ...otherProps
  } = props;
  return (
    <VStack ref={ref} justify="center" align="center" px="x12" py="x4" grow {...otherProps}>
      {asset}
      <VStack {...textContainerProperties[size]}>
        <Text
          align="center"
          whiteSpace="pre-line"
          color="fg.neutral"
          textStyle={textStyles.title[size]}
        >
          {title}
        </Text>
        <Text
          align="center"
          whiteSpace="pre-line"
          color="fg.neutralMuted"
          textStyle={textStyles.description[size]}
        >
          {description}
        </Text>
      </VStack>
      {(primaryActionProps || secondaryActionProps) && (
        <VStack align="center" gap="x5">
          {primaryActionProps && (
            <ActionButton variant="neutralWeak" size="medium" {...primaryActionProps} />
          )}
          {secondaryActionProps && (
            <ActionButton
              variant="ghost"
              size="small"
              color="fg.neutral"
              fontWeight="bold"
              bleedX="asPadding"
              bleedY="asPadding"
              {...secondaryActionProps}
            />
          )}
        </VStack>
      )}
    </VStack>
  );
});
ResultSection.displayName = "ResultSection";

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
