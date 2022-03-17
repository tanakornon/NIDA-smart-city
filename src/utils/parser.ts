export function parseJson(packet: any) {
  return JSON.parse(JSON.stringify(packet));
}
