import ResultadoBase from './ResultadoBase.jsx';

function parseDate(value) {
  if (!value) return new Date(0);

  const [datePart, timePart = '00:00:00'] = String(value).split(' ');
  const [yyyy, mm, dd] = datePart.split('-');

  if (!yyyy || !mm || !dd) return new Date(0);

  return new Date(`${yyyy}-${mm}-${dd}T${timePart}`);
}

export default function ResultadoOca({ data }) {
  if (!data || !data.historial?.length) {
    return <div className="empty-state">No hay movimientos para mostrar.</div>;
  }

  const movimientos = [...data.historial]
    .sort((a, b) => parseDate(a.fecha) - parseDate(b.fecha))
    .map((item) => ({
      fecha: item.fecha || '',
      titulo: item.estado || 'Movimiento registrado',
      descripcion: item.sucursal ? `Sucursal: ${item.sucursal}` : 'Sucursal no informada.'
    }));

  const estado = data.estado || movimientos[movimientos.length - 1]?.titulo || 'Sin estado informado';

  return (
    <ResultadoBase
      empresa="OCA"
      titulo="Estado actual del envío"
      subtitulo="Historial completo reportado por la empresa."
      estado={estado}
      movimientos={movimientos}
    />
  );
}