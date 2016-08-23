 import {
    reduce,
    isEqual,
} from 'lodash';

export default function deepDiff(obj1, obj2) {
    return reduce(obj1, function(result, value, key) {
        return isEqual(value, obj2[key]) ?
            result : result.concat([key, value, obj2[key]]);
    }, []);
}

