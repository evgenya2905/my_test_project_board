type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

export const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      style={{
        marginTop: '0.125rem',
        marginBottom: '0.125rem',
        height: '0.125rem',
        width: '100%',
        backgroundColor: '#7c3aed',
        opacity: 0,
      }}
      data-before={beforeId || '-1'}
      data-column={column}
    />
  );
};
