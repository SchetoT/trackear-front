import ResultadoBase from './ResultadoBase.jsx';

function extractMovimientos(data) {
  if (Array.isArray(data?.movimientos)) return data.movimientos;
  if (Array.isArray(data?.historial)) return data.historial;
  if (Array.isArray(data?.history)) return data.history;
  if (Array.isArray(data?.eventos)) return data.eventos;
  return [];
}

function getFecha(item) {
  return item.fecha || item.date || item.datetime || '';
}

function getTitulo(item) {
  return item.estado || item.status || item.evento || item.description || 'Movimiento registrado';
}

function getDetalle(item) {
  return item.detalle || item.historia || item.location || item.sucursal || item.observacion || 'Sin detalle disponible.';
}

export default function ResultadoEcommerce({ data }) {
  if (!data) {
    return <div className="empty-state">No hay datos para mostrar.</div>;
  }

  const movimientosOriginales = extractMovimientos(data);
  const movimientos = movimientosOriginales.map((item) => ({
    fecha: getFecha(item),
    titulo: getTitulo(item),
    descripcion: getDetalle(item)
  }));

  const estado = data.estado || data.status || movimientos[movimientos.length - 1]?.titulo || 'Sin estado informado';

  if (!movimientos.length) {
    return (
      <div className="result-card">
        <div className="result-head">
          <div className="result-title-group">
            <p className="result-eyebrow">Paquetería e-commerce</p>
            <h2 className="result-title">Resultado de seguimiento</h2>
            <p className="result-subtitle">Información consolidada del envío consultado.</p>
          </div>

          <span className="status-badge status-badge--warning">{estado}</span>
        </div>

        <div className="result-body">
          <div className="info-grid">
            {Object.entries(data).map(([key, value]) => (
              <div className="info-box" key={key}>
                <span className="info-label">{key}</span>
                <span className="info-value">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ResultadoBase
      empresa="Paquetería e-commerce"
      titulo="Resultado de seguimiento"
      subtitulo="Información consolidada del envío consultado."
      estado={estado}
      movimientos={movimientos}
    />
  );
}