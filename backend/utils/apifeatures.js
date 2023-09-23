class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                $or: [{
                    name: {
                        $regex: this.queryStr.keyword,
                        $options: "i"
                    }
                },
                {
                    discription: {
                        $regex: this.queryStr.keyword,
                        $options: "i"
                    }
                }
                ]
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr }

        // console.log(queryCopy);
        const removeField = ["keyword", "page", "limit"];

        removeField.forEach(key => { delete queryCopy[key] });

        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultsPerPage) {
        const currentPage = this.queryStr.page || 1;
        const skip = (currentPage - 1) * resultsPerPage;

        this.query = this.query.limit(resultsPerPage).skip(skip);

        return this;
    }
}

module.exports = ApiFeatures;