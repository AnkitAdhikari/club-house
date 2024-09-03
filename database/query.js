const db = require('./pool');

async function getMessages() {
    try {
        const { rows } = await db.query("Select * from messages;");
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

module.exports = {
    getMessages,
    deleteMessageById,
    updateMembershipStatus,
    updateAdminStatus
}