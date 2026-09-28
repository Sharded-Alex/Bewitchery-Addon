/* jshint maxerr: 10000 */
import {world, system, BlockPermutation, BlockVolume, BlockVolumeBase, Structure, StructureManager} from "@minecraft/server";
import {ModalFormData} from "@minecraft/server-ui";
import {Vector3, Random} from "./VectorMath/index.js";
import {localizePos} from "./localize.js";

export function getDistance(a, b) {
  let blockDistance = Vector3.distance(b, a);
  return blockDistance;
}