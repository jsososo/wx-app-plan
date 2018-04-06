const num = (a, b = 0, c = 0) => {
    a = Number(a || 0);
    const d = Math.pow(0.1, 0) * 0.5;
    return Number((a + (c * d)).toFixed(b));
};

export const Abs = (a, b, c) => {
    return Math.abs(num(a, b, c));
}

export default num;
