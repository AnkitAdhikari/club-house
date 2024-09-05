const db = require('./pool');

async function getMessages() {
    try {
        const { rows } = await db.query("Select messages.id,title,username,timestamp,message from messages join users on users.id=messages.user_id;");
        return rows;
    } catch (err) {
        throw new Error(err);
    }
}

async function deleteMessageById(id) {
    try {
        const { rowCount } = await db.query(`delete from messages where id=$1`, [id]);
        return (rowCount > 0)
    } catch (err) {
        throw new Error(err);
    }
}

async function updateMembershipStatus(id) {
    try {
        await db.query("update users set is_member=TRUE where id=$1", [id]);
    } catch (err) {
        throw new Error(err);
    }
}
async function updateAdminStatus(id) {
    try {
        await db.query("update users set is_admin=TRUE where id=$1", [id]);
    } catch (err) {
        throw new Error(err);
    }
}

async function insertNewMsg(user_id, title, message) {
    try {
        await db.query(`insert into messages (user_id,title,message) values ($1,$2,$3);`, [user_id, title, message]);
    } catch (err) {
        throw new Error(err);
    }
}

async function insertUser(firstName, lastName, username, hashedPass) {
    try {
        await db.query(`insert into users (first_name,last_name,username,password) values ($1,$2,$3,$4)`, [firstName, lastName, username, hashedPass]);
    } catch (err) {
        throw new Error(err);
    }
}

async function checkUserExistance(username) {
    const { rowCount } = await db.query(`select * from users where username=$1`, [username]);
    return (rowCount > 0)
}

module.exports = {
    getMessages,
    deleteMessageById,
    updateMembershipStatus,
    updateAdminStatus,
    insertNewMsg,
    insertUser,
    checkUserExistance
}