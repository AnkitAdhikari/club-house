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

module.exports = {
    getMessages,
    deleteMessageById,
    updateMembershipStatus,
    updateAdminStatus,
    insertNewMsg
}