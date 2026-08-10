import { useState } from 'react';
import { Icon } from '../components/Icon';
import { SERVICE_LABEL, STATIONS, type Station } from '../data/stations';
import { RULES } from '../lib/benefits';
import { soles } from '../lib/format';
import { useNav } from '../lib/nav';

type Service = Station['services'][number];
type Filter = 'todos' | Service;

const FILTERS: Filter[] = ['todos', 'tienda', 'cafe', 'gas', 'lubricantes'];

export function MapScreen() {
  const { back } = useNav();
  const [filter, setFilter] = useState<Filter>('todos');

  const shown =
    filter === 'todos' ? STATIONS : STATIONS.filter((s) => s.services.includes(filter));

  return (
    <section className="screen s-map">
      <div className="topbar">
        <button className="icon-btn ghost" onClick={back} aria-label="Volver">
          <Icon name="left" size={22} />
        </button>
        <div className="grow">
          <h1>Estaciones cerca</h1>
          <span className="sub">Con el precio que pagás vos, no el de la pizarra</span>
        </div>
      </div>

      <div className="scroll">
        <div className="s-hist-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`s-hist-chip${filter === f ? ' on' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'todos' ? 'Todas' : SERVICE_LABEL[f]}
            </button>
          ))}
        </div>

        {shown.map((s) => {
          const conConvenio = s.premium - RULES.convenioPorGalon.premium;
          return (
            <div key={s.name} className="card s-map-item">
              <div className="row between">
                <div className="grow">
                  <h4>{s.name}</h4>
                  <p className="tiny muted">{s.address}</p>
                </div>
                <span className="s-map-dist">{s.dist.toFixed(1)} km</span>
              </div>

              <div className="s-map-price">
                <div>
                  <span className="tiny muted">G-Premium 95</span>
                  <s>{soles(s.premium)}</s>
                  <b>{soles(conConvenio)}</b>
                </div>
                <span className="s-map-badge">Tu convenio</span>
              </div>

              <div className="s-map-tags">
                {s.services.map((sv) => (
                  <span key={sv} className="s-map-tag">
                    {SERVICE_LABEL[sv]}
                  </span>
                ))}
                {s.open24h && <span className="s-map-tag open">24 h</span>}
              </div>

              <a
                className="btn btn-soft btn-sm btn-block s-map-go"
                href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="pin" size={16} strokeWidth={2} />
                Cómo llegar
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
