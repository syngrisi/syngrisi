const dateToISO8601 = (date) => new Date(new Date(date)).toISOString().split('T')[0];
module.exports = dateToISO8601;
