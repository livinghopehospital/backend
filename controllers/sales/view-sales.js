const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Sales } = require("../../model/sales/sales");


const viewSales =async(req,res,next)=>{
    try {
      const mSales = await Sales.findSales();
      const {branch_id} = req.userData;
      if (mSales&&mSales.length>0) {
        const sale  = []
        mSales.map((sales)=>{
          sale.push(...sales.items);
        });

       const branchSale= sale.filter(branch_sale=>branch_sale.branch==branch_id)
        httpResponse({status_code:200,response_message:'Sales successfully fetched', data:branchSale,res})  
        return;
      }  
      const e = new HttpError(404, "You have not made any sales");
      return(e);
    } catch (error) {
        const e = new HttpError(500,error.message);
        return next(e);
    }
}




module.exports={
    viewSales
}
