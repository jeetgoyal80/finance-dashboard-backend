const buildPagination = (page = 1, limit = 10) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit
  };
};

const escapeRegex = (value = '') => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
  buildPagination,
  escapeRegex
};
