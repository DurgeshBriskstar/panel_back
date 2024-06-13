const firstUserSetup = () => {
    let userInfo = {
        "firstName": "Super",
        "lastName": "Admin",
        "email": "admin@test.com",
        "password": "Admin@123",
        "role": "admin",
    }
    return userInfo;
}

module.exports = {
    firstUserSetup,
}