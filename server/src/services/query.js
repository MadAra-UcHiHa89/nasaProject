const DEFAULT_PAGE_VALUE = 1; // Settiing default page value to be 1
const DEFAULT_LIMIT_VALUE = 0; // if 0 is set as limit Mongo returns all the documents

function getPagination(queryString) {
  const limit = Math.abs(queryString.limit) || DEFAULT_LIMIT_VALUE; // In order to ensure the limit is always positive
  // If limit is not set then in the queryString then set limit to DEFAULT VALUE i.e 0 => it will return all the documents
  const page = Math.abs(queryString.page) || DEFAULT_PAGE_VALUE; // In order to ensure the page user wants to view is always positive
  // Setting the deafult value if the query string page or limit isnt passed
  // If both not passed => return all the documents

  const documentsToSkip = limit * (page - 1);

  return {
    documentsToSkip,
    limit,
  };
}

module.exports = { getPagination };
