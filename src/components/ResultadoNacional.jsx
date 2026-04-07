import ResultadoBase from './ResultadoBase.jsx';

function parseNationalDate(value) {
  if (!value) return new Date(0);

  const [datePart, timePart = '00:00'] = String(value).split(' ');
  const [dd, mm, yyyy] = datePart.split('-');

  if (!dd || !mm || !yyyy) return new Date(0);

  return new Date(`${yyyy}-${mm}-${dd}T${timePart}:00`);
}

export default function ResultadoNacional({ data }) {
  if (!data || !data.movimientos?.length) {
    return <div className="empty-state">No hay movimientos para mostrar.</div>;
  }

  const movimientos = [...data.movimientos]
    .sort((a, b) => parseNationalDate(a.fecha) - parseNationalDate(b.fecha))
    .map((mov) => ({
      fecha: mov.fecha || '',
      titulo: mov.estado || 'Movimiento registrado',
      descripcion: [mov.historia, mov.planta].filter(Boolean).join(' · ') || 'Sin detalle disponible.'
    }));

  const ultimo = movimientos[movimientos.length - 1];

  return (
    <ResultadoBase
      empresa="T&T Nacional"
      titulo="Seguimiento del envío"
      subtitulo={
        data.trackingNumber
          ? `Número de seguimiento: ${data.trackingNumber}`
          : 'Movimientos reportados por la empresa.'
      }
      estado={ultimo?.titulo || 'Sin estado informado'}
      movimientos={movimientos}
    />
  );
}