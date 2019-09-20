export const countAssetsTransform = (bundleStats = {}) => {
  const { assets } = bundleStats;

  const value = Object.keys(assets).length;

  return {
    stats: {
      assetsCount: {
        value,
      },
    },
  };
};