export type CheckboxNode = {
  id: string;
  label: string;
  children?: CheckboxNode[];
};

export type CheckboxState = {
  checked: boolean;
  indeterminate: boolean;
};
