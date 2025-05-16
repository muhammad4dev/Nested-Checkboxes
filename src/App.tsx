import { CheckboxTree } from './components/CheckboxTree';

const data = [
  {
    id: '1',
    label: 'Parent A',
    children: [
      { id: '1-1', label: 'Child A1' },
      { id: '1-2', label: 'Child A2' },
    ],
  },
  {
    id: '2',
    label: 'Parent B',
    children: [
      {
        id: '2-1',
        label: 'Child B1',
        children: [
          { id: '2-1-1', label: 'Subchild B1-1' },
          { id: '2-1-2', label: 'Subchild B1-2' },
        ],
      },
      {
        id: '2-2',
        label: 'Child C1',
        children: [
          { id: '2-2-1', label: 'Subchild C1-1' },
          { id: '2-2-2', label: 'Subchild C1-2' },
          {
            id: '2-2-3',
            label: 'Subchild C1-3',
            children: [
              { id: '2-2-3-1', label: 'Subchild C1-3-1' },
              { id: '2-2-3-2', label: 'Subchild C1-3-2' },
            ],
          },
        ],
      },
    ],
  },
];

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Nested Checkboxes</h2>
      <CheckboxTree nodes={data} />
    </div>
  );
}
