const doFilter = (item, filter) => {
    let { value } = filter,
        result;
  
    if (!(value instanceof RegExp)) {
        value = filter.value = new RegExp("^" + value + "$", 'i');
    }

    if(filter.property === "month"){
        result = value.test(item[ "date" ].split("/")[0])
    } else if(filter.property === "year"){
        result = value.test(item[ "date" ].split("/")[2])
    } else {
        result = value.test(item[ filter.property ])
    }
  
    return result;
  }
  
  const createFilter = (...filters) => {
    if (typeof filters[0] === 'string') {
      filters = [
        {
          property: filters[0],
          value: filters[1]
        }
      ];
    }
  
    return item => filters.every(filter => doFilter(item, filter));
  };
  
  export { createFilter };
  