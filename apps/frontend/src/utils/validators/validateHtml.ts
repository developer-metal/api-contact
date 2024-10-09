const validateHtml = (value: string) => {
    const regex = /<\/([a-zA-Z][^\s>]*)\s*>/g;
    const result = value.match(regex);
    if (result) {
        return result.length > 0;
    }
    return false;
};
export default validateHtml;