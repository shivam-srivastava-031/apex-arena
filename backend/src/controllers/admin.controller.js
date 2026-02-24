const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');

const getStats = asyncHandler(async (req, res) => {
    const data = await adminService.getDashboardStats();
    return ok(res, 'Admin stats fetched successfully', data);
});

module.exports = {
    getStats
};
