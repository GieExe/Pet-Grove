export function distance(x1, y1, x2, y2){
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function getCellCenter(row, col){
  return { x: col + 0.5, y: row + 0.5 };
}

export function generatePetKg(rarity){
  let baseKg, variance;
  switch(rarity){
    case 'common': baseKg = 10; variance = 5; break;
    case 'rare': baseKg = 20; variance = 10; break;
    case 'epic': baseKg = 40; variance = 20; break;
    case 'legendary': baseKg = 80; variance = 40; break;
    case 'mythic': baseKg = 150; variance = 75; break;
    default: baseKg = 10; variance = 5;
  }
  const kg = baseKg + (Math.random() * variance * 2) - variance;
  return Math.max(5, Math.round(kg));
}

export function getKgBonus(kg, rarity){
  let multiplier;
  switch(rarity){
    case 'common': multiplier = kg / 10; break;
    case 'rare': multiplier = kg / 20; break;
    case 'epic': multiplier = kg / 40; break;
    case 'legendary': multiplier = kg / 80; break;
    case 'mythic': multiplier = kg / 150; break;
    default: multiplier = 1;
  }
  return Math.max(0.8, Math.min(1.5, multiplier));
}
