exports.fibonacciNumFunction = function (n) {
    var fibSequence = [0,]
    if(n >= 1) {
        x = 0
        y = 1
        while (n >= 1) {
            tmp = x
            x = x + y
            y = tmp
            fibSequence.push(x)
            n--
        }
        return fibSequence
    }
    else if (n < 0) {
        return "Please enter number bigger than 0"
    }
    else {
        return fibSequence
    }
}

exports.fibonacciNumRecursive = function (n) {
    return fibonacciRecursive(n)
}

var fibonacciRecursive = function(n) {
    if(n === 1) {
        return [0,1]
    }
    else if (n < 0) {
        return "Please enter number bigger than 0"
    }
    else {
        var fibSequence = fibonacciRecursive(n-1)
        fibSequence.push(fibSequence[fibSequence.length -1] + fibSequence[fibSequence.length -2])
        return fibSequence
    }
}