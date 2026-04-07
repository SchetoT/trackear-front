function formatDate(value) {
    const date = new Date(value);
  
    if (Number.isNaN(date.getTime())) {
      return value || '-';
    }
  
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function getStatusTone(status) {
    const value = String(status || '').toLowerCase();
  
    if (value.includes('entregado') || value.includes('delivered')) return 'success';
    if (value.includes('error') || value.includes('fallo')) return 'danger';
    if (value.includes('proceso') || value.includes('transito') || value.includes('viaje')) return 'info';
  
    return 'warning';
  }
  
  export default function ResultadoBase({
    empresa,
    titulo,
    subtitulo,
    estado,
    movimientos = [],
    extra = null
  }) {
    if (!movimientos.length && !extra) {
      return <div className="empty-state">No hay datos para mostrar.</div>;
    }
  
    return (
      <div className="result-card">
        <div className="result-head">
          <div className="result-title-group">
            <p className="result-eyebrow">{empresa}</p>
            <h2 className="result-title">{titulo}</h2>
            {subtitulo && <p className="result-subtitle">{subtitulo}</p>}
          </div>
  
          {estado && (
            <span className={`status-badge status-badge--${getStatusTone(estado)}`}>
              {estado}
            </span>
          )}
        </div>
  
        <div className="result-body">
          {movimientos.length > 0 && (
            <div className="tracking-list">
              {movimientos.map((mov, index) => (
                <div className="tracking-item" key={`${mov.fecha || index}`}>
                  <div className="tracking-meta">
                    {formatDate(mov.fecha)}
                  </div>
  
                  <div className="tracking-content">
                    <h3 className="tracking-title">
                      {mov.titulo || 'Movimiento registrado'}
                    </h3>
                    <p className="tracking-detail">
                      {mov.descripcion || 'Sin detalle disponible.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
  
          {extra}
        </div>
      </div>
    );
  }