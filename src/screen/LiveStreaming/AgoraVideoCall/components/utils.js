export const enumToItems = (enumType) => {
    const items = Object.values(enumType);
    const keys = items.filter((v) => typeof v === 'string');
    const values = items.filter((v) => typeof v === 'number');
    return keys.map((value, index) => ({
        label: value,
        value: values[index],
    }));
};