/* Settings */
const childSpawn: string = 'KF Links House';
const adultSpawn: string = 'Temple of Time';
const open_forest: boolean = true;
const bombchus_in_logic: boolean = true;
const logic_grottos_without_agony: boolean = true;
const logic_mido_backflip: boolean = true;

/* State */
const age: string = 'child';
const oppositeAge: string = 'adult';
const checkStatuses = {
  queenGohma: false,
};
const inventory = {
  slingshot: 0,
  boomerang: 0,
  sticks: 0,
  nuts: 0,
  swordKokiri: 0,
  bombs: 0,
  bombchus: 0,
  magic: 0,
  dins: 0,
  bottle: 0,
  shot: 0,
  shieldDeku: 0,
  ocarina: 0,
  storms: 0,
  sarias: 0,
  agony: 0,
  bootsiron: 0,
  bootshover: 0,
  scale: 0,
};

const roots: string[] = [childSpawn, adultSpawn, 'prelude_warp', 'minuet_warp', 'bolero_warp', 'serenade_warp', 'nocturne_warp', 'requiem_warp'];

/* Helpers */
function isChild(): boolean {
  return age === 'child';
}

function isAdult(): boolean {
  return age === 'adult';
}

function canLeaveForest(): boolean {
  return open_forest || isAdult() || checkStatuses.queenGohma;
}

function hasExplosives(): boolean {
  return !!(inventory.bombs || (bombchus_in_logic && inventory.bombchus));
}

function canChildAttack(): boolean {
  return !!(inventory.slingshot || inventory.boomerang || inventory.sticks || inventory.swordKokiri || hasExplosives() || (inventory.magic && inventory.dins));
}

function canPlantBugs(): boolean {
  return !!inventory.bottle;
}

function canOpenStormGrotto(): boolean {
  return !!((inventory.ocarina && inventory.storms) && (inventory.agony || logic_grottos_without_agony));
}

function canStunDeku(): boolean {
  return !!(isAdult() || (inventory.shieldDeku || inventory.slingshot || inventory.boomerang || inventory.sticks || inventory.swordKokiri || hasExplosives() || (inventory.magic && inventory.dins) || inventory.nuts));
}

/* Regions */
interface RuleObj {
  [name: string]: () => boolean;
}
interface Region {
  regionName: string;
  scene: string;
  locations?: RuleObj;
  exits: RuleObj;
}
const regions: Region[] = [
  {
    regionName: 'Kokiri Forest',
    scene: 'Kokiri Forest',
    locations: {
      'KF Kokiri Sword Chest': () => isChild(),
      'KF GS Know It All House': () => isChild() && canChildAttack(),
      'KF GS Bean Patch': () => !!(isChild() && inventory.bottle && canChildAttack()),
      'KF GS House of Twins': () => !!(isAdult() && inventory.shot), // (logic_adult_kokiri_gs && can_use(Hover_Boots)))
    },
    exits: {
      'KF Links House': () => true,
      'KF Midos House': () => true,
      'KF Outside Deku Tree': () => isAdult() || open_forest || (inventory.swordKokiri && inventory.shieldDeku),
      'Lost Woods': () => true,
      'LW Bridge From Forest': () => canLeaveForest(),
      'KF Storms Grotto': () => canOpenStormGrotto(),
    },
  },
  {
    regionName: 'KF Outside Deku Tree',
    scene: 'Kokiri Forest',
    exits: {
      'Deku Tree Lobby': () => isChild(),
      'Kokiri Forest': () => isAdult() || open_forest || (inventory.swordKokiri && inventory.shieldDeku),
    },
  },
  {
    regionName: 'KF Links House',
    scene: 'KF Links House',
    exits: {
      'Kokiri Forest': () => true,
    },
  },
  {
    regionName: 'KF Midos House',
    scene: 'KF Midos House',
    locations: {
      'KF Midos Top Left Chest': () => true,
      'KF Midos Top Right Chest': () => true,
      'KF Midos Bottom Left Chest': () => true,
      'KF Midos Bottom Right Chest': () => true,
    },
    exits: {
      'Kokiri Forest': () => true,
    },
  },
  {
    regionName: 'LW Forest Exit', // Going the wrong way in the woods
    scene: 'Lost Woods',
    exits: {
      'Kokiri Forest': () => true,
    },
  },
  {
    regionName: 'Lost Woods',
    scene: 'Lost Woods',
    locations: {
      'LW Skull Kid': () => isChild() && !!(inventory.ocarina && inventory.sarias),
      'LW Ocarina Memory Game': () => isChild() && !!inventory.ocarina,
      'LW Target in Woods': () => isChild() && !!inventory.slingshot,
      'LW Deku Scrub Near Bridge': () => isChild() && canStunDeku(),
      'LW GS Bean Patch Near Bridge': () => canPlantBugs() || canChildAttack(),
      // 'Bug Shrub': () => 'is_child and can_cut_shrubs and has_bottle',
    },
    exits: {
      'LW Forest Exit': () => true,
      'GC Woods Warp': () => true, // COME BACK
      'LW Bridge': () => isAdult() && (!!inventory.bootshover || inventory.shot === 2), //" is_adult and (can_use(Hover_Boots) or can_use(Longshot) or here(can_plant_bean) or logic_lost_woods_bridge)", COME BACK
      'Zora River': () => canLeaveForest() && !!(inventory.scale || (isAdult() && inventory.bootsiron)),
      'LW Beyond Mido': () => isChild() || logic_mido_backflip || (inventory.ocarina && inventory.sarias),
      // 'LW Near Shortcuts Grotto': 'here(can_blast_or_smash)', // COME BACK - here()
    },
  },
  {
    regionName: "LW Beyond Mido",
    scene: "Lost Woods",
    "locations": {
        "LW Deku Scrub Near Deku Theater Right": "is_child and can_stun_deku",
        "LW Deku Scrub Near Deku Theater Left": "is_child and can_stun_deku",
        "LW GS Above Theater": "
            is_adult and at_night and
            (here(can_plant_bean) or
                 (logic_lost_woods_gs_bean and can_use(Hookshot) and
                 (can_use(Longshot) or can_use(Bow) or has_bombchus or can_use(Dins_Fire))))",
        "LW GS Bean Patch Near Theater": "
            can_plant_bugs and 
            (can_child_attack or (shuffle_scrubs == 'off' and Buy_Deku_Shield))",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle"
    },
    "exits": {
        "LW Forest Exit": "True",
        "Lost Woods": "is_child or can_play(Sarias_Song)",
        "SFM Entryway": "True",
        "Deku Theater": "True",
        "LW Scrubs Grotto": "here(can_blast_or_smash)"
    }
  },
  {
    "region_name": "Lost Woods Mushroom Timeout",
    "scene": "Lost Woods",
    "exits": {
        "Lost Woods": "True"
    }
},
{
    "region_name": "SFM Entryway",
    "scene": "Sacred Forest Meadow",
    "exits": {
        "LW Beyond Mido": "True",
        "Sacred Forest Meadow": "
            is_adult or Slingshot or Sticks or 
            Kokiri_Sword or can_use(Dins_Fire)",
        "SFM Wolfos Grotto": "can_open_bomb_grotto"
    }
},
{
    "region_name": "Sacred Forest Meadow",
    "scene": "Sacred Forest Meadow",
    "locations": {
        "Song from Saria": "is_child and Zeldas_Letter",
        "Sheik in Forest": "is_adult",
        "SFM GS": "can_use(Hookshot) and at_night",
        "SFM Maze Gossip Stone (Lower)": "True",
        "SFM Maze Gossip Stone (Upper)": "True",
        "SFM Saria Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy_without_suns and has_bottle"
    },
    "exits": {
        "SFM Entryway": "True",
        "SFM Forest Temple Entrance Ledge": "can_use(Hookshot)",
        "SFM Fairy Grotto": "True",
        "SFM Storms Grotto": "can_open_storm_grotto"
    }
},
{
    "region_name": "SFM Forest Temple Entrance Ledge",
    "scene": "Sacred Forest Meadow",
    "exits": {
        "Sacred Forest Meadow": "True",
        "Forest Temple Lobby": "True"
    }
},
{
    "region_name": "LW Bridge From Forest",
    "scene": "Lost Woods",
    "locations": {
        "LW Gift from Saria": "True"
    },
    "exits": {
        "LW Bridge": "True"
    }
},
{
    "region_name": "LW Bridge",
    "scene": "Lost Woods",
    "exits": {
        "Kokiri Forest": "True",
        "Hyrule Field": "True",
        "Lost Woods": "can_use(Longshot)"
    }
},
{
    "region_name": "Hyrule Field",
    "scene": "Hyrule Field",
    "time_passes": true,
    "locations": {
        "HF Ocarina of Time Item": "is_child and has_all_stones",
        "Song from Ocarina of Time": "is_child and has_all_stones",
        "Big Poe Kill": "can_use(Bow) and can_ride_epona and has_bottle"
    },
    "exits": {
        "LW Bridge": "True",
        "Lake Hylia": "True",
        "Gerudo Valley": "True",
        "Market Entrance": "True",
        "Kakariko Village": "True",
        "ZR Front": "True",
        "Lon Lon Ranch": "True",
        "HF Southeast Grotto": "here(can_blast_or_smash)",
        "HF Open Grotto": "True",
        "HF Inside Fence Grotto": "can_open_bomb_grotto",
        "HF Cow Grotto": "(can_use(Megaton_Hammer) or is_child) and can_open_bomb_grotto",
                               # There is a hammerable boulder as adult which is not there as child
        "HF Near Market Grotto": "here(can_blast_or_smash)",
        "HF Fairy Grotto": "here(can_blast_or_smash)",
        "HF Near Kak Grotto": "can_open_bomb_grotto",
        "HF Tektite Grotto": "can_open_bomb_grotto"
    }
},
{
    "region_name": "Lake Hylia",
    "scene": "Lake Hylia",
    "time_passes": true,
    "events": {
        "Bonooru": "is_child and Ocarina"
    },
    "locations": {
        "Pierre": "is_adult and Bonooru and not free_scarecrow",
        "LH Underwater Item": "is_child and can_dive",
        "LH Sun": "
            is_adult and 
            (can_use(Distant_Scarecrow) or 'Water Temple Clear') and can_use(Bow)",
        "LH Freestanding PoH": "
            is_adult and (can_use(Scarecrow) or here(can_plant_bean))",
        "LH GS Bean Patch": "can_plant_bugs and can_child_attack",
        "LH GS Lab Wall": "
            is_child and (Boomerang or 
                (logic_lab_wall_gs and (Sticks or Kokiri_Sword))) and at_night",
        "LH GS Small Island": "is_child and can_child_attack and at_night",
        "LH GS Tree": "can_use(Longshot) and at_night",
        "LH Lab Gossip Stone": "True",
        "LH Gossip Stone (Southeast)": "True",
        "LH Gossip Stone (Southwest)": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Bean Plant Fairy": "can_plant_bean and can_play(Song_of_Storms) and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "is_child and can_cut_shrubs and has_bottle"
    },
    "exits": {
        "Hyrule Field": "True",
        "Zoras Domain": "is_child and can_dive",
        "LH Owl Flight": "is_child",
        "LH Lab": "True",
        "LH Fishing Island": "
            is_child or can_use(Scarecrow) or
            here(can_plant_bean) or 'Water Temple Clear'",
        "Water Temple Lobby": "
            can_use(Hookshot) and
            (can_use(Iron_Boots) or
                ((can_use(Longshot) or logic_water_hookshot_entry) and (Progressive_Scale, 2)))",
        "LH Grotto": "True"
    }
},
{
    "region_name": "LH Fishing Island",
    "scene": "Lake Hylia",
    "exits": {
        "Lake Hylia": "True",
        "LH Fishing Hole": "True"
    }
},
{
    "region_name": "LH Owl Flight",
    "scene": "Lake Hylia",
    "exits": {
        "Hyrule Field": "True"
    }
},
{
    "region_name": "LH Lab",
    "scene": "LH Lab",
    "events": {
        "Eyedrops Access": "
            is_adult and 
            ('Eyeball Frog Access' or (Eyeball_Frog and disable_trade_revert))"
    },
    "locations": {
        "LH Lab Dive": "
            (Progressive_Scale, 2) or
            (logic_lab_diving and Iron_Boots and can_use(Hookshot))",
        "LH GS Lab Crate": "Iron_Boots and can_use(Hookshot)"
    },
    "exits": {
        "Lake Hylia": "True"
    }
},
{
    "region_name": "LH Fishing Hole",
    "scene": "LH Fishing Hole",
    "locations": {
        "LH Child Fishing": "is_child",
        "LH Adult Fishing": "is_adult"
    },
    "exits": {
        "LH Fishing Island": "True"
    }
},
{
    "region_name": "Gerudo Valley",
    "scene": "Gerudo Valley",
    "time_passes": true,
    "locations": {
        "GV GS Small Bridge": "can_use(Boomerang) and at_night",
        "Bug Rock": "is_child and has_bottle"
    },
    "exits": {
        "Hyrule Field": "True",
        "GV Upper Stream": "True",
        "GV Crate Ledge": "is_child or can_use(Longshot)",
        "GV Grotto Ledge": "True",
        "GV Fortress Side": "
            is_adult and 
            (can_ride_epona or can_use(Longshot) or gerudo_fortress == 'open' or 'Carpenter Rescue')"
    }
},
{
    "region_name": "GV Upper Stream",
    "scene": "Gerudo Valley",
    "time_passes": true,
    "locations": {
        "GV Waterfall Freestanding PoH": "True",
        "GV GS Bean Patch": "can_plant_bugs and can_child_attack",
        "GV Cow": "is_child and can_play(Eponas_Song)",
        "GV Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Bean Plant Fairy": "can_plant_bean and can_play(Song_of_Storms) and has_bottle"
    },
    "exits": {
        "GV Lower Stream": "True"
    }
},
{
    "region_name": "GV Lower Stream",
    "scene": "Gerudo Valley",
    "time_passes": true,
    "exits": {
        "Lake Hylia": "True"
    }
},
{
    "region_name": "GV Grotto Ledge",
    "scene": "Gerudo Valley",
    "time_passes": true,
    "exits": {
        "GV Lower Stream": "True",
        "GV Octorok Grotto": "can_use(Silver_Gauntlets)",
        "GV Crate Ledge": "can_use(Longshot)"
    }
},
{
    "region_name": "GV Crate Ledge",
    "scene": "Gerudo Valley",
    "time_passes": true,
    "locations": {
        "GV Crate Freestanding PoH": "True"
    },
    "exits": {
        "GV Lower Stream": "True"
    }
},
{
    "region_name": "GV Fortress Side",
    "scene": "Gerudo Valley",
    "time_passes": true,
    "events": {
        "Broken Sword Access": "is_adult and ('Poachers Saw Access' or Poachers_Saw)"
    },
    "locations": {
        "GV Chest": "can_use(Megaton_Hammer)",
        "GV GS Behind Tent": "can_use(Hookshot) and at_night",
        "GV GS Pillar": "can_use(Hookshot) and at_night"
    },
    "exits": {
        "Gerudo Fortress": "True",
        "GV Upper Stream": "True",
        "GV Crate Ledge": "
            logic_valley_crate_hovers and can_use(Hover_Boots) and can_take_damage",
        "Gerudo Valley": "
            is_child or can_ride_epona or can_use(Longshot) or
            gerudo_fortress == 'open' or 'Carpenter Rescue'",
        "GV Carpenter Tent": "is_adult", # Invisible as child so not in logic
        "GV Storms Grotto": "is_adult and can_open_storm_grotto" # Not there as child
    }
},
{
    "region_name": "GV Carpenter Tent",
    "scene": "GV Carpenter Tent",
    "exits": {
        "GV Fortress Side": "True"
    }
},
{
    "region_name": "Gerudo Fortress",
    "scene": "Gerudo Fortress",
    "events": {
        "Carpenter Rescue": "can_finish_GerudoFortress",
        "GF Gate Open": "is_adult and Gerudo_Membership_Card"
    },
    "locations": {
        "GF Chest": "
            can_use(Hover_Boots) or can_use(Scarecrow) or can_use(Longshot)",
        "GF HBA 1000 Points": "
            Gerudo_Membership_Card and can_ride_epona and Bow and at_day",
        "GF HBA 1500 Points": "
            Gerudo_Membership_Card and can_ride_epona and Bow and at_day",
        "GF North F1 Carpenter": "is_adult or Kokiri_Sword",
        "GF North F2 Carpenter": "
            (is_adult or Kokiri_Sword) and 
            (Gerudo_Membership_Card or can_use(Bow) or can_use(Hookshot)
                or can_use(Hover_Boots) or logic_gerudo_kitchen)",
        "GF South F1 Carpenter": "is_adult or Kokiri_Sword",
        "GF South F2 Carpenter": "is_adult or Kokiri_Sword",
        "GF Gerudo Membership Card": "can_finish_GerudoFortress",
        "GF GS Archery Range": "
            can_use(Hookshot) and Gerudo_Membership_Card and at_night",
        "GF GS Top Floor": "
            is_adult and at_night and 
            (Gerudo_Membership_Card or can_use(Bow) or can_use(Hookshot) or
                can_use(Hover_Boots) or logic_gerudo_kitchen)"
    },
    "exits": {
        "GV Fortress Side": "True",
        "GF Outside Gate": "'GF Gate Open'",
        "Gerudo Training Grounds Lobby": "Gerudo_Membership_Card and is_adult",
        "GF Storms Grotto": "is_adult and can_open_storm_grotto" # Not there as child
    }
},
{
    "region_name": "GF Outside Gate",
    "scene": "Gerudo Fortress",
    "exits": {
        "Gerudo Fortress": "is_adult or (shuffle_overworld_entrances and 'GF Gate Open')",
        "Wasteland Near Fortress": "True"
    }
},
{
    "region_name": "Wasteland Near Fortress",
    "scene": "Haunted Wasteland",
    "exits": {
        "GF Outside Gate": "True",
        "Haunted Wasteland": "
            logic_wasteland_crossing or can_use(Hover_Boots) or can_use(Longshot)"
    }
},
{
    "region_name": "Haunted Wasteland",
    "scene": "Haunted Wasteland",
    "locations": {
        "Wasteland Chest": "has_fire_source",
        "Wasteland Bombchu Salesman": "
            Progressive_Wallet and 
            (is_adult or Sticks or Kokiri_Sword)",
        "Wasteland GS": "can_use(Hookshot) or can_use(Boomerang)",
        "Fairy Pot": "has_bottle",
        "Nut Pot": "True"
    },
    "exits": {
        "Wasteland Near Colossus": "logic_lens_wasteland or can_use(Lens_of_Truth)",
        "Wasteland Near Fortress": "
            logic_wasteland_crossing or can_use(Hover_Boots) or can_use(Longshot)"
    }
},
{
    "region_name": "Wasteland Near Colossus",
    "scene": "Haunted Wasteland",
    "exits": {
        "Desert Colossus": "True",
        "Haunted Wasteland": "logic_reverse_wasteland"
    }
},
{
    "region_name": "Desert Colossus",
    "scene": "Desert Colossus",
    "time_passes": true,
    "locations": {
        "Colossus Freestanding PoH": "is_adult and here(can_plant_bean)",
        "Colossus GS Bean Patch": "can_plant_bugs and can_child_attack",
        "Colossus GS Tree": "can_use(Hookshot) and at_night",
        "Colossus GS Hill": "
            is_adult and at_night and
                (here(can_plant_bean) or can_use(Longshot) or
                    (logic_colossus_gs and can_use(Hookshot)))",
        "Colossus Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Fairy Pond": "can_play(Song_of_Storms) and has_bottle",
        "Bug Rock": "has_bottle"
    },
    "exits": {
        "Colossus Great Fairy Fountain": "has_explosives",
        "Spirit Temple Lobby": "True",
        "Wasteland Near Colossus": "True",
        "Colossus Grotto": "can_use(Silver_Gauntlets)"
    }
},
{
    "region_name": "Desert Colossus From Spirit Lobby",
    "scene": "Desert Colossus",
    "locations": {
        "Sheik at Colossus": "True"
    },
    "exits": {
        "Desert Colossus": "True"
    }
},
{
    "region_name": "Colossus Great Fairy Fountain",
    "scene": "Colossus Great Fairy Fountain",
    "locations": {
        "Colossus Great Fairy Reward": "can_play(Zeldas_Lullaby)"
    },
    "exits": {
        "Desert Colossus": "True"
    }
},
{
    "region_name": "Market Entrance",
    "scene": "Market Entrance",
    "exits": {
        "Hyrule Field": "is_adult or at_day",
        "Market": "True",
        "Market Guard House": "True"
    }
},
{
    "region_name": "Market",
    "scene": "Market",
    "exits": {
        "Market Entrance": "True",
        "ToT Entrance": "True",
        "Castle Grounds": "True",
        "Market Bazaar": "is_child and at_day",
        "Market Mask Shop": "is_child and at_day",
        "Market Shooting Gallery": "is_child and at_day",
        "Market Bombchu Bowling": "is_child",
        "Market Potion Shop": "is_child and at_day",
        "Market Treasure Chest Game": "is_child and at_night",
        "Market Back Alley": "is_child"
    }
},
{
    "region_name": "Market Back Alley",
    "scene": "Market",
    "exits": {
        "Market": "True",
        "Market Bombchu Shop": "at_night",
        "Market Dog Lady House": "True",
        "Market Man in Green House": "at_night"
    }
},
{
    "region_name": "ToT Entrance",
    "scene": "ToT Entrance",
    "locations": {
        "ToT Gossip Stone (Left)": "True",
        "ToT Gossip Stone (Left-Center)": "True",
        "ToT Gossip Stone (Right)": "True",
        "ToT Gossip Stone (Right-Center)": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy_without_suns and has_bottle"
    },
    "exits": {
        "Market": "True",
        "Temple of Time": "True"
    }
},
{
    "region_name": "Temple of Time",
    "scene": "Temple of Time",
    "locations": {
        "ToT Light Arrows Cutscene": "is_adult and can_trigger_lacs"
    },
    "exits": {
        "ToT Entrance": "True",
        "Beyond Door of Time": "can_play(Song_of_Time) or open_door_of_time"
    }
},
{
    "region_name": "Beyond Door of Time",
    "scene": "Temple of Time",
    "locations": {
        "Master Sword Pedestal": "True",
        "Sheik at Temple": "Forest_Medallion and is_adult"
    },
    "exits": {
        "Temple of Time": "True"
    }
},
{
    "region_name": "Castle Grounds",
    "scene": "Castle Grounds",
    "exits": {
        "Market": "is_child or at_dampe_time",
        "Hyrule Castle Grounds": "is_child",
        "Ganons Castle Grounds": "is_adult"
    }
},
{
    "region_name": "Hyrule Castle Grounds",
    "scene": "Castle Grounds",
    "time_passes": true,
    "locations": {
        "HC Malon Egg": "True",
        "HC GS Tree": "can_child_attack",
        "HC Malon Gossip Stone": "True",
        "HC Rock Wall Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Rock": "has_bottle"
    },
    "exits": {
        "Castle Grounds": "True",
        "HC Garden": "Weird_Egg or skip_child_zelda or (not shuffle_weird_egg)",
        "HC Great Fairy Fountain": "has_explosives",
        "HC Storms Grotto": "can_open_storm_grotto"
    }
},
{
    "region_name": "HC Garden",
    "scene": "Castle Grounds",
    "exits": {
        "HC Garden Locations": "True",
        "Hyrule Castle Grounds": "True"
    }
},
{
    # Directly reachable from Root in "Free Zelda"
    "region_name": "HC Garden Locations",
    "scene": "Castle Grounds",
    "locations": {
        "HC Zeldas Letter": "True",
        "Song from Impa": "True"
    }
},
{
    "region_name": "HC Great Fairy Fountain",
    "scene": "HC Great Fairy Fountain",
    "locations": {
        "HC Great Fairy Reward": "can_play(Zeldas_Lullaby)"
    },
    "exits": {
        "Castle Grounds": "True"
    }
},
{
    "region_name": "Ganons Castle Grounds",
    "scene": "Castle Grounds",
    "locations": {
        "OGC GS": "True"
    },
    "exits": {
        "Castle Grounds": "True",
        "OGC Great Fairy Fountain": "can_use(Golden_Gauntlets) and at_dampe_time",
        "Ganons Castle Lobby": "can_build_rainbow_bridge and at_dampe_time"
    }
},
{
    "region_name": "OGC Great Fairy Fountain",
    "scene": "OGC Great Fairy Fountain",
    "locations": {
        "OGC Great Fairy Reward": "can_play(Zeldas_Lullaby)"
    },
    "exits": {
        "Castle Grounds": "True"
    }
},
{
    "region_name": "Market Guard House",
    "scene": "Market Guard House",
    "events": {
        "Sell Big Poe": "is_adult and Bottle_with_Big_Poe"
    },
    "locations": {
        "Market 10 Big Poes": "
            is_adult and 
            (Big_Poe or (Bottle_with_Big_Poe, big_poe_count))",
        "Market GS Guard House": "is_child"
    },
    "exits": {
        "Market Entrance": "True"
    }
},
{
    "region_name": "Market Bazaar",
    "scene": "Market Bazaar",
    "locations": {
        "Market Bazaar Item 1": "True",
        "Market Bazaar Item 2": "True",
        "Market Bazaar Item 3": "True",
        "Market Bazaar Item 4": "True",
        "Market Bazaar Item 5": "True",
        "Market Bazaar Item 6": "True",
        "Market Bazaar Item 7": "True",
        "Market Bazaar Item 8": "True"
    },
    "exits": {
        "Market": "True"
    }
},
{
    "region_name": "Market Mask Shop",
    "scene": "Market Mask Shop",
    "events": {
        "Skull Mask": "Zeldas_Letter and (complete_mask_quest or at('Kakariko Village', is_child))",
        "Mask of Truth": "'Skull Mask' and
            (complete_mask_quest or
            (at('Lost Woods', is_child and can_play(Sarias_Song)) and
             at('Graveyard', is_child and at_day) and
             at('Hyrule Field', is_child and has_all_stones)))"
    },
    "exits": {
        "Market": "True"
    }
},
{
    "region_name": "Market Shooting Gallery",
    "scene": "Market Shooting Gallery",
    "locations": {
        "Market Shooting Gallery Reward": "is_child"
    },
    "exits": {
        "Market": "True"
    }
},
{
    "region_name": "Market Bombchu Bowling",
    "scene": "Market Bombchu Bowling",
    "locations": {
        "Market Bombchu Bowling First Prize": "found_bombchus",
        "Market Bombchu Bowling Second Prize": "found_bombchus",
        "Market Bombchu Bowling Bombchus": "found_bombchus"
    },
    "exits": {
        "Market": "True"
    }
},
{
    "region_name": "Market Potion Shop",
    "scene": "Market Potion Shop",
    "locations": {
        "Market Potion Shop Item 1": "True",
        "Market Potion Shop Item 2": "True",
        "Market Potion Shop Item 3": "True",
        "Market Potion Shop Item 4": "True",
        "Market Potion Shop Item 5": "True",
        "Market Potion Shop Item 6": "True",
        "Market Potion Shop Item 7": "True",
        "Market Potion Shop Item 8": "True"
    },
    "exits": {
        "Market": "True"
    }
},
{
    "region_name": "Market Treasure Chest Game",
    "scene": "Market Treasure Chest Game",
    "locations": {
        "Market Treasure Chest Game Reward": "can_use(Lens_of_Truth)"
    },
    "exits": {
        "Market": "True"
    }
},
{
    "region_name": "Market Bombchu Shop",
    "scene": "Market Bombchu Shop",
    "locations": {
        "Market Bombchu Shop Item 1": "True",
        "Market Bombchu Shop Item 2": "True",
        "Market Bombchu Shop Item 3": "True",
        "Market Bombchu Shop Item 4": "True",
        "Market Bombchu Shop Item 5": "True",
        "Market Bombchu Shop Item 6": "True",
        "Market Bombchu Shop Item 7": "True",
        "Market Bombchu Shop Item 8": "True"
    },
    "exits": {
        "Market Back Alley": "True"
    }
},
{
    "region_name": "Market Dog Lady House",
    "scene": "Market Dog Lady House",
    "locations": {
        "Market Lost Dog": "is_child and at_night"
    },
    "exits": {
        "Market Back Alley": "True"
    }
},
{
    "region_name": "Market Man in Green House",
    "scene": "Market Man in Green House",
    "exits": {
        "Market Back Alley": "True"
    }
},
{
    "region_name": "Kakariko Village",
    "scene": "Kakariko Village",
    "events": {
        "Cojiro Access": "is_adult and 'Wake Up Adult Talon'",
        "Kakariko Village Gate Open": "is_child and (Zeldas_Letter or open_kakariko == 'open')"
    },
    "locations": {
        "Sheik in Kakariko": "
            is_adult and Forest_Medallion and Fire_Medallion and Water_Medallion",
        "Kak Anju as Adult": "is_adult and at_day",
        "Kak Anju as Child": "is_child and at_day",
        "Kak GS House Under Construction": "is_child and at_night",
        "Kak GS Skulltula House": "is_child and at_night",
        "Kak GS Guards House": "is_child and at_night",
        "Kak GS Tree": "is_child and at_night",
        "Kak GS Watchtower": "
            is_child and (Slingshot or has_bombchus or 
                (logic_kakariko_tower_gs and (Sticks or Kokiri_Sword) and
                can_take_damage)) and at_night",
        "Bug Rock": "has_bottle"
    },
    "exits": {
        "Hyrule Field": "True",
        "Kak Carpenter Boss House": "True",
        "Kak House of Skulltula": "True",
        "Kak Impas House": "True",
        "Kak Windmill": "True",
        "Kak Bazaar": "is_adult and at_day",
        "Kak Shooting Gallery": "is_adult and at_day",
        "Bottom of the Well": "
            'Drain Well' and (is_child or shuffle_dungeon_entrances)",
        "Kak Potion Shop Front": "is_child or at_day",
        "Kak Redead Grotto": "can_open_bomb_grotto",
        "Kak Impas Ledge": "
            (is_child and at_day) or (is_adult and logic_visible_collisions)",
        "Kak Impas Rooftop": "
            can_use(Hookshot) or (logic_kakariko_rooftop_gs and can_use(Hover_Boots))",
        "Kak Odd Medicine Rooftop": "
            can_use(Hookshot) or 
            (logic_man_on_roof and 
                (is_adult or at_day or Slingshot or has_bombchus or 
                    (logic_kakariko_tower_gs and (Sticks or Kokiri_Sword) and can_take_damage)))",
        "Kak Backyard": "is_adult or at_day",
        "Graveyard": "True",
        "Kak Behind Gate": "is_adult or 'Kakariko Village Gate Open'"
    }
},
{
    "region_name": "Kak Impas Ledge",
    "scene": "Kakariko Village",
    "exits": {
        "Kak Impas House Back": "True",
        "Kakariko Village": "True"
    }
},
{
    "region_name": "Kak Impas Rooftop",
    "scene": "Kakariko Village",
    "locations": {
        "Kak GS Above Impas House": "is_adult and at_night"
    },
    "exits": {
        "Kak Impas Ledge": "True",
        "Kakariko Village": "True"
    }
},
{
    "region_name": "Kak Odd Medicine Rooftop",
    "scene": "Kakariko Village",
    "locations": {
        "Kak Man on Roof": "True"
    },
    "exits": {
        "Kakariko Village": "True",
        "Kak Backyard": "True"
    }
},
{
    "region_name": "Kak Backyard",
    "scene": "Kakariko Village",
    "exits": {
        "Kakariko Village": "True",
        "Kak Open Grotto": "True",
        "Kak Odd Medicine Building": "is_adult",
        "Kak Potion Shop Back": "is_adult and at_day"
    }
},
{
    "region_name": "Kak Carpenter Boss House",
    "scene": "Kak Carpenter Boss House",
    "events": {
        "Wake Up Adult Talon": "is_adult and (Pocket_Egg or Pocket_Cucco)"
    },
    "exits": {
        "Kakariko Village": "True"
    }
},
{
    "region_name": "Kak House of Skulltula",
    "scene": "Kak House of Skulltula",
    "locations": {
        "Kak 10 Gold Skulltula Reward": "(Gold_Skulltula_Token, 10)",
        "Kak 20 Gold Skulltula Reward": "(Gold_Skulltula_Token, 20)",
        "Kak 30 Gold Skulltula Reward": "(Gold_Skulltula_Token, 30)",
        "Kak 40 Gold Skulltula Reward": "(Gold_Skulltula_Token, 40)",
        "Kak 50 Gold Skulltula Reward": "(Gold_Skulltula_Token, 50)"
    },
    "exits": {
        "Kakariko Village": "True"
    }
},
{
    "region_name": "Kak Impas House",
    "scene": "Kak Impas House",
    "exits": {
        "Kakariko Village": "True",
        "Kak Impas House Near Cow": "True"
    }
},
{
    "region_name": "Kak Impas House Back",
    "scene": "Kak Impas House",
    "locations": {
        "Kak Impas House Freestanding PoH": "True"
    },
    "exits": {
        "Kak Impas Ledge": "True",
        "Kak Impas House Near Cow": "True"
    }
},
{
    "region_name": "Kak Impas House Near Cow",
    "locations": {
        "Kak Impas House Cow": "can_play(Eponas_Song)"
    }
},
{
    "region_name": "Kak Windmill",
    "scene": "Windmill and Dampes Grave",
    "events": {
        "Drain Well": "is_child and can_play(Song_of_Storms)"
    },
    "locations": {
        "Kak Windmill Freestanding PoH": "
            can_use(Boomerang) or
            (logic_windmill_poh and is_adult) or 'Dampes Windmill Access'",
        "Song from Windmill": "is_adult and Ocarina"
    },
    "exits": {
        "Kakariko Village": "True"
    }
},
{
    "region_name": "Kak Bazaar",
    "scene": "Kak Bazaar",
    "locations": {
        "Kak Bazaar Item 1": "True",
        "Kak Bazaar Item 2": "True",
        "Kak Bazaar Item 3": "True",
        "Kak Bazaar Item 4": "True",
        "Kak Bazaar Item 5": "True",
        "Kak Bazaar Item 6": "True",
        "Kak Bazaar Item 7": "True",
        "Kak Bazaar Item 8": "True"
    },
    "exits": {
        "Kakariko Village": "True"
    }
},
{
    "region_name": "Kak Shooting Gallery",
    "scene": "Kak Shooting Gallery",
    "locations": {
        "Kak Shooting Gallery Reward": "is_adult and Bow"
    },
    "exits": {
        "Kakariko Village": "True"
    }
},
{
    "region_name": "Kak Potion Shop Front",
    "scene": "Kak Potion Shop Front",
    "locations": {
        "Kak Potion Shop Item 1": "is_adult",
        "Kak Potion Shop Item 2": "is_adult",
        "Kak Potion Shop Item 3": "is_adult",
        "Kak Potion Shop Item 4": "is_adult",
        "Kak Potion Shop Item 5": "is_adult",
        "Kak Potion Shop Item 6": "is_adult",
        "Kak Potion Shop Item 7": "is_adult",
        "Kak Potion Shop Item 8": "is_adult"
    },
    "exits": {
        "Kakariko Village": "True",
        "Kak Potion Shop Back": "is_adult"
    }
},
{
    "region_name": "Kak Potion Shop Back",
    "scene": "Kak Potion Shop Back",
    "exits": {
        "Kak Backyard": "is_adult",
        "Kak Potion Shop Front": "True"
    }
},
{
    "region_name": "Kak Odd Medicine Building",
    "scene": "Kak Odd Medicine Building",
    "events": {
        "Odd Potion Access": "
            is_adult and
            ('Odd Mushroom Access' or (Odd_Mushroom and disable_trade_revert))"
    },
    "exits": {
        "Kak Backyard": "True"
    }
},
{
    "region_name": "Graveyard",
    "scene": "Graveyard",
    "locations": {
        "Graveyard Freestanding PoH": "
            (is_adult and (here(can_plant_bean) or can_use(Longshot))) or
            (logic_graveyard_poh and can_use(Boomerang))",
        "Graveyard Dampe Gravedigging Tour": "is_child and at_dampe_time",
        "Graveyard GS Wall": "can_use(Boomerang) and at_night",
        "Graveyard GS Bean Patch": "can_plant_bugs and can_child_attack",
        "Butterfly Fairy": "can_use(Sticks) and at_day and has_bottle",
        "Bean Plant Fairy": "can_plant_bean and can_play(Song_of_Storms) and has_bottle",
        "Bug Rock": "has_bottle"
    },
    "exits": {
        "Graveyard Shield Grave": "is_adult or at_night",
        "Graveyard Composers Grave": "can_play(Zeldas_Lullaby)",
        "Graveyard Heart Piece Grave": "is_adult or at_night",
        "Graveyard Dampes Grave": "is_adult",
        "Graveyard Dampes House": "is_adult or at_dampe_time",
        "Kakariko Village": "True"
    }
},
{
    "region_name": "Graveyard Shield Grave",
    "scene": "Graveyard Shield Grave",
    "locations": {
        "Graveyard Shield Grave Chest": "True",
        "Free Fairies": "can_blast_or_smash and has_bottle"
    },
    "exits": {
        "Graveyard": "True"
    }
},
{
    "region_name": "Graveyard Heart Piece Grave",
    "scene": "Graveyard Heart Piece Grave",
    "locations": {
        "Graveyard Heart Piece Grave Chest": "can_play(Suns_Song)"
    },
    "exits": {
        "Graveyard": "True"
    }
},
{
    "region_name": "Graveyard Composers Grave",
    "scene": "Graveyard Composers Grave",
    "locations": {
        "Graveyard Composers Grave Chest": "has_fire_source",
        "Song from Composers Grave": "
            is_adult or 
            (Slingshot or Boomerang or Sticks or 
                has_explosives or Kokiri_Sword)"
    },
    "exits": {
        "Graveyard": "True"
    }
},
{
    "region_name": "Graveyard Dampes Grave",
    "scene": "Windmill and Dampes Grave",
    "events": {
        "Dampes Windmill Access": "is_adult and can_play(Song_of_Time)"
    },
    "locations": {
        "Graveyard Hookshot Chest": "True",
        "Graveyard Dampe Race Freestanding PoH": "is_adult or logic_child_dampe_race_poh",
        "Nut Pot": "True"
    },
    "exits": {
        "Graveyard": "True",
        "Kak Windmill": "is_adult and can_play(Song_of_Time)"
    }
},
{
    "region_name": "Graveyard Dampes House",
    "scene": "Graveyard Dampes House",
    "exits": {
        "Graveyard": "True"
    }
},
{
    "region_name": "Graveyard Warp Pad Region",
    "scene": "Graveyard",
    "locations": {
        "Graveyard Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy_without_suns and has_bottle"
    },
    "exits": {
        "Graveyard": "True",
        "Shadow Temple Entryway": "
            can_use(Dins_Fire) or
            (logic_shadow_fire_arrow_entry and can_use(Fire_Arrows))"
    }
},
{
    "region_name": "Kak Behind Gate",
    "scene": "Kakariko Village",
    "exits": {
        "Kakariko Village": "
            is_adult or logic_visible_collisions or 'Kakariko Village Gate Open' or open_kakariko == 'open'",
        "Death Mountain": "True"
    }
},
{
    "region_name": "Death Mountain",
    "scene": "Death Mountain",
    "time_passes": true,
    "locations": {
        "DMT Chest": "
            can_blast_or_smash or 
            (logic_dmt_bombable and is_child and Progressive_Strength_Upgrade)",
        "DMT Freestanding PoH": "
            can_take_damage or can_use(Hover_Boots) or
            (is_adult and here(can_plant_bean and (has_explosives or Progressive_Strength_Upgrade)))",
        "DMT GS Bean Patch": "
            can_plant_bugs and can_child_attack and
                (has_explosives or Progressive_Strength_Upgrade or
                (logic_dmt_soil_gs and can_use(Boomerang)))",
        "DMT GS Near Kak": "can_blast_or_smash",
        "DMT GS Above Dodongos Cavern": "
            is_adult and at_night and
            (can_use(Megaton_Hammer) or
                (logic_trail_gs_lower_hookshot and can_use(Hookshot)) or
                (logic_trail_gs_lower_hovers and can_use(Hover_Boots)) or
                (logic_trail_gs_lower_bean and here(can_plant_bean and (has_explosives or Progressive_Strength_Upgrade))))",
        "Bean Plant Fairy": "
            can_plant_bean and can_play(Song_of_Storms) and has_bottle and
            (has_explosives or Progressive_Strength_Upgrade)"
    },
    "exits": {
        "Kak Behind Gate": "True",
        "Goron City": "True",
        "Death Mountain Summit": "
            here(can_blast_or_smash) or
                (is_adult and here(can_plant_bean and Progressive_Strength_Upgrade)) or
                (logic_dmt_climb_hovers and can_use(Hover_Boots))",
        "Dodongos Cavern Beginning": "
            has_explosives or Progressive_Strength_Upgrade or is_adult",
        "DMT Storms Grotto": "can_open_storm_grotto"
    }
},
{
    "region_name": "Death Mountain Summit",
    "scene": "Death Mountain",
    "time_passes": true,
    "events": {
        "Prescription Access": "is_adult and ('Broken Sword Access' or Broken_Sword)"
    },
    "locations": {
        "DMT Biggoron": "
            is_adult and 
            (Claim_Check or 
                (guarantee_trade_path and 
                ('Eyedrops Access' or (Eyedrops and disable_trade_revert))))",
        "DMT GS Falling Rocks Path": "
            is_adult and (can_use(Megaton_Hammer) or logic_trail_gs_upper) and at_night",
        "DMT Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Bug Rock": "is_child and has_bottle"
    },
    "exits": {
        "Death Mountain": "True",
        "DMC Upper Local": "True",
        "DMT Owl Flight": "is_child",
        "DMT Cow Grotto": "here(can_blast_or_smash)",
        "DMT Great Fairy Fountain": "here(can_blast_or_smash)"
    }
},
{
    "region_name": "DMT Owl Flight",
    "scene": "Death Mountain",
    "exits": {
        "Kak Impas Rooftop": "True"
    }
},
{
    "region_name": "Goron City",
    "scene": "Goron City",
    "events": {
        "Goron City Child Fire": "is_child and can_use(Dins_Fire)",
        "GC Woods Warp Open": "
            can_blast_or_smash or can_use(Dins_Fire) or can_use(Bow) or 
            Progressive_Strength_Upgrade or 'Goron City Child Fire'",
        "Stop GC Rolling Goron as Adult": "
            is_adult and 
            (Progressive_Strength_Upgrade or has_explosives or Bow or
                (logic_link_goron_dins and can_use(Dins_Fire)))"
    },
    "locations": {
        "GC Maze Left Chest": "
            can_use(Megaton_Hammer) or can_use(Silver_Gauntlets) or
            (logic_goron_city_leftmost and has_explosives and can_use(Hover_Boots))",
        "GC Maze Center Chest": "
            can_blast_or_smash or can_use(Silver_Gauntlets)",
        "GC Maze Right Chest": "
            can_blast_or_smash or can_use(Silver_Gauntlets)",
        "GC Pot Freestanding PoH": "
            is_child and 'Goron City Child Fire' and
            (Bombs or (Progressive_Strength_Upgrade and logic_goron_city_pot_with_strength) or (has_bombchus and logic_goron_city_pot))",
        "GC Rolling Goron as Child": "
            is_child and 
            (has_explosives or (Progressive_Strength_Upgrade and logic_child_rolling_with_strength))",
        "GC Medigoron": "
            is_adult and Progressive_Wallet and 
            (can_blast_or_smash or Progressive_Strength_Upgrade)",
        "GC Rolling Goron as Adult": "'Stop GC Rolling Goron as Adult'",
        "GC GS Boulder Maze": "is_child and has_explosives",
        "GC GS Center Platform": "is_adult",
        "GC Maze Gossip Stone": "
            can_blast_or_smash or can_use(Silver_Gauntlets)",
        "GC Medigoron Gossip Stone": "
            can_blast_or_smash or Progressive_Strength_Upgrade",
        "Gossip Stone Fairy": "
            can_summon_gossip_fairy_without_suns and has_bottle and
            (can_blast_or_smash or Progressive_Strength_Upgrade)",
        "Bug Rock": "(can_blast_or_smash or can_use(Silver_Gauntlets)) and has_bottle",
        "Stick Pot": "is_child"
    },
    "exits": {
        "Death Mountain": "True",
        "GC Woods Warp": "'GC Woods Warp Open'",
        "GC Shop": "
            (is_adult and 'Stop GC Rolling Goron as Adult') or 
            (is_child and (has_explosives or Progressive_Strength_Upgrade or 'Goron City Child Fire'))",
        "GC Darunias Chamber": "
            (is_adult and 'Stop GC Rolling Goron as Adult') or
            (is_child and can_play(Zeldas_Lullaby))",
        "GC Grotto Platform": "
            is_adult and 
            ((can_play(Song_of_Time) and 
                    ((damage_multiplier != 'ohko' and damage_multiplier != 'quadruple') or 
                        can_use(Goron_Tunic) or can_use(Longshot) or can_use(Nayrus_Love))) or 
                (can_use(Hookshot) and
                    ((damage_multiplier != 'ohko' and can_use(Goron_Tunic)) or
                        can_use(Nayrus_Love) or
                        (damage_multiplier != 'ohko' and damage_multiplier != 'quadruple' and logic_goron_grotto))))"
    }
},
{
    "region_name": "GC Woods Warp",
    "scene": "Goron City",
    "events": {
        "GC Woods Warp Open": "can_blast_or_smash or can_use(Dins_Fire)"
    },
    "exits": {
        "Goron City": "can_leave_forest and 'GC Woods Warp Open'",
        "Lost Woods": "True"
    }
},
{
    "region_name": "GC Darunias Chamber",
    "scene": "Goron City",
    "events": {
        "Goron City Child Fire": "can_use(Sticks)"
    },
    "locations": {
        "GC Darunias Joy": "is_child and can_play(Sarias_Song)"
    },
    "exits": {
        "Goron City": "True",
        "DMC Lower Local": "is_adult"
    }
},
{
    "region_name": "GC Grotto Platform",
    "scene": "Goron City",
    "exits": {
        "GC Grotto": "True",
        "Goron City": "
            (damage_multiplier != 'ohko' and damage_multiplier != 'quadruple') or 
            can_use(Goron_Tunic) or can_use(Nayrus_Love) or 
            (can_play(Song_of_Time) and can_use(Longshot))"
    }
},
{
    "region_name": "GC Shop",
    "scene": "GC Shop",
    "locations": {
        "GC Shop Item 1": "True",
        "GC Shop Item 2": "True",
        "GC Shop Item 3": "True",
        "GC Shop Item 4": "True",
        "GC Shop Item 5": "True",
        "GC Shop Item 6": "True",
        "GC Shop Item 7": "True",
        "GC Shop Item 8": "True"
    },
    "exits": {
        "Goron City": "True"
    }
},
{
    "region_name": "DMC Upper Nearby",
    "scene": "Death Mountain Crater",
    "exits": {
        "DMC Upper Local": "can_use(Goron_Tunic)",
        "Death Mountain Summit": "True",
        "DMC Upper Grotto": "here(can_blast_or_smash)"
    }
},
{
    "region_name": "DMC Upper Local",
    "scene": "Death Mountain Crater",
    "locations": {
        "DMC Wall Freestanding PoH": "True",
        "DMC GS Crate": "is_child and can_child_attack",
        "DMC Gossip Stone": "has_explosives",
        "Gossip Stone Fairy": "
            has_explosives and can_summon_gossip_fairy_without_suns and has_bottle"
    },
    "exits": {
        "DMC Upper Nearby": "True",
        "DMC Ladder Area Nearby": "True",
        "DMC Central Nearby": "
            can_use(Goron_Tunic) and can_use(Longshot) and 
            ((damage_multiplier != 'ohko' and damage_multiplier != 'quadruple') or 
                (Fairy and not entrance_shuffle) or can_use(Nayrus_Love))"
    }
},
{
    "region_name": "DMC Ladder Area Nearby",
    "scene": "Death Mountain Crater",
    "locations": {
        "DMC Deku Scrub": "is_child and can_stun_deku"
    },
    "exits": {
        "DMC Upper Nearby": "is_adult",
        "DMC Lower Nearby": "
            can_use(Hover_Boots) or
            (logic_crater_upper_to_lower and can_use(Megaton_Hammer))"
    }
},
{
    "region_name": "DMC Lower Nearby",
    "scene": "Death Mountain Crater",
    "exits": {
        "DMC Lower Local": "can_use(Goron_Tunic)",
        "GC Darunias Chamber": "True",
        "DMC Great Fairy Fountain": "can_use(Megaton_Hammer)",
        "DMC Hammer Grotto": "can_use(Megaton_Hammer)"
    }
},
{
    "region_name": "DMC Lower Local",
    "scene": "Death Mountain Crater",
    "exits": {
        "DMC Lower Nearby": "True",
        "DMC Ladder Area Nearby": "True",
        "DMC Central Nearby": "can_use(Hover_Boots) or can_use(Hookshot)",
        "DMC Fire Temple Entrance": "
            (can_use(Hover_Boots) or can_use(Hookshot)) and
            (logic_fewer_tunic_requirements or can_use(Goron_Tunic))"
    }
},
{
    "region_name": "DMC Central Nearby",
    "scene": "Death Mountain Crater",
    "locations": {
        "DMC Volcano Freestanding PoH": "
            is_adult and
            (here(can_plant_bean) or 
                (logic_crater_bean_poh_with_hovers and Hover_Boots))",
        "Sheik in Crater": "is_adult"
    },
    "exits": {
        "DMC Central Local": "can_use(Goron_Tunic)"
    }
},
{
    "region_name": "DMC Central Local",
    "scene": "Death Mountain Crater",
    "locations": {
        "DMC GS Bean Patch": "can_plant_bugs and can_child_attack",
        "Bean Plant Fairy": "can_plant_bean and can_play(Song_of_Storms) and has_bottle"
    },
    "exits": {
        "DMC Central Nearby": "True",
        "DMC Lower Nearby": "
            is_adult and
            (can_use(Hover_Boots) or can_use(Hookshot) or here(can_plant_bean))",
        "DMC Upper Nearby": "is_adult and here(can_plant_bean)",
        "DMC Fire Temple Entrance": "
            (is_child and shuffle_dungeon_entrances) or
            (is_adult and (logic_fewer_tunic_requirements or can_use(Goron_Tunic)))"
    }
},
{
    "region_name": "DMC Fire Temple Entrance",
    "scene": "Death Mountain Crater",
    "exits": {
        "Fire Temple Lower": "True",
        "DMC Central Nearby": "can_use(Goron_Tunic)"
    }
},
{
    "region_name": "DMC Great Fairy Fountain",
    "scene": "DMC Great Fairy Fountain",
    "locations": {
        "DMC Great Fairy Reward": "can_play(Zeldas_Lullaby)"
    },
    "exits": {
        "DMC Lower Local": "True"
    }
},
{
    "region_name": "DMT Great Fairy Fountain",
    "scene": "DMT Great Fairy Fountain",
    "locations": {
        "DMT Great Fairy Reward": "can_play(Zeldas_Lullaby)"
    },
    "exits": {
        "Death Mountain Summit": "True"
    }
},
{
    "region_name": "ZR Front",
    "scene": "Zora River",
    "time_passes": true,
    "locations": {
        "ZR GS Tree": "is_child and can_child_attack"
    },
    "exits": {
        "Zora River": "is_adult or has_explosives",
        "Hyrule Field": "True"
    }
},
{
    "region_name": "Zora River",
    "scene": "Zora River",
    "time_passes": true,
    "locations": {
        "ZR Magic Bean Salesman": "is_child",
        "ZR Frogs Ocarina Game": "
            is_child and can_play(Zeldas_Lullaby) and can_play(Sarias_Song) and 
            can_play(Suns_Song) and can_play(Eponas_Song) and 
            can_play(Song_of_Time) and can_play(Song_of_Storms)",
        "ZR Frogs in the Rain": "is_child and can_play(Song_of_Storms)",
        "ZR Near Open Grotto Freestanding PoH": "
            is_child or can_use(Hover_Boots) or (is_adult and logic_zora_river_lower)",
        "ZR Near Domain Freestanding PoH": "
            is_child or can_use(Hover_Boots) or (is_adult and logic_zora_river_upper)",
        "ZR GS Ladder": "is_child and at_night and can_child_attack",
        "ZR GS Near Raised Grottos": "can_use(Hookshot) and at_night",
        "ZR GS Above Bridge": "can_use(Hookshot) and at_night",
        "ZR Near Grottos Gossip Stone": "True",
        "ZR Near Domain Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Bean Plant Fairy": "can_plant_bean and can_play(Song_of_Storms) and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "
            (is_child or can_use(Hover_Boots) or (is_adult and logic_zora_river_lower)) and
            can_cut_shrubs and has_bottle"
    },
    "exits": {
        "ZR Front": "True",
        "ZR Open Grotto": "True",
        "ZR Fairy Grotto": "here(can_blast_or_smash)",
        "Lost Woods": "can_dive or can_use(Iron_Boots)",
        "ZR Storms Grotto": "can_open_storm_grotto",
        "ZR Behind Waterfall": "
            can_play(Zeldas_Lullaby) or
            (can_use(Hover_Boots) and logic_zora_with_hovers) or
            (is_child and logic_zora_with_cucco)"
    }
},
{
    "region_name": "ZR Behind Waterfall",
    "scene": "Zora River",
    "exits": {
        "Zora River": "True",
        "Zoras Domain": "True"
    }
},
{
    "region_name": "ZR Top of Waterfall",
    "scene": "Zora River",
    "exits": {
        "Zora River": "True"
    }
},
{
    "region_name": "Zoras Domain",
    "scene": "Zoras Domain",
    "events": {
        "King Zora Thawed": "is_adult and Blue_Fire",
        "Eyeball Frog Access": "
            is_adult and 'King Zora Thawed' and 
            (Eyedrops or Eyeball_Frog or Prescription or 'Prescription Access')"
    },
    "locations": {
        "ZD Diving Minigame": "is_child",
        "ZD Chest": "can_use(Sticks)",
        "Deliver Rutos Letter": "
            is_child and Rutos_Letter and zora_fountain != 'open'",
        "ZD King Zora Thawed": "'King Zora Thawed'",
        "ZD GS Frozen Waterfall": "
            is_adult and at_night and
            (Progressive_Hookshot or Bow or Magic_Meter or logic_domain_gs)",
        "ZD Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy_without_suns and has_bottle",
        "Fish Group": "is_child and has_bottle",
        "Stick Pot": "is_child",
        "Nut Pot": "True"
    },
    "exits": {
        "ZR Behind Waterfall": "True",
        "Lake Hylia": "is_child and can_dive",
        "ZD Behind King Zora": "
            Deliver_Letter or zora_fountain == 'open' or
            (zora_fountain == 'adult' and is_adult)",
        "ZD Shop": "is_child or Blue_Fire",
        "ZD Storms Grotto": "can_open_storm_grotto"
    }
},
{
    "region_name": "ZD Behind King Zora",
    "scene": "Zoras Domain",
    "exits": {
        "Zoras Domain": "
            Deliver_Letter or zora_fountain == 'open' or
            (zora_fountain == 'adult' and is_adult)",
        "Zoras Fountain": "True"
    }
},
{
    "region_name": "ZD Eyeball Frog Timeout",
    "scene": "Zoras Domain",
    "exits": {
        "Zoras Domain": "True"
    }
},
{
    "region_name": "Zoras Fountain",
    "scene": "Zoras Fountain",
    "locations": {
        "ZF Iceberg Freestanding PoH": "is_adult",
        "ZF Bottom Freestanding PoH": "
            is_adult and Iron_Boots and (logic_fewer_tunic_requirements or can_use(Zora_Tunic))",
        "ZF GS Tree": "is_child",
        "ZF GS Above the Log": "can_use(Boomerang) and at_night",
        "ZF GS Hidden Cave": "
            can_use(Silver_Gauntlets) and can_blast_or_smash and 
            can_use(Hookshot) and at_night",
        "ZF Fairy Gossip Stone": "True",
        "ZF Jabu Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy_without_suns and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and at_day and has_bottle"
    },
    "exits": {
        "ZD Behind King Zora": "True",
        "Jabu Jabus Belly Beginning": "is_child and Fish",
        "ZF Ice Ledge": "is_adult",
        "ZF Great Fairy Fountain": "has_explosives"
    }
},
{
    "region_name": "ZF Ice Ledge",
    "scene": "Zoras Fountain",
    "exits": {
        "Zoras Fountain": "True",
        "Ice Cavern Beginning": "True"
    }
},
{
    "region_name": "ZD Shop",
    "scene": "ZD Shop",
    "locations": {
        "ZD Shop Item 1": "True",
        "ZD Shop Item 2": "True",
        "ZD Shop Item 3": "True",
        "ZD Shop Item 4": "True",
        "ZD Shop Item 5": "True",
        "ZD Shop Item 6": "True",
        "ZD Shop Item 7": "True",
        "ZD Shop Item 8": "True"
    },
    "exits": {
        "Zoras Domain": "True"
    }
},
{
    "region_name": "ZF Great Fairy Fountain",
    "scene": "ZF Great Fairy Fountain",
    "locations": {
        "ZF Great Fairy Reward": "can_play(Zeldas_Lullaby)"
    },
    "exits": {
        "Zoras Fountain": "True"
    }
},
{
    "region_name": "Lon Lon Ranch",
    "scene": "Lon Lon Ranch",
    "events": {
        "Epona": "can_play(Eponas_Song) and is_adult and at_day",
        "Links Cow": "can_play(Eponas_Song) and is_adult and at_day"
    },
    "locations": {
        "Song from Malon": "is_child and Zeldas_Letter and Ocarina and at_day",
        "LLR GS Tree": "is_child",
        "LLR GS Rain Shed": "is_child and at_night",
        "LLR GS House Window": "can_use(Boomerang) and at_night",
        "LLR GS Back Wall": "can_use(Boomerang) and at_night"
    },
    "exits": {
        "Hyrule Field": "True",
        "LLR Talons House": "is_adult or at_day",
        "LLR Stables": "True",
        "LLR Tower": "True",
        "LLR Grotto": "is_child"
    }
},
{
    "region_name": "LLR Talons House",
    "scene": "LLR Talons House",
    "locations": {
        "LLR Talons Chickens": "is_child and at_day and Zeldas_Letter"
    },
    "exits": {
        "Lon Lon Ranch": "True"
    }
},
{
    "region_name": "LLR Stables",
    "scene": "LLR Stables",
    "locations": {
        "LLR Stables Left Cow": "can_play(Eponas_Song)",
        "LLR Stables Right Cow": "can_play(Eponas_Song)"
    },
    "exits": {
        "Lon Lon Ranch": "True"
    }
},
{
    "region_name": "LLR Tower",
    "scene": "LLR Tower",
    "locations": {
        "LLR Freestanding PoH": "is_child",
        "LLR Tower Left Cow": "can_play(Eponas_Song)",
        "LLR Tower Right Cow": "can_play(Eponas_Song)"
    },
    "exits": {
        "Lon Lon Ranch": "True"
    }
},
{
    "region_name": "Ganons Castle Tower",
    "dungeon": "Ganons Castle",
    "locations": {
        "Ganons Tower Boss Key Chest": "True",
        "Ganondorf Hint": "Boss_Key_Ganons_Castle",
        "Ganon": "Boss_Key_Ganons_Castle and can_use(Light_Arrows)"
    }
},
{
    "region_name": "GF Storms Grotto",
    "scene": "GF Storms Grotto",
    "locations": {
        "Free Fairies": "has_bottle"
    },
    "exits": {
        "Gerudo Fortress": "True"
    }
},
{
    "region_name": "ZD Storms Grotto",
    "scene": "ZD Storms Grotto",
    "locations": {
        "Free Fairies": "has_bottle"
    },
    "exits": {
        "Zoras Domain": "True"
    }
},
{
    "region_name": "KF Storms Grotto",
    "scene": "KF Storms Grotto",
    "locations": {
        "KF Storms Grotto Chest": "True",
        "KF Storms Grotto Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "can_cut_shrubs and has_bottle",
        "Lone Fish": "has_bottle"
    },
    "exits": {
        "Kokiri Forest": "True"
    }
},
{
    "region_name": "LW Near Shortcuts Grotto",
    "scene": "LW Near Shortcuts Grotto",
    "locations": {
        "LW Near Shortcuts Grotto Chest": "True",
        "LW Near Shortcuts Grotto Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "can_cut_shrubs and has_bottle",
        "Lone Fish": "has_bottle"
    },
    "exits": {
        "Lost Woods": "True"
    }
},
{
    "region_name": "Deku Theater",
    "scene": "Deku Theater",
    "locations": {
        "Deku Theater Skull Mask": "is_child and 'Skull Mask'",
        "Deku Theater Mask of Truth": "is_child and 'Mask of Truth'"
    },
    "exits": {
        "LW Beyond Mido": "True"
    }
},
{
    "region_name": "LW Scrubs Grotto",
    "scene": "LW Scrubs Grotto",
    "locations": {
        "LW Deku Scrub Grotto Rear": "can_stun_deku",
        "LW Deku Scrub Grotto Front": "can_stun_deku"
    },
    "exits": {
        "LW Beyond Mido": "True"
    }
},
{
    "region_name": "SFM Fairy Grotto",
    "scene": "SFM Fairy Grotto",
    "locations": {
        "Free Fairies": "has_bottle"
    },
    "exits": {
        "Sacred Forest Meadow": "True"
    }
},
{
    "region_name": "SFM Storms Grotto",
    "scene": "SFM Storms Grotto",
    "locations": {
        "SFM Deku Scrub Grotto Rear": "can_stun_deku",
        "SFM Deku Scrub Grotto Front": "can_stun_deku"
    },
    "exits": {
        "Sacred Forest Meadow": "True"
    }
},
{
    "region_name": "SFM Wolfos Grotto",
    "scene": "SFM Wolfos Grotto",
    "locations": {
        "SFM Wolfos Grotto Chest": "
            is_adult or Slingshot or Sticks or 
            Kokiri_Sword or can_use(Dins_Fire)"
    },
    "exits": {
        "SFM Entryway": "True"
    }
},
{
    "region_name": "LLR Grotto",
    "scene": "LLR Grotto",
    "locations": {
        "LLR Deku Scrub Grotto Left": "can_stun_deku",
        "LLR Deku Scrub Grotto Right": "can_stun_deku",
        "LLR Deku Scrub Grotto Center": "can_stun_deku"
    },
    "exits": {
        "Lon Lon Ranch": "True"
    }
},
{
    "region_name": "HF Southeast Grotto",
    "scene": "HF Southeast Grotto",
    "locations": {
        "HF Southeast Grotto Chest": "True",
        "HF Southeast Grotto Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "can_cut_shrubs and has_bottle",
        "Lone Fish": "has_bottle"
    },
    "exits": {
        "Hyrule Field": "True"
    }
},
{
    "region_name": "HF Open Grotto",
    "scene": "HF Open Grotto",
    "locations": {
        "HF Open Grotto Chest": "True",
        "HF Open Grotto Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "can_cut_shrubs and has_bottle",
        "Lone Fish": "has_bottle"
    },
    "exits": {
        "Hyrule Field": "True"
    }
},
{
    "region_name": "HF Inside Fence Grotto",
    "scene": "HF Inside Fence Grotto",
    "locations": {
        "HF Deku Scrub Grotto": "can_stun_deku"
    },
    "exits": {
        "Hyrule Field": "True"
    }
},
{
    "region_name": "HF Cow Grotto",
    "scene": "HF Cow Grotto",
    "locations": {
        "HF GS Cow Grotto": "
            has_fire_source and (can_use(Hookshot) or can_use(Boomerang))",
        "HF Cow Grotto Cow": "has_fire_source and can_play(Eponas_Song)",
        "HF Cow Grotto Gossip Stone": "has_fire_source",
        "Gossip Stone Fairy": "has_fire_source and can_summon_gossip_fairy and has_bottle",
        "Bug Shrub": "has_fire_source and can_cut_shrubs and has_bottle",
        "Nut Pot": "has_fire_source"
    },
    "exits": {
        "Hyrule Field": "True"
    }
},
{
    "region_name": "HF Near Market Grotto",
    "scene": "HF Near Market Grotto",
    "locations": {
        "HF Near Market Grotto Chest": "True",
        "HF Near Market Grotto Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "can_cut_shrubs and has_bottle",
        "Lone Fish": "has_bottle"
    },
    "exits": {
        "Hyrule Field": "True"
    }
},
{
    "region_name": "HF Fairy Grotto",
    "scene": "HF Fairy Grotto",
    "locations": {
        "Free Fairies": "has_bottle"
    },
    "exits": {
        "Hyrule Field": "True"
    }
},
{
    "region_name": "HF Near Kak Grotto",
    "scene": "HF Near Kak Grotto",
    "locations": {
        "HF GS Near Kak Grotto": "can_use(Boomerang) or can_use(Hookshot)"
    },
    "exits": {
        "Hyrule Field": "True"
    }
},
{
    "region_name": "HF Tektite Grotto",
    "scene": "HF Tektite Grotto",
    "locations": {
        "HF Tektite Grotto Freestanding PoH": "
            (Progressive_Scale, 2) or can_use(Iron_Boots)"
    },
    "exits": {
        "Hyrule Field": "True"
    }
},
{
    "region_name": "HC Storms Grotto",
    "scene": "HC Storms Grotto",
    "locations": {
        "HC GS Storms Grotto": "
            (can_blast_or_smash or (is_child and logic_castle_storms_gs)) and
            (can_use(Boomerang) or can_use(Hookshot))",
        "HC Storms Grotto Gossip Stone": "can_blast_or_smash",
        "Gossip Stone Fairy": "can_blast_or_smash and can_summon_gossip_fairy and has_bottle",
        "Wandering Bugs": "can_blast_or_smash and has_bottle",
        "Nut Pot": "can_blast_or_smash"
    },
    "exits": {
        "Castle Grounds": "True"
    }
},
{
    "region_name": "Kak Redead Grotto",
    "scene": "Kak Redead Grotto",
    "locations": {
        "Kak Redead Grotto Chest": "
            is_adult or 
            (Sticks or Kokiri_Sword or can_use(Dins_Fire))"
    },
    "exits": {
        "Kakariko Village": "True"
    }
},
{
    "region_name": "Kak Open Grotto",
    "scene": "Kak Open Grotto",
    "locations": {
        "Kak Open Grotto Chest": "True",
        "Kak Open Grotto Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "can_cut_shrubs and has_bottle",
        "Lone Fish": "has_bottle"
    },
    "exits": {
        "Kak Backyard": "True"
    }
},
{
    "region_name": "DMT Cow Grotto",
    "scene": "DMT Cow Grotto",
    "locations": {
        "DMT Cow Grotto Cow": "can_play(Eponas_Song)"
    },
    "exits": {
        "Death Mountain Summit": "True"
    }
},
{
    "region_name": "DMT Storms Grotto",
    "scene": "DMT Storms Grotto",
    "locations": {
        "DMT Storms Grotto Chest": "True",
        "DMT Storms Grotto Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "can_cut_shrubs and has_bottle",
        "Lone Fish": "has_bottle"
    },
    "exits": {
        "Death Mountain": "True"
    }
},
{
    "region_name": "GC Grotto",
    "scene": "GC Grotto",
    "locations": {
        "GC Deku Scrub Grotto Left": "can_stun_deku",
        "GC Deku Scrub Grotto Right": "can_stun_deku",
        "GC Deku Scrub Grotto Center": "can_stun_deku"
    },
    "exits": {
        "GC Grotto Platform": "True"
    }
},
{
    "region_name": "DMC Upper Grotto",
    "scene": "DMC Upper Grotto",
    "locations": {
        "DMC Upper Grotto Chest": "True",
        "DMC Upper Grotto Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "can_cut_shrubs and has_bottle",
        "Lone Fish": "has_bottle"
    },
    "exits": {
        "DMC Upper Local": "True"
    }
},
{
    "region_name": "DMC Hammer Grotto",
    "scene": "DMC Hammer Grotto",
    "locations": {
        "DMC Deku Scrub Grotto Left": "can_stun_deku",
        "DMC Deku Scrub Grotto Right": "can_stun_deku",
        "DMC Deku Scrub Grotto Center": "can_stun_deku"
    },
    "exits": {
        "DMC Lower Local": "True"
    }
},
{
    "region_name": "ZR Open Grotto",
    "scene": "ZR Open Grotto",
    "locations": {
        "ZR Open Grotto Chest": "True",
        "ZR Open Grotto Gossip Stone": "True",
        "Gossip Stone Fairy": "can_summon_gossip_fairy and has_bottle",
        "Butterfly Fairy": "can_use(Sticks) and has_bottle",
        "Bug Shrub": "can_cut_shrubs and has_bottle",
        "Lone Fish": "has_bottle"
    },
    "exits": {
        "Zora River": "True"
    }
},
{
    "region_name": "ZR Fairy Grotto",
    "scene": "ZR Fairy Grotto",
    "locations": {
        "Free Fairies": "has_bottle"
    },
    "exits": {
        "Zora River": "True"
    }
},
{
    "region_name": "ZR Storms Grotto",
    "scene": "ZR Storms Grotto",
    "locations": {
        "ZR Deku Scrub Grotto Rear": "can_stun_deku",
        "ZR Deku Scrub Grotto Front": "can_stun_deku"
    },
    "exits": {
        "Zora River": "True"
    }
},
{
    "region_name": "LH Grotto",
    "scene": "LH Grotto",
    "locations": {
        "LH Deku Scrub Grotto Left": "can_stun_deku",
        "LH Deku Scrub Grotto Right": "can_stun_deku",
        "LH Deku Scrub Grotto Center": "can_stun_deku"
    },
    "exits": {
        "Lake Hylia": "True"
    }
},
{
    "region_name": "Colossus Grotto",
    "scene": "Colossus Grotto",
    "locations": {
        "Colossus Deku Scrub Grotto Rear": "can_stun_deku",
        "Colossus Deku Scrub Grotto Front": "can_stun_deku"
    },
    "exits": {
        "Desert Colossus": "True"
    }
},
{
    "region_name": "GV Octorok Grotto",
    "scene": "GV Octorok Grotto",
    "exits": {
        "GV Grotto Ledge": "True"
    }
},
{
    "region_name": "GV Storms Grotto",
    "scene": "GV Storms Grotto",
    "locations": {
        "GV Deku Scrub Grotto Rear": "can_stun_deku",
        "GV Deku Scrub Grotto Front": "can_stun_deku"
    },
    "exits": {
        "GV Fortress Side": "True"
    }
}
];


function accessHyruleField() {
  return (isAdult() && adultSpawn === 'Hyrule Field') ||
         (isChild() && childSpawn === 'Hyrule Field')
  ;
}

export {};