/** */

exports.buildQuery = options => {
    let seek_conditions = {};
    const sort_condition = options.sort_by ? this.buildSortOrderString(options.sort_by) : '';
    const fields_to_return = options.return_only ? this.buildReturnFieldsString(options.return_only) : '';
    const count = options.count || false;

    let skip = 0, limit = Number.MAX_SAFE_INTEGER;
    
    if (options.page && options.population) {
        const pagination = this.determinePagination(options.page, options.population);
        limit = pagination.limit;
        skip = pagination.skip;
    }

    /** Delete sort and return fields */
    delete options.count;
    delete options.page;
    delete options.population;
    delete options.return_only;
    delete options.sort_by;

    Object.keys(options).forEach((field) => {
        const field_value = options[field].toLowerCase();
        let condition;

        if (field_value.includes(':')) {
            condition = this.buildInQuery(field_value);
        } else if (field_value.includes('!')) {
            condition = this.buildNorQuery(field_value);
        } else if (field_value.includes('~')) {
            condition = this.buildRangeQuery(field_value);
        } else {
            condition = this.buildOrQuery(field_value);
        }

        seek_conditions[field] = { ...condition };
    });

    return {
        count,
        fields_to_return,
        limit,
        seek_conditions,
        skip,
        sort_condition,
    }
}

exports.buildInQuery = value => {
    const values = value.split(':');
    return {
        $in: [
            ...values
        ]
    };
}

exports.buildNorQuery = value => {
    const values = value.split('!');
    return {
        $nin: [
            ...(values.slice(1))
        ]
    }
}

exports.buildOrQuery = value => {
    const values = value.split(',');
    return {
        $in: [
            ...values
        ]
    };
}

exports.buildRangeQuery = value => {
    const values = value.split('-');
    return {
        $gte: values[0] ? Number(values[0]) : Number.MIN_SAFE_INTEGER,
        $lte: values[1] ? Number(values[1]) : Number.MAX_SAFE_INTEGER,
    };
}

exports.buildReturnFieldsString = value => {
    const fields = value.split(',');
    return fields.join(' ');
}

exports.buildSortOrderString = value => {
    const values = value.split(',');
    return values.join(' ');
}

exports.buildWildcardOptions = (key_list, value) => {
    const keys = key_list.split(',');
    return {
        $or: keys.map((key) => ({
                [key]: {
                    $regex : `${value}`,
                    $options: 'i',
                },
        })),
    };
}

exports.determinePagination = (page, population) => {
    return{
        limit: Number(population),
        skip: page * population,
    }
}

