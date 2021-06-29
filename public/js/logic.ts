/** Settings */
let child_spawn:string = "KF Links House";
let adult_spawn:string = "Temple of Time";
let open_forest:boolean = true;
let bombchus_in_logic:boolean = true;
let logic_grottos_without_agony:boolean = true;

/** State */
let age:string = "child";
let opposite_age:string = "adult";
let check_statuses = {
  queenGohma: false,
};
let inventory = {
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
}
const roots: string[] = [child_spawn, adult_spawn, "prelude_warp", "minuet_warp", "bolero_warp", "serenade_warp", "nocturne_warp", "requiem_warp"];

/** Helpers */
function isChild() {
  return age === "child";
}

function isAdult() {
  return age === "adult";
}

function canLeaveForest() {
  return open_forest || isAdult() || check_statuses.queenGohma
}

function hasExplosives() {
  return inventory.bombs || (bombchus_in_logic && inventory.bombchus)
}

function canChildAttack() {
  return inventory.slingshot || inventory.boomerang || inventory.sticks || inventory.swordKokiri || hasExplosives() || (inventory.magic && inventory.dins)
}

function canPlantBugs() {
  return inventory.bottle
}

function canOpenStormGrotto() {
  return (inventory.ocarina && inventory.storms) && (inventory.agony || logic_grottos_without_agony)
}

function canStunDeku() {
  return isAdult() || (inventory.shieldDeku || inventory.slingshot || inventory.boomerang || inventory.sticks || inventory.swordKokiri || hasExplosives() || (inventory.magic && inventory.dins) || inventory.nuts)

/** Regions */
let regions = [
  {
    "region_name": "Kokiri Forest",
    "scene": "Kokiri Forest",
    "hint": "Kokiri Forest",
    "locations": {
      "KF Kokiri Sword Chest": isChild(),
      "KF GS Know It All House": isChild() && canChildAttack(),
      "KF GS Bean Patch": isChild() && inventory.bottle && canChildAttack(),
      "KF GS House of Twins": isAdult() && inventory.shot /** (logic_adult_kokiri_gs && can_use(Hover_Boots))) */
    },
    "exits": {
      "KF Links House": true,
      "KF Midos House": true,
      "KF Outside Deku Tree": isAdult() || open_forest || (inventory.swordKokiri && inventory.shieldDeku),
      "Lost Woods": true,
      "LW Bridge From Forest": canLeaveForest(),
      "KF Storms Grotto": canOpenStormGrotto
    }
  },
  {
    "region_name": "KF Outside Deku Tree",
    "scene": "Kokiri Forest",
    "hint": "Kokiri Forest",
    "exits": {
        "Deku Tree Lobby": isChild(),
        "Kokiri Forest": isAdult() || open_forest || (inventory.swordKokiri && inventory.shieldDeku)
    }
  },
  {
    "region_name": "KF Links House",
    "scene": "KF Links House",
    "exits": {
        "Kokiri Forest": true
    }
  },
  {
    "region_name": "KF Midos House",
    "scene": "KF Midos House",
    "locations": {
        "KF Midos Top Left Chest": true,
        "KF Midos Top Right Chest": true,
        "KF Midos Bottom Left Chest": true,
        "KF Midos Bottom Right Chest": true
    },
    "exits": {
        "Kokiri Forest": true
    }
  },
  {
    "region_name": "LW Forest Exit", /** Going the wrong way in the woods */
    "scene": "Lost Woods",
    "hint": "the Lost Woods",
    "exits": {
        "Kokiri Forest": true
    }
  },
  {
    "region_name": "Lost Woods",
    "scene": "Lost Woods",
    "hint": "the Lost Woods",
    "locations": {
        "LW Skull Kid": isChild() && (inventory.ocarina && inventory.sarias),
        "LW Ocarina Memory Game": isChild() && inventory.ocarina,
        "LW Target in Woods": isChild() && inventory.slingshot,
        "LW Deku Scrub Near Bridge": isChild() && canStunDeku(),
        "LW GS Bean Patch Near Bridge": canPlantBugs() || canChildAttack(),
        /** "Bug Shrub": "is_child and can_cut_shrubs and has_bottle" */
    },
    "exits": {
        "LW Forest Exit": true,
        "GC Woods Warp": true,
        "LW Bridge": isAdult() && (inventory.bootshover || inventory " is_adult and (can_use(Hover_Boots) or can_use(Longshot) or here(can_plant_bean) or logic_lost_woods_bridge)", /** COME BACK */
        "Zora River": canLeaveForest() && (inventory.scale || (isAdult() && inventory.bootsiron)),
        "LW Beyond Mido": isChild() || logic_mido_backflip || (inventory.ocarina && inventory.sarias),
        "LW Near Shortcuts Grotto": "here(can_blast_or_smash)" /** COME BACK - here() */
    }
  },
]




function accessHyruleField() {
  return
    (isAdult() && adult_spawn === "Hyrule Field") ||
    (isChild() && child_spawn === "Hyrule Field")
}

export {}
