/** */

exports.build_query = options => {
    let seek_conditions = {};
    const sort_condition = options.sort_by ? this.build_sort_order_string(options.sort_by) : '';
    const fields_to_return = options.return_only ? this.build_return_fields_string(options.return_only) : '';
    const count = options.count || false;

    let skip = 0, limit = Number.MAX_SAFE_INTEGER;
    
    if (options.page && options.population) {
        const pagination = this.determine_pagination(options.page, options.population);
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
            condition = this.build_in_query(field_value);
        } else if (field_value.includes('!')) {
            condition = this.build_nor_query(field_value);
        } else if (field_value.includes('~')) {
            condition = this.build_range_query(field_value);
        } else {
            condition = this.build_or_query(field_value);
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

exports.build_in_query = value => {
    const values = value.split(':');
    return {
        $in: [
            ...values
        ]
    };
}

exports.build_nor_query = value => {
    const values = value.split('!');
    return {
        $nin: [
            ...(values.slice(1))
        ]
    }
}

exports.build_or_query = value => {
    const values = value.split(',');
    return {
        $in: [
            ...values
        ]
    };
}

exports.build_range_query = value => {
    const values = value.split('-');
    return {
        $gte: values[0] ? Number(values[0]) : Number.MIN_SAFE_INTEGER,
        $lte: values[1] ? Number(values[1]) : Number.MAX_SAFE_INTEGER,
    };
}

exports.build_return_fields_string = value => {
    const fields = value.split(',');
    return fields.join(' ');
}

exports.build_sort_order_string = value => {
    const values = value.split(',');
    return values.join(' ');
}

exports.build_wildcard_options = (key_list, value) => {
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

exports.determine_pagination = (page, population) => {
    return{
        limit: Number(population),
        skip: page * population,
    }
}

