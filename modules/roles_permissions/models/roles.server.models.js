const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: [true, "Role name is required!"],
    }
});

const PermissionSchema = new mongoose.Schema({
    permissionName: {
        type: String,
        required: [true, "Permission name is required!"],
    }
});

const RoleModel = mongoose.model("roles", RoleSchema);
const PermissionModel = mongoose.model("permissions", PermissionSchema);

module.exports = {
    RoleModel,
    PermissionModel,
};