function formatISOToDateTime(isoDateString) {
    const date = new Date(isoDateString);
    return `${date.toISOString().slice(0, 10)} ${date.toTimeString().slice(0, 8)}`;
}

module.exports = formatISOToDateTime;
