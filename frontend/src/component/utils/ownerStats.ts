import { Owner } from "../../types/Admin";

export const calculateOwnerStats = (owner: Owner) => {
  const totalSets =
    owner.properties?.reduce((acc, property) => acc + property.totalRoom, 0) ??
    0;
  const availableSets =
    owner.properties?.reduce((acc, property) => acc + property.noOfSet, 0) ?? 0;
  const bookedSets = totalSets - availableSets;

  return { totalSets, availableSets, bookedSets };
};
