function itertoolsCombinations(arr, size) {
    const result = [];

    function c(current, start) {
        if (current.length === size) {
            result.push([...current]);
            return;
        }

        for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            c(current, i + 1);
            current.pop();
        }
    }

    c([], 0);

    return result;
}