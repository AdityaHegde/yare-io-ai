function transformPosToDynamic(pos) {
  if (pos.position !== undefined) {
    return [
      `spirit_lookup["${pos.id}"].position[0]`,
      `spirit_lookup["${pos.id}"].position[1]`
    ];
  }
  return pos;
}
let persistedLogIndex = 0;

export function circle(pos, radius, color = "#0f0") {
  pos = transformPosToDynamic(pos);
  console.log(`RENDER@CIRCLE@${pos[0]}@${pos[1]}@${radius}@${color}`);
}
export function ping(pos) {
  pos = transformPosToDynamic(pos);
  console.log(`RENDER@PING@${pos[0]}@${pos[1]}@${Date.now()}`);
}
export function line(pos1, pos2, color = "#0f0") {
  pos1 = transformPosToDynamic(pos1);
  pos2 = transformPosToDynamic(pos2);
  console.log(`RENDER@LINE@${pos1[0]}@${pos1[1]}@${pos2[0]}@${pos2[1]}@${color}`);
}
export function text(pos, str, color = "#0f0") {
  pos = transformPosToDynamic(pos);
  console.log(`RENDER@TEXT@${pos[0]}@${pos[1]}@${str}@${color}`);
}
export function log(str) {
  console.log(`RENDER@PLOG@${persistedLogIndex}@${JSON.stringify(str)}`);
  persistedLogIndex += 1;
}
