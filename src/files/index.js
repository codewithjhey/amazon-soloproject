import express from "express"
import multer from "multer"
import { extname } from "path"
import httpErrors from "http-errors"

import {
  saveProductImage,
  getProducts,
  writeProducts
} from "../lib/fs-tools.js"

const filesRouter = express.Router()

const { NotFound } = httpErrors

filesRouter.post(
  "/:id/upload",
  multer().single("productImg"),
  async (req, res, next) => {
    try {
      const fileExtensionType = extname(req.file.originalname)
      const fileName = req.params.id + fileExtensionType
      await saveProductImage(fileName, req.file.buffer)
      const url = `http://localhost:3002/productImgs/${fileName}`
      const products = await getProducts()
      const productID = req.params.id
      const oldProductIndex = products.findIndex(
        (product) => product.id === productID
      )
      if (oldProductIndex !== -1) {
        const oldProduct = products[oldProductIndex]
        const updatedProduct = {
          ...oldProduct,
          imageUrl: url,
          updatedAt: new Date()
        }
        products[oldProductIndex] = updatedProduct
        await writeProducts(products)
        res.send("The product with id " + productID + "  image updated")
      } else {
        next(NotFound(`Product with id ${productID} not found`))
      }
    } catch (error) {
      console.log(error)
    }
  }
)

export default filesRouter
