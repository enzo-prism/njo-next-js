import { Fragment, type ReactNode } from "react";

export function IrReplaceableBookTitle() {
  return (
    <em aria-label="IrReplaceable">
      <s>Ir</s>Replaceable
    </em>
  );
}

export function withIrReplaceableTitle(text: string): ReactNode {
  const parts = text.split("IrReplaceable");
  return parts.map((part, index) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 ? <IrReplaceableBookTitle /> : null}
    </Fragment>
  ));
}
