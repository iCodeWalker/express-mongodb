class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    // exlcluded fields
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    // deleting keys that is not needed in the query object for filtering
    excludeFields.forEach((item) => {
      delete queryObj[item];
    });

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (matchedWord) => {
      return `$${matchedWord}`;
    });

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // mongodb query : sorting using multiple variables sort(price ratingsAverage)
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      //query = query.select('name duration price)
      this.query = this.query.select(fields);
    } else {
      // add - to exclude the field
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;

    const skipValue = (page - 1) * limit;

    this.query = this.query.skip(skipValue).limit(limit);

    return this;
  }
}

export default APIFeatures;
