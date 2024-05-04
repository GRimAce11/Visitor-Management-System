const UserData = (id, username, password, companyname) => {
    const data = {
        uid: id,
        username: username,
        password: password,
        companyname: companyname,
        usertyp: 'company',
        date: new Date()
    }
    return data
}

export default UserData