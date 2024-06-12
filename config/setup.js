const firstUserSetup = () => {
    let userInfo = {
        "firstName": "Super",
        "lastName": "Admin",
        "email": "admin@test.com",
        "password": "Admin@123",
        "role": "SuperAdmin",
    }
    return userInfo;
}

module.exports = {
    firstUserSetup,
}