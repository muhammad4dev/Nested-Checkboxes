import { useNestedCheckboxes } from '../hooks/useNestedCheckboxes';
import type { CheckboxNode } from '../types/Checkbox';

type Props = {
  nodes: CheckboxNode[];
};

export const CheckboxTree = ({ nodes }: Props) => {
  const { getState, handleToggle, getCheckedItems } =
    useNestedCheckboxes(nodes);

  const renderNode = (node: CheckboxNode) => {
    const { checked, indeterminate } = getState(node.id);

    return (
      <div key={node.id} style={{ paddingLeft: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={checked}
            ref={(el) => {
              if (el) el.indeterminate = indeterminate;
            }}
            onChange={() => handleToggle(node.id)}
          />
          {node.label}
        </label>
        {node.children?.map(renderNode)}
      </div>
    );
  };

  return (
    <div>
      {nodes.map(renderNode)}
      <p>Checked Items: {JSON.stringify(getCheckedItems())}</p>
    </div>
  );
};
