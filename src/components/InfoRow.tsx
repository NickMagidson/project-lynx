const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center', 
  paddingInline: '5px',
};

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div style={infoRowStyle}>
    <strong style={{ marginBottom: '10px', marginTop: '1px' }}>{label}:</strong>
    <p style={{ marginBottom: '10px', marginTop: '1px' }}>{value}</p>
  </div>
);

export default InfoRow;