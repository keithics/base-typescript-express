export const NgDateType = function (name, required = true) {
    return {
        year: NgDate(name,required),
        month: NgDate(name, required),
        day: NgDate(name, required),
        dateObject: Date
    }
}

export const NgDate = function (name, required = true) {
    return  required ? {type: Number, required: name + ' is required'} : { type: Number};

}


export const formatDate = function (me,name) {
    return {
        ... me[name],
        dateObject : new Date(me[name].year, me[name].month - 1, me[name].day),
    }
}
