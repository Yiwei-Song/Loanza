import React, { useMemo, useState } from 'react';
import type { Opportunity } from '../types';
import { useApp } from '../state/store';
import { countryName } from '../data/countries';
import { OpportunityMini } from './opportunity';
import { Icon } from './ui';

/**
 * Stylised dot-matrix world map.
 * Land is rasterised from coarse continent polygons ([lon, lat] rings) —
 * deliberately low-poly, tuned to read as Earth at dot resolution.
 */
type Ring = [number, number][];

const LAND: Ring[] = [
  // North America (Hudson Bay simplified away)
  [[-168, 66], [-165, 60], [-156, 58], [-150, 61], [-146, 60], [-136, 57], [-130, 54], [-125, 48], [-124, 40], [-120, 34], [-114, 29], [-110, 23], [-105, 19], [-96, 16], [-92, 15], [-90, 13], [-85, 11], [-80, 9], [-78, 7], [-82, 9], [-86, 14], [-90, 18], [-90, 21], [-86, 30], [-82, 28], [-80, 25], [-80, 32], [-75, 35], [-70, 41], [-66, 44], [-60, 46], [-53, 47], [-55, 52], [-60, 55], [-64, 60], [-73, 63], [-82, 67], [-95, 70], [-110, 69], [-125, 70], [-140, 70], [-155, 71], [-168, 66]],
  // Greenland
  [[-57, 76], [-40, 83], [-22, 82], [-20, 76], [-25, 70], [-40, 60], [-48, 61], [-53, 67], [-57, 76]],
  // South America
  [[-78, 7], [-72, 12], [-64, 11], [-60, 8], [-52, 5], [-50, 0], [-44, -3], [-35, -8], [-37, -12], [-40, -20], [-46, -24], [-53, -30], [-58, -34], [-62, -39], [-65, -47], [-69, -55], [-73, -50], [-72, -44], [-71, -33], [-70, -25], [-70, -18], [-76, -15], [-81, -6], [-80, 0], [-78, 7]],
  // Cuba / Antilles sliver
  [[-85, 23.5], [-74, 20], [-74, 21.5], [-85, 22.5], [-85, 23.5]],
  // Africa
  [[-17, 15], [-17, 21], [-10, 31], [0, 36], [10, 37], [20, 32], [32, 31], [34, 28], [37, 22], [43, 11], [51, 12], [48, 5], [41, -2], [40, -10], [36, -18], [33, -26], [27, -34], [18, -34], [14, -26], [12, -18], [9, -8], [8, 4], [0, 5], [-8, 4], [-13, 9], [-17, 15]],
  // Madagascar
  [[44, -12], [50, -16], [47, -25], [44, -22], [43, -16], [44, -12]],
  // Europe (Iberia → Balkans)
  [[-10, 36], [-9, 44], [-1, 46], [-5, 48], [2, 51], [5, 53], [8, 54], [8, 57], [13, 55], [20, 54], [24, 57], [31, 60], [30, 52], [34, 46], [28, 41], [23, 36], [15, 38], [10, 39], [4, 40], [-1, 36], [-10, 36]],
  // Italy
  [[8, 45], [13, 44], [18, 40], [16, 38], [12, 40], [9, 43], [8, 45]],
  // British Isles (merged blob)
  [[-10, 52], [-5, 50], [1, 51], [0, 53], [-2, 56], [-4, 59], [-8, 58], [-10, 54], [-10, 52]],
  // Iceland
  [[-24, 63], [-13, 64], [-15, 66], [-22, 66], [-24, 63]],
  // Scandinavia + Baltics
  [[5, 58], [5, 62], [12, 66], [18, 70], [28, 71], [31, 70], [28, 64], [24, 60], [18, 56], [12, 56], [8, 58], [5, 58]],
  // Russia / Siberia / Central Asia
  [[30, 52], [30, 60], [28, 67], [33, 69], [45, 69], [60, 70], [75, 73], [100, 77], [115, 76], [140, 73], [160, 70], [178, 66], [179, 62], [170, 60], [160, 61], [160, 53], [156, 51], [150, 59], [143, 59], [141, 54], [135, 49], [131, 43], [120, 45], [100, 44], [80, 43], [70, 41], [55, 41], [45, 42], [37, 45], [30, 46], [30, 52]],
  // Middle East → India → China → SE Asia
  [[70, 40], [75, 38], [80, 35], [90, 30], [100, 35], [110, 42], [122, 41], [124, 40], [122, 37], [121, 31], [118, 25], [112, 21], [108, 16], [106, 10], [103, 9], [100, 14], [98, 9], [101, 5], [99, 6], [96, 12], [92, 16], [88, 22], [85, 20], [80, 15], [77, 7], [73, 9], [68, 24], [62, 26], [58, 26], [52, 28], [48, 31], [44, 38], [52, 38], [60, 36], [66, 38], [70, 40]],
  // Arabia
  [[34, 30], [38, 15], [44, 12], [52, 15], [59, 22], [58, 26], [48, 30], [40, 32], [34, 30]],
  // Japan
  [[130, 31], [132, 34], [136, 35], [140, 37], [141, 41], [143, 45], [145, 44], [141, 39], [137, 34], [132, 32], [130, 31]],
  // Korea
  [[126, 34], [129, 35], [129, 39], [125, 39], [126, 34]],
  // Sumatra
  [[95, 5], [98, 4], [104, -3], [106, -6], [102, -5], [95, 3], [95, 5]],
  // Java
  [[105, -6], [114, -7], [115, -8], [106, -8], [105, -6]],
  // Borneo
  [[109, 1], [114, 4], [118, 2], [117, -3], [112, -3], [109, 1]],
  // Sulawesi
  [[119, 0], [122, 1], [123, -2], [120, -3], [119, 0]],
  // New Guinea
  [[131, -1], [140, -2], [147, -6], [150, -9], [143, -9], [137, -7], [131, -4], [131, -1]],
  // Philippines
  [[120, 18], [122, 17], [122, 14], [124, 12], [125, 8], [122, 7], [120, 12], [120, 18]],
  // Australia
  [[114, -22], [114, -34], [118, -35], [124, -33], [130, -32], [136, -35], [139, -37], [146, -39], [150, -37], [153, -31], [153, -26], [150, -22], [146, -18], [142, -12], [136, -15], [132, -12], [127, -14], [122, -17], [114, -22]],
  // Tasmania
  [[145, -41], [148, -41], [147, -43], [145, -41]],
  // New Zealand
  [[173, -35], [176, -38], [178, -38], [176, -40], [174, -40], [173, -35]],
  [[167, -46], [170, -43], [174, -41], [172, -44], [168, -47], [167, -46]],
];

function inRing(lon: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function isLand(lon: number, lat: number): boolean {
  return LAND.some((ring) => inRing(lon, lat, ring));
}

/** Projection shared by dots and pins: x = (lon+180)*2, y = (90-lat)*2. */
export function projectMap(lat: number, lon: number): { x: number; y: number } {
  return { x: (lon + 180) * 2, y: (90 - lat) * 2 };
}

export const MAP_W = 720;
export const MAP_Y0 = 16; // crop above lat 82°N
export const MAP_H = 280; // down to lat 58°S

const CELL = 4; // degrees per dot

const DOTS: { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = [];
  for (let lat = 82; lat > -58; lat -= CELL) {
    for (let lon = -180; lon < 180; lon += CELL) {
      const cLat = lat - CELL / 2;
      const cLon = lon + CELL / 2;
      if (isLand(cLon, cLat)) {
        const { x, y } = projectMap(cLat, cLon);
        out.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
      }
    }
  }
  return out;
})();

export function WorldDots({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 ${MAP_Y0} ${MAP_W} ${MAP_H}`} className={className} aria-hidden="true">
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={2.4} className="map-dot" />
      ))}
    </svg>
  );
}

// ─────────────────────────── Interactive map ───────────────────────────

interface Cluster {
  key: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  opps: Opportunity[];
}

export function MapView({
  opportunities,
  interactive = true,
  onShowList,
}: {
  opportunities: Opportunity[];
  interactive?: boolean;
  onShowList?: () => void;
}) {
  const { t, lang } = useApp();
  const [active, setActive] = useState<string | null>(null);

  const clusters = useMemo(() => {
    const map = new Map<string, Cluster>();
    for (const opp of opportunities) {
      for (const loc of opp.locations) {
        const key = `${loc.city}|${loc.country}`;
        const existing = map.get(key);
        if (existing) existing.opps.push(opp);
        else map.set(key, { key, city: loc.city, country: loc.country, lat: loc.lat, lon: loc.lon, opps: [opp] });
      }
    }
    return [...map.values()];
  }, [opportunities]);

  const unmappable = useMemo(
    () => opportunities.filter((o) => o.locations.length === 0).length,
    [opportunities],
  );

  return (
    <div className="mapview">
      <div className="mapview-stage" onMouseLeave={() => interactive && setActive(null)}>
        <WorldDots className="mapview-world" />
        {clusters.map((cl) => {
          const { x, y } = projectMap(cl.lat, cl.lon);
          const left = (x / MAP_W) * 100;
          const top = ((y - MAP_Y0) / MAP_H) * 100;
          const isActive = active === cl.key;
          return (
            <div
              key={cl.key}
              className={`map-pin-wrap ${isActive ? 'active' : ''}`}
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <button
                className={`map-pin ${cl.opps.length > 1 ? 'multi' : ''}`}
                aria-label={`${cl.city} — ${cl.opps.length}`}
                onMouseEnter={() => interactive && setActive(cl.key)}
                onFocus={() => interactive && setActive(cl.key)}
                onClick={() => interactive && setActive(cl.key)}
              >
                <span className="map-pin-dot" />
                {cl.opps.length > 1 && <span className="map-pin-count">{cl.opps.length}</span>}
              </button>
              {interactive && isActive && (
                <div className={`map-popover ${left > 62 ? 'flip-x' : ''} ${top < 45 ? 'flip-y' : ''}`}>
                  <div className="map-popover-head">
                    <Icon name="pin" size={13} strokeWidth={2} />
                    <strong>{cl.city}</strong>
                    <span>{countryName(cl.country, lang)}</span>
                  </div>
                  <div className="map-popover-list">
                    {cl.opps.slice(0, 4).map((o) => (
                      <OpportunityMini key={o.id} opp={o} />
                    ))}
                    {cl.opps.length > 4 && <div className="map-popover-more">+{cl.opps.length - 4}</div>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {interactive && unmappable > 0 && (
        <div className="map-footnote">
          <Icon name="globe" size={13} strokeWidth={1.8} />
          <span>{t('db.map.unmappable', { n: unmappable })}</span>
          {onShowList && (
            <button className="map-footnote-link" onClick={onShowList}>
              {t('db.map.showList')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
