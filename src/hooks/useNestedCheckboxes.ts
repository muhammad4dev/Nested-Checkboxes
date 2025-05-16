import { useCallback, useMemo, useState } from 'react';
import type { CheckboxNode, CheckboxState } from '../types/Checkbox';

type CheckboxMap = Record<string, CheckboxState>;
type ParentMap = Record<string, string | null>;
type ChildrenMap = Record<string, string[]>;

export const useNestedCheckboxes = (config: CheckboxNode[]) => {
  const [checkboxMap, setCheckboxMap] = useState<CheckboxMap>({});

  const { parentMap, childrenMap } = useMemo(() => {
    const parentMap: ParentMap = {};
    const childrenMap: ChildrenMap = {};

    const buildMaps = (
      nodes: CheckboxNode[],
      parentId: string | null = null
    ) => {
      for (const node of nodes) {
        parentMap[node.id] = parentId;
        if (node.children?.length) {
          childrenMap[node.id] = node.children.map((child) => child.id);
          buildMaps(node.children, node.id);
        } else {
          childrenMap[node.id] = [];
        }
      }
    };

    buildMaps(config);
    return { parentMap, childrenMap };
  }, [config]);

  const getAllDescendants = useCallback(
    (id: string): string[] => {
      const result: string[] = [];
      const dfs = (currentId: string) => {
        result.push(currentId);
        for (const child of childrenMap[currentId] || []) {
          dfs(child);
        }
      };
      dfs(id);
      return result;
    },
    [childrenMap]
  );

  const updateParentStates = useCallback(
    (updatedMap: CheckboxMap, id: string) => {
      const parentId = parentMap[id];
      if (!parentId) return;

      const children = childrenMap[parentId];
      const allChecked = children.every((cid) => updatedMap[cid]?.checked);
      const noneChecked = children.every(
        (cid) => !updatedMap[cid]?.checked && !updatedMap[cid]?.indeterminate
      );

      updatedMap[parentId] = {
        checked: allChecked,
        indeterminate: !allChecked && !noneChecked,
      };

      updateParentStates(updatedMap, parentId);
    },
    [parentMap, childrenMap]
  );

  const handleToggle = useCallback(
    (id: string) => {
      const current = checkboxMap[id] ?? {
        checked: false,
        indeterminate: false,
      };
      const newChecked = !current.checked;

      const updatedMap: CheckboxMap = { ...checkboxMap };
      const allIds = getAllDescendants(id);

      for (const cid of allIds) {
        updatedMap[cid] = { checked: newChecked, indeterminate: false };
      }

      updateParentStates(updatedMap, id);
      setCheckboxMap(updatedMap);
    },
    [checkboxMap, getAllDescendants, updateParentStates]
  );

  const getState = useCallback(
    (id: string): CheckboxState => {
      return checkboxMap[id] ?? { checked: false, indeterminate: false };
    },
    [checkboxMap]
  );

  const getCheckedItems = useCallback(() => {
    return Object.entries(checkboxMap)
      .filter(([, value]) => value.checked)
      .map(([id]) => id);
  }, [checkboxMap]);

  return { getState, handleToggle, getCheckedItems };
};
