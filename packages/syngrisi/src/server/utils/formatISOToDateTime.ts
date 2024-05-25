function formatISOToDateTime(isoDateString: string): string {
    const date = new Date(isoDateString);
    return `${date.toISOString().slice(0, 10)} ${date.toTimeString().slice(0, 8)}`;
}

export default formatISOToDateTime;
