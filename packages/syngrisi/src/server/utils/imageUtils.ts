export const getPngDimensions = (buffer: Buffer): { width: number, height: number } => {
    // Check PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (buffer.length < 24) {
        throw new Error('Buffer too small to be a PNG');
    }
    if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
        throw new Error('Invalid PNG signature');
    }
    // IHDR chunk starts at offset 8
    // Length (4 bytes), Type (4 bytes)
    // Width (4 bytes) at offset 16
    // Height (4 bytes) at offset 20
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
};
