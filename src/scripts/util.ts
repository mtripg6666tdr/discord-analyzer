import { PermissionFlagsBits, UserFlags } from "discord-api-types/payloads";

export function getTimeStampFromSnowflake(snowflake: string){
  return new Date(parseInt((BigInt(snowflake) >> 22n).toString()) + 1420070400000);
}

export function timestampToString(date: Date){
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}時${date.getMinutes()}分${date.getSeconds()}秒${date.getMilliseconds()}`;
}

export function getPermissionList(permissions: bigint){
  return Object.entries(PermissionFlagsBits)
    .filter(([_, permissionBit]) => (permissions & permissionBit) === permissionBit)
    .map(([name]) =>
      name.replace(
        /[a-z][A-Z]/g,
        capture => capture.length === 1
          ? ` ${capture.toUpperCase()}`
          : `${capture[0]} ${capture[1].toUpperCase()}`
      )
    );
}

const flagsText: Record<string, string> = {
  HypeSquadOnlineHouse1: "HypeSquad Bravery",
  HypeSquadOnlineHouse2: "HypeSquad Brilliance",
  HypeSquadOnlineHouse3: "HypeSquad Balance",
};

export function getFlagList(flag: number){
  return Object.entries(UserFlags)
    .filter(([_, flagBit]) => (flag & flagBit as number) === flagBit)
    .map(([name]) => flagsText[name] || name);
}
