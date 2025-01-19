export const shortenAddress = (address: string, chars = 4) => {
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
};
