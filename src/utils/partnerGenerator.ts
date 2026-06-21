export type PartnerType = 'company' | 'shop' | 'gas_station' | 'school' | 'house';

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  coordinates: [number, number];
  logoText: string;
  benefits: {
    energySaved: string;
    taxReduction: string;
    co2Offset: string;
  };
}

const FIRST_NAMES = ['Klaus', 'Maria', 'Johannes', 'Sophie', 'Michael', 'Anna', 'Thomas', 'Laura', 'Andreas', 'Sarah'];
const LAST_NAMES = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker'];
const COMPANY_NAMES = ['TechSolutions', 'GreenEnergy', 'EcoBuild', 'SmartGrid', 'Solaris', 'FutureWorks'];
const SHOP_NAMES = ['BioMarkt', 'City Grill', 'Kapadokya', 'Xiao', 'Mrs. Deniz', 'Atelier', 'Spark'];

function pseudoRandom(seed: number) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generatePartnersInBounds(
  southWest: [number, number],
  northEast: [number, number]
): Partner[] {
  const partners: Partner[] = [];
  
  // Use a grid size of 0.02 degrees (approx 2km)
  const GRID_SIZE = 0.02;
  const startLat = Math.floor(southWest[0] / GRID_SIZE);
  const endLat = Math.floor(northEast[0] / GRID_SIZE);
  const startLng = Math.floor(southWest[1] / GRID_SIZE);
  const endLng = Math.floor(northEast[1] / GRID_SIZE);

  for (let latIdx = startLat; latIdx <= endLat; latIdx++) {
    for (let lngIdx = startLng; lngIdx <= endLng; lngIdx++) {
      // Seed based on grid cell coordinates
      let seed = Math.abs(latIdx * 10000 + lngIdx * 100);
      
      // Generate 1 to 4 partners per grid cell
      const countInCell = Math.floor(pseudoRandom(seed++) * 4) + 1;

      for (let i = 0; i < countInCell; i++) {
        const lat = (latIdx + pseudoRandom(seed++)) * GRID_SIZE;
        const lng = (lngIdx + pseudoRandom(seed++)) * GRID_SIZE;

        // Only include partners that actually fall within the current view bounds
        if (lat >= southWest[0] && lat <= northEast[0] && lng >= southWest[1] && lng <= northEast[1]) {
          const typeRand = pseudoRandom(seed++);
          let type: PartnerType = 'house';
          if (typeRand > 0.8) type = 'company';
          else if (typeRand > 0.6) type = 'shop';
          else if (typeRand > 0.5) type = 'gas_station';
          else if (typeRand > 0.4) type = 'school';

          let name = '';
          let logoText = '';
          
          if (type === 'house') {
            name = `${FIRST_NAMES[Math.floor(pseudoRandom(seed++) * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(pseudoRandom(seed++) * LAST_NAMES.length)]}`;
            logoText = name.split(' ').map(n => n[0]).join('');
          } else if (type === 'company') {
            name = COMPANY_NAMES[Math.floor(pseudoRandom(seed++) * COMPANY_NAMES.length)] + (pseudoRandom(seed++) > 0.5 ? ' GmbH' : ' AG');
            logoText = name.substring(0, 2).toUpperCase();
          } else if (type === 'shop') {
            name = SHOP_NAMES[Math.floor(pseudoRandom(seed++) * SHOP_NAMES.length)];
            logoText = name.substring(0, 2).toUpperCase();
          } else if (type === 'gas_station') {
            name = pseudoRandom(seed++) > 0.5 ? 'Aral' : 'Shell';
            logoText = name[0];
          } else if (type === 'school') {
            name = 'Stadtische Gesamtschule';
            logoText = 'SG';
          }

          const energyVal = Math.floor(pseudoRandom(seed++) * (type === 'company' || type === 'school' ? 10000 : 2000)) + 500;
          const taxVal = Math.floor(energyVal * 0.3);
          const co2Val = (energyVal * 0.0004).toFixed(1);

          partners.push({
            id: `partner-${Math.floor(lat * 100000)}-${Math.floor(lng * 100000)}`,
            name,
            type,
            coordinates: [lat, lng],
            logoText,
            benefits: {
              energySaved: `${energyVal.toLocaleString()} kWh/yr`,
              taxReduction: `€${taxVal.toLocaleString()}/yr`,
              co2Offset: `${co2Val} tons`,
            }
          });
        }
      }
    }
  }

  return partners;
}
