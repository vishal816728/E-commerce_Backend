class ApiFeatures{
    constructor(query,queryStr){
        this.query=query
        this.queryStr=queryStr
    }

    search(){
        const keyword=this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{}

        this.query=this.query.find({...keyword})
        return this
    }

    filter(){
        const queryCopy={...this.queryStr}
        // javascript takes reference of the objects so it will modify the actual object 
        const Removefields=["keyword","page","limit"]

        Removefields.forEach(key=>delete queryCopy[key])
        console.log(queryCopy)

        //Price filter
        let queryStr=JSON.stringify(queryCopy)
        queryStr= queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`)

        this.query=this.query.find(JSON.parse(queryStr))
        return this
    }

    Pagination(ResultPerPage){
          const currentPage=Number(this.queryStr.page) || 1

        //   http://localhost:7000/api/v1/getallproducts?keyword=park3&category=real estate&price[gt]=1200&price[lt]=2000
        // all the query strings after getallproducts are query str
        const skipitems = ResultPerPage*(currentPage-1)

        this.query=this.query.limit(currentPage).skip(skipitems)
        return this

    }

}

module.exports=ApiFeatures