import express from "express"
import uniqid from "uniqid"
import httpErrors from "http-errors"
import {
  getProducts,
  writeProducts,
  getReviews,
  writeReviews
} from "../../lib/fs-tools.js"
import {
  checksPostSchema,
  triggerBadRequest,
  checksReviewSchema,
  triggerReviewBadRequest
} from "./validator.js"

const productsRouter = express.Router()

const { NotFound } = httpErrors

const getProductsReviews = async () => {
  const productsArray = await getProducts()
  const reviews = await getReviews()
  const productsReviews = productsArray.map((product) => {
    const wantedReview = reviews.filter(
      (review) => review.productId === product.id
    )
    if (wantedReview) {
      product.reviews = wantedReview
    }
    return product
  })
  return productsReviews
}

const getProductReviews = async (id) => {
  const productsArray = await getProducts()
  const queriedProduct = productsArray.find((product) => product.id === id)
  const reviews = await getReviews()
  const wantedReview = reviews.filter((review) => review.productId === id)
  if (wantedReview) {
    queriedProduct.reviews = wantedReview
  }
  return queriedProduct
}

productsRouter.get("/", async (req, res, next) => {
  try {
    const productsArray = await getProducts()
    if (req.query && req.query.category) {
      const filteredProducts = productsArray.filter(
        (product) => product.category === req.query.category
      )
      res.send(filteredProducts)
    } else {
      res.send(productsArray)
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts()
    const product = products.find(
      (product) => product._id === req.params.productId
    )
    if (product) {
      res.send(product)
    } else {
      next(NotFound(`Product with the id ${req.params.productId} not found`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.post(
  "/",
  checksPostSchema,
  triggerBadRequest,

  async (req, res, next) => {
    const newProduct = { ...req.body, createdAt: new Date(), _id: uniqid() }
    try {
      const productsArray = await getProducts()

      productsArray.push(newProduct)

      await writeProducts(productsArray)

      res.status(201).send(`Product with id: ${newProduct._id} created`)
    } catch (error) {
      next(error)
    }
  }
)

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts()

    const index = products.findIndex(
      (product) => product._id === req.params.productId
    )
    if (index !== -1) {
      const oldProduct = products[index]

      const updatedProduct = {
        ...oldProduct,
        ...req.body,
        updatedAt: new Date()
      }

      products[index] = updatedProduct

      await writeProducts(products)

      res.send(updatedProduct)
    } else {
      next(NotFound(`Product with is ${req.params.productId} cannot be found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts()

    const remainingProducts = products.filter(
      (product) => product._id != req.params.productId
    )

    if (products.length !== remainingProducts.length) {
      writeProducts(remainingProducts)
      res.status(204).send()
    } else {
      next(
        NotFound(`Product with the is ${req.params.productId} cannot be found!`)
      )
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.post(
  "/:id/reviews",
  checksReviewSchema,
  triggerReviewBadRequest,
  async (req, res, next) => {
    try {
      const reviewsArray = await getReviews()
      if (req.body.productId === req.params.id) {
        const newReview = {
          ...req.body,
          _id: uniqid(),
          createdAt: new Date()
        }
        reviewsArray.push(newReview)
        await writeReviews(reviewsArray)
        res.send(`Review with id ${newReview._id} created`)
      } else {
        next(NotFound(`Product with id ${req.body.productId} was not found`))
      }
    } catch (error) {
      console.log(error)
    }
  }
)

export default productsRouter
