export const ellipsisAddress = (hexAddress: any) => {
  try {
    return hexAddress
      ? `${hexAddress.substring(0, 4)}...${hexAddress.substring(
          hexAddress.length - 4
        )}`
      : null;
  } catch (e) {
    return hexAddress;
  }
};
