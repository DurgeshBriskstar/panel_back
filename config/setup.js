const { STATUS_ACTIVE } = require("../modules/helper/flags");

const firstUserSetup = () => {
    let userInfo = {
        "firstName": "Super",
        "lastName": "Admin",
        "email": "admin@test.com",
        "password": "Admin@123",
        "role": "admin",
        "status": STATUS_ACTIVE,
    }
    return userInfo;
}

module.exports = {
    firstUserSetup,
}