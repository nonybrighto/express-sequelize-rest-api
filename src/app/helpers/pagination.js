class Pagination{


    constructor(totalCount, page, limit){
        this.page = page;
        this.limit = limit;
        this.totalCount = totalCount;
    }

    getOffset(){
        let offset = (this.page - 1) * this.limit;
        return offset;
    }

    getTotalPages(){
        let totalPages = Math.ceil(this.totalCount / this.limit);
        return totalPages;
    }

    hasNextPage(){
            return this.page < this.getTotalPages();
    }

    hasPreviousPage(){
            return this.page > 1;
    }

    generateLinkHeader(){
        


    }

    generatePaginationObject(){

        let paginationObject = {
            totalPages: this.getTotalPages(),
            limit: this.limit,
            currentPage: this.page,
            ...(this.hasPreviousPage() && {previousPage: this.page - 1}),
            ...(this.hasNextPage() && {nextPage: this.page + 1}),

        };

        return paginationObject;
    }


}

export default Pagination;