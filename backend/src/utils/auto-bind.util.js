function autoBind(instance) {
    const proto = Object.getPrototypeOf(instance);
    const propertyNames = Object.getOwnPropertyNames(proto);

    propertyNames.forEach(name => {
        const value = instance[name];
        if (name !== 'constructor' && typeof value === 'function') {
            instance[name] = value.bind(instance);
        }
    });
}

export default autoBind;