export const formatPhone = (input: string) => {
    let digits = input.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length > 11) digits = digits.slice(0, 11);
    
    if (digits[0] === '7' || digits[0] === '8' || digits[0] === '9') {
        if (digits[0] === '9') digits = '7' + digits; // Auto-correct starting with 9
        let res = '+7 ';
        if (digits.length > 1) res += '(' + digits.substring(1, 4);
        if (digits.length >= 5) res += ') ' + digits.substring(4, 7);
        if (digits.length >= 8) res += '-' + digits.substring(7, 9);
        if (digits.length >= 10) res += '-' + digits.substring(9, 11);
        return res;
    }
    return '+' + digits;
};
