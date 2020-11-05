const getRealEventList = function (parentElement) {
    let result = null;

    //In this case we assign the event to the elements itselfs
    if (parentElement === document || parentElement instanceof Element) {
        result = [parentElement];
    }
    else if (parentElement instanceof HTMLCollection || parentElement instanceof NodeList) {
        result = parentElement;
    }

    return result;
};

const getNameAndNamespace = function (nameWithNamespace) {
    const outcome = [];
    if (nameWithNamespace) {
        const splitted = name.split('.');
        if (splitted){

            for (let index = 0; index < splitted.length; index++) {
                outcome.push(splitted[index]);
            }
        }
    }
    return outcome;
};

export { getRealEventList, getNameAndNamespace };