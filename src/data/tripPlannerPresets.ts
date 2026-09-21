export interface TripPreset {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  universe: 'disney' | 'marvel' | 'neutral';
  strategy: 'smart_wait' | 'min_walking' | 'balanced_dining';
  locationIds: string[];
  icon: string;
  estimatedDuration: string;
  description: string;
}

export const TRIP_PLANNER_PRESETS: TripPreset[] = [
  {
    id: 'preset_avengers_action',
    name: 'Avengers Campus Tactical Sprint',
    badge: 'Marvel Hero Edition',
    tagline: 'High-speed combat simulators, Quinjet launches, and Quantum Pym fuel',
    universe: 'marvel',
    strategy: 'smart_wait',
    locationIds: [
      'avengers_quinjet',
      'pym_test_kitchen',
      'web_slingers',
      'shawarma_palace',
      'guardians_rewind',
      'stark_super_store'
    ],
    icon: '⚡',
    estimatedDuration: '4 hrs 15 mins',
    description: 'Tackle the Marvel flagship attractions with minimal wait time, interspaced with Pym Test Kitchen colossal pretzels and post-battle Shawarma.'
  },
  {
    id: 'preset_disney_classics',
    name: 'Royal Magic & Maritime Sailing',
    badge: 'Disney Classic',
    tagline: 'Cinderella dining, Pirates sailing armada, and Tomorrowland coasters',
    universe: 'disney',
    strategy: 'balanced_dining',
    locationIds: [
      'space_mountain',
      'cinderella_royal_table',
      'pirates_sailing',
      'blue_bayou_waterfront',
      'jungle_sailing_cruise',
      'tron_lightcycle'
    ],
    icon: '🏰',
    estimatedDuration: '5 hrs 30 mins',
    description: 'An enchanting journey through Fantasyland, Adventureland bayous, and futuristic Tomorrowland speeds with a royal castle banquet.'
  },
  {
    id: 'preset_speed_runner',
    name: 'Lowest Queue Speed-Run',
    badge: 'Efficiency First',
    tagline: 'Prioritizes shortest wait lines to maximize rides per hour',
    universe: 'neutral',
    strategy: 'min_walking',
    locationIds: [
      'jungle_sailing_cruise',
      'shawarma_palace',
      'pirates_sailing',
      'docking_bay_7',
      'slinky_dog_dash',
      'cosmic_rays_cafe'
    ],
    icon: '⏱️',
    estimatedDuration: '3 hrs 45 mins',
    description: 'Engineered for visitors who want minimum queue friction and streamlined cross-park walking loops.'
  },
  {
    id: 'preset_gourmet_trail',
    name: 'Epicurean Food & Leisure Tour',
    badge: 'Foodie & Dining',
    tagline: 'Iconic park dishes from Blue Bayou waterside to Pym Quantum Lab',
    universe: 'neutral',
    strategy: 'balanced_dining',
    locationIds: [
      'cinderella_royal_table',
      'web_slingers',
      'pym_test_kitchen',
      'blue_bayou_waterfront',
      'falcon_run',
      'docking_bay_7'
    ],
    icon: '🍽️',
    estimatedDuration: '5 hrs 00 mins',
    description: 'Indulge in signature Disney and Marvel culinary innovations combined with thrilling midway rides between courses.'
  }
];
